const router = require('express').Router();
const { getAllJobs, getJobById, createJob, updateJob, deleteJob, getMyJobs } = require('../controllers/jobController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', getAllJobs);
router.get('/my', auth, requireRole('employer'), getMyJobs);
router.get('/:id', getJobById);
router.post('/', auth, requireRole('employer'), createJob);
router.put('/:id', auth, requireRole('employer'), updateJob);
router.delete('/:id', auth, requireRole('employer'), deleteJob);

module.exports = router;