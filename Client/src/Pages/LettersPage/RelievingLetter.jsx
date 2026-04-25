import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import CLogo from '../../assets/images/CLogo.png';
import headerImg from '../../assets/images/NewHeaderImage.png';
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

const RelievingLetter = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [dateOfRelieving, setDateOfRelieving] = useState('');
  const [lastWorkingDay, setLastWorkingDay] = useState('');
  const [gender, setGender] = useState('');
  const [signatory, setSignatory] = useState('R.S. Pandey (CEO)');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const previewRef = useRef();

  const departments = ['Marketing', 'Development', 'Sales', 'HR', 'Design', 'IT'];
  const genderOptions = [
    { value: 'him', label: 'Him' },
    { value: 'her', label: 'Her' },
    { value: 'them', label: 'Them' }
  ];

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
      setDesignation(emp.designation || '');
      setDepartment(emp.department || '');
      if (emp.joiningDate) {
        setDateOfJoining(new Date(emp.joiningDate).toISOString().split('T')[0]);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handlePrint = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || ''}/api/relieving-letters`, {
        employeeName, department, designation, dateOfJoining, dateOfRelieving, lastWorkingDay, gender: gender?.value || gender, signatory
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failure saving to Database:', error);
    }
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${employeeName} Relieving Letter</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            min-height: calc(100vh - 2cm);
            box-sizing: border-box;
            padding: 88px 20px 72px 20px;
          }
          .print-header {
            margin-bottom: 12px;
          }
          .header-image {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 78px;
            display: block;
            object-fit: cover;
            margin-bottom: 12px;
          }
          .logo-header {
            max-width: 7rem;
            margin-bottom: 10px;
            margin-left: 10px;
          }
          .print-content {
            margin-top: 0;
          }
          .print-content p {
            margin: 10px 0;
            text-align: justify;
          }
          .signature-img {
            padding-top: 1rem;
            margin-left: 3rem;
            width: 8rem;
          }
          .ceo-head {
            font-weight: bold;
          }
          .headName {
            margin-left: 4rem;
          }
          .footer-image {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 58px;
            margin-top: 0;
            display: block;
            object-fit: cover;
          }
          @page {
            margin: 1cm;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; }
            .header-image, .footer-image {
              break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${previewRef.current.innerHTML}
        </div>
      </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Wait for the content to load before printing
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        // printWindow.close(); // Uncomment this if you want to close the print window automatically after printing
      }, 500);
    };
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dg-page-container">
      <div className="dg-page-header">
        <span className="dg-page-tag">Relieving</span>
        <h1 className="dg-page-title">Generate Relieving Letter</h1>
      </div>

      <div className="dg-form-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Fill in the details to generate the relieving letter
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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
                <label className="dg-label">Department</label>
                <SearchableSelect 
                  options={departments.map(dept => ({ label: dept, value: dept }))}
                  value={department} 
                  onChange={setDepartment} 
                  placeholder="-- Select Department --"
                />
              </div>

              <div className="dg-form-group">
                <label className="dg-label">Designation</label>
                <input type="text" value={designation} onChange={(e) => setDesignation(e.target.value)} className="dg-input" required />
              </div>

              <div className="dg-form-group">
                <label className="dg-label">Gender</label>
                <select value={gender?.value || gender} onChange={(e) => setGender(e.target.value)} className="dg-input" required>
                  <option value="">-- Select Gender --</option>
                  <option value="He">Male (He/Him)</option>
                  <option value="She">Female (She/Her)</option>
                  <option value="They">Other (They/Them)</option>
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

          <div className="dg-form-section">
            <p className="dg-form-section-title">Employment Timeline</p>
            <div className="dg-form-grid">
              <div className="dg-form-group">
                <label className="dg-label">Date of Joining</label>
                <input type="date" value={dateOfJoining} onChange={(e) => setDateOfJoining(e.target.value)} className="dg-input" required />
              </div>

              <div className="dg-form-group">
                <label className="dg-label">Date of Relieving</label>
                <input type="date" value={dateOfRelieving} onChange={(e) => setDateOfRelieving(e.target.value)} className="dg-input" required />
              </div>

              <div className="dg-form-group">
                <label className="dg-label">Last Working Day</label>
                <input type="date" value={lastWorkingDay} onChange={(e) => setLastWorkingDay(e.target.value)} className="dg-input" required />
              </div>
            </div>
          </div>

          <div className="dg-form-actions">
            <button type="submit" className="dg-btn-secondary">
              Preview Letter
            </button>
          </div>
        </form>

      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Relieving Letter Preview"
        style={customStyles}
        shouldCloseOnOverlayClick={true}
      >
        <div ref={previewRef} className="p-6 bg-white">
          <style jsx>{`
            .header-image {
              width: 100%;
              height: 80px;
              display: block;
              object-fit: cover;
              margin-bottom: 12px;
            }
            .footer-image {
              width: 100%;
              height: 60px;
              margin-top: 1rem;
              display: block;
              object-fit: cover;
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          `}</style>
          <div className="print-header">
            <img src={headerImg} alt="Header" className="header-image" />
            <h1 className="text-xl font-bold text-center heading-letter">RELIEVING LETTER</h1>
          </div>
          <img src={CLogo} alt="Logo" className='w-24 logo-header' />
          
          <div className="print-content">
            <p>1815, Wright Town, Jabalpur<br />Madhya Pradesh, 482002<br />
            Phone: +91-7440992424<br />
            Email: info@doaguru.com<br />
            Website: <a href="https://doaguru.com" className="text-blue-600">https://doaguru.com</a></p>
            
            <p className="mt-4">Date: {new Date().toLocaleDateString('en-GB')}</p>
            
            <p className="mt-6">To Whom It May Concern,</p>
            
            <p className="mt-4">
              This is to certify that <span className="font-bold">{employeeName || '[Employee Name]'}</span> was employed 
              with DOAGuru Infosystems in the <span className="font-bold">{department || '[Department]'}</span> Department 
              as a <span className="font-bold">{designation || '[Designation]'}</span> from 
              <span className="font-bold"> {dateOfJoining || '[Date of Joining]'}</span> to 
              <span className="font-bold"> {dateOfRelieving || '[Date of Relieving]'}</span>.
            </p>
            
            <p className="mt-4">
              {(() => {
                const g = gender?.value || gender;
                const pr_their = g === 'He' ? 'his' : g === 'She' ? 'her' : 'their';
                const pr_them = g === 'He' ? 'him' : g === 'She' ? 'her' : 'them';
                const pr_he = g === 'He' ? 'He' : g === 'She' ? 'She' : 'They';
                return (
                  <>
                    During {pr_their} tenure, we found {pr_them} to be sincere, hardworking, and dedicated to {pr_their} responsibilities. 
                    {pr_he} have completed all handovers and formalities, and accordingly, we hereby relieve {pr_them} from {pr_their} duties with effect from the close of business on 
                    <span className="font-bold"> {lastWorkingDay || '[Last Working Day]'}</span>.
                  </>
                );
              })()}
            </p>
            
            <p className="mt-4">
              We wish <span className="font-bold">{employeeName || '[Employee Name]'}</span> all the very best in 
              {['He', 'She'].includes(gender?.value || gender) ? (gender?.value || gender === 'He' ? ' his' : ' her') : ' their'} future endeavors.
            </p>
            
            <p className="mt-6">Warm regards,</p>
            
            <div className="mt-8">
              <img src={imgS} alt="Authorized Signatory" className="w-28 ms-14 mt-4 signature-img" />
              <p className="mt-1 font-bold ceo-head">
                <span className="headName ms-16">{signatory === 'HR Manager' ? 'HR Department' : signatory.includes('CEO') ? 'R.S. Pandey' : signatory}</span><br />
                <span style={{marginLeft: '4rem'}}>{signatory === 'HR Manager' ? 'HR Manager' : signatory.includes('CEO') ? 'CEO, DOAGuru Infosystems' : 'Authorized Signatory'}</span>
              </p>
            </div>
          </div>
          
          <img src={footerImg} alt="Footer" className="footer-image mt-4" />
        </div>
        
        <div className="mt-4 text-center no-print">
          <button
            onClick={handlePrint}
            className="bg-blue-500 text-white py-2 px-6 rounded mr-4"
          >
            Print Letter
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white py-2 px-6 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default RelievingLetter;
