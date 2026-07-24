import { validationResult } from 'express-validator';
import LeadRepository from '../repositories/lead.repository.js';
import NoteRepository from '../repositories/note.repository.js';
import ActivityRepository from '../repositories/activity.repository.js';
import UserRepository from '../repositories/user.repository.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Controller handlers for Lead management REST endpoints
 */
export const LeadController = {
  /**
   * GET /api/leads
   * Paginate, filter, and search leads
   */
  getLeads: async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const status = req.query.status || '';
    const assignedTo = req.query.assignedTo || '';
    const sort = req.query.sort || 'newest';

    try {
      const { leads, total } = LeadRepository.findAll({
        page,
        limit,
        search,
        status,
        assignedTo,
        sort
      });

      return successResponse(res, 'Leads list retrieved.', {
        leads,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    } catch (error) {
      console.error('[GetLeads Controller Error]', error);
      return errorResponse(res, 'An error occurred fetching leads.', 500);
    }
  },

  /**
   * GET /api/leads/:id
   * Fetch lead profile, assigned rep, notes, and activity history
   */
  getLeadById: async (req, res) => {
    const { id } = req.params;

    try {
      const lead = LeadRepository.findById(id);
      if (!lead) {
        return errorResponse(res, 'Lead not found.', 404);
      }

      // Query notes and activities chronologically
      const notes = NoteRepository.findByLeadId(id);
      const activities = ActivityRepository.findByLeadId(id);

      return successResponse(res, 'Lead details retrieved.', {
        lead,
        notes,
        activities
      });
    } catch (error) {
      console.error('[GetLeadById Controller Error]', error);
      return errorResponse(res, 'An error occurred fetching lead details.', 500);
    }
  },

  /**
   * POST /api/leads
   * Create a new lead and log creation activity
   */
  createLead: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation rules violated.', 400, errors.array());
    }

    const { full_name, company, email, phone, source, status, assigned_to } = req.body;

    try {
      // Confirm assigned representative user exists
      const assignedUser = UserRepository.findById(assigned_to);
      if (!assignedUser) {
        return errorResponse(res, 'Assigned user does not exist.', 400);
      }

      const leadId = LeadRepository.create({
        full_name,
        company,
        email,
        phone,
        source,
        status,
        assigned_to,
        created_by: req.user.id
      });

      // Automatically log 'Lead Created' activity
      ActivityRepository.create({
        leadId,
        userId: req.user.id,
        action: 'Lead Created',
        oldValue: null,
        newValue: `Created opportunity with status: ${status}`
      });

      return successResponse(res, 'Lead created successfully.', { id: leadId }, 201);
    } catch (error) {
      console.error('[CreateLead Controller Error]', error);
      return errorResponse(res, 'An error occurred creating lead.', 500);
    }
  },

  /**
   * PUT /api/leads/:id
   * Update lead, check status / owner changes to log activities
   */
  updateLead: async (req, res) => {
    const { id } = req.params;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation rules violated.', 400, errors.array());
    }

    const { full_name, company, email, phone, source, status, assigned_to } = req.body;

    try {
      const existingLead = LeadRepository.findById(id);
      if (!existingLead) {
        return errorResponse(res, 'Lead not found.', 404);
      }

      // Verify assigned representative exists
      const assignedUser = UserRepository.findById(assigned_to);
      if (!assignedUser) {
        return errorResponse(res, 'Assigned user does not exist.', 400);
      }

      // Check for changes to log activity
      const changes = [];

      // 1. Status Changed
      if (existingLead.status !== status) {
        ActivityRepository.create({
          leadId: id,
          userId: req.user.id,
          action: 'Status Changed',
          oldValue: existingLead.status,
          newValue: status
        });
        changes.push('status');
      }

      // 2. Assignment Changed
      if (Number(existingLead.assigned_to) !== Number(assigned_to)) {
        const oldName = existingLead.assigned_name || 'Unassigned';
        const newName = assignedUser.full_name;
        
        ActivityRepository.create({
          leadId: id,
          userId: req.user.id,
          action: 'Assignment Changed',
          oldValue: oldName,
          newValue: newName
        });
        changes.push('assignment');
      }

      // 3. Generic update if other parameters changed
      if (changes.length === 0 && (
        existingLead.full_name !== full_name ||
        existingLead.company !== company ||
        existingLead.email !== email ||
        existingLead.phone !== phone ||
        existingLead.source !== source
      )) {
        ActivityRepository.create({
          leadId: id,
          userId: req.user.id,
          action: 'Lead Updated',
          oldValue: 'Details modified',
          newValue: 'Details updated'
        });
      }

      LeadRepository.update(id, {
        full_name,
        company,
        email,
        phone,
        source,
        status,
        assigned_to
      });

      return successResponse(res, 'Lead updated successfully.');
    } catch (error) {
      console.error('[UpdateLead Controller Error]', error);
      return errorResponse(res, 'An error occurred updating lead.', 500);
    }
  },

  /**
   * DELETE /api/leads/:id
   * Delete lead, logging activity (cascades logs on hard delete)
   */
  deleteLead: async (req, res) => {
    const { id } = req.params;

    try {
      const existingLead = LeadRepository.findById(id);
      if (!existingLead) {
        return errorResponse(res, 'Lead not found.', 404);
      }

      // Attempt to log delete action (will be purged by cascade database rules, but fulfills logging constraints)
      ActivityRepository.create({
        leadId: id,
        userId: req.user.id,
        action: 'Lead Deleted',
        oldValue: existingLead.full_name,
        newValue: null
      });

      // Hard delete
      const deleted = LeadRepository.delete(id);
      if (!deleted) {
        return errorResponse(res, 'Failed to delete lead.', 500);
      }

      return successResponse(res, 'Lead deleted successfully.');
    } catch (error) {
      console.error('[DeleteLead Controller Error]', error);
      return errorResponse(res, 'An error occurred deleting lead.', 500);
    }
  },

  /**
   * POST /api/leads/:id/notes
   * Add a note to a lead and return the updated notes list
   */
  addLeadNote: async (req, res) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation rules violated.', 400, errors.array());
    }

    const { note } = req.body;

    try {
      const existingLead = LeadRepository.findById(id);
      if (!existingLead) {
        return errorResponse(res, 'Lead not found.', 404);
      }

      // Save note
      NoteRepository.create({
        leadId: id,
        userId: req.user.id,
        note
      });

      // Log activity
      ActivityRepository.create({
        leadId: id,
        userId: req.user.id,
        action: 'Note Added',
        oldValue: null,
        newValue: `Note: ${note.substring(0, 30)}${note.length > 30 ? '...' : ''}`
      });

      // Retrieve fresh notes list
      const notes = NoteRepository.findByLeadId(id);

      return successResponse(res, 'Note added successfully.', notes, 201);
    } catch (error) {
      console.error('[AddLeadNote Controller Error]', error);
      return errorResponse(res, 'An error occurred adding note.', 500);
    }
  }
};

export default LeadController;
