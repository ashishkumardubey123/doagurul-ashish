import { useState, useRef } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";
import CLogo from '../../assets/images/CLogo.png';
import headerImg from '../../assets/images/1headerLetterimg.jpg';
import footerImg from '../../assets/images/1footerLetterimg.jpg';
import imgS from '../../assets/images/CEOSignature.png';

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
  const [terminationDate, setTerminationDate] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewRef = useRef();
  const navigate = useNavigate();

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

  const handlePrint = () => {
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
    <div className="container mx-auto p-4">
      <button 
        onClick={handleViewAll} 
        className="border border-gray-300 w-[150px] h-10 ml-[1050px] mb-4"
      >
        View all PDFs
      </button>
      
      <form className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <h2 className="text-2xl font-bold mb-4">Generate Termination Letter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Employee Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Employee ID</label>
            <input
              type="text"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Termination Date <span className="text-red-500">*</span></label>
            <input
              type="date"
              value={terminationDate}
              onChange={(e) => setTerminationDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="button"
            onClick={openModal}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded"
          >
            Preview Termination Letter
          </button>
        </div>
      </form>

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
              
              <p className="mt-2">We regret to inform you that your employment with DOAGuru Infosystems as a {designation || '[Designation]'} in the Development Department is hereby terminated with effect from {terminationDate || '[Termination Date]'}.</p>
              
              <p className="mt-2">This decision has been taken after careful consideration and following the terms and conditions of your employment contract. Despite prior discussions, reviews, and feedback, the expectations and standards of the organisation have not been met satisfactorily.</p>
              
              <p className="mt-2">You are requested to complete all formalities, including the handover of company assets, documentation, and clearance procedures by your last working day. Your full and final settlement will be processed as per company policy.</p>
              
              <p className="mt-2">We thank you for your services and wish you success in your future endeavours.</p>
              
              <div className="mt-10">
                <p>Sincerely,</p>
                <img src={imgS} alt="Signature" className="w-28 mt-2" />
                <p className="font-bold">Authorized Signatory<br />DOAGuru Infosystems</p>
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