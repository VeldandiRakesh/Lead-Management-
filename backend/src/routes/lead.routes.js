import { Router } from 'express';
import { LeadController } from '../controllers/lead.controller.js';
import { authenticateJWT, requireAdmin } from '../middleware/auth.middleware.js';
import { createLeadValidator, updateLeadValidator, addNoteValidator } from '../validators/lead.validator.js';

const router = Router();

/**
 * @route   GET /api/leads
 * @desc    Paginate, search, sort and filter leads
 * @access  Private
 */
router.get('/', authenticateJWT, LeadController.getLeads);

/**
 * @route   GET /api/leads/:id
 * @desc    Get detailed lead info, author notes, and activity log streams
 * @access  Private
 */
router.get('/:id', authenticateJWT, LeadController.getLeadById);

/**
 * @route   POST /api/leads
 * @desc    Create a new lead opportunity and log activity
 * @access  Private
 */
router.post('/', authenticateJWT, createLeadValidator, LeadController.createLead);

/**
 * @route   PUT /api/leads/:id
 * @desc    Update lead parameters and log modifications
 * @access  Private
 */
router.put('/:id', authenticateJWT, updateLeadValidator, LeadController.updateLead);

/**
 * @route   DELETE /api/leads/:id
 * @desc    Hard delete a lead and cascade notes/activities
 * @access  Private (Admin only)
 */
router.delete('/:id', authenticateJWT, requireAdmin, LeadController.deleteLead);

/**
 * @route   POST /api/leads/:id/notes
 * @desc    Add a comment to a lead profile and return updated timeline
 * @access  Private
 */
router.post('/:id/notes', authenticateJWT, addNoteValidator, LeadController.addLeadNote);

export default router;
