import db from '../config/database.js';

/**
 * Repository layer for the 'lead_notes' table
 */
export const NoteRepository = {
  /**
   * Add a new note to a lead
   * @returns {number|string} last inserted row ID
   */
  create: (data) => {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO lead_notes (lead_id, user_id, note, created_at)
      VALUES (?, ?, ?, ?)
    `;
    const stmt = db.prepare(sql);
    const result = stmt.run(
      Number(data.leadId),
      Number(data.userId),
      data.note,
      now
    );
    return result.lastInsertRowid;
  },

  /**
   * Get all notes for a specific lead ordered chronologically
   */
  findByLeadId: (leadId) => {
    const sql = `
      SELECT n.*, u.full_name as author_name, u.avatar as author_avatar
      FROM lead_notes n
      LEFT JOIN users u ON n.user_id = u.id
      WHERE n.lead_id = ?
      ORDER BY n.created_at DESC
    `;
    return db.prepare(sql).all(Number(leadId));
  }
};

export default NoteRepository;
