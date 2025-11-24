import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

// Note: You'll need to replace these with your actual image imports
import imgS from '../../assets/images/CEOSignature.png';
import CLogo from '../../assets/images/CLogo.png';
import headerImg from '../../assets/images/NewHeaderImage.png';
import footerImg from '../../assets/images/NewFotterImage.png';

const A4_WIDTH_PX = 794; // 210mm at 96dpi
const A4_HEIGHT_PX = 1123; // 297mm at 96dpi
// Update Some file remove 

const OfferLater = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = Boolean(id);
  const isPreviewMode = new URLSearchParams(location.search).get('preview') === 'true';
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [offerReleaseDate, setOfferReleaseDate] = useState('');
  const [probationPeriod, setProbationPeriod] = useState('');
  const [noticePeriod, setNoticePeriod] = useState('');
  const [confirmationNoticePeriod, setConfirmationNoticePeriod] = useState('');
  const [jobResponsibilities, setJobResponsibilities] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewRef = useRef();

  // Fetch offer letter data if in edit or preview mode
  useEffect(() => {
    const fetchOfferLetter = async () => {
      if (!id) return; // Don't fetch if no ID is provided
      
      console.log('Fetching offer letter with ID:', id);
      console.log('isPreviewMode:', isPreviewMode);
      console.log('isEditMode:', isEditMode);
      
      try {
        const token = localStorage.getItem('token');
        console.log('Using token:', token ? 'Token exists' : 'No token found');
        
        const response = await axios.get(`https://letter-doaguru.dentalguru.software/api/offer-letters/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API Response:', response);
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        const data = response.data;
        console.log('Fetched data:', data);
        
        // Set form fields with fetched data
        setName(data.name || '');
        setAddress(data.address || '');
        setPhoneNumber(data.phoneNumber || '');
        setEmail(data.email || '');
        setDate(data.joiningDate || '');
        setPosition(data.designation || '');
        setSalary(data.salary || '');
        setOfferReleaseDate(data.offerReleaseDate || '');
        setProbationPeriod(data.probationPeriod || '');
        setNoticePeriod(data.noticePeriod || '');
        setConfirmationNoticePeriod(data.confirmationNoticePeriod || '');
        
        // Handle job responsibilities
        let responsibilities = [];
        if (data.jobResponsibilities) {
          responsibilities = Array.isArray(data.jobResponsibilities) 
            ? data.jobResponsibilities 
            : JSON.parse(data.jobResponsibilities);
        }
        setJobResponsibilities(responsibilities.length > 0 ? responsibilities : ['']);
        
        console.log('Form data set, opening print dialog in preview mode');
        
        // If in preview mode, show the print dialog after a short delay
        if (isPreviewMode) {
          const timer = setTimeout(() => {
            console.log('Opening print dialog...');
            handlePrint();
          }, 1000); // Increased delay to ensure DOM is ready
          return () => clearTimeout(timer);
        }
        
      } catch (error) {
        console.error('Error fetching offer letter:', error);
      }
    };

    fetchOfferLetter();
  }, [id, isEditMode]);

  const handleSaveInfo = async () => {
    try {
      const letterData = {
        name,
        address,
        phoneNumber,
        email,
        offerReleaseDate,
        joiningDate: date,
        designation: position,
        salary,
        probationPeriod,
        noticePeriod,
        confirmationNoticePeriod,
        jobResponsibilities
      };

      const url = isEditMode 
        ? `https://letter-doaguru.dentalguru.software/api/updateOfferLetter/${id}`
        : 'https://letter-doaguru.dentalguru.software/api/saveOfferLetter';
      
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(letterData),
      });

      const responseData = await response.json();
      console.log(responseData, 'API Response');

      if (response.ok) {
        console.log(isEditMode ? 'Offer letter updated successfully' : 'Employee Letter Info Saved');
        handlePrint();
      } else {
        console.log('Failed to save/update letter info...');
      }
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  const handleJobResponsibilitiesChange = (index, value) => {
    const updatedResponsibilities = [...jobResponsibilities];
    updatedResponsibilities[index] = value;
    setJobResponsibilities(updatedResponsibilities);
  };

  const addJobResponsibility = () => {
    setJobResponsibilities([...jobResponsibilities, '']);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = () => {
    // Get the print content from the preview reference
    const printContent = previewRef.current.innerHTML;
    // Create a new window for printing
    const printWindow = window.open('', '_blank', `width=${A4_WIDTH_PX},height=${A4_HEIGHT_PX}`);
    if (!printWindow) {
      alert('Please allow popups for this site to print.');
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${name} - Offer Letter</title>
          <style>
            @page {
              size: A4;
              margin: 0mm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: #fff;

            }
            .print-container {
              width: 100%;
              height: 100vh;
              background: #fff;
              box-sizing: border-box;
              position: relative;
              
            }
            .print-header-img {
              position: fixed;
              top: 0;
              left: 0;
              width: 210mm;
              height: 32mm;
              object-fit: cover;
              z-index: 1000;
              
            }
            .print-footer-img {
              position: fixed;
              bottom: 0;
              left: 0;
              width: 210mm;     /* exact A4 width */
              height: 20mm;     /* adjust according to footer image */
              object-fit: cover;
              z-index: 1000;
            }
            .print-content {
              margin-top: 35mm;   /* space for header */
              margin-bottom: 25mm;/* space for footer */
              padding: 0mm 15mm;
              box-sizing: border-box;
              background: #fff;
              
            }
            @media print {
              html, body {
                width: 210mm;
                height: 297mm;
                margin: 0;
                padding: 0;
                background: #fff;
              }
              .print-header-img {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 32mm;
                object-fit: cover;
                z-index: 1000;
                background: #fff;
                page-break-after: avoid;
              }
              .print-footer-img {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 20mm;
                object-fit: cover;
                z-index: 1000;
                background: #fff;
                page-break-before: avoid;
              }
              .print-content {
                margin-top: 32mm;
                margin-bottom: 32mm;
                min-height: calc(297mm - 64mm);
                padding: 0 10mm;
                width: 100%;

                background: red;
                box-sizing: border-box;
                page-break-inside: auto;
              }
              .print-content * {
                page-break-inside: avoid; /* but prevent breaking inside paragraphs/tables */
              }
              .no-print {
                display: none !important;
              }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <img src="${headerImg}" alt="Header" class="print-header-img" />
            <img src="${footerImg}" alt="Footer" class="print-footer-img" />
            <div class="print-content">
              ${printContent}
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isPreviewMode ? 'Preview Offer Letter' : isEditMode ? 'Edit Offer Letter' : 'Generate Offer Letter'}
          </h2>
          <div className="flex gap-2">
            {(isEditMode || isPreviewMode) && (
              <button
                onClick={() => navigate('/download/offer-letter')}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Back to List
              </button>
            )}
            {!isPreviewMode && (
              <button
                onClick={handleSaveInfo}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isEditMode ? 'Update' : 'Save'}
              </button>
            )}
          </div>
        </div>
        
        <div className={`mb-4 ${isPreviewMode ? 'opacity-75' : ''}`}>
          <label className="block text-gray-700">Candidate Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            disabled={isPreviewMode}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1 resize-none"
            rows="3"
            required
            disabled={isPreviewMode}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Contact Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            disabled={isPreviewMode}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Email ID</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            disabled={isPreviewMode}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Joining Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            disabled={isPreviewMode}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Position</label>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            disabled={isPreviewMode}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Salary</label>
          <input
            type="text"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="e.g., 10000 ₹"
            required
            disabled={isPreviewMode}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Offer Release Date</label>
          <input
            type="date"
            value={offerReleaseDate}
            onChange={(e) => setOfferReleaseDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            disabled={isPreviewMode}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Probation Period</label>
          <select
            value={probationPeriod}
            onChange={(e) => setProbationPeriod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            disabled={isPreviewMode}
          >
            <option value="">Select Probation Period</option>
            <option value="1">1 month</option>
            <option value="2">2 months</option>
            <option value="3">3 months</option>
            <option value="4">4 months</option>
            <option value="5">5 months</option>
            <option value="6">6 months</option>
            <option value="7">7 months</option>
            <option value="8">8 months</option>
            <option value="9">9 months</option>
            <option value="10">10 months</option>
            <option value="11">11 months</option>
            <option value="12">12 months</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Notice Period During Probation</label>
          <select
            value={noticePeriod}
            onChange={(e) => setNoticePeriod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            disabled={isPreviewMode}
          >
            <option value="">Select Notice Period</option>
            <option value="7 days">7 days</option>
            <option value="15 days">15 days</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Notice Period After Confirmation</label>
          <input
            type="text"
            value={confirmationNoticePeriod}
            onChange={(e) => setConfirmationNoticePeriod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="e.g., 30 days"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700">Job Responsibilities</label>
          {jobResponsibilities.map((responsibility, index) => (
            <input
              key={index}
              type="text"
              value={responsibility}
              onChange={(e) => handleJobResponsibilitiesChange(index, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
              required
            />
          ))}
          <button type="button" onClick={addJobResponsibility} className="border-2 border-green-400 text-black py-2 px-4 rounded">
            Add Job Responsibility
          </button>
        </div>
        
        <button type="button" onClick={openModal} className="border border-gray-950 text-black py-2 px-4 rounded">
          Preview Offer Letter
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div ref={previewRef} className="print-content p-6 bg-white rounded-lg shadow-lg">
              <div className="print-header flex justify-center" style={{overflow: 'hidden'}}>
                <h1 className="text-xl font-bold pt-7 text-center">OFFER LETTER</h1>
              </div>
              
              <div className="company-header">
                {/* <img src={CLogo} alt="Logo" className='w-24 logo-header' /> */}
                <h2>DOAGuru Infosystems</h2>
                <div className="company-info">
                  Website: <a href="http://www.doaguru.com" target='_blank' className='text-blue-900'>www.doaguru.com</a> | Email: info@doaguru.com | Contact: +91-7440992424
                </div>
              </div>
              
              <div className='release-date'>
                <p><strong>Date: {offerReleaseDate}</strong></p>
              </div>
              
              <div className="candidate-info">
                <p><strong>To,</strong><br />
                {name}<br />
                {address}<br />
                {phoneNumber}<br />
                {email}</p>
              </div>
              
              <div className="subject-line">
                <p><strong>Subject: Offer of Employment</strong></p>
              </div>
              
              <p>Dear {name},</p>
              
              <p>We are pleased to offer you the position of <strong>{position}</strong> at DOAGuru Infosystems, based on your qualifications and discussions during the interview process.</p>
              
              <p>Below are the terms and conditions of your employment:</p>
              
              <div className="section">
                <h3>1. Designation & Department</h3>
                <div className="section-content">
                  <p>You will be designated as <strong>{position}</strong>, and you will report to the assigned Team Lead or Manager as per project requirement.</p>
                </div>
              </div>
              
              <div className="section section-bottom-gap">
                <h3>2. Joining Date</h3>
                <div className="section-content">
                  <p>Your date of joining shall be <strong>{date}</strong>, or as mutually agreed upon.</p>
                </div>
              </div>
               
              <div className="section section-top-gap">
                <h3>3. Place of Work</h3>
                <div className="section-content">
                  <p>Your primary place of work will be at DOAGuru Infosystems, Jabalpur (M.P.), or any other location as assigned.</p>
                </div>
              </div>
              
              <div className="section">
                <h3>4. Compensation</h3>
                <div className="section-content">
                  <p>{salary} ₹. It may be subject to revision based on your performance during the probation period.</p>
                </div>
              </div>
              
              <div className="section">
                <h3>5. Probation Period</h3>
                <div className="section-content">
                  <p>You will be on a probation period of <strong>{probationPeriod} months</strong> from the date of joining.</p>
                  <p><strong>Probation Period Meaning:</strong> This is a trial period during which your performance, conduct, learning ability, and behavior will be assessed.</p>
                  <p>During this period, either the company or you may terminate the employment with <strong>{noticePeriod}</strong> notice, or compensation in lieu thereof.</p>
                  <p>The company reserves the right to terminate your employment without notice during the probation period if your performance is found unsatisfactory, duties are not fulfilled, or code of conduct is violated.</p>
                </div>
              </div>
              
              <div className="section">
                <h3>6. Roles and Responsibilities</h3>
                <div className="section-content">
                  <p>You are expected to:</p>
                  <ul>
                    {jobResponsibilities.map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    ))}
                    <li>Perform your assigned duties with honesty, efficiency, and full dedication.</li>
                    <li>Complete tasks within deadlines, maintain team collaboration, and ensure client satisfaction.</li>
                    <li>Follow company policies, ethical standards, and communication protocols.</li>
                  </ul>
                </div>
              </div>
              
              <div className="section">
                <h3>7. Default Expectations</h3>
                <div className="section-content">
                  <p>The company expects you to:</p>
                  <ul>
                    <li>Be punctual and regular in attendance.</li>
                    <li>Follow instructions given by team leads or reporting managers.</li>
                    <li>Avoid unprofessional conduct, misuse of company assets, or delay in deliverables.</li>
                    <li>Take ownership and accountability of your assigned work.</li>
                  </ul>
                </div>
              </div>
              
              <div className="section ">
                <h3 className=''>8. Performance Review & Package Revision</h3>
                <div className="section-content">
                  <p>Your performance will be evaluated periodically. Based on the outcomes:</p>
                  <ul>
                    <li>Your compensation package may be revised.</li>
                    <li>Your probation may be extended, confirmed, or terminated.</li><br /><br /><br />
                    <li>A confirmation letter will be issued upon successful completion of the probation.</li>
                  </ul>
                </div>
              </div>
              
              <div className="section">
                <h3>9. Confidentiality & Code of Conduct</h3>
                <div className="section-content">
                  <p>You are required to:</p>
                  <ul>
                    <li>Maintain the confidentiality of all company data, client information, and intellectual property.</li>
                    <li>Not share or misuse any leads, resources, or internal information.</li>
                    <li>Follow professional behavior at all times. Breach of this may lead to immediate termination.</li>
                  </ul>
                </div>
              </div>
              
              <div className="section">
                <h3>10. Termination Clause</h3>
                <div className="section-content">
                  <p>Post-confirmation, either party may terminate the employment by giving <strong>{confirmationNoticePeriod}</strong> written notice or salary in lieu of notice.</p>
                </div>
              </div>
              
              <div className="section">
                <h3>11. Additional Terms</h3>
                <div className="section-content">
                  <ul>
                    <li>You agree to abide by all rules, regulations, and policies of DOAGuru Infosystems as amended from time to time.</li>
                    <li>Employment is subject to verification of documents submitted at the time of joining.</li>
                  </ul>
                </div>
              </div>
              
              <p>Please sign and return a copy of this letter as a token of your acceptance.</p>
              <p>We look forward to welcoming you to our team.</p>
              
              <p><strong>Warm Regards,</strong></p>
              
              <img src={imgS} alt="Signature" className='w-28 ms-14 mt-4 signature-img' />
              <p className='mt-1 font-bold ceo-head'><span className='headName ms-16'>R.S.Pandey</span><br />HR Manager<br />DOAGuru Infosystems</p>
              
              <div className="acknowledgment">
                <h3>Acknowledgment:</h3>
                <p>I, {name}, accept the above terms and conditions of employment.</p>
                <div className="signature-line">
                  <p>Signature: ___________________</p>
                  <p>Date: ________________</p>
                </div>
              </div>
              
                          </div>
            
            <div className="p-4 border-t">
              {!isPreviewMode && (
                <button 
                  onClick={handleSaveInfo} 
                  className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                >
                  {isEditMode ? 'Update' : 'Save'}
                </button>
              )}
              <button 
                onClick={handlePrint} 
                className="bg-green-500 text-white py-2 px-4 rounded mr-2"
              >
                Print Letter
              </button>
              <button 
                onClick={closeModal} 
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                {isPreviewMode ? 'Close' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfferLater;