const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const roles = ['Admin', 'User'];
const statuses = ['Active', 'Inactive'];

async function createUser(isAdmin = false) {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = isAdmin ? 'admin@example.com' : faker.internet.email(firstName, lastName);
  const phoneNumber = faker.phone.number();
  const role = isAdmin ? 'Admin' : faker.helpers.arrayElement(roles);
  const status = faker.helpers.arrayElement(statuses);
  const address = {
    street: faker.location.street(),
    number: faker.number.int({ max: 1000 }),
    city: faker.address.city(),
    postalCode: faker.address.zipCode()
  };
  const password = await bcrypt.hash(isAdmin ? 'password' : faker.internet.password(), 10);
  
  return {
    firstName,
    lastName,
    email,
    phoneNumber,
    role,
    status,
    address,
    password
  };
}

async function seedDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone_number VARCHAR(20),
        role VARCHAR(20) NOT NULL,
        status VARCHAR(20) NOT NULL,
        address JSONB,
        password VARCHAR(100) NOT NULL,
        profile_picture VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', ['admin@example.com']);
    if (rows.length === 0) {

      const admin = await createUser(true);
      await pool.query(
        `INSERT INTO users (first_name, last_name, email, phone_number, role, status, address, password)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [admin.firstName, admin.lastName, admin.email, admin.phoneNumber, admin.role, admin.status, admin.address, admin.password]
      );
      
    }
  } catch (error) {
    throw error;
  }
}

module.exports = { seedDatabase };