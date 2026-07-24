import db from '../config/database.js';

/**
 * Repository layer for database interactions on the 'users' table
 */
export const UserRepository = {
  /**
   * Find a user by their email address
   * @param {string} email
   * @returns {Object|undefined} user record
   */
  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
    return stmt.get(email);
  },

  /**
   * Find a user by their auto-incremented primary ID
   * @param {number|string} id
   * @returns {Object|undefined} user record
   */
  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    return stmt.get(id);
  }
};

export default UserRepository;
