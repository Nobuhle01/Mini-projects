const Application = require('../models/Application');
const Job = require('../models/Job');

// Seeker applies to a job (with Cloudinary resume upload)
exports.applyToJob = async (req, res) => {
  try {
    const { coverLetter } = req.body;
    const resumeUrl = req.file?.path;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check if user already applied to the job
    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user.id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You already applied to this job' });
    }

    const application = new Application({
      job: jobId,
      applicant: req.user.id,
      coverLetter,
      resumeUrl,
    });

    const savedApplication = await application.save();

    res.status(201).json({
      message: 'Application submitted',
      application: savedApplication,
    });
  } catch (err) {
    console.error('Application error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Employer views applications for their job
exports.getJobApplications = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Authorization check: only employer who owns the job can view
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view applications for this job' });
    }

    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .populate('job', 'title');

    res.json(applications);
  } catch (err) {
    console.error('Get applications error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};