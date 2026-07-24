import db from '../config/database.js';

/**
 * Repository layer for the 'lead_activity' table
 */
export const ActivityRepository = {
  /**
   * Log a new lead-related activity event
   * @returns {number|string} last inserted row ID
   */
  create: (data) => {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO lead_activity (lead_id, user_id, action, old_value, new_value, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const stmt = db.prepare(sql);
    const result = stmt.run(
      Number(data.leadId),
      Number(data.userId),
      data.action,
      data.oldValue || null,
      data.newValue || null,
      now
    );
    return result.lastInsertRowid;
  },

  /**
   * Fetch all logged activity events for a specific lead ordered chronologically
   */
  findByLeadId: (leadId) => {
    const sql = `
      SELECT a.*, u.full_name as user_name
      FROM lead_activity a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE a.lead_id = ?
      ORDER BY a.created_at DESC
    `;
    return db.prepare(sql).all(Number(leadId));
  }
};

export default ActivityRepository;
