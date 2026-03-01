const express = require('express');
const router = express.Router();
const UserModel = require('../models/User');
const ActivityModel = require('../models/Activity');
const DashboardStatModel = require('../models/DashboardStat');

const typeDefs = `
type User {
  id: Int!
  name: String!
  email: String!
  role: String!
  status: String!
  lastLogin: String
  createdAt: String!
  updatedAt: String!
}

type Activity {
  id: Int!
  userId: Int!
  userName: String
  action: String!
  resource: String!
  details: String
  createdAt: String!
}

type DashboardStat {
  id: Int!
  label: String!
  value: String!
  change: Float!
  period: String!
  updatedAt: String!
}

type UserList {
  data: [User!]!
  total: Int!
  page: Int!
  limit: Int!
  totalPages: Int!
}

type ActivityList {
  data: [Activity!]!
  total: Int!
}

type Query {
  users(page: Int, limit: Int, search: String, role: String, status: String): UserList!
  user(id: Int!): User
  activities(limit: Int, offset: Int): ActivityList!
  dashboardStats: [DashboardStat!]!
}

type Mutation {
  createUser(name: String!, email: String!, role: String, status: String): User!
  updateUser(id: Int!, name: String, email: String, role: String, status: String): User
  deleteUser(id: Int!): User
}
`;

function resolveQuery(db, queryName, args) {
  const users = new UserModel(db);
  const activities = new ActivityModel(db);
  const stats = new DashboardStatModel(db);

  switch (queryName) {
    case 'users':
      return users.getAll(args);
    case 'user':
      return users.getById(args.id);
    case 'activities':
      return activities.getAll(args);
    case 'dashboardStats':
      return stats.getAll();
    default:
      throw new Error(`Unknown query: ${queryName}`);
  }
}

function resolveMutation(db, mutationName, args) {
  const users = new UserModel(db);

  switch (mutationName) {
    case 'createUser':
      return users.create(args);
    case 'updateUser': {
      const { id, ...fields } = args;
      return users.update(id, fields);
    }
    case 'deleteUser':
      return users.delete(args.id);
    default:
      throw new Error(`Unknown mutation: ${mutationName}`);
  }
}

function parseGraphQL(query) {
  const operationMatch = query.match(/^\s*(query|mutation)\s*(?:\w+)?\s*(?:\(([^)]*)\))?\s*\{/);
  const operationType = operationMatch ? operationMatch[1] : 'query';

  const bodyMatch = query.match(/\{\s*([\s\S]*)\s*\}$/);
  if (!bodyMatch) return { operationType, fields: [] };

  const body = bodyMatch[1];
  const fieldRegex = /(\w+)(?:\s*\(([^)]*)\))?\s*(?:\{([^}]*)\})?/g;
  const fields = [];
  let match;

  while ((match = fieldRegex.exec(body)) !== null) {
    const name = match[1];
    const argsStr = match[2];
    const subFields = match[3];

    let args = {};
    if (argsStr) {
      const argRegex = /(\w+)\s*:\s*(?:"([^"]*)"|(\d+(?:\.\d+)?)|(\w+))/g;
      let argMatch;
      while ((argMatch = argRegex.exec(argsStr)) !== null) {
        const key = argMatch[1];
        const val = argMatch[2] !== undefined ? argMatch[2] :
                    argMatch[3] !== undefined ? Number(argMatch[3]) :
                    argMatch[4];
        args[key] = val;
      }
    }

    fields.push({ name, args, subFields });
  }

  return { operationType, fields };
}

router.get('/schema', (req, res) => {
  res.json({ schema: typeDefs });
});

router.post('/', (req, res) => {
  try {
    const { query, variables } = req.body;

    if (!query) {
      return res.status(400).json({ errors: [{ message: 'Query is required' }] });
    }

    const parsed = parseGraphQL(query);
    const data = {};

    for (const field of parsed.fields) {
      const mergedArgs = { ...field.args, ...variables };

      if (parsed.operationType === 'mutation') {
        data[field.name] = resolveMutation(req.app.locals.db, field.name, mergedArgs);
      } else {
        data[field.name] = resolveQuery(req.app.locals.db, field.name, mergedArgs);
      }
    }

    res.json({ data });
  } catch (err) {
    console.error('GraphQL error:', err);
    res.json({ errors: [{ message: err.message }] });
  }
});

module.exports = router;
