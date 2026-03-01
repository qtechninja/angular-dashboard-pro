import { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, Users, Activity, Zap, Clock, ShieldCheck, BarChart3,
  ArrowUpRight, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { api } from '../lib/api';
import Card, { CardBody } from '../components/ui/Card';
import Loading from '../components/ui/Loading';
import ErrorState from '../components/ui/ErrorState';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const statIcons = {
  'Total Users': Users,
  'Active Sessions': Activity,
  'API Requests': Zap,
  'Avg Response Time': Clock,
  'Error Rate': ShieldCheck,
  'Uptime': BarChart3,
};

const statColors = {
  'Total Users': 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400',
  'Active Sessions': 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  'API Requests': 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  'Avg Response Time': 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  'Error Rate': 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'Uptime': 'bg-teal-50 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
};

const actionIcons = {
  login: { icon: ArrowUpRight, color: 'text-emerald-500' },
  create: { icon: Zap, color: 'text-primary-500' },
  update: { icon: RefreshCw, color: 'text-amber-500' },
  delete: { icon: ArrowDownRight, color: 'text-red-500' },
  export: { icon: ArrowUpRight, color: 'text-violet-500' },
};

function MiniBarChart({ data }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-0.5 h-10">
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 bg-primary-200 dark:bg-primary-700 rounded-sm min-w-[3px] transition-all duration-300"
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function StatCard({ stat }) {
  const Icon = statIcons[stat.label] || BarChart3;
  const colorClass = statColors[stat.label] || 'bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
  const isPositive = stat.change >= 0;
  const changeIsGood = stat.label === 'Error Rate' ? !isPositive : isPositive;

  const chartData = Array.from({ length: 7 }, () => Math.random() * 80 + 20);

  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div className={`flex items-center gap-1 text-xs font-medium ${changeIsGood ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(stat.change)}%
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
        <div className="mt-3">
          <MiniBarChart data={chartData} />
        </div>
      </CardBody>
    </Card>
  );
}

function ActivityItem({ activity }) {
  const actionInfo = actionIcons[activity.action] || actionIcons.update;
  const Icon = actionInfo.icon;

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gray-100 dark:bg-gray-700 ${actionInfo.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 dark:text-white">
          <span className="font-medium">{activity.userName || 'System'}</span>
          {' '}
          <span className="text-gray-500 dark:text-gray-400">{activity.action}</span>
          {' '}
          <span className="font-medium">{activity.resource}</span>
        </p>
        {activity.details && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{activity.details}</p>
        )}
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{timeAgo(activity.createdAt)}</span>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/activity?limit=10'),
    ])
      .then(([statsRes, activityRes]) => {
        setStats(statsRes.data);
        setActivity(activityRes.data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) return <Loading message="Loading dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your application metrics</p>
        </div>
        <Button variant="secondary" onClick={fetchData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats?.map(stat => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">API Traffic</h2>
                <Badge variant="success">Live</Badge>
              </div>
              <div className="h-48 flex items-end gap-1">
                {Array.from({ length: 24 }, (_, i) => {
                  const height = Math.sin(i * 0.5) * 30 + 50 + Math.random() * 20;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-primary-500/80 dark:bg-primary-400/60 rounded-t transition-all duration-300 hover:bg-primary-600 dark:hover:bg-primary-400"
                        style={{ height: `${height}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>Now</span>
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {activity?.slice(0, 8).map(item => (
                <ActivityItem key={item.id} activity={item} />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Users by Role</h2>
            <div className="space-y-3">
              {[
                { role: 'Admin', count: 3, color: 'bg-red-500', total: 12 },
                { role: 'Editor', count: 3, color: 'bg-primary-500', total: 12 },
                { role: 'User', count: 6, color: 'bg-emerald-500', total: 12 },
              ].map(item => (
                <div key={item.role}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.role}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color} transition-all duration-500`}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Status</h2>
            <div className="space-y-3">
              {[
                { service: 'REST API', status: 'Operational', uptime: '99.98%' },
                { service: 'GraphQL API', status: 'Operational', uptime: '99.95%' },
                { service: 'Database', status: 'Operational', uptime: '99.99%' },
                { service: 'Auth Service', status: 'Operational', uptime: '99.97%' },
              ].map(item => (
                <div key={item.service} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.service}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{item.uptime}</span>
                    <Badge variant="success">{item.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
