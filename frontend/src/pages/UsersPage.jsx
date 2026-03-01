import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, Mail, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import { useToast } from '../contexts/ToastContext';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input, { Select } from '../components/ui/Input';
import { StatusBadge, RoleBadge } from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Table, { Thead, Th, Tbody, Tr, Td } from '../components/ui/Table';
import Pagination from '../components/ui/Pagination';
import Loading from '../components/ui/Loading';
import ErrorState from '../components/ui/ErrorState';
import EmptyState from '../components/ui/EmptyState';

function UserForm({ user, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    status: user?.status || 'active',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name is required (min 2 characters)';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        placeholder="John Doe"
      />
      <Input
        label="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
        error={errors.email}
        placeholder="john@example.com"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Role"
          value={form.role}
          onChange={e => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </Select>
        <Select
          label="Status"
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </Select>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" loading={loading}>{user ? 'Update User' : 'Create User'}</Button>
      </div>
    </form>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      sortBy,
      order: sortOrder,
    });
    if (search) params.set('search', search);
    if (roleFilter) params.set('role', roleFilter);
    if (statusFilter) params.set('status', statusFilter);

    api.get(`/users?${params}`)
      .then(res => {
        setUsers(res.data);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [page, search, roleFilter, statusFilter, sortBy, sortOrder]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => { setPage(1); }, [search, roleFilter, statusFilter]);

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handleCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, form);
        addToast('User updated successfully', 'success');
      } else {
        await api.post('/users', form);
        addToast('User created successfully', 'success');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setSaving(true);
    try {
      await api.delete(`/users/${deleteUser.id}`);
      addToast('User deleted successfully', 'success');
      setDeleteUser(null);
      fetchUsers();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  if (error && !users.length) return <ErrorState message={error} onRetry={fetchUsers} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your application users</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardBody className="pb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
            <div className="relative flex-1 w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">User</option>
              </select>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Loading message="Loading users..." />
          ) : users.length === 0 ? (
            <EmptyState
              title="No users found"
              message={search || roleFilter || statusFilter ? 'Try adjusting your search or filters' : 'Get started by adding your first user'}
              action={!search && !roleFilter && !statusFilter ? 'Add User' : undefined}
              onAction={handleCreate}
            />
          ) : (
            <>
              <Table>
                <Thead>
                  <tr>
                    <Th sortable sorted={sortBy === 'name'} order={sortOrder} onSort={() => handleSort('name')}>Name</Th>
                    <Th sortable sorted={sortBy === 'email'} order={sortOrder} onSort={() => handleSort('email')}>Email</Th>
                    <Th sortable sorted={sortBy === 'role'} order={sortOrder} onSort={() => handleSort('role')}>Role</Th>
                    <Th sortable sorted={sortBy === 'status'} order={sortOrder} onSort={() => handleSort('status')}>Status</Th>
                    <Th sortable sorted={sortBy === 'lastLogin'} order={sortOrder} onSort={() => handleSort('lastLogin')}>Last Login</Th>
                    <Th>Actions</Th>
                  </tr>
                </Thead>
                <Tbody>
                  {users.map(user => (
                    <Tr key={user.id}>
                      <Td>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-medium text-primary-700 dark:text-primary-400">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white">{user.name}</span>
                        </div>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                          <Mail className="w-3.5 h-3.5" />
                          {user.email}
                        </div>
                      </Td>
                      <Td><RoleBadge role={user.role} /></Td>
                      <Td><StatusBadge status={user.status} /></Td>
                      <Td>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(user.lastLogin)}</span>
                      </Td>
                      <Td>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(user)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                            title="Edit user"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteUser(user)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
              <Pagination page={page} totalPages={totalPages} total={total} onPageChange={setPage} />
            </>
          )}
        </CardBody>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingUser ? 'Edit User' : 'Add New User'}
      >
        <UserForm
          user={editingUser}
          onSave={handleSave}
          onCancel={() => setModalOpen(false)}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message={`Are you sure you want to delete ${deleteUser?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
        loading={saving}
      />
    </div>
  );
}
