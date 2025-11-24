import { useState, useRef } from 'react';
import axios from 'axios';
import CLogo from '../../assets/images/CLogo.png';
import headerImg from '../../assets/images/1headerLetterimg.jpg';
import footerImg from '../../assets/images/1footerLetterimg.jpg';
import imgS from '../../assets/images/CEOSignature.png';

const InternshipOfferLetter = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    startDate: '',
    endDate: '',
    position: 'Intern',
    stipend: '',
    mentorName: '',
    mentorContact: '',
    offerReleaseDate: '',
    termsAndConditions: [
      'The internship duration is as mentioned above.',
      'You will be required to maintain a minimum attendance of 80%.',
      'You will be assigned a mentor for guidance.',
      'Company policies must be strictly followed.',
      'Confidentiality of company information must be maintained.'
    ]
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTermChange = (index, value) => {
    const updatedTerms = [...formData.termsAndConditions];
    updatedTerms[index] = value;
    setFormData(prev => ({
      ...prev,
      termsAndConditions: updatedTerms
    }));
  };

  const addTerm = () => {
    setFormData(prev => ({
      ...prev,
      termsAndConditions: [...prev.termsAndConditions, '']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSaveInfo = async () => {
    try {
      const response = await fetch('https://letter-doaguru.dentalguru.software/api/saveInternshipOffer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Internship offer saved successfully');
        handlePrint();
      } else {
        console.log('Failed to save internship offer');
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handlePrint = () => {
    const printContent = previewRef.current.innerHTML;
    const printWindow = window.open('', '', 'width=210mm,height=297mm');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${formData.name} - Internship Offer Letter</title>
        <style>
          @page {
            size: A4;
            margin: 0.8cm 1.2cm 1cm 1.2cm;
          }
          body {
            font-family: Arial, sans-serif;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            color: #333;
            font-size: 12px;
          }
          .print-container {
            max-width: 100%;
            margin: 0 auto;
            padding: 0;
            position: relative;
          }
          .header {
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .logo {
            max-height: 50px;
            margin-bottom: 5px;
          }
          .header-right {
            text-align: right;
            margin-bottom: 5px;
            font-size: 11px;
          }
          .content {
            margin: 10px 0;
            line-height: 1.3;
          }
          .section {
            margin-bottom: 8px;
          }
          .section-title {
            font-weight: bold;
            margin: 10px 0 6px 0;
            font-size: 13px;
          }
          .signature {
            margin-top: 20px;
          }
          .signature img {
            height: 40px;
            margin-bottom: 5px;
          }
          .footer {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 10px;
            color: #666;
            padding: 5px 0;
            border-top: 1px solid #eee;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              zoom: 0.95;
            }
            .no-print {
              display: none !important;
            }
            .print-container {
              padding: 0;
              transform: scale(0.98);
              transform-origin: top left;
              width: 100%;
            }
            .content {
              page-break-inside: avoid;
            }
            p, li {
              margin: 4px 0;
            }
            ul, ol {
              margin: 4px 0;
              padding-left: 20px;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          ${printContent}
        </div>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for images to load before printing
    printWindow.onload = function() {
      setTimeout(() => {
        printWindow.print();
        // printWindow.close(); // Uncomment this if you want to close the print window after printing
      }, 500);
    };
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Internship Offer Letter</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Candidate Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Monthly Stipend</label>
            <input
              type="text"
              name="stipend"
              value={formData.stipend}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="e.g., ₹5,000 per month"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Mentor's Name</label>
            <input
              type="text"
              name="mentorName"
              value={formData.mentorName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Mentor's Contact</label>
            <input
              type="text"
              name="mentorContact"
              value={formData.mentorContact}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700">Offer Release Date</label>
            <input
              type="date"
              name="offerReleaseDate"
              value={formData.offerReleaseDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
              required
            ></textarea>
          </div>
          
          <div className="col-span-2">
            <label className="block text-gray-700">Terms & Conditions</label>
            {formData.termsAndConditions.map((term, index) => (
              <div key={index} className="flex items-center mb-2">
                <span className="mr-2">{index + 1}.</span>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleTermChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded"
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addTerm}
              className="mt-2 px-3 py-1 bg-blue-100 text-blue-700 rounded"
            >
              + Add Term
            </button>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Preview Offer Letter
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div ref={previewRef} className="p-4 print:p-0">
              {/* Header */}
              <div className="header">
                <div className="flex justify-between items-start">
                  <div>
                    <img src={CLogo} alt="Company Logo" className="logo" />
                    <h1 className="text-lg font-bold mt-1">DOAGuru Infosystems</h1>
                    <p className="text-gray-600 text-xs">
                      Website: <a href="https://www.doaguru.com" className="text-blue-600 no-underline">www.doaguru.com</a><br/>
                      Email: info@doaguru.com | Contact: +91-7440992424
                    </p>
                  </div>
                  <div className="header-right">
                    <p className="text-xs">{formData.offerReleaseDate ? new Date(formData.offerReleaseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>
                
                <div className="mt-2 text-center">
                  <h2 className="text-xl font-bold uppercase">INTERNSHIP OFFER LETTER</h2>
                </div>
              </div>

              {/* Recipient Info */}
              <div className="section">
                <p className="mb-1"><strong>To,</strong></p>
                <p className="font-semibold">{formData.name || '[Candidate Name]'}</p>
                <p className="text-xs">{formData.address || '[Address]'}</p>
                <p className="text-xs">Email: {formData.email || '[Email]'}</p>
                <p className="text-xs">Phone: {formData.phoneNumber || '[Phone Number]'}</p>
              </div>

              {/* Letter Content */}
              <div className="content">
                <p className="mb-2">Dear {formData.name || '[Candidate Name]'},</p>
                
                <p className="mb-3">
                  We are pleased to offer you an internship position at DOAGuru Infosystems as a <strong>{formData.position || '[Position]'}</strong> 
                  from <strong>{formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '[Start Date]'}</strong> to <strong>{formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '[End Date]'}</strong>.
                </p>
                
                <div className="section">
                  <h3 className="section-title">INTERNSHIP DETAILS:</h3>
                  <ul className="list-disc pl-5 space-y-0">
                    <li className="mb-1"><strong>Position:</strong> {formData.position || '[Position]'}</li>
                    <li className="mb-1"><strong>Duration:</strong> {formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '[Start Date]'} to {formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '[End Date]'}</li>
                    <li className="mb-1"><strong>Stipend:</strong> {formData.stipend || 'Not specified'}</li>
                    <li className="mb-1"><strong>Mentor:</strong> {formData.mentorName || '[Mentor Name]'} ({formData.mentorContact || '[Contact Info]'})</li>
                  </ul>
                </div>
                
                <div className="section">
                  <h3 className="section-title">TERMS & CONDITIONS:</h3>
                  <ol className="list-decimal pl-5 space-y-0">
                    {formData.termsAndConditions.map((term, index) => (
                      <li key={index} className="mb-1 text-xs">{term || '[Term]'}</li>
                    ))}
                  </ol>
                </div>
                
                <p className="mt-3 mb-2">
                  We look forward to having you as part of our team. Please sign and return a copy of this letter 
                  to indicate your acceptance of this internship offer.
                </p>
                
                <div className="signature">
                  <p className="mb-1">Best regards,</p>
                  <div className="mt-2">
                    <img src={imgS} alt="Signature" className="signature-img" />
                    <p className="font-semibold text-sm">R.S. Pandey</p>
                    <p className="text-xs">HR Manager</p>
                    <p className="text-xs">DOAGuru Infosystems</p>
                  </div>
                </div>
                
                <div className="footer no-print">
                  <p className="text-center text-xs text-gray-600">
                    <strong>Confidentiality Notice:</strong> This letter and any attachments are confidential and may be protected by legal privilege.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gray-100 flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Close
              </button>
              <button
                onClick={handleSaveInfo}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save & Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipOfferLetter;
