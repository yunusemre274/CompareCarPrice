import express from 'express';
import * as recommendationController from '../controllers/recommendationController.js';

const router = express.Router();

// GET /api/recommendations?name={car_name}
// Get best country recommendations for buying a car
router.get('/', recommendationController.getCarRecommendations);

export default router;
