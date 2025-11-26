import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
  pdf,
  Font,
} from '@react-pdf/renderer';

// ---- IMPORTANT: prevent hyphenation issues on e-mails/long tokens ----
Font.registerHyphenationCallback((word) => [String(word)]);

// Assets (ensure these resolve to public URLs at runtime)
import imgS from '../../assets/images/CEOSignature.png';
import headerImg from '../../assets/images/NewHeaderImage.png';
import footerImg from '../../assets/images/NewFotterImage.png';

// Helpers
const safe = (v) => (v === null || v === undefined ? '' : String(v));
const safeArray = (arr) => (Array.isArray(arr) ? arr.filter((x) => typeof x === 'string' && x.trim() !== '') : []);

// PDF Styles — use numeric values (points) instead of CSS strings
const styles = StyleSheet.create({
  page: {
    paddingTop: 80,
    paddingBottom: 70,
    paddingHorizontal: 50,
    position: 'relative',
  },
  headerWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    
  },
  footerWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  headerImg: { width: '100%', height: '100%' ,marginBottom: 10},
  footerImg: { width: '100%', height: '100%' },
  content: {
    fontSize: 11,
    lineHeight: 1.4,
  },
  title: {
    fontSize: 16,
    marginBottom: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  signature: {
    width: 100,
    height: 50,
    marginVertical: 15,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 10,
  },
  bullet: {
    width: 15,
    marginRight: 8,
  },
  strong: {
    fontWeight: 'bold',
  },
});

// PDF Component
const OfferLetterPDF = ({ data }) => {
  const d = {
    name: safe(data.name),
    address: safe(data.address),
    phoneNumber: safe(data.phoneNumber),
    email: safe(data.email),
    date: safe(data.date),
    position: safe(data.position),
    salary: safe(data.salary),
    offerReleaseDate: safe(data.offerReleaseDate),
    probationPeriod: safe(data.probationPeriod),
    noticePeriod: safe(data.noticePeriod),
    confirmationNoticePeriod: safe(data.confirmationNoticePeriod),
    jobResponsibilities: safeArray(data.jobResponsibilities),
  };

  const PageWithHeaderFooter = ({ children }) => (
    <Page size="A4" style={styles.page}>
      {/* Use fixed containers so header/footer never interfere with layout */}
      <View fixed style={styles.headerWrap}>
        <Image src={headerImg} style={styles.headerImg} />
      </View>
      <View fixed style={styles.footerWrap}>
        <Image src={footerImg} style={styles.footerImg} />
      </View>
      <View style={styles.content}>{children}</View>
    </Page>
  );

  return (
    <Document>
      {/* Page 1 - Basic Info and Terms */}
      <PageWithHeaderFooter>
        <Text style={styles.title}>OFFER LETTER</Text>

        <View style={styles.section}>
          <Text>To,</Text>
          <Text style={styles.bold}>{d.name}</Text>
          <Text style={styles.bold}>{d.address}</Text>
          <Text style={styles.bold}>{d.phoneNumber}</Text>
          {/* Render email safely and make it a mailto Link (no wrapping issues) */}
          {d.email ? (
            <Link src={`mailto:${d.email}`} style={styles.bold}>
              {d.email}
            </Link>
          ) : (
            <Text style={styles.bold}> </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subject: Offer of Employment</Text>
          <Text>Dear {d.name},</Text>
          <Text>
            We are pleased to offer you the position of {d.position} at DOAGuru Infosystems.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Designation & Department</Text>
          <Text>
            You will be designated as <Text style={styles.strong}>{d.position}</Text>, and you will report to the
            assigned Team Lead or Manager as per project requirement.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Joining Date</Text>
          <Text>
            Your date of joining shall be <Text style={styles.strong}>{d.date}</Text>, or as mutually agreed upon.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Working Days</Text>
          <Text>
            You will work 6 days a week, Monday to Saturday, with working hours from 10:00 AM to 7:00 PM as per company policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Place of Work</Text>
          <Text>
            Your primary place of work will be at DOAGuru Infosystems, Jabalpur (M.P.), or any other location as
            assigned.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Compensation</Text>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>Your monthly salary for the first month will be ₹{d.salary} Only.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>Based on your performance, salary may be revised as per company policy.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>Your salary will be paid on time every month.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Probation Period</Text>
          <Text>
            You will be on a probation period of <Text style={styles.strong}>{d.probationPeriod} months</Text> from the
            date of joining. During this period, your performance and conduct will be reviewed.
          </Text>
          <Text style={styles.strong}>Probation Period Meaning:</Text>
          <Text>
            This is a trial period during which your performance, conduct, learning ability, and behavior will be
            assessed.
          </Text>
          <Text>
            During this period, either the company or you may terminate the employment with{' '}
            <Text style={styles.strong}>{d.noticePeriod}</Text> notice.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Notice Period & Service Commitment</Text>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>In the event of resignation, you must serve a 30-day written notice. Under no circumstances are you permitted to resign or discontinue your employment within the first six (6) months from your joining date.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>Violation of this clause may lead to appropriate action as per company policy.</Text>
          </View>
        </View>

                <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Roles and Responsibilities</Text>
          <Text>You are expected to:</Text>
          {d.jobResponsibilities.map((resp, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>{'\u2022'}</Text>
              <Text>{resp}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. General Terms</Text>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>You are expected to maintain the highest standards of professionalism, confidentiality, and follow all company policies.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>You are also expected to adhere to the company's code of conduct and ethical guidelines.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>The company reserves the right to amend these terms and conditions at any time, with prior notice to the employee.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>This offer is valid for 15 days from the date of issue.</Text>
          </View>

          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>Failure to accept this offer within the stipulated time will result in the offer being considered withdrawn.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>Any disputes arising from this offer shall be resolved in accordance with the laws of India.</Text>
          </View>

        </View>

           <View style={styles.section}>
          <Text>We look forward to your valuable contribution to DOAGURU INFOSYSTEMS. Please sign and return a copy of this letter as confirmation of your acceptance.</Text>
        </View>

      </PageWithHeaderFooter>

      {/* Page 2 - Terms and Responsibilities */}
      <PageWithHeaderFooter>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acknowledgment:</Text>
          <Text>I, {d.name}, accept the above terms and conditions of employment.</Text>
          <View style={{ marginTop: 30 }}>
            <Text>Signature: ___________________</Text>
            <Text>Date: ________________</Text>
          </View>
        </View>

      </PageWithHeaderFooter>

      {/* Page 3 - Signatures */}
      {/* <PageWithHeaderFooter>
        {/* <View style={styles.section}>
          <Text>Please sign and return a copy of this letter as a token of your acceptance.</Text>
          <Text>We look forward to welcoming you to our team.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.strong}>Warm Regards,</Text>
          <Image src={imgS} style={styles.signature} />
          <Text>R.S. Pandey</Text>
          <Text>Director</Text>
          <Text>DOAGuru Infosystems</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acknowledgment:</Text>
          <Text>I, {d.name}, accept the above terms and conditions of employment.</Text>
          <View style={{ marginTop: 20 }}>
            <Text>Signature: ___________________</Text>
            <Text>Date: ________________</Text>
          </View>
        </View> */}
      {/* </PageWithHeaderFooter> */} 
    </Document>
  );
};

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

  const fetchOfferLetter = async () => {
    if (!id) return; // Don't fetch if no ID is provided

    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`https://letter-doaguru.dentalguru.software/api/offer-letters/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      const data = response.data;

      // Set form fields with fetched data
      setName(safe(data.name));
      setAddress(safe(data.address));
      setPhoneNumber(safe(data.phoneNumber));
      setEmail(safe(data.email));
      setDate(safe(data.joiningDate));
      setPosition(safe(data.designation));
      setSalary(safe(data.salary));
      setOfferReleaseDate(safe(data.offerReleaseDate));
      setProbationPeriod(safe(data.probationPeriod));
      setNoticePeriod(safe(data.noticePeriod));
      setConfirmationNoticePeriod(safe(data.confirmationNoticePeriod));

      // Handle job responsibilities
      let responsibilities = [];
      if (data.jobResponsibilities) {
        responsibilities = Array.isArray(data.jobResponsibilities)
          ? data.jobResponsibilities
          : (() => {
              try {
                const parsed = JSON.parse(data.jobResponsibilities);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })();
      }
      setJobResponsibilities(safeArray(responsibilities).length > 0 ? safeArray(responsibilities) : ['']);

      if (isPreviewMode) {
        const timer = setTimeout(() => {
          handlePrint();
        }, 1000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error('Error fetching offer letter:', error);
    }
  };

  useEffect(() => {
    fetchOfferLetter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditMode]);

  const handleSaveInfo = async () => {
    try {
      const letterData = {
        name: safe(name),
        address: safe(address),
        phoneNumber: safe(phoneNumber),
        email: safe(email),
        offerReleaseDate: safe(offerReleaseDate),
        joiningDate: safe(date),
        designation: safe(position),
        salary: safe(salary),
        probationPeriod: safe(probationPeriod),
        noticePeriod: safe(noticePeriod),
        confirmationNoticePeriod: safe(confirmationNoticePeriod),
        jobResponsibilities: safeArray(jobResponsibilities),
      };

      const url = isEditMode
        ? `https://letter-doaguru.dentalguru.software/api/updateOfferLetter/${id}`
        : 'https://letter-doaguru.dentalguru.software/api/saveOfferLetter';

      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
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

  const handleRemoveJobResponsibility = (index) => {
    const updatedResponsibilities = jobResponsibilities.filter((_, i) => i !== index);
    setJobResponsibilities(updatedResponsibilities.length > 0 ? updatedResponsibilities : ['']);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePrint = async () => {
    const data = {
      name,
      address,
      phoneNumber,
      email,
      date,
      position,
      salary,
      offerReleaseDate,
      probationPeriod,
      noticePeriod,
      confirmationNoticePeriod,
      jobResponsibilities,
    };

    try {
      // Build the PDF instance explicitly to avoid any race conditions
      const instance = pdf();
      instance.updateContainer(<OfferLetterPDF data={data} />);
      const blob = await instance.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safe(name) || 'offer'}_offer_letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Check console for details.');
    }
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
              <button onClick={handleSaveInfo} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {isEditMode ? 'Update' : 'Save and Print'}
              </button>
            )}
          </div>
        </div>

        {/* Form Fields */}
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
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
              <option key={month} value={month}>
                {month} month{month > 1 ? 's' : ''}
              </option>
            ))}
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
            disabled={isPreviewMode}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Job Responsibilities</label>
          {jobResponsibilities.map((responsibility, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={responsibility}
                onChange={(e) => handleJobResponsibilitiesChange(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded mt-1 mb-2"
                required
                disabled={isPreviewMode}
              />
              {!isPreviewMode && (
                <button
                  type="button"
                  onClick={() => handleRemoveJobResponsibility(index)}
                  className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  aria-label="Remove job responsibility"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addJobResponsibility}
            className="border-2 border-green-400 text-black py-2 px-4 rounded"
            disabled={isPreviewMode}
          >
            Add Job Responsibility
          </button>
        </div>

        <div className="flex gap-2">
          {/* <button type="button" onClick={handlePrint} className="bg-green-500 text-white py-2 px-4 rounded">
            Without Save Download PDF
          </button> */}
          {!isPreviewMode && (
              <button onClick={handleSaveInfo} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {isEditMode ? 'Update' : 'Save and Print'}
              </button>
            )}
          <button type="button" onClick={openModal} className="border border-gray-950 text-black py-2 px-4 rounded">
            Preview Letter
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-[95vw] max-w-7xl h-[95vh] flex flex-col">
            <div ref={previewRef} className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
                <div className="print-header flex justify-center">
                  <h1 className="text-xl font-bold pt-7 text-center">OFFER LETTER</h1>
                </div>

                <div className="company-header">
                  <h2>DOAGuru Infosystems</h2>
                  <div className="company-info">
                    Website: <a href="http://www.doaguru.com" target="_blank" rel="noreferrer" className="text-blue-900">www.doaguru.com</a> | Email: info@doaguru.com | Contact: +91-7440992424
                  </div>
                </div>

                <div className="release-date mt-4">
                  <p>
                    <strong>Date: {offerReleaseDate}</strong>
                  </p>
                </div>

                <div className="candidate-info mt-4">
                  <p>
                    <strong>To,</strong>
                    <br />
                    {name}
                    <br />
                    {address}
                    <br />
                    {phoneNumber}
                    <br />
                    {email}
                  </p>
                </div>

                <div className="subject-line mt-4">
                  <p>
                    <strong>Subject: Offer of Employment</strong>
                  </p>
                  <p className="mt-2">Dear {name},</p>
                  <p className="mt-2">
                    We are pleased to offer you the position of <strong>{position}</strong> at DOAGuru Infosystems.
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-bold">1. Designation & Department</h3>
                    <p>
                      You will be designated as <strong>{position}</strong>, and you will report to the assigned Team Lead or
                      Manager as per project requirement.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">2. Joining Date</h3>
                    <p>
                      Your date of joining shall be <strong>{date}</strong>, or as mutually agreed upon.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">3. Working Days</h3>
                    <p>
                      You will work 6 days a week, Monday to Saturday, with working hours from 10:00 AM to 7:00 PM as per company policy.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold">4. Place of Work</h3>
                    <p>
                      Your primary place of work will be at DOAGuru Infosystems, Jabalpur (M.P.), or any other location as
                      assigned.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">5. Compensation</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>Your monthly salary for the first month will be ₹{salary} ( Only).</li>
                      <li>Based on your performance, salary may be revised as per company policy.</li>
                      <li>Your salary will be paid on time every month.</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold">6. Probation Period</h3>
                    <p>
                      You will be on a probation period of <strong>{probationPeriod} months</strong> from the date of joining. During this period, your performance and conduct will be reviewed.
                    </p>
                    <p className="font-bold mt-2">Probation Period Meaning:</p>
                    <p>
                      This is a trial period during which your performance, conduct, learning ability, and behavior will be
                      assessed.
                    </p>
                    <p>
                      During this period, either the company or you may terminate the employment with <strong>{noticePeriod}</strong>{' '}
                      notice.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-bold">7. Notice Period & Service Commitment</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>In the event of resignation, you must serve a 30-day written notice. Under no circumstances are you permitted to resign or discontinue your employment within the first six (6) months from your joining date.
</li>
                      <li>Violation of this clause may lead to appropriate action as per company policy.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold">8. Roles and Responsibilities</h3>
                    <p>You are expected to:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {jobResponsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold">9. General Terms</h3>
                    <p>You are expected to maintain the highest standards of professionalism, confidentiality, and follow all company policies.</p>
                    <p>You are also expected to adhere to the company's code of conduct and ethical guidelines.</p>
                    <p>The company reserves the right to amend these terms and conditions at any time, with prior notice to the employee.</p>
                    <p>This offer is valid for 15 days from the date of issue.</p>
                    <p>Failure to accept this offer within the stipulated time will result in the offer being considered withdrawn.</p>
                    <p>Any disputes arising from this offer shall be resolved in accordance with the laws of India.</p>
                  </div>

                  <div className="mt-8">
                    <p>We look forward to your valuable contribution to DOAGURU INFOSYSTEMS. Please sign and return a copy of this letter as confirmation of your acceptance.</p>
                  </div>

                  <div className="mt-8">
                    <p className="font-bold">Warm Regards,</p>
                    <div className="mt-4">
                      <p className="font-bold">R.S. Pandey</p>
                      <p>Director</p>
                      <p>DOAGuru Infosystems</p>
                    </div>
                  </div>

                  <div className="mt-12 border-t pt-4">
                    <h3 className="font-bold">Acknowledgment:</h3>
                    <p>I, <span className="font-bold">{name}</span>, accept the above terms and conditions of employment.</p>
                    <div className="mt-8 space-y-4">
                      <p>Signature: ___________________</p>
                      <p>Date: ________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t bg-gray-50 rounded-b-lg flex justify-end gap-2">
              <button onClick={handlePrint} className="bg-green-500 text-white py-2 px-4 rounded mr-2">
                Without Save Download PDF
              </button>
              {!isPreviewMode && (
              <button onClick={handleSaveInfo} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                {isEditMode ? 'Update' : 'Save and Print'}
              </button>
            )}
              <button onClick={closeModal} className="bg-red-500 text-white py-2 px-4 rounded">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferLater;
