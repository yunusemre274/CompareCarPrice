import express from 'express';
import * as countryController from '../controllers/countryController.js';

const router = express.Router();

// GET /api/countries
// Get all countries for dropdown
router.get('/', countryController.getAllCountries);

// GET /api/countries/search?q={query}
// Search countries by name
router.get('/search', countryController.searchCountries);

// GET /api/country/:countryCode
// Get detailed country information
router.get('/:countryCode', countryController.getCountryDetails);

export default router;
