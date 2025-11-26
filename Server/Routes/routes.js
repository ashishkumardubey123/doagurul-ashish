const express = require('express');
const router = express.Router();

// Import controllers
const employeeController = require('../Controller/employeeController');
const {
  getOfferLetters,
  getOfferLetterById,
  updateOfferLetter,
  downloadPdf,
  saveInternshipOffer
} = require('../Controller/Controller');
const { saveOfferLetter } = require('../Controller/PdfController');
const { RegisterAuth, LoginAuth } = require('../Controller/Auth');


// Define routes

// Auth Routes
router.post('/api/register', RegisterAuth); 
router.post('/api/login', LoginAuth);

// Offer Letters
router.post('/api/saveOfferLetter', saveOfferLetter);
router.put('/api/updateOfferLetter/:id', updateOfferLetter);
router.post('/api/saveInternshipOffer', saveInternshipOffer);
router.get('/api/offer-letters', getOfferLetters);
router.get('/api/offer-letters/:id', getOfferLetterById);
router.get('/api/download-pdf/:filename', downloadPdf); 



// New Experience Letter Routes
router.post('/api/saveEmployee', employeeController.saveEmployee); 
router.get('/api/generatePDF/:employeeId', employeeController.generatePDF); 

// Salary Slip Routes
// router.get('/api/generateSalarySlip/:employeeId', employeeController.generateSalarySlip);


module.exports = router;
