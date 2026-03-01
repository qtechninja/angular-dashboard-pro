import { useState } from 'react';
import { Play, Copy, Check, Code2, ChevronDown, ChevronRight, Braces } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const restEndpoints = [
  { method: 'GET', path: '/api/users', description: 'List all users with pagination and filters' },
  { method: 'GET', path: '/api/users/1', description: 'Get a single user by ID' },
  { method: 'POST', path: '/api/users', description: 'Create a new user', body: '{\n  "name": "Jane Smith",\n  "email": "jane@example.com",\n  "role": "editor"\n}' },
  { method: 'PUT', path: '/api/users/1', description: 'Update an existing user', body: '{\n  "name": "Sarah Chen Updated"\n}' },
  { method: 'DELETE', path: '/api/users/12', description: 'Delete a user by ID' },
  { method: 'GET', path: '/api/dashboard/stats', description: 'Get all dashboard statistics' },
  { method: 'GET', path: '/api/dashboard/activity', description: 'Get recent activity feed' },
  { method: 'GET', path: '/api/health', description: 'Health check endpoint' },
];

const graphqlQueries = [
  {
    name: 'Get All Users',
    query: `{
  users(page: 1, limit: 5) {
    data {
      id
      name
      email
      role
      status
    }
    total
    totalPages
  }
}`,
  },
  {
    name: 'Get Single User',
    query: `{
  user(id: 1) {
    id
    name
    email
    role
    status
    lastLogin
    createdAt
  }
}`,
  },
  {
    name: 'Dashboard Stats',
    query: `{
  dashboardStats {
    id
    label
    value
    change
    period
  }
}`,
  },
  {
    name: 'Activities Feed',
    query: `{
  activities(limit: 5) {
    data {
      id
      userName
      action
      resource
      details
      createdAt
    }
    total
  }
}`,
  },
  {
    name: 'Create User (Mutation)',
    query: `mutation {
  createUser(name: "Test User", email: "test@example.com", role: "user") {
    id
    name
    email
    role
    status
    createdAt
  }
}`,
  },
];

const methodColors = {
  GET: 'badge-success',
  POST: 'badge-primary',
  PUT: 'badge-warning',
  DELETE: 'badge-danger',
};

function JsonViewer({ data }) {
  const formatted = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto max-h-96 font-mono leading-relaxed">
      {formatted}
    </pre>
  );
}

function RestTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [response, setResponse] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [responseStatus, setResponseStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customBody, setCustomBody] = useState('');
  const [copied, setCopied] = useState(false);
  const { addToast } = useToast();

  const runRequest = async (endpoint) => {
    setLoading(true);
    setResponse(null);
    const start = performance.now();

    try {
      const apiPath = endpoint.path.replace('/api', '');
      let result;

      if (endpoint.method === 'GET') {
        result = await api.get(apiPath);
      } else if (endpoint.method === 'POST') {
        const body = customBody || endpoint.body;
        result = await api.post(apiPath, JSON.parse(body));
      } else if (endpoint.method === 'PUT') {
        const body = customBody || endpoint.body;
        result = await api.put(apiPath, JSON.parse(body));
      } else if (endpoint.method === 'DELETE') {
        result = await api.delete(apiPath);
      }

      setResponseTime(Math.round(performance.now() - start));
      setResponseStatus(200);
      setResponse(result);
    } catch (err) {
      setResponseTime(Math.round(performance.now() - start));
      setResponseStatus(err.message.includes('HTTP') ? parseInt(err.message.split('HTTP ')[1]) : 500);
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {restEndpoints.map((ep, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
              selectedEndpoint === i
                ? 'border-primary-300 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:border-gray-600 dark:hover:bg-gray-700/50'
            }`}
            onClick={() => {
              setSelectedEndpoint(i);
              setCustomBody(ep.body || '');
            }}
          >
            <span className={`${methodColors[ep.method]} inline-flex items-center px-2 py-0.5 rounded text-xs font-bold`}>
              {ep.method}
            </span>
            <code className="text-sm font-mono text-gray-700 dark:text-gray-300 flex-1">{ep.path}</code>
            <span className="text-xs text-gray-400 hidden sm:block">{ep.description}</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>

      {selectedEndpoint !== null && (
        <div className="space-y-3">
          {restEndpoints[selectedEndpoint].body && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Request Body</label>
              <textarea
                value={customBody}
                onChange={e => setCustomBody(e.target.value)}
                rows={5}
                className="input-field font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}
          <Button onClick={() => runRequest(restEndpoints[selectedEndpoint])} loading={loading}>
            <Play className="w-4 h-4 mr-2" />
            Send Request
          </Button>
        </div>
      )}

      {response && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={responseStatus < 400 ? 'success' : 'danger'}>
                {responseStatus}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">{responseTime}ms</span>
            </div>
            <button
              onClick={copyResponse}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <JsonViewer data={response} />
        </div>
      )}
    </div>
  );
}

function GraphQLTester() {
  const [query, setQuery] = useState(graphqlQueries[0].query);
  const [response, setResponse] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const runQuery = async () => {
    setLoading(true);
    setResponse(null);
    const start = performance.now();

    try {
      const url = `${API_BASE.replace('/api', '')}/graphql`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setResponseTime(Math.round(performance.now() - start));
      setResponse(data);
    } catch (err) {
      setResponseTime(Math.round(performance.now() - start));
      setResponse({ errors: [{ message: err.message }] });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {graphqlQueries.map((q, i) => (
          <button
            key={i}
            onClick={() => setQuery(q.query)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              query === q.query
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
            }`}
          >
            {q.name}
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Query</label>
        <textarea
          value={query}
          onChange={e => setQuery(e.target.value)}
          rows={10}
          className="input-field font-mono text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <Button onClick={runQuery} loading={loading}>
        <Play className="w-4 h-4 mr-2" />
        Execute Query
      </Button>

      {response && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant={response.errors ? 'danger' : 'success'}>
                {response.errors ? 'Error' : 'Success'}
              </Badge>
              <span className="text-xs text-gray-500 dark:text-gray-400">{responseTime}ms</span>
            </div>
            <button
              onClick={copyResponse}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <JsonViewer data={response} />
        </div>
      )}
    </div>
  );
}

export default function ApiExplorerPage() {
  const [tab, setTab] = useState('rest');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">API Explorer</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Test REST and GraphQL endpoints interactively</p>
      </div>

      <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('rest')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'rest'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          REST API
        </button>
        <button
          onClick={() => setTab('graphql')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'graphql'
              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Braces className="w-4 h-4" />
          GraphQL
        </button>
      </div>

      <Card>
        <CardBody>
          {tab === 'rest' ? <RestTester /> : <GraphQLTester />}
        </CardBody>
      </Card>
    </div>
  );
}
