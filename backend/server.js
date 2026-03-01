require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(morgan('dev'));
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'data.db');
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
app.locals.db = db;

// Initialize schema and seed data
const { initializeSchema } = require('./models/schema');
const { seedDatabase } = require('./models/seed');
initializeSchema(db);
seedDatabase(db);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
const usersRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const graphqlRoutes = require('./routes/graphql');

app.use('/api/users', usersRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/graphql', graphqlRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
