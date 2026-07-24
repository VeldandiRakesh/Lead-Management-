import db from '../config/database.js';

/**
 * Repository layer to handle database interactions on the 'leads' table
 */
export const LeadRepository = {
  /**
   * Search, filter, sort, and paginate leads
   */
  findAll: ({ page = 1, limit = 10, search = '', status = '', assignedTo = '', sort = 'newest' }) => {
    const conditions = [];
    const params = [];

    // Search Name or Company or Email
    if (search.trim()) {
      conditions.push('(l.full_name LIKE ? OR l.company LIKE ? OR l.email LIKE ?)');
      const matchPattern = `%${search.trim()}%`;
      params.push(matchPattern, matchPattern, matchPattern);
    }

    // Filter by Pipeline Status
    if (status) {
      conditions.push('l.status = ?');
      params.push(status);
    }

    // Filter by Assigned User ID
    if (assignedTo) {
      conditions.push('l.assigned_to = ?');
      params.push(Number(assignedTo));
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Query total matching records count
    const countSql = `SELECT COUNT(*) as count FROM leads l ${whereClause}`;
    const countStmt = db.prepare(countSql);
    const countResult = countStmt.get(...params);
    const total = countResult.count;

    // Apply sort order
    const orderBy = sort === 'oldest' ? 'l.created_at ASC' : 'l.created_at DESC';

    // Calculate pagination values
    const offset = (page - 1) * limit;

    // Query page items joined with user metadata
    const fetchSql = `
      SELECT l.*, u.full_name as assigned_name, u.avatar as assigned_avatar
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;
    const fetchStmt = db.prepare(fetchSql);

    const paginatedParams = [...params, limit, offset];
    const leads = fetchStmt.all(...paginatedParams);

    return { leads, total };
  },

  /**
   * Fetch a lead record by primary ID with user metadata joins
   */
  findById: (id) => {
    const sql = `
      SELECT l.*, u.full_name as assigned_name, u.avatar as assigned_avatar, c.full_name as creator_name
      FROM leads l
      LEFT JOIN users u ON l.assigned_to = u.id
      LEFT JOIN users c ON l.created_by = c.id
      WHERE l.id = ? LIMIT 1
    `;
    return db.prepare(sql).get(id);
  },

  /**
   * Create a new lead record
   */
  create: (data) => {
    const now = new Date().toISOString();
    const sql = `
      INSERT INTO leads (full_name, company, email, phone, source, status, assigned_to, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const stmt = db.prepare(sql);
    const result = stmt.run(
      data.full_name,
      data.company,
      data.email,
      data.phone,
      data.source,
      data.status,
      data.assigned_to ? Number(data.assigned_to) : null,
      Number(data.created_by),
      now,
      now
    );
    return result.lastInsertRowid;
  },

  /**
   * Update an existing lead record
   */
  update: (id, data) => {
    const now = new Date().toISOString();
    const sql = `
      UPDATE leads
      SET full_name = ?, company = ?, email = ?, phone = ?, source = ?, status = ?, assigned_to = ?, updated_at = ?
      WHERE id = ?
    `;
    const stmt = db.prepare(sql);
    const result = stmt.run(
      data.full_name,
      data.company,
      data.email,
      data.phone,
      data.source,
      data.status,
      data.assigned_to ? Number(data.assigned_to) : null,
      now,
      Number(id)
    );
    return result.changes > 0;
  },

  /**
   * Hard delete a lead record
   */
  delete: (id) => {
    const stmt = db.prepare('DELETE FROM leads WHERE id = ?');
    const result = stmt.run(Number(id));
    return result.changes > 0;
  }
};

export default LeadRepository;
