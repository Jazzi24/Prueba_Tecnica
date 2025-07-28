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
    const profile = req.file ? 
      `/uploads/${req.file.filename}` : 
      '/uploads/Foto_def.png';
    
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
      profilePicture:profile
    });
    
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, status, search } = req.query;
    
    const users = await User.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      role,
      status,
      search
    });
    
    const total = await User.count({ role, status, search });
    
    res.json({
      users,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    if (req.file) {
      updates.profile_picture = `/uploads/${req.file.filename}`;
    }
    
    const updatedUser = await User.update(id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.delete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};