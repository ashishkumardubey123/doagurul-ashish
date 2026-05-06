const pool = require('./Config/DB');

async function migrate() {
  const queries = [
    `CREATE TABLE IF NOT EXISTS intern_experience_letters (id INT PRIMARY KEY AUTO_INCREMENT, employeeName VARCHAR(255), employeeId VARCHAR(255), designation VARCHAR(255), department VARCHAR(255), startDate DATE, endDate DATE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS relieving_letters (id INT PRIMARY KEY AUTO_INCREMENT, employeeName VARCHAR(255), department VARCHAR(255), designation VARCHAR(255), dateOfJoining DATE, dateOfRelieving DATE, lastWorkingDay DATE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS termination_letters (id INT PRIMARY KEY AUTO_INCREMENT, employeeName VARCHAR(255), employeeId VARCHAR(255), designation VARCHAR(255), terminationDate DATE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS salary_slips (id INT PRIMARY KEY AUTO_INCREMENT, employeeName VARCHAR(255), employeeId VARCHAR(255), month VARCHAR(50), year INT, grossSalary FLOAT, netSalary FLOAT, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`,
    `CREATE TABLE IF NOT EXISTS intern_ppo_letters (id INT PRIMARY KEY AUTO_INCREMENT, employeeName VARCHAR(255), employeeId VARCHAR(255), oldDesignation VARCHAR(255), newDesignation VARCHAR(255), newCTC FLOAT, joiningDate DATE, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`
  ];
  
  for(const q of queries) {
    try {
      await pool.query(q);
      console.log('Success:', q.substring(0, 50));
    } catch(e) {
      console.error(e);
    }
  }
  process.exit();
}

migrate();
