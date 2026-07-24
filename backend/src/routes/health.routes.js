import { Router } from 'express';
import { successResponse } from '../utils/response.js';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    API Server Health Check Endpoint
 * @access  Public
 */
router.get('/health', (req, res) => {
  return successResponse(res, 'LeadFlow API Running');
});

export default router;
