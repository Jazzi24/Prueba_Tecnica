const pool = require('../config/db');

class User {
  static async create(user) {
    const { firstName, lastName, email, phoneNumber, role, status, address, password } = user;
    const { rows } = await pool.query(
      `INSERT INTO users (first_name, last_name, email, phone_number, role, status, address, password) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [firstName, lastName, email, phoneNumber, role, status, address, password]
    );
    return rows[0];
  }

  static async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0];
  }
}

module.exports = User;