import React, { useState, useEffect } from 'react';
import CLogo from "../assets/images/CLogo.png";
import Signature from "../assets/images/CEOSignature.png";

const SalarySlip = () => {
  const [showSlip, setShowSlip] = useState(false);
  // Company Information
  const companyInfo = {
    name: 'DOAGURU INFOSYSTEMS',
    address: '1851, Write Town, jabalpur',
    city: 'Jabalpur',
    state: 'Madhya Pradesh',
    country: 'India',
    phone: '+91 7440992424',
    email: 'info@doaguru.com',
    website: 'www.doaguru.com',
    gstin: '23AGLPP2890G1Z7',
  };

  const [formData, setFormData] = useState({
    employeeName: 'Employee Name',
    employeeId: 'DOAG000',
    designation: 'Designation',
    department: 'Department',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    dateOfJoining: '02-02-2025',
    panNumber: 'Pan Number',
    grossSalary: 10000,
    lopDays: 0,
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Calculate total working days in the selected month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };

  const totalWorkingDays = getDaysInMonth(formData.month, formData.year);

  // Update form data when input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grossSalary' || name === 'lopDays' || name === 'month' || name === 'year' 
        ? Number(value) 
        : value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSlip(true);
    window.scrollTo(0, 0);
  };

  // Reset form to show the input fields again
  const handleEdit = () => {
    setShowSlip(false);
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };
  
  // Reusable Detail Item Component
  const DetailItem = ({ label, value, isHighlighted = false }) => (
    <div className="flex">
      <span className={`w-36 text-gray-600 ${isHighlighted ? 'font-semibold' : ''}`}>
        {label}
      </span>
      <span className={`${isHighlighted ? 'text-indigo-700 font-bold' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  );
  
  // Salary Item Component
  const SalaryItem = ({ label, amount, isTotal = false }) => (
    <div className={`flex justify-between items-center ${isTotal ? 'pt-2' : 'pb-2'}`}>
      <span className={`${isTotal ? 'font-bold' : 'text-gray-700'}`}>
        {label}
      </span>
      <span className={`font-mono ${isTotal ? 'text-lg font-bold text-indigo-700' : 'text-gray-800'}`}>
        ₹{amount.toLocaleString('en-IN')}
      </span>
    </div>
  );

  // Get month names
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  // Convert number to words for net pay (Indian Numbering System)
  const numberToWords = (num) => {
    const single = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const double = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const formatTens = (num) => {
      if (num < 10) return single[num];
      if (num >= 10 && num < 20) return double[num - 10];
      return tens[Math.floor(num / 10)] + (num % 10 ? ' ' + single[num % 10] : '');
    };

    // Handle decimal part (paise)
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    
    if (rupees === 0) {
      return 'Zero Rupees' + (paise > 0 ? ` and ${formatTens(paise)} Paise` : '') + ' Only';
    }

    let result = '';
    
    // Crores
    if (rupees >= 10000000) {
      const crores = Math.floor(rupees / 10000000);
      result += formatTens(crores) + ' Crore';
      const remaining = rupees % 10000000;
      if (remaining > 0) result += ' ' + numberToWords(remaining);
    } 
    // Lakhs
    else if (rupees >= 100000) {
      const lakhs = Math.floor(rupees / 100000);
      result += formatTens(lakhs) + ' Lakh';
      const remaining = rupees % 100000;
      if (remaining > 0) result += ' ' + numberToWords(remaining);
    } 
    // Thousands
    else if (rupees >= 1000) {
      const thousands = Math.floor(rupees / 1000);
      result += formatTens(thousands) + ' Thousand';
      const remaining = rupees % 1000;
      if (remaining > 0) result += ' ' + numberToWords(remaining);
    } 
    // Hundreds
    else if (rupees >= 100) {
      const hundreds = Math.floor(rupees / 100);
      result += single[hundreds] + ' Hundred';
      const remaining = rupees % 100;
      if (remaining > 0) result += ' and ' + formatTens(remaining);
    } 
    // Tens and ones
    else {
      result = formatTens(rupees);
    }

    // Add 'Rupees' word
    let finalResult = result + ' Rupees';
    
    // Add paise if any
    if (paise > 0) {
      finalResult += ' and ' + formatTens(paise) + ' Paise';
    }
    
    return finalResult + ' Only';
  };

  // Salary Calculation Logic
  const salaryData = {
    grossSalary: formData.grossSalary,
    totalWorkingDays: totalWorkingDays,
    lopDays: formData.lopDays,
    
    // Calculate daily rate based on gross salary and working days
    get dailyRate() {
      return this.grossSalary / this.totalWorkingDays;
    },
    
    // Calculate LOP amount based on daily rate and LOP days
    get lopDeduction() {
      return Math.round(this.dailyRate * this.lopDays);
    },
    
    // Calculate basic salary as 50% of gross (adjust percentage as per your policy)
    get basicSalary() {
      const basic = Math.round(this.grossSalary * 0.5);
      return Math.round((basic / this.totalWorkingDays) * (this.totalWorkingDays - this.lopDays));
    },
    
    // Calculate paid days: Total Working Days - LOP Days
    get paidDays() {
      return this.totalWorkingDays - this.lopDays;
    },
    
    // Calculate allowances based on paid days
    get conveyanceAllowance() {
      const fullConveyance = 1600; // Fixed amount for full month
      return Math.round((fullConveyance / this.totalWorkingDays) * this.paidDays);
    },
    
    get medicalAllowance() {
      const fullMedical = 1250; // Fixed amount for full month
      return Math.round((fullMedical / this.totalWorkingDays) * this.paidDays);
    },
    
    get houseRentAllowance() {
      // HRA is 40% of basic (calculated on paid days)
      const fullHRA = Math.round(this.grossSalary * 0.5 * 0.40); // 40% of 50% of gross
      return Math.round((fullHRA / this.totalWorkingDays) * this.paidDays);
    },
    
    get specialAllowance() {
      // Calculate special allowance based on remaining amount after other components
      const otherComponents = this.basicSalary + this.houseRentAllowance + this.conveyanceAllowance + this.medicalAllowance;
      return Math.max(0, this.grossSalary - otherComponents - this.lopDeduction);
    },
    
    // ESI Calculation set to 0 as per requirement
    get esiDeduction() {
      return 0; // Set to 0 as per requirement
    },
    
    // PF Calculation set to 0 as per requirement
    get pfDeduction() {
      return 0; // Set to 0 as per requirement
    },
    
    get totalDeductions() {
      return this.esiDeduction + this.pfDeduction + this.lopDeduction;
    },
    
    get netPay() {
      const totalEarnings = this.basicSalary + this.houseRentAllowance + this.conveyanceAllowance + this.medicalAllowance + this.specialAllowance;
      return totalEarnings - (this.esiDeduction + this.pfDeduction);
    }
  };

  // Show form if slip is not generated yet
  if (!showSlip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
            <h2 className="text-2xl md:text-3xl font-bold text-center">Employee Salary Details</h2>
            <p className="text-center text-blue-100 mt-2">Fill in the details to generate salary slip</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Employee Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="employeeName"
                  value={formData.employeeName}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                  placeholder="Enter full name"
                />
              </div>
              
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Employee ID <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                  placeholder="Enter employee ID"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Designation <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                  placeholder="Enter designation"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Department <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                  placeholder="Enter department"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Bank Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    className="block w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                    placeholder="e.g. State Bank of India"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Account Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    name="accountNumber"
                    value={formData.accountNumber}
                    onChange={handleChange}
                    className="block w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                    placeholder="Enter account number"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">PAN Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    className="block w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                    placeholder="e.g. ABCDE1234F"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Date of Joining <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleChange}
                    className="block w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Gross Salary (₹)</label>
                <input
                  type="number"
                  name="grossSalary"
                  value={formData.grossSalary}
                  onChange={handleChange}
                  min="0"
                  step="100"
                //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                className="block w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Month <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-2.5 pr-8 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    required
                  >
                    {monthNames.map((month, index) => (
                      <option key={index} value={index + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="block w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - 5 + i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">LOP (Leave Without Pay) Days</label>
                <input
                  type="number"
                  name="lopDays"
                  value={formData.lopDays}
                  onChange={handleChange}
                  min="0"
                  max={totalWorkingDays}
                  className="block w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                //   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Total working days in {monthNames[formData.month - 1]} {formData.year}: {totalWorkingDays}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Generate Salary Slip
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Salary Slip Display
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Salary Slip Generator</h1>
          <p className="text-gray-600">Generated on {new Date().toLocaleDateString('en-IN')}</p>
        </div>
        
        {/* Salary Slip Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
          {/* Company Header */}
          <div className="bg-white p-4 border-b">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src={CLogo} 
                  alt="Company Logo" 
                  className="w-16 h-16 object-contain"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-xl font-bold text-gray-800">{companyInfo.name}</h1>
                  <p className="text-sm text-gray-600">{companyInfo.address}</p>
                  <p className="text-sm text-gray-600">{companyInfo.city}, {companyInfo.state}, {companyInfo.country}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {/* <span className="font-medium">CIN:</span> {companyInfo.cin} |  */}
                    <span className="font-medium">GSTIN:</span> {companyInfo.gstin} | 
                    {/* <span className="font-medium">PAN:</span> {companyInfo.pan} */}
                  </p>
                </div>
              </div>
              <div className="mt-4 md:mt-0 text-center">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-lg">
                  <h2 className="text-xl font-bold">SALARY SLIP</h2>
                  <p className="text-sm flex items-center justify-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {monthNames[formData.month - 1]} {formData.year}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Employee Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 border-b">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-left mb-2 md:mb-0">
                <h1 className="text-xl font-bold text-gray-800">{formData.employeeName}</h1>
                <p className="text-gray-600">{formData.designation}</p>
                <p className="text-sm text-gray-500">Employee ID: {formData.employeeId}</p>
              </div>
              <div className="text-sm text-gray-600 text-center md:text-right">
                <p><span className="font-medium">Date of Joining:</span> {formatDate(formData.dateOfJoining)}</p>
                <p><span className="font-medium">Department:</span> {formData.department}</p>
                <p><span className="font-medium">PAN Number:</span> {formData.panNumber}</p>
              </div>
            </div>
          </div>
          
          {/* Employee & Bank Details */}
          <div className="p-6 bg-gray-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Employee Details */}
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Employee Details
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Employee ID" value={formData.employeeId} />
                  <DetailItem label="Department" value={formData.department} />
                  <DetailItem label="Date of Joining" value={formatDate(formData.dateOfJoining)} />
                  <DetailItem label="Working Days" value={`${totalWorkingDays} days`} />
                  <DetailItem label="LOP Days" value={`${formData.lopDays} days`} />
                </div>
              </div>
              
              {/* Bank Details */}
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200 flex items-center">
                  <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Bank & Payment Details
                </h3>
                <div className="space-y-3">
                  <DetailItem label="Bank Name" value={formData.bankName} />
                  <DetailItem label="Account Number" value={`•••• ${formData.accountNumber.slice(-4)}`} />
                  <DetailItem label="PAN Number" value={formData.panNumber} />
                  <DetailItem label="Payment Mode" value="Bank Transfer" />
                  <DetailItem label="Net Payable" value={`₹${salaryData.netPay.toLocaleString('en-IN')}`} isHighlighted />
                </div>
              </div>
            </div>
          </div>
          
          {/* Salary Breakdown */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Salary Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Earnings */}
              <div className="bg-green-50 rounded-xl overflow-hidden border border-green-100">
                <div className="bg-green-600 p-4 text-white font-semibold text-center">
                  EARNINGS
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <SalaryItem label="Basic Salary" amount={salaryData.basicSalary} />
                    <SalaryItem label="House Rent Allowance (HRA)" amount={salaryData.houseRentAllowance} />
                    <SalaryItem label="Conveyance Allowance" amount={salaryData.conveyanceAllowance} />
                    <SalaryItem label="Medical Allowance" amount={salaryData.medicalAllowance} />
                    <SalaryItem label="Special Allowance" amount={salaryData.specialAllowance} />
                    <div className="pt-2 mt-4 border-t border-green-100">
                      <SalaryItem label="Total Earnings" amount={salaryData.grossSalary} isTotal />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Deductions */}
              <div className="bg-red-50 rounded-xl overflow-hidden border border-red-100">
                <div className="bg-red-600 p-4 text-white font-semibold text-center">
                  DEDUCTIONS
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <SalaryItem label="Professional Tax" amount={0} />
                    <SalaryItem label="Income Tax (TDS)" amount={0} />
                    <SalaryItem label="Provident Fund (PF)" amount={salaryData.pfDeduction} />
                    <SalaryItem label="Health Insurance (ESI)" amount={salaryData.esiDeduction} />
                    <div className="h-6"></div> {/* Spacer for alignment */}
                    <div className="pt-2 mt-4 border-t border-red-100">
                      <SalaryItem label="Total Deductions" amount={salaryData.totalDeductions} isTotal />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Net Pay */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-6 text-white mb-8">
              <div className="flex flex-col items-center text-center">
                <span className="text-blue-100 mb-2">Net Payable Amount</span>
                <div className="text-3xl font-bold mb-2">₹{salaryData.netPay.toLocaleString('en-IN')}</div>
                <div className="text-blue-100 text-sm">
                  {numberToWords(salaryData.netPay)} Rupees Only
                </div>
              </div>
            </div>
            
            {/* Footer */}
            
            {/* Signature Section */}
            <div className="mt-12 pt-6 border-t border-gray-200">
              <div className="flex flex-col items-end">
                <div className="mb-2 text-sm text-gray-500">
                  For {companyInfo.name}
                </div>
                <img src={Signature} className="h-16" alt="Flowbite Logo" />
                <div className=" mb-2 w-48 h-0.5 bg-gray-300"></div>
                <div className="text-sm font-medium text-gray-700">
                  Authorized Signatory
                </div>
                <div className="text-xs text-gray-500">
                  Director
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              {/* <p className="mb-2">This is a system generated salary slip and does not require a signature.</p> */}
              <p>For any discrepancies, please contact the HR department within 7 days.</p>
            </div>
            {/* Action Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Salary Slip
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalarySlip;