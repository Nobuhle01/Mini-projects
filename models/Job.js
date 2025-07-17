const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // Reference to employer user
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  requirements: {
    type: [String],  // Array of skills or requirements
    default: []
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Temporary', 'Internship'],
    default: 'Full-Time'
  },
  salaryRange: {
    min: Number,
    max: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  applicationDeadline: {
    type: Date
  }
});

module.exports = mongoose.model('Job', jobSchema);
