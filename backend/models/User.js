class UserModel {
  constructor(db) {
    this.db = db;
  }

  getAll({ search, role, status, sortBy = 'createdAt', order = 'desc', page = 1, limit = 10 } = {}) {
    let where = [];
    let params = [];

    if (search) {
      where.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    if (role) {
      where.push('role = ?');
      params.push(role);
    }
    if (status) {
      where.push('status = ?');
      params.push(status);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
    const allowedSort = ['name', 'email', 'role', 'status', 'createdAt', 'lastLogin'];
    const sortColumn = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 'ASC' : 'DESC';

    const countRow = this.db.prepare(`SELECT COUNT(*) as total FROM users ${whereClause}`).get(...params);
    const total = countRow.total;

    const offset = (page - 1) * limit;
    const rows = this.db.prepare(
      `SELECT * FROM users ${whereClause} ORDER BY ${sortColumn} ${sortOrder} LIMIT ? OFFSET ?`
    ).all(...params, limit, offset);

    return { data: rows, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  getById(id) {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  create({ name, email, role = 'user', status = 'active' }) {
    const now = new Date().toISOString();
    const result = this.db.prepare(
      'INSERT INTO users (name, email, role, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, email, role, status, now, now);
    return this.getById(result.lastInsertRowid);
  }

  update(id, fields) {
    const user = this.getById(id);
    if (!user) return null;

    const allowed = ['name', 'email', 'role', 'status'];
    const updates = [];
    const params = [];

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = ?`);
        params.push(fields[key]);
      }
    }

    if (updates.length === 0) return user;

    updates.push('updatedAt = ?');
    params.push(new Date().toISOString());
    params.push(id);

    this.db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    return this.getById(id);
  }

  delete(id) {
    const user = this.getById(id);
    if (!user) return null;
    this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return user;
  }

  getByEmail(email) {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  }
}

module.exports = UserModel;
