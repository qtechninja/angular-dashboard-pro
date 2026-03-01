const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const ActivityModel = require('../models/Activity');

function getModels(req) {
  const db = req.app.locals.db;
  return { users: new UserModel(db), activities: new ActivityModel(db) };
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET /api/users
router.get('/', (req, res) => {
  try {
    const { search, role, status, sortBy, order, page, limit } = req.query;
    const { users } = getModels(req);
    const result = users.getAll({
      search,
      role,
      status,
      sortBy,
      order,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
    });
    res.json(result);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET /api/users/:id
router.get('/:id', (req, res) => {
  try {
    const { users } = getModels(req);
    const user = users.getById(parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user });
  } catch (err) {
    console.error('GET /api/users/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST /api/users
router.post('/', (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) errors.push('Name is required (min 2 characters)');
    if (!email || !validateEmail(email)) errors.push('Valid email is required');
    if (role && !['admin', 'editor', 'user'].includes(role)) errors.push('Role must be admin, editor, or user');
    if (status && !['active', 'inactive', 'suspended'].includes(status)) errors.push('Invalid status');

    if (errors.length) return res.status(400).json({ error: errors.join('; ') });

    const { users, activities } = getModels(req);

    const existing = users.getByEmail(email);
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    const user = users.create({ name: name.trim(), email: email.trim().toLowerCase(), role, status });

    activities.create({
      userId: user.id,
      action: 'create',
      resource: 'user',
      details: `Created user account for ${user.name}`,
    });

    res.status(201).json({ data: user });
  } catch (err) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT /api/users/:id
router.put('/:id', (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    const errors = [];

    if (name !== undefined && name.trim().length < 2) errors.push('Name must be at least 2 characters');
    if (email !== undefined && !validateEmail(email)) errors.push('Valid email is required');
    if (role && !['admin', 'editor', 'user'].includes(role)) errors.push('Role must be admin, editor, or user');
    if (status && !['active', 'inactive', 'suspended'].includes(status)) errors.push('Invalid status');

    if (errors.length) return res.status(400).json({ error: errors.join('; ') });

    const { users, activities } = getModels(req);

    if (email) {
      const existing = users.getByEmail(email.trim().toLowerCase());
      if (existing && existing.id !== parseInt(req.params.id)) {
        return res.status(400).json({ error: 'Email already in use by another user' });
      }
    }

    const fields = {};
    if (name !== undefined) fields.name = name.trim();
    if (email !== undefined) fields.email = email.trim().toLowerCase();
    if (role !== undefined) fields.role = role;
    if (status !== undefined) fields.status = status;

    const user = users.update(parseInt(req.params.id), fields);
    if (!user) return res.status(404).json({ error: 'User not found' });

    activities.create({
      userId: user.id,
      action: 'update',
      resource: 'user',
      details: `Updated user ${user.name}`,
    });

    res.json({ data: user });
  } catch (err) {
    console.error('PUT /api/users/:id error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE /api/users/:id
router.delete('/:id', (req, res) => {
  try {
    const { users } = getModels(req);
    const user = users.delete(parseInt(req.params.id));
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ data: user, message: 'User deleted successfully' });
  } catch (err) {
    console.error('DELETE /api/users/:id error:', err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
