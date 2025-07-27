const app = require('./app');
const pool = require('./config/db');
const { seedDatabase } = require('./seeders/seedUsers');
const PORT = process.env.PORT || 5000;


pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
    
    
    seedDatabase().then(() => {
      console.log('Database seeded successfully');
    }).catch(err => {
      console.error('Error seeding database:', err);
    });
    
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
});