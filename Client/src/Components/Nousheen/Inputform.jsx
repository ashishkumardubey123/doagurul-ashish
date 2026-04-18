import { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import imgS from '../../assets/images/CEOSignature.png';
import logo from '../../assets/images/CLogo.png'; // Import the logo
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";

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


const WarningLetter = () => {

  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [warningDetails, setWarningDetails] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewRef = useRef();
  const [letterData, setLetterData] = useState(
    {
      name,
      date,
      warningDetails,
      
      

    }
  )

  const navigate = useNavigate();

  

  const handleSaveInfo = async () => {
    handlePrint();
  };

  const handleveiw = () =>{
      navigate('/LetterGenrate');
  }

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    // Get the current date in a readable format
    const formattedDate = date ? new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }) : '[Date]';

    // Create a new div to hold the content for printing
    const printContent = document.createElement('div');
    printContent.innerHTML = `
      <div class="print-container">
        <div class="print-header">
          <div class="header-side">
            <div class="he left-white"></div>
            <div class="left-green"></div>
            <div class="right-red"></div>
          </div>
          <h1 class="text-xl font-bold pt-7 text-center heading-letter">WARNING LETTER</h1>
        </div>
        <img src="${logo}" alt="Logo" class="w-24 logo-header" />
        <div class="print-content">
          <p>1815, Wright Town, Jabalpur<br />Madhya Pradesh, 482002<br />
          <a href="http://www.doaguru.com" target="_blank" class="text-blue-900">www.doaguru.com</a></p>
          <div class="release-date">
            <p class="font-bold">Warning Release Date: ${formattedDate}</p>
          </div>
          <p>Dear ${name || '[Name]'},</p>
          <p>${warningDetails || '[Warning Details]'}</p>
          <br />
          <p>We hope that this letter will act as a warning to avoid complications in the future. If you have any say in this regard you may feel free to contact any person in management and report your grievances.</p>
          <br />
          <p>We expect you to have good behavior and observe good conduct here after.</p>
          <img src="${imgS}" alt="Signature" class="w-28 mt-4 signature-img" />
          <p class="mt-1 font-bold ceo-head">
            <span class="headName">R.S.Pandey</span><br />(CEO) DOAGuru InfoSystems.
          </p>
        </div>
        <div class="footer-side mt-28">
          <div class="left-white"></div>
          <div class="left-green"></div>
          <div class="right-red"></div>
        </div>
      </div>
    `;

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Write the HTML content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${name || 'Warning'} Letter</title>
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
          .logo-header {
            max-width: 7rem;
            margin-bottom: 10px;
            margin-left: 10px;
          }
          .signature-img {
            padding-top: 1rem;
            width: 8rem;
          }
          .ceo-head {
            font-weight: bold;
          }
          .headName {
            margin-left: 3.5rem;
          }
          .release-date {
            display: flex;
            justify-content: flex-end;
            margin: 15px 0;
          }
          .print-content p {
            margin: 10px 0;
            line-height: 1.6;
          }
          .heading-letter {
            padding-top: 4.5rem;
          }
          .header-side {
            transform: rotate(180deg);
            display: flex;
            align-items: flex-end;
            width: 100%;
            height: 150px;
            margin-bottom: 2rem;
            position: absolute;
            background: transparent;
          }
          .footer-side {
            display: flex;
            align-items: baseline;
            width: 100%;
            height: 4rem;
            position: absolute;
            background: transparent;
            bottom: 0;
          }
          .left-green {
            width: 28rem;
            background-color: #006838;
            height: 0.7rem;
            clip-path: polygon(0 0, 90% 0, 100% 100%, 0% 100%);
            z-index: 999;
          }
          .right-red {
            margin-left: -14rem;
            width: 36rem;
            background-color: #ee1c25;
            height: 0.7rem;
            clip-path: polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%);
          }
          @page {
            margin: 1cm;
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
        ${printContent.innerHTML}
        <script>
          // Auto-print when the window loads
          window.onload = function() {
            setTimeout(function() {
              window.print();
              // Uncomment to close after printing
              // window.onafterprint = function() {
              //   window.close();
              // };
            }, 500);
          };
        </script>
      </body>
      </html>
    `);

    // Close the document
    printWindow.document.close();
  };
  useEffect(() => {
    setLetterData({
      name,
      date,
      warningDetails,
    });
  }, [name,
    date,
  warningDetails,]);

  return (
    <div className="dg-page-container">
      <div className="dg-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="dg-page-tag">Warning</span>
          <h1 className="dg-page-title">Generate Warning Letter</h1>
        </div>
        <button onClick={handleveiw} className="dg-btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          View all PDFs
        </button>
      </div>

      <div className="dg-form-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Fill in the details to generate the warning letter
          </p>
        </div>

        <form>
          <div className="dg-form-section">
            <p className="dg-form-section-title">Warning Details</p>
            <div className="dg-form-grid">
              <div className="dg-form-group">
                <label className="dg-label">Candidate Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="dg-input" required />
              </div>

              <div className="dg-form-group">
                <label className="dg-label">Warning Release Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="dg-input" required />
              </div>
            </div>

            <div className="dg-form-group" style={{ marginTop: '1rem' }}>
              <label className="dg-label">Warning Reason / Details</label>
              <textarea value={warningDetails} onChange={(e) => setWarningDetails(e.target.value)} className="dg-textarea" rows="4" required></textarea>
            </div>
          </div>

          <div className="dg-form-actions">
            <button type="button" onClick={openModal} className="dg-btn-secondary">
              Preview Warning Letter
            </button>
          </div>
        </form>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={closeModal} 
        contentLabel="Preview Modal"
        style={customStyles}
        shouldCloseOnOverlayClick={true}
      >
        <div ref={previewRef} className="p-6 bg-white">
          <button onClick={closeModal} className='text-[35px] no-print'><IoMdArrowBack /></button>
          {/* Warning Letter Preview Content */}
          <div className="print-header">
            <div className="header-side">
              <div className="he left-white"></div>
              <div className="left-green"></div>

              <div className="right-red"></div>
            </div>

            <h1 className="text-xl font-bold pt-7 text-center heading-letter">WARNING LETTER</h1>
          </div>
          <img src={logo} alt="Logo" className='w-24 logo-header' />
          <div className="print-content">
            <p>1815, Wright Town, Jabalpur<br />Madhya Pradesh, 482002<br /><a href="http://www.doaguru.com" target='_blank' className='text-blue-900'>www.doaguru.com</a></p>
            <div className='release-date flex justify-end'>

              <p className='font-bold'><span>Warning Release Date: {date}</span></p>
            </div>
            
            <p>Dear {name},</p>
            <p>
            {warningDetails}
            </p>
            <br />
            <p>We hope that this letter will act as a warning to avoid complications in the future. If you have any say in this regard you may feel free to contact any person in management and report your grievances.</p><br />
            <p>We expect you to have good behavior and observe good conduct here after.</p>
            <img src={imgS} alt="Signature" className='w-28 mt-4 signature-img' />
            <p className='mt-1 font-bold ceo-head'><span className='headName'>R.S.Pandey</span><br />(CEO) DOAGuru InfoSystems.</p>
          </div>
          <div className="footer-side mt-28">
            <div className="left-white"></div>
            <div className="left-green"></div>

            <div className="right-red"></div>
          </div>
        </div>
        <div className="mt-4 text-center no-print">
          <button 
            onClick={handlePrint} 
            className="bg-blue-500 text-white py-2 px-6 rounded mr-4"
          >
            Print Warning Letter
          </button>
          <button 
            onClick={closeModal} 
            className="bg-red-500 text-white py-2 px-6 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default WarningLetter;

