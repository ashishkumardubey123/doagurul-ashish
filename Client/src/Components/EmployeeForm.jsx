import { useState, useEffect } from 'react';
import axios from 'axios';
import SearchableSelect from './SearchableSelect';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({ name: '', designation: '', joining_date: '', resignation_date: '', gender: '', signatory: 'R.S. Pandey (CEO)' });
  const [employeeId, setEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

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
        designation: emp.designation || '',
        joining_date: emp.joiningDate ? new Date(emp.joiningDate).toISOString().split('T')[0] : '',
        gender: emp.gender || '',
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/saveEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        setEmployeeId(result.employeeId); // Store the employeeId for PDF download
      } else {
        const errorData = await response.json();
        alert('Error saving employee data: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error saving employee data:', error);
    }
  };

  const handleDownloadPDF = async () => {
    if (!employeeId) {
      alert('No employee ID found!');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generatePDF/${employeeId}`);

      if (response.ok) {
        const blob = await response.blob(); // Handle PDF as a blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `experience_letter_${formData.name}.pdf`;
        a.click();
      } else {
        const errorData = await response.json();
        alert('Error generating PDF: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleGeneratePreview = async () => {
    if (!formData.name || !formData.designation || !formData.joining_date || !formData.resignation_date) {
      alert('Please fill in all required fields');
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/saveEmployee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setEmployeeId(result.employeeId);
        
        // Fetch the PDF preview right after
        const pdfResp = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/generatePDF/${result.employeeId}`);
        if (pdfResp.ok) {
          const blob = await pdfResp.blob();
          const url = window.URL.createObjectURL(blob);
          setPdfUrl(url);
          setShowPreview(true);
        } else {
          alert('Error generating PDF preview');
        }
      } else {
        const errorData = await response.json();
        alert('Error saving employee data: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error in preview:', error);
    }
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
