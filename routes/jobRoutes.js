const express = require('express');
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const verifyToken = require('../middleware/verifyToken');

// Routes
router.post('/', verifyToken, createJob);
router.get('/', getJobs); // ← this one caused your error
router.get('/:id', getJobById);
router.put('/:id', verifyToken, updateJob);
router.delete('/:id', verifyToken, deleteJob);

module.exports = router;
