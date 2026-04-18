import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import axios from 'axios';
import CLogo from '../../assets/images/CLogo.png';
import headerImg from '../../assets/images/NewFotterImage.png';
import footerImg from '../../assets/images/NewFotterImage.png';
import imgS from '../../assets/images/CEOSignature.png';
import SearchableSelect from '../../Components/SearchableSelect';

// Make sure to bind modal to your appElement
Modal.setAppElement('#root');

// Custom modal styles
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: '0',
    border: 'none',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000
  }
};

const TerminationLetter = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [designation, setDesignation] = useState('');
  const [department, setDepartment] = useState('');
  const [terminationDate, setTerminationDate] = useState('');
  const [gender, setGender] = useState('');
  const [signatory, setSignatory] = useState('R.S. Pandey (CEO)');
  const [reason, setReason] = useState('Poor Performance');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://sf.doaguru.com/api/users');
        if (response.data && Array.isArray(response.data)) {
          setEmployees(response.data.filter(emp => emp.employment_status === 'active'));
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.full_name} (${emp.employee_id || 'No ID'}) - ${emp.department || 'N/A'}`
  }));

  const handleEmployeeSelect = (id) => {
    const emp = employees.find(e => e.id == id);
    if (emp) {
      setEmployeeName(emp.full_name || '');
      setEmployeeId(emp.employee_id || '');
      setDesignation(emp.designation || '');
      setDepartment(emp.department || '');
      setGender(emp.gender || '');
    }
  };

  const openModal = () => {
    if (!employeeName || !designation || !terminationDate) {
      alert('Please fill in all required fields');
      return;
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || ''}/api/termination-letters`, {
        employeeName, employeeId, designation, department, terminationDate, gender, signatory, reason
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failure saving to Database:', error);
    }
    // Get the preview content using the ref
    if (!previewRef.current) {
      console.error('Preview content not found');
      return;
    }
    
    // Clone the content for printing
    const contentClone = previewRef.current.cloneNode(true);
    
    // Create a new window for printing
    const printWindow = window.open('', '', 'width=800,height=600');
    
    // Write the HTML content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Termination Letter - ${employeeName || 'Employee'}</title>
        <style>
          @page {
            margin: 1cm;
          }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 1.5cm;
            line-height: 1.6;
            color: #333;
          }
          .print-header {
            text-align: center;
            margin-bottom: 1.5rem;
          }
          .print-header img {
            width: 12rem;
            height: auto;
            margin: 0 auto 1rem;
            position: absolute;
            top: 0;
            right: 0;
          }
          @media print {
            .print-header img {
              width: 12rem !important;
              height: auto !important;
            }
          }
          .print-footer {
            margin-top: 2rem;
            text-align: center;
            height: 5rem;
            width: 100%;
          }
          .footer-side img {
            height: 5rem;
            width: 100%;
            margin: 0 auto;
          }
          @media print {
            body { 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        ${contentClone.innerHTML}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // window.close(); // Uncomment to close after printing
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleViewAll = () => {
    navigate('/LetterGenrate');
  };

  return (
    <div className="dg-page-container">
      <div className="dg-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="dg-page-tag">Termination</span>
          <h1 className="dg-page-title">Generate Termination Letter</h1>
        </div>
        <button onClick={handleViewAll} className="dg-btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          View all PDFs
        </button>
      </div>
      
      <div className="dg-form-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Fill in the details to generate the termination letter
          </p>
        </div>

        <form>
          <div className="dg-form-section">
            <p className="dg-form-section-title">Select Employee</p>
            <div className="dg-form-group">
              <label className="dg-label">Search and Select Employee</label>
              <SearchableSelect
                options={employeeOptions}
                onChange={handleEmployeeSelect}
                placeholder={loading ? "Loading employees..." : "-- Select Employee --"}
              />
            </div>
          </div>

          <div className="dg-form-section">
            <p className="dg-form-section-title">Employee Details</p>
            <div className="dg-form-grid">
              <div className="dg-form-group">
                <label className="dg-label">Employee Name</label>
                <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="dg-input" required />
              </div>
              
              <div className="dg-form-group">
                <label className="dg-label">Employee ID</label>
                <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="dg-input" />
              </div>
              
              <div className="dg-form-group">
                <label className="dg-label">Designation</label>
                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="dg-input" required />
              </div>

              <div className="dg-form-group">
                <label className="dg-label">Department</label>
                <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} className="dg-input" />
              </div>
              
              <div className="dg-form-group">
                <label className="dg-label">Termination Date</label>
                <input type="date" value={terminationDate} onChange={(e) => setTerminationDate(e.target.value)} className="dg-input" required />
              </div>
              
              <div className="dg-form-group">
                <label className="dg-label">Gender</label>
                <select value={gender} onChange={(e) => setGender(e.target.value)} className="dg-input" required>
                  <option value="">-- Select Gender --</option>
                  <option value="He">Male (He/Him)</option>
                  <option value="She">Female (She/Her)</option>
                  <option value="They">Other (They/Them)</option>
                </select>
              </div>
              
              <div className="dg-form-group">
                <label className="dg-label">Reason for Termination</label>
                <select value={reason} onChange={(e) => setReason(e.target.value)} className="dg-input" required>
                  <option value="Poor Performance">Poor Performance</option>
                  <option value="Misconduct">Misconduct</option>
                  <option value="Downsizing">Downsizing / Redundancy</option>
                  <option value="Absconding">Absconding / Unauthorized Absence</option>
                </select>
              </div>
              
              <div className="dg-form-group">
                <label className="dg-label">Signatory</label>
                <select value={signatory} onChange={(e) => setSignatory(e.target.value)} className="dg-input" required>
                  <option value="R.S. Pandey (CEO)">R.S. Pandey (CEO)</option>
                  <option value="HR Manager">HR Manager</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="dg-form-actions">
            <button type="button" onClick={openModal} className="dg-btn-secondary">
              Preview Termination Letter
            </button>
          </div>
        </form>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Termination Letter Preview"
      >
        <div className="p-6 bg-white">
          <button onClick={closeModal} className="text-[35px] no-print">
            <IoMdArrowBack />
          </button>
          
          <div ref={previewRef} className="mt-4 print-preview-content">
            <div className="print-header text-center mb-8">
              <img src={headerImg} alt="Header" className=" mx-auto mb-4" style={{width: '12rem', position: 'absolute', top: '0', right: '0' }} />
              <h1 className="text-xxl font-bold text-gray-800 ">TERMINATION LETTER</h1>
            </div>
            
            <img src={CLogo} alt="Logo" className="" style={{width: '12rem' }} />
            
            <div className="print-content">
              <p>DOAGuru Infosystems<br />
              1815 Wright Town, Jabalpur,<br />
              Madhya Pradesh, INDIA – 482002<br />
              Phone: +91-7440992424<br />
              Email: info@doaguru.com<br />
              Website: https://doaguru.com</p>
              
              <div className="flex justify-between my-4">
                <p>Date: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              
              <p>To,</p>
              <p className="font-semibold">{employeeName || '[Employee Name]'}<br />
              {designation || '[Employee Designation]'}<br />
              Employee ID: {employeeId || '[Employee ID]'}</p>
              
              <p className="font-bold mt-6">Subject: Termination of Employment</p>
              
              <p className="mt-4">Dear {employeeName || 'Employee'},</p>
              
              <p className="mt-2">We regret to inform you that your employment with DOAGuru Infosystems as a {designation || '[Designation]'} in the {department || 'Development'} Department is hereby terminated with effect from {terminationDate || '[Termination Date]'}.</p>
              
              <p className="mt-2">
                This decision has been taken after careful consideration and following the terms and conditions of your employment contract. 
                {reason === 'Poor Performance' && " Despite prior discussions, reviews, and feedback, the expectations and standards of the organisation have not been met satisfactorily."}
                {reason === 'Misconduct' && " This decision has been taken due to a severe breach of the company's code of conduct and professional standards."}
                {reason === 'Downsizing' && " Due to recent restructuring and downsizing within the organisation, we regret to inform you that your position has been made redundant."}
                {reason === 'Absconding' && " This decision has been taken due to your unauthorized and prolonged absence from work without prior intimation."}
              </p>
              
              <p className="mt-2">You are requested to complete all formalities, including the handover of company assets, documentation, and clearance procedures by your last working day. Your full and final settlement will be processed as per company policy.</p>
              
              <p className="mt-2">We thank you for your services and wish you success in your future endeavours.</p>
              
              <div className="mt-10">
                <p>Sincerely,</p>
                <img src={imgS} alt="Signature" className="w-28 mt-2" />
                <p className="font-bold">
                  {signatory === 'HR Manager' ? 'HR Department' : signatory.includes('CEO') ? 'R.S. Pandey' : signatory}<br />
                  {signatory === 'HR Manager' ? 'HR Manager, DOAGuru Infosystems' : signatory.includes('CEO') ? 'CEO, DOAGuru Infosystems' : 'Authorized Signatory'}
                </p>
              </div>
            </div>
            
            <div className="footer-side mt-12 text-center">
              <img src={footerImg} alt="Footer" className="h-20 mx-auto" />
            </div>
          </div>
          
          <div className="mt-6 text-center no-print">
            <button
              onClick={handlePrint}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded mr-4"
            >
              Print Termination Letter
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TerminationLetter;
