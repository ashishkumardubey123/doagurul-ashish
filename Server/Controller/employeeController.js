
const Employee = require('../models/employeeModel'); // Assuming you have a model
const generatePDF = require('../utils/pdfGenerator');

exports.saveEmployee = (req, res) => {
  const { name, designation, joining_date, resignation_date } = req.body;
  const employeeData = [name, designation, joining_date, resignation_date];
  console.log(employeeData);
  

  Employee.saveEmployee(employeeData, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error saving employee data.', error: err });
      
      
    }
    const insertedEmployeeId = result.insertId;
    res.status(200).json({ message: 'Employee saved successfully', employeeId: insertedEmployeeId });
  });
};

//intran Offerlete ke liye 
exports.saveIntran = (req, res) => {
  const { name, designation, joining_date, resignation_date } = req.body;
  const employeeData = [name, designation, joining_date, resignation_date];
  console.log(employeeData);
  

  Employee.saveEmployee(employeeData, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error saving employee data.', error: err });
      
      
    }
    const insertedEmployeeId = result.insertId;
    res.status(200).json({ message: 'Employee saved successfully', employeeId: insertedEmployeeId });
  });
};

exports.generatePDF = (req, res) => {
  const employeeId = req.params.employeeId;

  Employee.getEmployeeById(employeeId, (err, employee) => {
    if (err || !employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    try {
      // Call the utility function to generate the PDF
      generatePDF(employee, res);
    } catch (error) {
      res.status(500).json({ message: 'Error generating PDF', error });
    }
  });
};

//Salary Slip
// exports.generateSalarySlip = (req, res) => {
//   const employeeId = req.params.employeeId;

//   Employee.getEmployeeById(employeeId, (err, employee) => {
//     if (err || !employee) {
//       return res.status(404).json({ message: 'Employee not found' });
//     }

//     try {
//       // Call the utility function to generate the PDF
//       generateSalarySlip(employee, res);
//     } catch (error) {
//       res.status(500).json({ message: 'Error generating PDF', error });
//     }
//   });
// };

