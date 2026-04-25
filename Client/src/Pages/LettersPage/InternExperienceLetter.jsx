import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  pdf,
  Font,
} from '@react-pdf/renderer';
import SearchableSelect from '../../Components/SearchableSelect';

// Images for PDF
import CLogo from "../../assets/images/CLogo.png";
import Signature from "../../assets/images/CEOSignature.png";
import headerImg from "../../assets/images/NewHeaderImage.png";
import footerImg from "../../assets/images/NewFotterImage.png";

// PDF Styles
const styles = StyleSheet.create({
  page: { paddingTop: 80, paddingBottom: 70, paddingHorizontal: 50, position: 'relative', fontSize: 11, fontFamily: 'Helvetica', lineHeight: 1.5, color: '#333' },
  headerWrap: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  footerWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },
  headerImg: { width: '100%', height: '100%', marginBottom: 8 },
  footerImg: { width: '100%', height: '100%', marginTop: 8 },
  content: { marginTop: 20 },
  title: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, color: '#000', textDecoration: 'underline' },
  dateRight: { textAlign: 'right', marginBottom: 20 },
  paragraph: { marginBottom: 15, textAlign: 'justify' },
  bold: { fontWeight: 'bold' },
  signatureSection: { marginTop: 40 },
  signatureImage: { width: 100, height: 50, marginBottom: 5 },
  signatureLine: { width: 120, height: 1, backgroundColor: '#000', marginBottom: 5 },
  signatureText: { fontSize: 10 },
  watermarkContainer: { position: 'absolute', top: 80, left: 0, right: 0, bottom: 70, zIndex: -1, justifyContent: 'center', alignItems: 'center' },
  watermark: { width: 350, height: 350, opacity: 0.04 }
});

const InternExperienceLetterPDF = ({ data }) => {
  const { formData, companyInfo } = data;
  
  const PageWithHeaderFooter = ({ children }) => (
    <Page size="A4" style={styles.page}>
      <View fixed style={styles.headerWrap}><Image src={headerImg} style={styles.headerImg} /></View>
      <View fixed style={styles.footerWrap}><Image src={footerImg} style={styles.footerImg} /></View>
      <View fixed style={styles.watermarkContainer}><Image src={CLogo} style={styles.watermark} /></View>
      <View style={styles.content}>{children}</View>
    </Page>
  );

  return (
    <Document>
      <PageWithHeaderFooter>
        <Text style={styles.dateRight}>Date: {formData.currentDate}</Text>
        
        <Text style={styles.title}>TO WHOMSOEVER IT MAY CONCERN</Text>
        
        <Text style={styles.paragraph}>
          This is to certify that <Text style={styles.bold}>{formData.employeeName}</Text> (Employee ID: {formData.employeeId}) has successfully completed their internship with <Text style={styles.bold}>{companyInfo.name}</Text>. 
          {formData.gender === 'He' ? ' He' : formData.gender === 'She' ? ' She' : ' They'} worked as an <Text style={styles.bold}>{formData.designation}</Text> in the {formData.department} Department from <Text style={styles.bold}>{formData.startDate}</Text> to <Text style={styles.bold}>{formData.endDate}</Text>.
        </Text>
        
        <Text style={styles.paragraph}>
          During {formData.gender === 'He' ? 'his' : formData.gender === 'She' ? 'her' : 'their'} tenure with us, {formData.gender === 'He' ? 'he' : formData.gender === 'She' ? 'she' : 'they'} {formData.gender === 'They' ? 'were' : 'was'} found to be hardworking, diligent, and eager to learn. {formData.gender === 'He' ? 'His' : formData.gender === 'She' ? 'Her' : 'Their'} contributions to the assigned projects were valuable and demonstrated a solid understanding of the concepts involved.
        </Text>
        
        <Text style={styles.paragraph}>
          We wish <Text style={styles.bold}>{formData.employeeName}</Text> the very best in all {formData.gender === 'He' ? 'his' : formData.gender === 'She' ? 'her' : 'their'} future endeavors.
        </Text>
        
        <View style={styles.signatureSection}>
          <Text style={{ marginBottom: 10 }}>For {companyInfo.name}</Text>
          {formData.showSignature && (
            <Image src={Signature} style={styles.signatureImage} />
          )}
          {!formData.showSignature && <View style={{ height: 50 }} />}
          <View style={styles.signatureLine}></View>
          <Text style={[styles.signatureText, styles.bold]}>
            {formData.signatory === 'HR Manager' ? 'HR Department' : formData.signatory.includes('CEO') ? 'R.S. Pandey' : formData.signatory}
          </Text>
          <Text style={styles.signatureText}>
            {formData.signatory === 'HR Manager' ? 'HR Manager' : formData.signatory.includes('CEO') ? 'CEO, DOAGuru Infosystems' : 'Authorized Signatory'}
          </Text>
        </View>

      </PageWithHeaderFooter>
    </Document>
  );
};

const InternExperienceLetter = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    designation: '',
    department: '',
    startDate: '',
    endDate: '',
    gender: '',
    currentDate: new Date().toLocaleDateString('en-GB'),
    showSignature: true,
    signatory: 'R.S. Pandey (CEO)'
  });

  const companyInfo = {
    name: 'DOAGURU INFOSYSTEMS',
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://sf.doaguru.com/api/users');
      if (response.data && Array.isArray(response.data)) {
        const activeEmployees = response.data.filter(emp => emp.employment_status === 'active');
        setEmployees(activeEmployees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.full_name} (${emp.employee_id || 'No ID'}) - ${emp.department || 'N/A'}`
  }));

  const handleEmployeeSelect = (employeeId) => {
    const employee = employees.find(emp => emp.id == employeeId);
    if (employee) {
      setFormData(prev => ({
        ...prev,
        employeeName: employee.full_name || '',
        employeeId: employee.employee_id || '',
        designation: employee.designation || 'Intern',
        department: employee.department || '',
        startDate: employee.joiningDate ? new Date(employee.joiningDate).toISOString().split('T')[0] : '',
        gender: employee.gender || '',
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFormatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleGeneratePreview = async (e) => {
    e.preventDefault();
    setShowPreview(true);
    
    const formattedData = {
      ...formData,
      startDate: handleFormatDate(formData.startDate),
      endDate: handleFormatDate(formData.endDate),
    };

    const instance = pdf(<InternExperienceLetterPDF data={{ formData: formattedData, companyInfo }} />);
    const blob = await instance.toBlob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || ''}/api/intern-experience-letters`, {
        ...formData,
        startDate: handleFormatDate(formData.startDate),
        endDate: handleFormatDate(formData.endDate)
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to save to Database:', err);
    }

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${formData.employeeName.replace(' ', '_')}_Experience_Letter.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
            <button onClick={handleDownload} className="dg-btn-primary" style={{ width: 'auto' }}>
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
        <span className="dg-page-tag">Interns</span>
        <h1 className="dg-page-title">Generate Intern Experience Letter</h1>
      </div>
      
      <div className="dg-form-card">
        <form onSubmit={handleGeneratePreview}>
          <div className="dg-form-section">
            <p className="dg-form-section-title">Select Intern</p>
            <div className="dg-form-group">
              <label className="dg-label">Search and Select Intern</label>
              <SearchableSelect 
                options={employeeOptions}
                onChange={handleEmployeeSelect}
                placeholder={loading ? "Loading Interns..." : "-- Select Intern --"}
              />
            </div>
          </div>

          <div className="dg-form-section">
            <p className="dg-form-section-title">Intern Details</p>
            <div className="dg-form-grid">
              <div className="dg-form-group">
                <label className="dg-label">Employee Name</label>
                <input type="text" name="employeeName" value={formData.employeeName} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Employee ID</label>
                <input type="text" name="employeeId" value={formData.employeeId} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Designation</label>
                <input type="text" name="designation" value={formData.designation} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Pronouns</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="dg-input" required>
                  <option value="">-- Select Gender --</option>
                  <option value="He">Male (He/Him)</option>
                  <option value="She">Female (She/Her)</option>
                  <option value="They">Other (They/Them)</option>
                </select>
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Signatory</label>
                <select name="signatory" value={formData.signatory} onChange={handleChange} className="dg-input" required>
                  <option value="R.S. Pandey (CEO)">R.S. Pandey (CEO)</option>
                  <option value="HR Manager">HR Manager</option>
                </select>
              </div>
            </div>
          </div>

          <div className="dg-form-section">
            <p className="dg-form-section-title">Tenure Details</p>
            <div className="dg-form-grid">
              <div className="dg-form-group">
                <label className="dg-label">Start Date</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">End Date</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Date of Issue</label>
                <input type="text" name="currentDate" value={formData.currentDate} onChange={handleChange} className="dg-input" required />
              </div>
            </div>
          </div>

          <div className="dg-form-section">
            <p className="dg-form-section-title">Document Settings</p>
            <div className="dg-form-group flex items-center gap-3 mt-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="showSignature" checked={formData.showSignature} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-[var(--border-medium)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
                <span className="ml-3 text-sm font-medium text-[var(--text-primary)]">Include Digital Signature</span>
              </label>
            </div>
          </div>

          <div className="dg-form-actions">
            <button type="submit" className="dg-btn-primary">
              Generate Experience Letter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InternExperienceLetter;
