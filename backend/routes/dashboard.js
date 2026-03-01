const express = require('express');
const router = express.Router();
const DashboardStatModel = require('../models/DashboardStat');
const ActivityModel = require('../models/Activity');

// GET /api/dashboard/stats
router.get('/stats', (req, res) => {
  try {
    const stats = new DashboardStatModel(req.app.locals.db);
    const data = stats.getAll();
    res.json({ data });
  } catch (err) {
    console.error('GET /api/dashboard/stats error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/dashboard/activity
router.get('/activity', (req, res) => {
  try {
    const { limit, offset } = req.query;
    const activities = new ActivityModel(req.app.locals.db);
    const result = activities.getAll({
      limit: limit ? parseInt(limit) : 20,
      offset: offset ? parseInt(offset) : 0,
    });
    res.json(result);
  } catch (err) {
    console.error('GET /api/dashboard/activity error:', err);
    res.status(500).json({ error: 'Failed to fetch activity feed' });
  }
});

module.exports = router;
