import { useState, useRef } from 'react';
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
  footerImg: { width: '100%', height: '100%', marginTop: 10 },
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
const InternshipOfferLetterPDF = ({ data }) => {
  const d = {
    name: safe(data.name),
    address: safe(data.address),
    phoneNumber: safe(data.phoneNumber),
    email: safe(data.email),
    gender: safe(data.gender),
    startDate: safe(data.startDate),
    endDate: safe(data.endDate),
    position: safe(data.position),
    stipend: safe(data.stipend),
    mentorName: safe(data.mentorName),
    mentorContact: safe(data.mentorContact),
    offerReleaseDate: safe(data.offerReleaseDate),
    termsAndConditions: safeArray(data.termsAndConditions),
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
      {/* Page 1 - Internship Offer Details */}
      <PageWithHeaderFooter>
        <Text style={styles.title}>INTERNSHIP OFFER LETTER</Text>

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
          <Text style={styles.sectionTitle}>Subject: Offer of Internship</Text>
          <Text>Dear {d.name},</Text>
          <Text>
            We are pleased to offer you an internship position at DOAGuru Infosystems as <Text style={styles.strong}>{d.position}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Internship Duration</Text>
          <Text>
            Your internship will be from <Text style={styles.strong}>{d.startDate}</Text> to <Text style={styles.strong}>{d.endDate}</Text>.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Position & Department</Text>
          <Text>
            You will be designated as <Text style={styles.strong}>{d.position}</Text>, and you will report to the assigned mentor as per project requirement.
          </Text>
          <Text>
            Throughout the internship, <Text style={styles.strong}>{d.name}</Text> will be expected to complete assigned tasks and demonstrate {pronouns.possessive} progress regularly.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Stipend</Text>
          <Text>
            You will receive a monthly stipend of <Text style={styles.strong}>?{d.stipend}/-</Text> for the duration of your internship.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Mentor Details</Text>
          <Text>
            You will be assigned <Text style={styles.strong}>{d.mentorName}</Text> as your mentor.
          </Text>
          <Text>
            Contact: <Text style={styles.strong}>{d.mentorContact}</Text>
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Working Days</Text>
          <Text>
            You will work 6 days a week, Monday to Saturday, with working hours from 10:00 AM to 7:00 PM as per company policy.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Place of Work</Text>
          <Text>
            Your primary place of work will be at DOAGuru Infosystems, Jabalpur (M.P.), or any other location as assigned.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Terms & Conditions</Text>
          {d.termsAndConditions.map((term, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>{index + 1}.</Text>
              <Text>{term}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. General Guidelines</Text>
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
            <Text>The company reserves the right to amend these terms and conditions at any time, with prior notice to the intern.</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bullet}>{'\u2022'}</Text>
            <Text>This offer is valid for 7 days from the date of issue.</Text>
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

        <View style={styles.section}>
          <Text style={styles.strong}>Warm Regards,</Text>
          <Image src={imgS} style={styles.signature} />
          <Text>{signatoryDetails.name}</Text>
          <Text>{signatoryDetails.title}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acknowledgment:</Text>
          <Text>I, {d.name}, accept the above terms and conditions of internship.</Text>
          <View style={{ marginTop: 30 }}>
            <Text>Signature: ___________________</Text>
            <Text>Date: ________________</Text>
          </View>
        </View>
      </PageWithHeaderFooter>
    </Document>
  );
};

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
    gender: '',
    signatory: 'R.S. Pandey (CEO)',
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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/saveInternshipOffer`, {
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

  const handlePrint = async () => {
    const data = {
      name: formData.name,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      startDate: formData.startDate,
      endDate: formData.endDate,
      position: formData.position,
      stipend: formData.stipend,
      mentorName: formData.mentorName,
      mentorContact: formData.mentorContact,
      gender: formData.gender,
      signatory: formData.signatory,
      offerReleaseDate: formData.offerReleaseDate,
      termsAndConditions: formData.termsAndConditions,
    };

    try {
      // Build the PDF instance explicitly to avoid any race conditions
      const instance = pdf();
      instance.updateContainer(<InternshipOfferLetterPDF data={data} />);
      const blob = await instance.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${safe(formData.name) || 'internship'}_internship_offer_letter.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="dg-page-container">
      {/* Page Header */}
      <div className="dg-page-header">
        <span className="dg-page-tag">Internship</span>
        <h1 className="dg-page-title">Generate Internship Offer Letter</h1>
      </div>

      <div className="dg-form-card">
        {/* Top action bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Fill in the intern details to generate the offer letter
          </p>
        </div>

        {/* Section: Intern Info */}
        <div className="dg-form-section">
          <p className="dg-form-section-title">Candidate Information</p>
          <div className="dg-form-grid">
            <div className="dg-form-group">
              <label className="dg-label">Candidate Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Contact Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="dg-select" required>
                <option value="">Select Gender</option>
                <option value="He">Male (He/Him)</option>
                <option value="She">Female (She/Her)</option>
                <option value="They">Other (They/Them)</option>
              </select>
            </div>
          </div>
          <div className="dg-form-group" style={{ marginTop: '1rem' }}>
            <label className="dg-label">Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} className="dg-textarea" rows="3" required></textarea>
          </div>
        </div>

        {/* Section: Internship Details */}
        <div className="dg-form-section">
          <p className="dg-form-section-title">Internship Details</p>
          <div className="dg-form-grid">
            <div className="dg-form-group">
              <label className="dg-label">Position</label>
              <input type="text" name="position" value={formData.position} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Monthly Stipend</label>
              <input type="text" name="stipend" value={formData.stipend} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} placeholder="e.g., Rs. 5000" required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">End Date</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
          </div>
        </div>

        {/* Section: Mentor & Misc */}
        <div className="dg-form-section">
          <p className="dg-form-section-title">Mentor & Issuance</p>
          <div className="dg-form-grid">
            <div className="dg-form-group">
              <label className="dg-label">Mentor's Name</label>
              <input type="text" name="mentorName" value={formData.mentorName} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Mentor's Contact</label>
              <input type="text" name="mentorContact" value={formData.mentorContact} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Offer Release Date</label>
              <input type="date" name="offerReleaseDate" value={formData.offerReleaseDate} onChange={handleChange} className="dg-input" style={{ paddingLeft: '1rem' }} required />
            </div>
            <div className="dg-form-group">
              <label className="dg-label">Signatory</label>
              <select name="signatory" value={formData.signatory} onChange={handleChange} className="dg-select" required>
                <option value="R.S. Pandey (CEO)">R.S. Pandey (CEO)</option>
                <option value="HR Manager">HR Manager</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section: Terms and Conditions */}
        <div className="dg-form-section">
          <p className="dg-form-section-title">Terms & Conditions</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {formData.termsAndConditions.map((term, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '0.875rem', minWidth: '1.5rem', textAlign: 'center' }}>
                  {index + 1}.
                </span>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => handleTermChange(index, e.target.value)}
                  className="dg-input"
                  style={{ paddingLeft: '1rem', flex: 1 }}
                  required
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addTerm}
            style={{ marginTop: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '8px', color: '#10b981', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.18)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.1)'}
          >
            + Add Term
          </button>
        </div>

        {/* Action Buttons */}
        <div className="dg-form-actions">
          <button type="button" onClick={handleSubmit} className="dg-btn-secondary">
            Preview Letter
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1a1a2e', border: '1px solid var(--border-medium)', borderRadius: '16px', width: '95vw', maxWidth: '900px', height: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 24px 80px rgba(0,0,0,0.6)', animation: 'fadeInUp 0.3s ease' }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Internship Offer Preview — {formData.name || 'Candidate'}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={handlePrint} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#10b981,#059669)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  Download PDF
                </button>
                <button onClick={handleSaveInfo} style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  Save & Print
                </button>
                <button onClick={closeModal} style={{ padding: '0.5rem 0.875rem', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', color: '#f43f5e', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                  Close
                </button>
              </div>
            </div>

            {/* Modal Body: Printed White Theme for PDF */}
            <div ref={previewRef} style={{ flex: 1, overflowY: 'auto', padding: '2rem', background: '#f8f9fa' }}>
              <div style={{ maxWidth: '720px', margin: '0 auto', background: 'white', borderRadius: '8px', padding: '3rem', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', color: '#1a1a1a', fontSize: '0.9rem', lineHeight: 1.7 }}>
                <h1 style={{ textAlign: 'center', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>INTERNSHIP OFFER LETTER</h1>
                <div style={{ borderBottom: '2px solid #6366f1', marginBottom: '1rem', paddingBottom: '0.75rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '1rem' }}>DOAGuru Infosystems</p>
                  <p style={{ fontSize: '0.8rem', color: '#555' }}>www.doaguru.com | info@doaguru.com | +91-7440992424</p>
                </div>
                <p style={{ marginBottom: '1rem' }}><strong>Date:</strong> {formData.offerReleaseDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                <p><strong>To,</strong><br />{formData.name}<br />{formData.address}<br />{formData.phoneNumber}<br />{formData.email}</p>
                <p style={{ marginTop: '1rem' }}><strong>Subject: Offer of Internship</strong></p>
                <p style={{ marginTop: '0.5rem' }}>Dear {formData.name},</p>
                <p>We are pleased to offer you an internship position at DOAGuru Infosystems as <strong>{formData.position}</strong></p>
                
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>1. Internship Duration</p>
                    <p>Your internship will be from <strong>{formData.startDate}</strong> to <strong>{formData.endDate}</strong>.</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>2. Position & Department</p>
                    <p>You will be designated as <strong>{formData.position}</strong>, and you will report to the assigned mentor.</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>2.1 Performance Expectation</p>
                    <p>Throughout the internship, <strong>{formData.name || 'the intern'}</strong> is expected to complete assigned tasks and demonstrate {getPronouns(formData.gender).possessive} progress regularly.</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>3. Stipend</p>
                    <p>You will receive a monthly stipend of <strong>{formData.stipend}</strong>.</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>4. Mentor Details</p>
                    <p>You will be assigned <strong>{formData.mentorName}</strong> ({formData.mentorContact}).</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>5. Working Days</p>
                    <p>You will work 6 days a week, Monday to Saturday, 10:00 AM to 7:00 PM.</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>6. Place of Work</p>
                    <p>DOAGuru Infosystems, Jabalpur (M.P.), or as assigned.</p>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontWeight: 700 }}>7. Terms & Conditions</p>
                    <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
                      {formData.termsAndConditions.map((term, index) => <li key={index}>{term}</li>)}
                    </ul>
                  </div>
                </div>
                
                <p style={{ marginTop: '1.5rem' }}>We look forward to your valuable contribution. Please sign and return a copy as confirmation.</p>
                <div style={{ marginTop: '2rem' }}>
                  <p style={{ fontWeight: 700 }}>Warm Regards,</p>
                  <p style={{ marginTop: '0.5rem' }}>{getSignatoryDetails(formData.signatory).name}</p>
                  <p>{getSignatoryDetails(formData.signatory).title}</p>
                </div>
                <div style={{ marginTop: '2.5rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
                  <p style={{ fontWeight: 700 }}>Acknowledgment</p>
                  <p>I, <strong>{formData.name}</strong>, accept the above terms and conditions of internship.</p>
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

export default InternshipOfferLetter;

