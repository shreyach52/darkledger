const express = require('express');
const router = express.Router();
const { getTimeline, getTopGroups, getSectorBreakdown } = require('../controllers/statsController');

router.get('/timeline', getTimeline);
router.get('/top-groups', getTopGroups);
router.get('/sectors', getSectorBreakdown);
router.get('/top-groups-canonical', getTopGroupsCanonical);
router.get('/events', getKnownEvents);
module.exports = router;