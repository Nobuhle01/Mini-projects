const Job = require('../models/Job');

// Create job
exports.createJob = async (req, res) => {
  try {
    const { title, description, requirements, location, industry, jobType, salaryRange, applicationDeadline } = req.body;

    const newJob = new Job({
      employer: req.user.id, // from verifyToken middleware
      title,
      description,
      requirements,
      location,
      industry,
      jobType,
      salaryRange,
      applicationDeadline
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

/// Get all jobs with optional search filters
exports.getJobs = async (req, res) => {
  try {
    const { title, location, industry, jobType, skills } = req.query;

    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (industry) {
      filter.industry = { $regex: industry, $options: 'i' };
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      filter.requirements = { $all: skillsArray };
    }

    const jobs = await Job.find(filter).populate('employer', 'name email');
    res.json(jobs);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


// Get single job by ID
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update job (only employer who owns it can update)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to update this job' });
    }

    Object.assign(job, req.body);
    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete job (only employer who owns it can delete)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    // Check ownership
    if (job.employer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this job' });
    }

    // Use findByIdAndDelete
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
