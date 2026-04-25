import { useState, useRef } from 'react';
import Modal from 'react-modal';
import imgS from '../../assets/images/CEOSignature.png';
import logo from '../../assets/images/CLogo.png';
import headerImg from '../../assets/images/NewHeaderImage.png';
import footerImg from '../../assets/images/NewFotterImage.png';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowBack } from "react-icons/io";

Modal.setAppElement('#root');

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
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
};

const WarningLetter = () => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [warningDetails, setWarningDetails] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewRef = useRef();
  const navigate = useNavigate();

  const formattedDate = date
    ? new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '[Date]';

  const handleView = () => {
    navigate('/LetterGenrate');
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    const printContent = `
      <div class="print-container">
        <img src="${headerImg}" alt="Header" class="header-image" />
        <div class="letter-body">
          <h1 class="heading-letter">WARNING LETTER</h1>
          <img src="${logo}" alt="Logo" class="logo-header" />
          <div class="print-content">
            <p>1815, Wright Town, Jabalpur<br />Madhya Pradesh, 482002<br />
            <a href="http://www.doaguru.com" target="_blank">www.doaguru.com</a></p>
            <div class="release-date">
              <p><strong>Warning Release Date: ${formattedDate}</strong></p>
            </div>
            <p>Dear ${name || '[Name]'},</p>
            <p>${warningDetails || '[Warning Details]'}</p>
            <p>We hope that this letter will act as a warning to avoid complications in the future. If you have any say in this regard you may feel free to contact any person in management and report your grievances.</p>
            <p>We expect you to have good behavior and observe good conduct here after.</p>
            <img src="${imgS}" alt="Signature" class="signature-img" />
            <p class="ceo-head"><span class="headName">R.S.Pandey</span><br />(CEO) DOAGuru InfoSystems.</p>
          </div>
        </div>
        <img src="${footerImg}" alt="Footer" class="footer-image" />
      </div>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${name || 'Warning'} Letter</title>
        <style>
          @page { margin: 0.8cm; }
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            line-height: 1.6;
          }
          .print-container {
            max-width: 800px;
            margin: 0 auto;
            min-height: calc(100vh - 1.6cm);
            box-sizing: border-box;
            padding: 86px 20px 72px 20px;
            position: relative;
          }
          .header-image {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 78px;
            object-fit: cover;
          }
          .footer-image {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100%;
            height: 58px;
            object-fit: cover;
          }
          .heading-letter {
            text-align: center;
            margin: 0 0 12px;
            font-size: 24px;
            font-weight: 700;
          }
          .logo-header {
            width: 96px;
            margin: 0 0 12px 8px;
          }
          .release-date {
            display: flex;
            justify-content: flex-end;
            margin: 14px 0;
          }
          .print-content p { margin: 10px 0; }
          .signature-img {
            padding-top: 0.75rem;
            width: 8rem;
          }
          .ceo-head { font-weight: bold; }
          .headName { margin-left: 3.5rem; }
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${printContent}
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="dg-page-container">
      <div className="dg-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span className="dg-page-tag">Warning</span>
          <h1 className="dg-page-title">Generate Warning Letter</h1>
        </div>
        <button onClick={handleView} className="dg-btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
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
          <button onClick={closeModal} className="text-[35px] no-print"><IoMdArrowBack /></button>
          <div className="print-header">
            <img src={headerImg} alt="Header" className="w-full h-20 object-cover mb-3" />
            <h1 className="text-xl font-bold text-center">WARNING LETTER</h1>
          </div>
          <img src={logo} alt="Logo" className="w-24" />
          <div className="print-content">
            <p>1815, Wright Town, Jabalpur<br />Madhya Pradesh, 482002<br /><a href="http://www.doaguru.com" target="_blank" className="text-blue-900">www.doaguru.com</a></p>
            <div className="release-date flex justify-end">
              <p className="font-bold"><span>Warning Release Date: {formattedDate}</span></p>
            </div>

            <p>Dear {name || '[Name]'},</p>
            <p>{warningDetails || '[Warning Details]'}</p>
            <p>We hope that this letter will act as a warning to avoid complications in the future. If you have any say in this regard you may feel free to contact any person in management and report your grievances.</p>
            <p>We expect you to have good behavior and observe good conduct here after.</p>
            <img src={imgS} alt="Signature" className="w-28 mt-4" />
            <p className="mt-1 font-bold"><span className="ml-14">R.S.Pandey</span><br />(CEO) DOAGuru InfoSystems.</p>
          </div>
          <img src={footerImg} alt="Footer" className="w-full h-16 object-cover mt-8" />
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
};

export default WarningLetter;
