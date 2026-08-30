const express = require('express');
const router = express.Router();
const {
  getTimeline,
  getTopGroups,
  getSectorBreakdown,
  getTopGroupsCanonical,
  getKnownEvents,
} = require('../controllers/statsController');
const { getAnomalies } = require('../controllers/anomalyController');

router.get('/timeline', getTimeline);
router.get('/top-groups', getTopGroups);
router.get('/sectors', getSectorBreakdown);
router.get('/top-groups-canonical', getTopGroupsCanonical);
router.get('/events', getKnownEvents);
router.get('/anomalies', getAnomalies);

module.exports = router;