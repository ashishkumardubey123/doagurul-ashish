const db = require('../Config/DB');
const path = require('path'); 

// Save offer letter details
// const saveOfferLetter = (req, res) => {
//   const { name, offerReleaseDate, joiningDate, designation } = req.body;
//   const pdfPath = path.join(__dirname, 'upload', `${name}_offer_letter.pdf`);

//   // pdf ki path save krna he database me
//   // const query = 'INSERT INTO offer_letters (name, offerReleaseDate, joiningDate, designation, pdfPath) VALUES (?, ?, ?, ?, ?)';
//   const values = [name, offerReleaseDate, joiningDate, designation, pdfPath];

//   db.query(query, values, (error, results) => {
//     if (error) {
//       console.error('Failed to save offer letter data:', error);
//       res.status(500).send('Failed to save offer letter data');
//     } else {
//       res.status(200).send('Offer letter data saved successfully');
//       console.log(results);
//     }
//   });
// };

// Save internship offer letter details
const saveInternshipOffer = (req, res) => {
  const {
    name,
    address,
    phoneNumber,
    email,
    gender,
    startDate,
    endDate,
    position,
    stipend,
    mentorName,
    mentorContact,
    signatory,
    termsAndConditions
  } = req.body;

  // For now, we'll just log the data and send a success response
  // console.log('Saving internship offer:', {
  //   name,
  //   email,
  //   position,
  //   startDate,
  //   endDate,
  //   stipend,
  //   mentorName,
  //   mentorContact,
  //   termsAndConditions,
  // });

  // TODO: Save to database when the database is set up
  
  const query = `
    INSERT INTO internship_offers 
    (name, email, gender, phoneNumber, address, position, startDate, endDate, stipend, mentorName, mentorContact, signatory, termsAndConditions)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    name,
    email,
    gender || null,
    phoneNumber,
    address,
    position,
    new Date(startDate).toISOString().split('T')[0],
    new Date(endDate).toISOString().split('T')[0],
    stipend,
    mentorName,
    mentorContact,
    signatory || null,
    JSON.stringify(termsAndConditions),
  ];
  
  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Error saving internship offer:', error);
      return res.status(500).json({ success: false, message: 'Failed to save internship offer' });
    }
    
    // TODO: Generate and save PDF if needed.
    return res.status(200).json({ 
      success: true, 
      message: 'Internship offer processed successfully',
      data: {
        id: results.insertId,
        name,
        email,
        gender: gender || null,
        signatory: signatory || null
      }
    });
  });
};

// Get all offer letters data
const getOfferLetters = (req, res) => {
  const query = 'SELECT * FROM offer_letters';
  
  db.query(query, (error, results) => {
    if (error) {
      console.error('Failed to fetch offer letters:', error);
      res.status(500).send('Failed to fetch offer letters');
    } else {
      res.status(200).json(results);
    }
  });
};

// Update an existing offer letter
const updateOfferLetter = (req, res) => {
  const { id } = req.params;
  const {
    name,
    address,
    phoneNumber,
    email,
    offerReleaseDate,
    joiningDate,
    designation,
    salary,
    probationPeriod,
    noticePeriod,
    confirmationNoticePeriod,
    jobResponsibilities,
    gender,
    signatory
  } = req.body;

  const query = `
    UPDATE offer_letters 
    SET 
      name = ?,
      address = ?,
      phoneNumber = ?,
      email = ?,
      offerReleaseDate = ?,
      joiningDate = ?,
      designation = ?,
      salary = ?,
      probationPeriod = ?,
      noticePeriod = ?,
      confirmationNoticePeriod = ?,
      jobResponsibilities = ?,
      gender = ?,
      signatory = ?
    WHERE id = ?
  `;

  const values = [
    name,
    address,
    phoneNumber,
    email,
    new Date(offerReleaseDate).toISOString().split('T')[0],
    new Date(joiningDate).toISOString().split('T')[0],
    designation,
    salary,
    probationPeriod,
    noticePeriod,
    confirmationNoticePeriod,
    JSON.stringify(jobResponsibilities),
    gender || null,
    signatory || null,
    id
  ];

  db.query(query, values, (error, results) => {
    if (error) {
      console.error('Failed to update offer letter:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update offer letter',
        error: error.message
      });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Offer letter not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Offer letter updated successfully',
      data: { id, ...req.body }
    });
  });
};

// Get a single offer letter by ID
const getOfferLetterById = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM offer_letters WHERE id = ?';
  
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Failed to fetch offer letter:', error);
      res.status(500).send('Failed to fetch offer letter');
    } else if (results.length === 0) {
      res.status(404).send('Offer letter not found');
    } else {
      res.status(200).json(results[0]);
    }
  });
};

// Download PDF by ID
const downloadPdf = (req, res) => {
  const { id } = req.params;

  db.query('SELECT pdfPath FROM offer_letters WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Failed to get PDF path:', error);
      res.status(500).send('Failed to get PDF path');
    } else if (results.length > 0) {
      const pdfPath = results[0].pdfPath;
      res.sendFile(path.resolve(pdfPath));
    } else {
      res.status(404).send('PDF not found');
    }
  });
};

module.exports = {
  saveInternshipOffer,
  getOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  downloadPdf,
};
