const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, role, status, address, password } = req.body;
    
    if (!firstName || !lastName || !email || !phoneNumber || !role || !status || !address || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      status,
      address,
      password: hashedPassword,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


