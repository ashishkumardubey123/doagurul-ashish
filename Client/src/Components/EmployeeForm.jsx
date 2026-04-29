import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
} from '@react-pdf/renderer';
import SearchableSelect from './SearchableSelect';
import CLogo from '../assets/images/CLogo.png';
import Signature from '../assets/images/CEOSignature.png';
import headerImg from '../assets/images/NewHeaderImage.png';
import footerImg from '../assets/images/NewFotterImage.png';

const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 80,
    paddingBottom: 70,
    paddingHorizontal: 50,
    position: 'relative',
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#333',
  },
  headerWrap: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  footerWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },
  headerImage: { width: '100%', height: '100%', marginBottom: 8 },
  footerImage: { width: '100%', height: '100%', marginTop: 8 },
  content: { marginTop: 20 },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000',
    textDecoration: 'underline',
  },
  dateRight: { textAlign: 'right', marginBottom: 20 },
  paragraph: { marginBottom: 15, textAlign: 'justify' },
  bold: { fontWeight: 'bold' },
  signatureSection: { marginTop: 40 },
  signatureImage: { width: 100, height: 50, marginBottom: 5 },
  signatureLine: { width: 120, height: 1, backgroundColor: '#000', marginBottom: 5 },
  signatureText: { fontSize: 10 },
  watermarkContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    bottom: 70,
    zIndex: -1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  watermark: { width: 350, height: 350, opacity: 0.04 },
});

const normalizeGender = (gender = '') => {
  const value = gender.toLowerCase();
  if (value === 'he' || value === 'male') return 'He';
  if (value === 'she' || value === 'female') return 'She';
  if (value === 'they' || value === 'other') return 'They';
  return '';
};

const getPronouns = (gender) => {
  const normalized = normalizeGender(gender);
  if (normalized === 'He') return { subject: 'he', possessive: 'his', be: 'was' };
  if (normalized === 'She') return { subject: 'she', possessive: 'her', be: 'was' };
  return { subject: 'they', possessive: 'their', be: 'were' };
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const EmployeeExperienceLetterPDF = ({ data }) => {
  const { formData, companyInfo } = data;
  const pronouns = getPronouns(formData.gender);
  const issueDate = formData.currentDate || new Date().toLocaleDateString('en-GB');

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View fixed style={pdfStyles.headerWrap}>
          <Image src={headerImg} style={pdfStyles.headerImage} />
        </View>
        <View fixed style={pdfStyles.footerWrap}>
          <Image src={footerImg} style={pdfStyles.footerImage} />
        </View>
        <View fixed style={pdfStyles.watermarkContainer}>
          <Image src={CLogo} style={pdfStyles.watermark} />
        </View>

        <View style={pdfStyles.content}>
          <Text style={pdfStyles.dateRight}>Date: {issueDate}</Text>
          <Text style={pdfStyles.title}>TO WHOMSOEVER IT MAY CONCERN</Text>

          <Text style={pdfStyles.paragraph}>
            This is to certify that <Text style={pdfStyles.bold}>{formData.name}</Text>
            {formData.employeeCode ? ` (Employee ID: ${formData.employeeCode})` : ''} was employed with{' '}
            <Text style={pdfStyles.bold}>{companyInfo.name}</Text> as a{' '}
            <Text style={pdfStyles.bold}>{formData.designation}</Text> from{' '}
            <Text style={pdfStyles.bold}>{formData.joining_date}</Text> to{' '}
            <Text style={pdfStyles.bold}>{formData.resignation_date}</Text>.
          </Text>

          <Text style={pdfStyles.paragraph}>
            During {pronouns.possessive} tenure with us, {pronouns.subject} {pronouns.be} found to be sincere,
            hardworking, and professional in approach. {pronouns.possessive.charAt(0).toUpperCase() + pronouns.possessive.slice(1)} performance and conduct were satisfactory.
          </Text>

          <Text style={pdfStyles.paragraph}>
            We wish <Text style={pdfStyles.bold}>{formData.name}</Text> success in all future endeavors.
          </Text>

          <View style={pdfStyles.signatureSection}>
            <Text style={{ marginBottom: 10 }}>For {companyInfo.name}</Text>
            <Image src={Signature} style={pdfStyles.signatureImage} />
            <View style={pdfStyles.signatureLine}></View>
            <Text style={[pdfStyles.signatureText, pdfStyles.bold]}>
              {formData.signatory === 'HR Manager' ? 'HR Department' : formData.signatory.includes('CEO') ? 'R.S. Pandey' : formData.signatory}
            </Text>
            <Text style={pdfStyles.signatureText}>
              {formData.signatory === 'HR Manager' ? 'HR Manager' : formData.signatory.includes('CEO') ? 'CEO, DOAGuru Infosystems' : 'Authorized Signatory'}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    employeeCode: '',
    designation: '',
    joining_date: '',
    resignation_date: '',
    gender: '',
    signatory: 'R.S. Pandey (CEO)',
    currentDate: new Date().toLocaleDateString('en-GB'),
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://sf.doaguru.com/api/users');
        if (response.data && Array.isArray(response.data)) {
          setEmployees(response.data.filter(emp => emp.employment_status === 'active'));
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.full_name} (${emp.employee_id || 'No ID'}) - ${emp.department || 'N/A'}`
  }));

  const handleEmployeeSelect = (id) => {
    const emp = employees.find(e => e.id == id);
    if (emp) {
      setFormData(prev => ({
        ...prev,
        name: emp.full_name || '',
        employeeCode: emp.employee_id || '',
        designation: emp.designation || '',
        joining_date: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : '',
        gender: normalizeGender(emp.gender),
      }));
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfUrl) {
      alert('Please generate preview first!');
      return;
    }

    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `experience_letter_${formData.name || 'employee'}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleGeneratePreview = async () => {
    if (!formData.name || !formData.designation || !formData.joining_date || !formData.resignation_date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Keep existing save flow so entries remain available in records table.
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/saveEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await response.json();
      } else {
        const errorData = await response.json();
        alert('Error saving employee data: ' + errorData.message);
        return;
      }
    } catch (error) {
      console.error('Error saving employee data:', error);
      return;
    }

    try {
      const formattedData = {
        ...formData,
        joining_date: formatDate(formData.joining_date),
        resignation_date: formatDate(formData.resignation_date),
      };
      const companyInfo = { name: 'DOAGURU INFOSYSTEMS' };
      const instance = pdf(<EmployeeExperienceLetterPDF data={{ formData: formattedData, companyInfo }} />);
      const blob = await instance.toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(prev => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setShowPreview(true);
    } catch (error) {
      console.error('Error generating preview:', error);
      alert('Error generating PDF preview');
    }
  };

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  if (showPreview) {
    return (
      <div className="dg-page-container">
        <div className="dg-page-header">
          <span className="dg-page-tag">Preview</span>
          <h1 className="dg-page-title">Experience Letter Preview</h1>
        </div>
        <div className="dg-form-card flex flex-col h-[800px]">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => setShowPreview(false)} className="dg-btn-secondary">
              Back to Form
            </button>
            <button onClick={handleDownloadPDF} className="dg-btn-primary" style={{ width: 'auto' }}>
              Download PDF
            </button>
          </div>
          {pdfUrl ? (
            <iframe src={pdfUrl} className="w-full flex-1 rounded-md border border-[var(--border-medium)]" title="PDF Preview" />
          ) : (
            <div className="w-full flex-1 flex items-center justify-center text-[var(--text-secondary)]">Generating preview...</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="dg-page-container">
      <div className="dg-page-header">
        <span className="dg-page-tag">Experience</span>
        <h1 className="dg-page-title">Generate Experience Letter</h1>
      </div>

      <div className="dg-form-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Fill in the details to generate the employee experience letter
          </p>
        </div>

        <form>
          <div className="dg-form-section">
            <p className="dg-form-section-title">Select Employee</p>
            <div className="dg-form-group">
              <label className="dg-label">Search and Select Employee</label>
              <SearchableSelect
                options={employeeOptions}
                onChange={handleEmployeeSelect}
                placeholder={loading ? "Loading employees..." : "-- Select Employee --"}
              />
            </div>
          </div>

          <div className="dg-form-section">
            <p className="dg-form-section-title">Employee Details</p>
            <div className="dg-form-grid">
              <div className="dg-form-group">
                <label className="dg-label">Employee Name</label>
                <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Designation</label>
                <input type="text" placeholder="Designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Employee ID</label>
                <input type="text" placeholder="Employee ID" value={formData.employeeCode} onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })} className="dg-input" />
              </div>
            </div>
            
            <p className="dg-form-section-title" style={{ marginTop: '1.5rem' }}>Tenure Dates</p>
            <div className="dg-form-grid">
              <div className="dg-form-group">
                <label className="dg-label">Joining Date</label>
                <input type="date" value={formData.joining_date} onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Resignation Date</label>
                <input type="date" value={formData.resignation_date} onChange={(e) => setFormData({ ...formData, resignation_date: e.target.value })} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Gender (Pronouns)</label>
                <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="dg-input" required>
                  <option value="">-- Select Gender --</option>
                  <option value="He">Male (He/Him)</option>
                  <option value="She">Female (She/Her)</option>
                  <option value="They">Other (They/Them)</option>
                </select>
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Signatory</label>
                <select value={formData.signatory} onChange={(e) => setFormData({ ...formData, signatory: e.target.value })} className="dg-input" required>
                  <option value="R.S. Pandey (CEO)">R.S. Pandey (CEO)</option>
                  <option value="HR Manager">HR Manager</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dg-form-actions">
            <button type="button" onClick={handleGeneratePreview} className="dg-btn-primary">
              Preview Letter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
