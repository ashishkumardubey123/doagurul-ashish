const db = require('../Config/DB');
const path = require('path');

// Save internship offer letter details
const saveInternshipOffer = async (req, res) => {
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

  try {
    const [results] = await db.query(query, values);
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
  } catch (error) {
    console.error('Error saving internship offer:', error);
    return res.status(500).json({ success: false, message: 'Failed to save internship offer' });
  }
};

// Get all offer letters data
const getOfferLetters = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM offer_letters');
    res.status(200).json(results);
  } catch (error) {
    console.error('Failed to fetch offer letters:', error);
    res.status(500).send('Failed to fetch offer letters');
  }
};

// Update an existing offer letter
const updateOfferLetter = async (req, res) => {
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

  try {
    const [results] = await db.query(query, values);

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
  } catch (error) {
    console.error('Failed to update offer letter:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update offer letter',
      error: error.message
    });
  }
};

// Get a single offer letter by ID
const getOfferLetterById = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query('SELECT * FROM offer_letters WHERE id = ?', [id]);
    if (results.length === 0) {
      return res.status(404).send('Offer letter not found');
    }
    res.status(200).json(results[0]);
  } catch (error) {
    console.error('Failed to fetch offer letter:', error);
    res.status(500).send('Failed to fetch offer letter');
  }
};

// Download PDF by ID
const downloadPdf = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await db.query('SELECT pdfPath FROM offer_letters WHERE id = ?', [id]);
    if (results.length > 0) {
      const pdfPath = results[0].pdfPath;
      res.sendFile(path.resolve(pdfPath));
    } else {
      res.status(404).send('PDF not found');
    }
  } catch (error) {
    console.error('Failed to get PDF path:', error);
    res.status(500).send('Failed to get PDF path');
  }
};

module.exports = {
  saveInternshipOffer,
  getOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  downloadPdf,
};
