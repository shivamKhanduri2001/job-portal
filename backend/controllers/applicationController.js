const pool = require('../db');

const applyToJob = async (req, res) => {
  const { job_id, cover_letter } = req.body;
  const resume_url = req.file ? `/uploads/${req.file.filename}` : null;

  if (!job_id) {
    return res.status(400).json({ message: 'job_id is required' });
  }

  try {
    const jobExists = await pool.query(
      'SELECT id FROM jobs WHERE id = $1',
      [job_id]
    );

    if (!jobExists.rows[0]) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const result = await pool.query(
      'INSERT INTO applications (job_id, seeker_id, resume_url, cover_letter) VALUES ($1,$2,$3,$4) RETURNING *',
      [job_id, req.user.id, resume_url, cover_letter]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'You have already applied to this job' });
    }
    res.status(500).json({ message: err.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.*, j.title as job_title, j.company, j.location, j.type
       FROM applications a 
       JOIN jobs j ON a.job_id = j.id
       WHERE a.seeker_id = $1 
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getApplicationsForJob = async (req, res) => {
  try {
    const jobCheck = await pool.query(
      'SELECT employer_id FROM jobs WHERE id = $1',
      [req.params.jobId]
    );

    if (!jobCheck.rows[0]) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (jobCheck.rows[0].employer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const result = await pool.query(
      `SELECT a.*, u.name as applicant_name, u.email as applicant_email
       FROM applications a 
       JOIN users u ON a.seeker_id = u.id
       WHERE a.job_id = $1 
       ORDER BY a.applied_at DESC`,
      [req.params.jobId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'reviewed', 'accepted', 'rejected'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const appResult = await pool.query(
      `SELECT a.*, j.employer_id 
       FROM applications a 
       JOIN jobs j ON a.job_id = j.id 
       WHERE a.id = $1`,
      [req.params.id]
    );

    if (!appResult.rows[0]) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (appResult.rows[0].employer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const result = await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { applyToJob, getMyApplications, getApplicationsForJob, updateApplicationStatus };