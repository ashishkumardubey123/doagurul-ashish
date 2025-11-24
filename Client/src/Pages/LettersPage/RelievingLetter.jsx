import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
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

const RelievingLetter = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('Development');
  const [designation, setDesignation] = useState('');
  const [dateOfJoining, setDateOfJoining] = useState('');
  const [dateOfRelieving, setDateOfRelieving] = useState('');
  const [lastWorkingDay, setLastWorkingDay] = useState('');
  const [gender, setGender] = useState('him');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewRef = useRef();

  const departments = ['Marketing', 'Development', 'Sales'];
  const genderOptions = [
    { value: 'him', label: 'Him' },
    { value: 'her', label: 'Her' },
    { value: 'them', label: 'Them' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${employeeName} Relieving Letter</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
          }
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
            padding: 20px;
          }
          .print-header {
            text-align: center;
            margin-bottom: 20px;
            position: relative;
          }
          .header-image {
            width: 10rem;
            position: absolute;
            top: 0;
            right: 0;
          }
          .logo-header {
            max-width: 7rem;
            margin-bottom: 10px;
            margin-left: 10px;
          }
          .print-content {
            margin-top: 2rem;
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
            width: 100%;
            height: 5rem;
            margin-top: 2rem;
           
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
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <h2 className="text-2xl font-bold mb-4">Generate Relieving Letter</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700">Employee Name</label>
            <input
              type="text"
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            >
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Date of Joining</label>
            <input
              type="date"
              value={dateOfJoining}
              onChange={(e) => setDateOfJoining(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Date of Relieving</label>
            <input
              type="date"
              value={dateOfRelieving}
              onChange={(e) => setDateOfRelieving(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Last Working Day</label>
            <input
              type="date"
              value={lastWorkingDay}
              onChange={(e) => setLastWorkingDay(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          Preview Letter
        </button>
      </form>

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
              width: 10rem;
              position: absolute;
              top: 0;
              right: 0;
            }
            .footer-image {
              width: 100%;
              height: 5rem;
              margin-top: 2rem;
              
            }
            @media print {
              .no-print {
                display: none;
              }
            }
          `}</style>
          <div className="print-header">
            <img src={headerImg} alt="Header" className="header-image" />
            <h1 className="text-xl font-bold pt-7 text-center heading-letter">RELIEVING LETTER</h1>
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
              During {gender} tenure, we found {gender} to be sincere, hardworking, and dedicated to {gender} responsibilities. 
              {gender === 'him' ? ' He' : gender === 'her' ? ' She' : ' They'} have completed all handovers and formalities, 
              and accordingly, we hereby relieve {gender} from {gender} duties with effect from the close of business on 
              <span className="font-bold"> {lastWorkingDay || '[Last Working Day]'}</span>.
            </p>
            
            <p className="mt-4">
              We wish <span className="font-bold">{employeeName || '[Employee Name]'}</span> all the very best in 
              {gender === 'him' ? ' his' : gender === 'her' ? ' her' : ' their'} future endeavors.
            </p>
            
            <p className="mt-6">Warm regards,</p>
            
            <div className="mt-8">
              <img src={imgS} alt="Authorized Signatory" className="w-28 ms-14 mt-4 signature-img" />
              <p className="mt-1 font-bold ceo-head">
                <span className="headName ms-16">R.S.Pandey</span><br />
                Authorized Signatory<br />
                DOAGuru Infosystems
              </p>
            </div>
          </div>
          
          <img src={footerImg} alt="Footer" className="footer-image mt-8" />
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