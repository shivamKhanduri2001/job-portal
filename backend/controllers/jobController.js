const pool = require('../db');

const getAllJobs = async (req, res) => {
  const { search, type, location } = req.query;

  let query = 'SELECT j.*, u.name as employer_name FROM jobs j JOIN users u ON j.employer_id = u.id WHERE 1=1';
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (j.title ILIKE $${params.length} OR j.company ILIKE $${params.length} OR j.description ILIKE $${params.length})`;
  }

  if (type) {
    params.push(type);
    query += ` AND j.type = $${params.length}`;
  }

  if (location) {
    params.push(`%${location}%`);
    query += ` AND j.location ILIKE $${params.length}`;
  }

  query += ' ORDER BY j.created_at DESC';

  try {
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};