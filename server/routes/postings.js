const express = require('express');
const router = express.Router();
const { getPostings, getPostingById, exportPostings } = require('../controllers/postingsController');

router.get('/export', exportPostings); // must come before /:id, or "export" gets matched as an id
router.get('/', getPostings);
router.get('/:id', getPostingById);

module.exports = router;