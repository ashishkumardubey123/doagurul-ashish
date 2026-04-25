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
const getPronouns = (gender) => {
  if (gender === 'He') return { subject: 'he', object: 'him', possessive: 'his' };
  if (gender === 'She') return { subject: 'she', object: 'her', possessive: 'her' };
  return { subject: 'they', object: 'them', possessive: 'their' };
};
const getSignatoryDetails = (signatory) => {
  if (signatory === 'HR Manager') {
    return { name: 'HR Department', title: 'HR Manager, DOAGuru Infosystems' };
  }
  if (safe(signatory).includes('CEO')) {
    return { name: 'R.S. Pandey', title: 'CEO, DOAGuru Infosystems' };
  }
  return {
    name: safe(signatory) || 'Authorized Signatory',
    title: 'Authorized Signatory',
  };
};

// PDF Styles â€” use numeric values (points) instead of CSS strings
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
  headerImg: { width: '100%', height: '100%', marginBottom: 8 },
  footerImg: { width: '100%', height: '100%', marginTop: 8 },
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
    gender: safe(data.gender),
    date: safe(data.date),
    position: safe(data.position),
    salary: safe(data.salary),
    offerReleaseDate: safe(data.offerReleaseDate),
    probationPeriod: safe(data.probationPeriod),
    noticePeriod: safe(data.noticePeriod),
    confirmationNoticePeriod: safe(data.confirmationNoticePeriod),
    jobResponsibilities: safeArray(data.jobResponsibilities),
    signatory: safe(data.signatory),
  };
  const pronouns = getPronouns(d.gender);
  const signatoryDetails = getSignatoryDetails(d.signatory);

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
            <Text>Your monthly salary for the first month will be â‚¹{d.salary} Only.</Text>
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
          <Text>
            During probation, <Text style={styles.strong}>{d.name}</Text> is expected to demonstrate {pronouns.possessive}{' '}
            ability to perform assigned duties consistently.
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
          <Text style={styles.strong}>Warm Regards,</Text>
          <Image src={imgS} style={styles.signature} />
          <Text>{signatoryDetails.name}</Text>
          <Text>{signatoryDetails.title}</Text>
        </View>

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
  const [gender, setGender] = useState('');
  const [signatory, setSignatory] = useState('R.S. Pandey (CEO)');
  const [jobResponsibilities, setJobResponsibilities] = useState(['']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const previewRef = useRef();

  const fetchOfferLetter = async () => {
    if (!id) return; // Don't fetch if no ID is provided

    try {
      const token = localStorage.getItem('token');

      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offer-letters/${id}`, {
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
      setGender(safe(data.gender));
      setSignatory(safe(data.signatory) || 'R.S. Pandey (CEO)');

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
        setIsModalOpen(true);
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
        gender: safe(gender),
        probationPeriod: safe(probationPeriod),
        noticePeriod: safe(noticePeriod),
        confirmationNoticePeriod: safe(confirmationNoticePeriod),
        jobResponsibilities: safeArray(jobResponsibilities),
        signatory: safe(signatory),
      };

      const url = isEditMode
        ? `${import.meta.env.VITE_API_BASE_URL}/api/updateOfferLetter/${id}`
        : `${import.meta.env.VITE_API_BASE_URL}/api/saveOfferLetter`;

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
      gender,
      offerReleaseDate,
      probationPeriod,
      noticePeriod,
      confirmationNoticePeriod,
      jobResponsibilities,
      signatory,
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
    <div className="dg-page-container">
      <div className="dg-page-header">
        <span className="dg-page-tag">Employee</span>
        <h1 className="dg-page-title">
          {isPreviewMode ? 'Preview Offer Letter' : isEditMode ? 'Edit Offer Letter' : 'Generate Offer Letter'}
        </h1>
      </div>

      <div className="dg-form-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {isEditMode ? 'Update the details and regenerate PDF' : 'Fill in the candidate details to generate the offer letter'}
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {(isEditMode || isPreviewMode) && (
              <button onClick={() => navigate('/download/offer-letter')} className="dg-btn-secondary">
                Back to List
              </button>
            )}
            {!isPreviewMode && (
              <button onClick={handleSaveInfo} className="dg-btn-primary" style={{ width: 'auto' }}>
                {isEditMode ? 'Update Letter' : 'Save & Download PDF'}
              </button>
            )}
          </div>
        </div>

        <div className="dg-form-section">
          <p className="dg-form-section-title">Candidate Information</p>
          <div className="dg-form-grid">
            <div className="dg-form-group">
              <label className="dg-label">Candidate Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="dg-input" style={{ paddingLeft: '1rem' }} placeholder="Full name" required disabled={isPreviewMode} />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Contact Number</label>
              <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="dg-input" style={{ paddingLeft: '1rem' }} placeholder="+91 XXXXX XXXXX" required disabled={isPreviewMode} />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Email ID</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="dg-input" style={{ paddingLeft: '1rem' }} placeholder="candidate@email.com" required disabled={isPreviewMode} />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className="dg-select" required disabled={isPreviewMode}>
                <option value="">Select Gender</option>
                <option value="He">Male (He/Him)</option>
                <option value="She">Female (She/Her)</option>
                <option value="They">Other (They/Them)</option>
              </select>
            </div>
          </div>
          <div className="dg-form-group" style={{ marginTop: '1rem' }}>
            <label className="dg-label">Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="dg-textarea" rows="3" placeholder="Full address..." required disabled={isPreviewMode} />
          </div>
        </div>

        <div className="dg-form-section">
          <p className="dg-form-section-title">Job Details</p>
          <div className="dg-form-grid">
            <div className="dg-form-group">
              <label className="dg-label">Position / Designation</label>
              <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="dg-input" style={{ paddingLeft: '1rem' }} placeholder="e.g., Software Developer" required disabled={isPreviewMode} />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Monthly Salary (Rs.)</label>
              <input type="text" value={salary} onChange={(e) => setSalary(e.target.value)} className="dg-input" style={{ paddingLeft: '1rem' }} placeholder="e.g., 25000" required disabled={isPreviewMode} />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Joining Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="dg-input" style={{ paddingLeft: '1rem' }} required disabled={isPreviewMode} />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Offer Release Date</label>
              <input type="date" value={offerReleaseDate} onChange={(e) => setOfferReleaseDate(e.target.value)} className="dg-input" style={{ paddingLeft: '1rem' }} required disabled={isPreviewMode} />
            </div>
          </div>
        </div>

        <div className="dg-form-section">
          <p className="dg-form-section-title">Terms and Conditions</p>
          <div className="dg-form-grid">
            <div className="dg-form-group">
              <label className="dg-label">Probation Period</label>
              <select value={probationPeriod} onChange={(e) => setProbationPeriod(e.target.value)} className="dg-select" required disabled={isPreviewMode}>
                <option value="">Select Probation Period</option>
                {[1,2,3,4,5,6,7,8,9,10,11,12].map((m) => (
                  <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Notice Period During Probation</label>
              <select value={noticePeriod} onChange={(e) => setNoticePeriod(e.target.value)} className="dg-select" required disabled={isPreviewMode}>
                <option value="">Select Notice Period</option>
                <option value="7 days">7 days</option>
                <option value="15 days">15 days</option>
              </select>
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Notice Period After Confirmation</label>
              <input type="text" value={confirmationNoticePeriod} onChange={(e) => setConfirmationNoticePeriod(e.target.value)} className="dg-input" style={{ paddingLeft: '1rem' }} placeholder="e.g., 30 days" required disabled={isPreviewMode} />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Signatory</label>
              <select value={signatory} onChange={(e) => setSignatory(e.target.value)} className="dg-select" required disabled={isPreviewMode}>
                <option value="R.S. Pandey (CEO)">R.S. Pandey (CEO)</option>
                <option value="HR Manager">HR Manager</option>
              </select>
            </div>
          </div>
        </div>

        <div className="dg-form-section">
          <p className="dg-form-section-title">Job Responsibilities</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {jobResponsibilities.map((responsibility, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '0.875rem', minWidth: '1.5rem', textAlign: 'center' }}>
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={responsibility}
                  onChange={(e) => handleJobResponsibilitiesChange(index, e.target.value)}
                  className="dg-input"
                  style={{ paddingLeft: '1rem', flex: 1 }}
                  placeholder={`Responsibility ${index + 1}...`}
                  required
                  disabled={isPreviewMode}
                />
                {!isPreviewMode && (
                  <button
                    type="button"
                    onClick={() => handleRemoveJobResponsibility(index)}
                    style={{ padding: '0.5rem 0.75rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', color: '#f43f5e', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244,63,94,0.2)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244,63,94,0.1)'}
                    aria-label="Remove"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          {!isPreviewMode && (
            <button
              type="button"
              onClick={addJobResponsibility}
              style={{ marginTop: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', color: '#10b981', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.18)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
            >
              + Add Responsibility
            </button>
          )}
        </div>

        <div className="dg-form-actions">
          {!isPreviewMode && (
            <button onClick={handleSaveInfo} className="dg-btn-primary" style={{ width: 'auto' }}>
              {isEditMode ? 'Update Letter' : 'Save and Download PDF'}
            </button>
          )}
          <button type="button" onClick={openModal} className="dg-btn-secondary">
            Preview Letter
          </button>
          {(isEditMode || isPreviewMode) && (
            <button onClick={() => navigate('/download/offer-letter')} className="dg-btn-secondary">
              Back to List
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid var(--border-medium)', borderRadius: '16px', width: '95vw', maxWidth: '900px', height: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Offer Letter Preview — {name || 'Candidate'}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handlePrint} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  Download PDF
                </button>
                {!isPreviewMode && (
                  <button onClick={handleSaveInfo} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                    {isEditMode ? 'Update' : 'Save and Print'}
                  </button>
                )}
                <button onClick={closeModal} style={{ padding: '0.5rem 0.875rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', color: '#f43f5e', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  Close
                </button>
              </div>
            </div>
            <div ref={previewRef} style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#f8f9fa' }}>
              <div style={{ maxWidth: '720px', margin: '0 auto', background: 'white', borderRadius: '8px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', color: '#1a1a1a', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <h1 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>OFFER LETTER</h1>
                <div style={{ borderBottom: '2px solid #6366f1', marginBottom: '1rem', paddingBottom: '0.75rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem' }}>DOAGuru Infosystems</p>
                  <p style={{ fontSize: '0.8rem', color: '#555' }}>www.doaguru.com | info@doaguru.com | +91-7440992424</p>
                </div>
                <p style={{ marginBottom: '1rem' }}><strong>Date:</strong> {offerReleaseDate}</p>
                <p><strong>To,</strong><br />{name}<br />{address}<br />{phoneNumber}<br />{email}</p>
                <p style={{ marginTop: '1rem' }}><strong>Subject: Offer of Employment</strong></p>
                <p style={{ marginTop: '0.5rem' }}>Dear {name},</p>
                <p>We are pleased to offer you the position of <strong>{position}</strong> at DOAGuru Infosystems.</p>
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}><p style={{ fontWeight: 700 }}>1. Designation and Department</p><p>You will be designated as {position}, reporting to the assigned Team Lead or Manager.</p></div>
                  <div style={{ marginBottom: '1rem' }}><p style={{ fontWeight: 700 }}>2. Joining Date</p><p>Your date of joining shall be {date}, or as mutually agreed upon.</p></div>
                  <div style={{ marginBottom: '1rem' }}><p style={{ fontWeight: 700 }}>3. Working Days</p><p>You will work 6 days a week, Monday to Saturday, 10:00 AM to 7:00 PM.</p></div>
                  <div style={{ marginBottom: '1rem' }}><p style={{ fontWeight: 700 }}>4. Place of Work</p><p>DOAGuru Infosystems, Jabalpur (M.P.), or any other assigned location.</p></div>
                  <div style={{ marginBottom: '1rem' }}><p style={{ fontWeight: 700 }}>5. Compensation</p><p>Monthly salary: Rs. {salary}. Salary may be revised based on performance.</p></div>
                  <div style={{ marginBottom: '1rem' }}><p style={{ fontWeight: 700 }}>6. Probation Period</p><p>{probationPeriod} months from joining. Notice during probation: {noticePeriod}.</p></div>
                  <div style={{ marginBottom: '1rem' }}><p style={{ fontWeight: 700 }}>6.1 Performance Expectation</p><p>During probation, <strong>{name || 'the candidate'}</strong> is expected to demonstrate {getPronouns(gender).possessive} ability to perform assigned duties consistently.</p></div>
                  <div style={{ marginBottom: '1rem' }}><p style={{ fontWeight: 700 }}>7. Notice Period</p><p>On confirmation: {confirmationNoticePeriod || '30 days'} written notice required.</p></div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>8. Roles and Responsibilities</p>
                    <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                      {jobResponsibilities.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>
                <p style={{ marginTop: '1.5rem' }}>We look forward to your valuable contribution. Please sign and return a copy as confirmation.</p>
                <div style={{ marginTop: '2rem' }}>
                  <p style={{ fontWeight: 700 }}>Warm Regards,</p>
                  <p style={{ marginTop: '0.5rem' }}>{getSignatoryDetails(signatory).name}</p>
                  <p>{getSignatoryDetails(signatory).title}</p>
                </div>
                <div style={{ marginTop: '2.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                  <p style={{ fontWeight: 700 }}>Acknowledgment</p>
                  <p>I, <strong>{name}</strong>, accept the above terms and conditions.</p>
                  <div style={{ marginTop: '1.5rem', display: 'flex', gap: '3rem' }}>
                    <p>Signature: ___________________</p>
                    <p>Date: ________________</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferLater;
