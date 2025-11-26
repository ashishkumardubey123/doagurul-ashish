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
    startDate: safe(data.startDate),
    endDate: safe(data.endDate),
    position: safe(data.position),
    stipend: safe(data.stipend),
    mentorName: safe(data.mentorName),
    mentorContact: safe(data.mentorContact),
    offerReleaseDate: safe(data.offerReleaseDate),
    termsAndConditions: safeArray(data.termsAndConditions),
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
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Stipend</Text>
          <Text>
            You will receive a monthly stipend of <Text style={styles.strong}>₹{d.stipend}/-</Text> for the duration of your internship.
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
          <Text>R.S. Pandey</Text>
          <Text>Director</Text>
          <Text>DOAGuru Infosystems</Text>
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
          <div className="bg-white rounded-lg w-[95vw] max-w-7xl h-[95vh] flex flex-col">
            <div ref={previewRef} className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg">
                <div className="print-header flex justify-center">
                  <h1 className="text-xl font-bold pt-7 text-center">INTERNSHIP OFFER LETTER</h1>
                </div>

                <div className="company-header">
                  <h2>DOAGuru Infosystems</h2>
                  <div className="company-info">
                    Website: <a href="http://www.doaguru.com" target="_blank" rel="noreferrer" className="text-blue-900">www.doaguru.com</a> | Email: info@doaguru.com | Contact: +91-7440992424
                  </div>
                </div>

                <div className="release-date mt-4">
                  <p>
                    <strong>Date: {formData.offerReleaseDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                  </p>
                </div>

                <div className="candidate-info mt-4">
                  <p>
                    <strong>To,</strong>
                    <br />
                    {formData.name}
                    <br />
                    {formData.address}
                    <br />
                    {formData.phoneNumber}
                    <br />
                    {formData.email}
                  </p>
                </div>

                <div className="subject-line mt-4">
                  <p>
                    <strong>Subject: Offer of Internship</strong>
                  </p>
                  <p className="mt-2">Dear {formData.name},</p>
                  <p className="mt-2">
                    We are pleased to offer you an internship position at DOAGuru Infosystems as <strong>{formData.position}</strong>
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-bold">1. Internship Duration</h3>
                    <p>
                      Your internship will be from <strong>{formData.startDate}</strong> to <strong>{formData.endDate}</strong>.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">2. Position & Department</h3>
                    <p>
                      You will be designated as <strong>{formData.position}</strong>, and you will report to the assigned mentor as per project requirement.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">3. Stipend</h3>
                    <p>
                      You will receive a monthly stipend of <strong>{formData.stipend}</strong> for the duration of your internship.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">4. Mentor Details</h3>
                    <p>
                      You will be assigned <strong>{formData.mentorName}</strong> as your mentor.
                    </p>
                    <p>
                      Contact: <strong>{formData.mentorContact}</strong>
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">5. Working Days</h3>
                    <p>
                      You will work 6 days a week, Monday to Saturday, with working hours from 10:00 AM to 7:00 PM as per company policy.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">6. Place of Work</h3>
                    <p>
                      Your primary place of work will be at DOAGuru Infosystems, Jabalpur (M.P.), or any other location as assigned.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold">7. Terms & Conditions</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      {formData.termsAndConditions.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold">8. General Guidelines</h3>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                      <li>You are expected to maintain the highest standards of professionalism, confidentiality, and follow all company policies.</li>
                      <li>You are also expected to adhere to the company's code of conduct and ethical guidelines.</li>
                      <li>The company reserves the right to amend these terms and conditions at any time, with prior notice to the intern.</li>
                      <li>This offer is valid for 7 days from the date of issue.</li>
                      <li>Failure to accept this offer within the stipulated time will result in the offer being considered withdrawn.</li>
                      <li>Any disputes arising from this offer shall be resolved in accordance with the laws of India.</li>
                    </ul>
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
                    <p>I, <span className="font-bold">{formData.name}</span>, accept the above terms and conditions of internship.</p>
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
              <button onClick={handleSaveInfo} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Save and Print
              </button>
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

export default InternshipOfferLetter;
