const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// POST /login
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body

    // Check required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    // Successful login
    res.status(200).json({
      message: 'Login successful!',
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

module.exports = router;
