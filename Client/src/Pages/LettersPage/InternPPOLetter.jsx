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
  page: { paddingTop: 80, paddingBottom: 70, paddingHorizontal: 50, position: 'relative', fontSize: 10, fontFamily: 'Helvetica', lineHeight: 1.5, color: '#333' },
  headerWrap: { position: 'absolute', top: 0, left: 0, right: 0, height: 80 },
  footerWrap: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 60 },
  headerImg: { width: '100%', height: '100%' },
  footerImg: { width: '100%', height: '100%' },
  content: { marginTop: 15 },
  title: { fontSize: 14, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#000', textDecoration: 'underline' },
  bold: { fontWeight: 'bold' },
  dateRight: { textAlign: 'right', marginBottom: 10 },
  paragraph: { marginBottom: 10, textAlign: 'justify' },
  table: { display: "table", width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0, marginTop: 10, marginBottom: 10 },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: { width: "50%", borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, backgroundColor: '#f0f0f0', padding: 5 },
  tableCol: { width: "50%", borderStyle: "solid", borderBottomWidth: 1, borderRightWidth: 1, padding: 5 },
  tableCellHeader: { margin: "auto", fontSize: 10, fontWeight: 500 },
  tableCell: { margin: "auto", fontSize: 10 },
  signatureSection: { marginTop: 25 },
  signatureImage: { width: 100, height: 50, marginBottom: 5 },
  signatureLine: { width: 120, height: 1, backgroundColor: '#000', marginBottom: 5 },
  signatureText: { fontSize: 10 },
  watermarkContainer: { position: 'absolute', top: 80, left: 0, right: 0, bottom: 70, zIndex: -1, justifyContent: 'center', alignItems: 'center' },
  watermark: { width: 350, height: 350, opacity: 0.04 }
});

const InternPPOLetterPDF = ({ data }) => {
  const { formData, companyInfo } = data;

  const monthlyGross = formData.newCTC ? formData.newCTC / 12 : 0;
  const basic = formData.basicSalary ? parseFloat(formData.basicSalary) : 0;
  const hra = formData.hra ? parseFloat(formData.hra) : 0;
  const allowances = formData.allowances ? parseFloat(formData.allowances) : 0;

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
        
        <Text style={styles.title}>PRE-PLACEMENT OFFER (PPO)</Text>
        
        <Text style={styles.paragraph}>Dear <Text style={styles.bold}>{formData.employeeName}</Text>,</Text>
        
        <Text style={styles.paragraph}>
          We are pleased to offer you the full-time position of <Text style={styles.bold}>{formData.newDesignation}</Text> at <Text style={styles.bold}>{companyInfo.name}</Text>. 
          This Pre-Placement Offer (PPO) is being extended to you based on your excellent performance during your internship with us as an <Text style={styles.bold}>{formData.oldDesignation}</Text>.
        </Text>

        <Text style={styles.paragraph}>
          Your transition to a full-time employee will be effective from <Text style={styles.bold}>{formData.joiningDate}</Text>. 
          Your Total Cost to Company (CTC) will be <Text style={styles.bold}>₹{parseInt(formData.newCTC).toLocaleString('en-IN')} per annum</Text>.
        </Text>

        <Text style={[styles.paragraph, styles.bold]}>Compensation Breakdown:</Text>
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Salary Component</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Monthly (₹)</Text></View>
            <View style={styles.tableColHeader}><Text style={styles.tableCellHeader}>Annual (₹)</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Basic Salary</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{basic.toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{(basic * 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>House Rent Allowance (HRA)</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{hra.toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{(hra * 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={styles.tableCol}><Text style={styles.tableCell}>Other Allowances</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{allowances.toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text></View>
            <View style={styles.tableCol}><Text style={styles.tableCell}>{(allowances * 12).toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text></View>
          </View>
          <View style={styles.tableRow}>
            <View style={[styles.tableColHeader, {backgroundColor: '#e2e8f0'}]}><Text style={[styles.tableCellHeader, styles.bold]}>Total Gross Salary</Text></View>
            <View style={[styles.tableColHeader, {backgroundColor: '#e2e8f0'}]}><Text style={[styles.tableCellHeader, styles.bold]}>{monthlyGross.toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text></View>
            <View style={[styles.tableColHeader, {backgroundColor: '#e2e8f0'}]}><Text style={[styles.tableCellHeader, styles.bold]}>{Number(formData.newCTC).toLocaleString('en-IN', {maximumFractionDigits: 0})}</Text></View>
          </View>
        </View>

        <Text style={styles.paragraph}>
          We look forward to your continued contribution to DOAGuru Infosystems. Please review the terms, sign, and return a copy of this letter by <Text style={styles.bold}>{formData.acceptanceDate}</Text> to indicate your acceptance of this offer.
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

const InternPPOLetter = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    oldDesignation: '',
    newDesignation: '',
    newCTC: '',
    basicSalary: '',
    hra: '',
    allowances: '',
    joiningDate: '',
    acceptanceDate: '',
    currentDate: new Date().toLocaleDateString('en-GB'),
    showSignature: true,
    gender: '',
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
        oldDesignation: employee.designation || 'Intern',
        gender: employee.gender || '',
        // Can also auto-fill newCTC if needed but user typically fills it manually for PPO
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
      joiningDate: handleFormatDate(formData.joiningDate),
      acceptanceDate: handleFormatDate(formData.acceptanceDate),
    };

    const instance = pdf(<InternPPOLetterPDF data={{ formData: formattedData, companyInfo }} />);
    const blob = await instance.toBlob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL || ''}/api/intern-ppo-letters`, {
        ...formData,
        joiningDate: handleFormatDate(formData.joiningDate)
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Failed to save to Database:', err);
    }

    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${formData.employeeName.replace(' ', '_')}_PPO_Letter.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (showPreview) {
    return (
      <div className="dg-page-container">
        <div className="dg-page-header">
          <span className="dg-page-tag">Preview</span>
          <h1 className="dg-page-title">PPO Letter Preview</h1>
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
        <h1 className="dg-page-title">Generate PPO Letter</h1>
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
            <p className="dg-form-section-title">Employee Details</p>
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
                <label className="dg-label">Internship Designation</label>
                <input type="text" name="oldDesignation" value={formData.oldDesignation} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">New Full-Time Designation</label>
                <input type="text" name="newDesignation" value={formData.newDesignation} onChange={handleChange} className="dg-input" required />
              </div>
            </div>
          </div>

          <div className="dg-form-section">
            <p className="dg-form-section-title">Package & Timeline</p>
            <div className="dg-form-grid">
              <div className="dg-form-group">
                <label className="dg-label">New Annual CTC (₹)</label>
                <input type="number" name="newCTC" value={formData.newCTC} onChange={handleChange} className="dg-input" step="500" min="0" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Basic Salary (Monthly ₹)</label>
                <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} className="dg-input" min="0" step="1" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">HRA (Monthly ₹)</label>
                <input type="number" name="hra" value={formData.hra} onChange={handleChange} className="dg-input" min="0" step="1" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Other Allowances (Monthly ₹)</label>
                <input type="number" name="allowances" value={formData.allowances} onChange={handleChange} className="dg-input" min="0" step="1" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Date of Joining (Full-Time)</label>
                <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Acceptance Deadline</label>
                <input type="date" name="acceptanceDate" value={formData.acceptanceDate} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Date of Issue</label>
                <input type="text" name="currentDate" value={formData.currentDate} onChange={handleChange} className="dg-input" required />
              </div>
              <div className="dg-form-group">
                <label className="dg-label">Gender</label>
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
              Generate PPO Letter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InternPPOLetter;
