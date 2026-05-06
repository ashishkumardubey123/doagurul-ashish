const pool = require('../Config/DB');

exports.saveInternExperienceLetter = async (req, res) => {
  try {
    const { employeeName, employeeId, designation, department, startDate, endDate, gender, signatory } = req.body;
    const [result] = await pool.query(
      'INSERT INTO intern_experience_letters (employeeName, employeeId, designation, department, startDate, endDate, gender, signatory) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [employeeName, employeeId, designation, department, new Date(startDate).toISOString().split('T')[0], new Date(endDate).toISOString().split('T')[0], gender || null, signatory || null]
    );
    res.status(200).json({ success: true, message: 'Saved successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getInternExperienceLetters = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM intern_experience_letters ORDER BY createdAt DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.saveInternPPOLetter = async (req, res) => {
  try {
    const { employeeName, employeeId, oldDesignation, newDesignation, newCTC, joiningDate, gender, signatory, basicSalary, hra, allowances } = req.body;
    const [result] = await pool.query(
      'INSERT INTO intern_ppo_letters (employeeName, employeeId, oldDesignation, newDesignation, newCTC, joiningDate, gender, signatory, basic_salary, hra, allowances) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [employeeName, employeeId, oldDesignation, newDesignation, newCTC, new Date(joiningDate).toISOString().split('T')[0], gender || null, signatory || null, basicSalary || null, hra || null, allowances || null]
    );
    res.status(200).json({ success: true, message: 'Saved successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getInternPPOLetters = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM intern_ppo_letters ORDER BY createdAt DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.saveRelievingLetter = async (req, res) => {
  try {
    const { employeeName, department, designation, dateOfJoining, dateOfRelieving, lastWorkingDay, gender, signatory } = req.body;
    const [result] = await pool.query(
      'INSERT INTO relieving_letters (employeeName, department, designation, dateOfJoining, dateOfRelieving, lastWorkingDay, gender, signatory) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [employeeName, department, designation, new Date(dateOfJoining).toISOString().split('T')[0], new Date(dateOfRelieving).toISOString().split('T')[0], new Date(lastWorkingDay).toISOString().split('T')[0], gender || null, signatory || null]
    );
    res.status(200).json({ success: true, message: 'Saved successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRelievingLetters = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM relieving_letters ORDER BY createdAt DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.saveTerminationLetter = async (req, res) => {
  try {
    const { employeeName, employeeId, designation, department, terminationDate, gender, signatory, reason } = req.body;
    const [result] = await pool.query(
      'INSERT INTO termination_letters (employeeName, employeeId, designation, department, terminationDate, gender, signatory, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [employeeName, employeeId, designation, department, new Date(terminationDate).toISOString().split('T')[0], gender || null, signatory || null, reason || null]
    );
    res.status(200).json({ success: true, message: 'Saved successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getTerminationLetters = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM termination_letters ORDER BY createdAt DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.saveSalarySlip = async (req, res) => {
  try {
    const { employeeName, employeeId, month, year, grossSalary, netSalary, basicSalary, hra, pf, esi, allowances, gender, signatory } = req.body;
    const [result] = await pool.query(
      'INSERT INTO salary_slips (employeeName, employeeId, month, year, grossSalary, netSalary, basic_salary, hra, pf, esi, allowances, gender, signatory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [employeeName, employeeId, month, year, grossSalary || 0, netSalary || 0, basicSalary || null, hra || null, pf || null, esi || null, allowances || null, gender || null, signatory || null]
    );
    res.status(200).json({ success: true, message: 'Saved successfully', id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSalarySlips = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM salary_slips ORDER BY createdAt DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getInternshipOffers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM internship_offers ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getExperienceLetters = async (req, res) => {
  try {
    // Note: experincel table uses 'id' but no explicit 'createdAt'. We'll order by id DESC as fallback for recency.
    const [rows] = await pool.query('SELECT * FROM experincel ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
