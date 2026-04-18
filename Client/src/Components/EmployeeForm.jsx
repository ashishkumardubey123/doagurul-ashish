import { useState } from 'react';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({ name: '', designation: '', joining_date: '', resignation_date: '',  });
  const [employeeId, setEmployeeId] = useState(null);

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
            </div>
          </div>

          <div className="dg-form-actions">
            {!employeeId ? (
              <button type="button" onClick={handleSubmit} className="dg-btn-primary">
                Save Employee Details
              </button>
            ) : (
              <button type="button" onClick={handleDownloadPDF} className="dg-btn-secondary" style={{ background: '#10b981', color: '#fff', borderColor: '#059669' }}>
                Download Experience Letter PDF
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
