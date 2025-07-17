const express = require('express');
const router = express.Router();

// Example placeholder route
router.get('/upload-test', (req, res) => {
  res.json({ message: 'Upload route placeholder working' });
});

module.exports = router;
