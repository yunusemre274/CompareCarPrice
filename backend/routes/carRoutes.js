import express from 'express';
import * as carController from '../controllers/carController.js';

const router = express.Router();

// GET /api/car?name={car_name}
// Get car price comparison across all countries
router.get('/', carController.getCarComparison);

// GET /api/car/search?q={query}
// Search for available cars
router.get('/search', carController.searchCars);

export default router;
