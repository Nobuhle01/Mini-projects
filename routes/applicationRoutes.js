const express = require('express');
const router = express.Router();
const { applyToJob, getJobApplications } = require('../controllers/applicationController');
const { verifyToken, restrictTo } = require('../middleware/auth'); // Auth middleware
const upload = require('../middleware/upload'); // Multer + Cloudinary config

// ✅ Job seeker applies to a job (with resume upload)
router.post('/:jobId/apply', verifyToken, restrictTo('seeker'), upload.single('resume'), applyToJob);

// ✅ Employer views all applications for a specific job
router.get('/:jobId', verifyToken, restrictTo('employer'), getJobApplications);

module.exports = router;
