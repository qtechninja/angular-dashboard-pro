function seedDatabase(db) {
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) return;

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, role, status, lastLogin, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const users = [
    ['Sarah Chen', 'sarah.chen@company.com', 'admin', 'active', '2026-02-28T14:30:00Z', '2025-06-15T09:00:00Z', '2026-02-28T14:30:00Z'],
    ['James Wilson', 'james.wilson@company.com', 'editor', 'active', '2026-02-27T11:20:00Z', '2025-07-20T10:00:00Z', '2026-02-27T11:20:00Z'],
    ['Emily Rodriguez', 'emily.rodriguez@company.com', 'user', 'active', '2026-02-28T09:15:00Z', '2025-08-10T08:30:00Z', '2026-02-28T09:15:00Z'],
    ['Michael Park', 'michael.park@company.com', 'editor', 'active', '2026-02-26T16:45:00Z', '2025-09-01T11:00:00Z', '2026-02-26T16:45:00Z'],
    ['Amanda Foster', 'amanda.foster@company.com', 'admin', 'active', '2026-02-28T13:00:00Z', '2025-09-15T14:00:00Z', '2026-02-28T13:00:00Z'],
    ['David Kim', 'david.kim@company.com', 'user', 'inactive', '2026-01-15T10:30:00Z', '2025-10-05T09:00:00Z', '2026-01-15T10:30:00Z'],
    ['Rachel Thompson', 'rachel.thompson@company.com', 'user', 'active', '2026-02-28T08:00:00Z', '2025-10-20T13:30:00Z', '2026-02-28T08:00:00Z'],
    ['Alex Martinez', 'alex.martinez@company.com', 'editor', 'active', '2026-02-25T15:10:00Z', '2025-11-01T10:00:00Z', '2026-02-25T15:10:00Z'],
    ['Priya Patel', 'priya.patel@company.com', 'user', 'active', '2026-02-27T17:45:00Z', '2025-11-15T12:00:00Z', '2026-02-27T17:45:00Z'],
    ['Tom Harrison', 'tom.harrison@company.com', 'user', 'suspended', '2025-12-20T09:00:00Z', '2025-12-01T08:00:00Z', '2025-12-20T09:00:00Z'],
    ['Lisa Chang', 'lisa.chang@company.com', 'admin', 'active', '2026-02-28T12:30:00Z', '2025-12-10T11:00:00Z', '2026-02-28T12:30:00Z'],
    ['Robert Blake', 'robert.blake@company.com', 'user', 'active', '2026-02-26T14:20:00Z', '2026-01-05T09:30:00Z', '2026-02-26T14:20:00Z'],
  ];

  const insertMany = db.transaction(() => {
    for (const u of users) {
      insertUser.run(...u);
    }
  });
  insertMany();

  const insertActivity = db.prepare(`
    INSERT INTO activities (userId, action, resource, details, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  const activities = [
    [1, 'login', 'auth', 'Logged in from Chrome on macOS', '2026-02-28T14:30:00Z'],
    [2, 'update', 'user', 'Updated profile settings', '2026-02-28T14:15:00Z'],
    [1, 'create', 'report', 'Generated Q4 analytics report', '2026-02-28T13:45:00Z'],
    [3, 'login', 'auth', 'Logged in from Safari on iOS', '2026-02-28T09:15:00Z'],
    [5, 'delete', 'document', 'Removed outdated policy document', '2026-02-28T13:00:00Z'],
    [7, 'login', 'auth', 'Logged in from Firefox on Windows', '2026-02-28T08:00:00Z'],
    [11, 'update', 'settings', 'Changed notification preferences', '2026-02-28T12:30:00Z'],
    [4, 'create', 'user', 'Added new team member account', '2026-02-27T16:00:00Z'],
    [1, 'export', 'data', 'Exported user analytics to CSV', '2026-02-27T15:30:00Z'],
    [9, 'update', 'profile', 'Updated avatar and bio', '2026-02-27T17:45:00Z'],
    [2, 'login', 'auth', 'Logged in from Edge on Windows', '2026-02-27T11:20:00Z'],
    [5, 'create', 'dashboard', 'Created custom analytics widget', '2026-02-27T10:00:00Z'],
    [8, 'update', 'document', 'Edited API documentation page', '2026-02-26T15:10:00Z'],
    [12, 'login', 'auth', 'Logged in from Chrome on Linux', '2026-02-26T14:20:00Z'],
    [3, 'create', 'comment', 'Commented on project roadmap', '2026-02-26T11:30:00Z'],
  ];

  const insertActivities = db.transaction(() => {
    for (const a of activities) {
      insertActivity.run(...a);
    }
  });
  insertActivities();

  const insertStat = db.prepare(`
    INSERT INTO dashboard_stats (label, value, change, period, updatedAt)
    VALUES (?, ?, ?, ?, ?)
  `);

  const stats = [
    ['Total Users', '12', 8.3, 'month', '2026-02-28T14:30:00Z'],
    ['Active Sessions', '847', 12.5, 'week', '2026-02-28T14:30:00Z'],
    ['API Requests', '24.3K', 5.2, 'month', '2026-02-28T14:30:00Z'],
    ['Avg Response Time', '142ms', -3.1, 'week', '2026-02-28T14:30:00Z'],
    ['Error Rate', '0.12%', -18.7, 'month', '2026-02-28T14:30:00Z'],
    ['Uptime', '99.98%', 0.02, 'month', '2026-02-28T14:30:00Z'],
  ];

  const insertStats = db.transaction(() => {
    for (const s of stats) {
      insertStat.run(...s);
    }
  });
  insertStats();
}

module.exports = { seedDatabase };
