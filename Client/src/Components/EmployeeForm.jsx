import { useState } from 'react';

const EmployeeForm = () => {
  const [formData, setFormData] = useState({ name: '', designation: '', joining_date: '', resignation_date: '',  });
  const [employeeId, setEmployeeId] = useState(null);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://letter-doaguru.dentalguru.software/api/saveEmployee', {
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
      const response = await fetch(`https://letter-doaguru.dentalguru.software/api/generatePDF/${employeeId}`);

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
    <div className='flex m-auto flex-col  '>
      <form>
        <input 
        className='border border-black rounded-lg px-3 py-1 m-2'
        type="text" placeholder="Name"  value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required/>
        <input 
        className='border border-black rounded-lg px-3 py-1 m-2'
        type="text" placeholder="Designation"  value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
        <input
        className='border border-black rounded-lg px-3 py-1 m-2'
        type="date" placeholder="Joining Date"  value={formData.joining_date} onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })} required />
        <input
        className='border border-black rounded-lg px-3 py-1 m-2'
        type="date" placeholder="Resignation Date" value={formData.resignation_date} onChange={(e) => setFormData({ ...formData, resignation_date: e.target.value })} />


        <button 
        className='border border-black rounded-lg px-3 py-1 m-2'
        type="button" onClick={handleSubmit}>Save Employee</button>

        {employeeId && (
          <button
          className='border border-black rounded-lg px-3 py-1 m-2'
          type="button" onClick={handleDownloadPDF}>Download Experience Letter PDF</button>
        )}
      </form>
    </div>
  );
};

export default EmployeeForm;
