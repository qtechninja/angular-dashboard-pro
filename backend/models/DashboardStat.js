class DashboardStatModel {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    return this.db.prepare('SELECT * FROM dashboard_stats ORDER BY id ASC').all();
  }

  getById(id) {
    return this.db.prepare('SELECT * FROM dashboard_stats WHERE id = ?').get(id);
  }

  update(id, { value, change }) {
    const stat = this.getById(id);
    if (!stat) return null;

    const now = new Date().toISOString();
    this.db.prepare(
      'UPDATE dashboard_stats SET value = ?, change = ?, updatedAt = ? WHERE id = ?'
    ).run(value, change, now, id);

    return this.getById(id);
  }
}

module.exports = DashboardStatModel;
