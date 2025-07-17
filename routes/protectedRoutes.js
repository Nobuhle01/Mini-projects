const express = require('express');
const verifyToken = require('../middleware/verifyToken');
const router = express.Router();

// Example protected route
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    message: 'Welcome to the protected dashboard!',
    user: req.user
  });
});

module.exports = router;
