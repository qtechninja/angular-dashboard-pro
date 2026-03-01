class ActivityModel {
  constructor(db) {
    this.db = db;
  }

  getAll({ limit = 20, offset = 0 } = {}) {
    const rows = this.db.prepare(`
      SELECT a.*, u.name as userName, u.email as userEmail
      FROM activities a
      LEFT JOIN users u ON a.userId = u.id
      ORDER BY a.createdAt DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const countRow = this.db.prepare('SELECT COUNT(*) as total FROM activities').get();

    return { data: rows, total: countRow.total };
  }

  getByUserId(userId) {
    return this.db.prepare(`
      SELECT a.*, u.name as userName
      FROM activities a
      LEFT JOIN users u ON a.userId = u.id
      WHERE a.userId = ?
      ORDER BY a.createdAt DESC
    `).all(userId);
  }

  create({ userId, action, resource, details }) {
    const now = new Date().toISOString();
    const result = this.db.prepare(
      'INSERT INTO activities (userId, action, resource, details, createdAt) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, action, resource, details || null, now);

    return this.db.prepare(`
      SELECT a.*, u.name as userName
      FROM activities a
      LEFT JOIN users u ON a.userId = u.id
      WHERE a.id = ?
    `).get(result.lastInsertRowid);
  }
}

module.exports = ActivityModel;
