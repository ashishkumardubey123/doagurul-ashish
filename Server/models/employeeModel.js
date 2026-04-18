const db = require('../Config/DB');

exports.saveEmployee = (employeeData, callback) => {
  const query = `INSERT INTO experincel (name, designation, joining_date, resignation_date, gender, signatory ) VALUES (?, ?, ?, ?, ?, ? )`;
  console.log(employeeData, 'model');
  
  db.query(query, employeeData, callback);
};

exports.getEmployeeById = (employeeId, callback) => {
  const query = 'SELECT * FROM experincel WHERE id = ?'; // Adjust table name and fields if necessary
  db.query(query, [employeeId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    if (result.length === 0) {
      return callback(null, null); // No employee found
    }
    // Assuming the query returns employee details as an object
    const employee = result[0];
    callback(null, employee); // Return the employee object
  });
};
