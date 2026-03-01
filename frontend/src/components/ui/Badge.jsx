const variantClasses = {
  primary: 'badge-primary dark:bg-primary-900/30 dark:text-primary-400',
  success: 'badge-success dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'badge-warning dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'badge-danger dark:bg-red-900/30 dark:text-red-400',
};

export default function Badge({ children, variant = 'primary', className = '' }) {
  return (
    <span className={`${variantClasses[variant] || variantClasses.primary} ${className}`}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }) {
  const map = {
    active: { variant: 'success', label: 'Active' },
    inactive: { variant: 'warning', label: 'Inactive' },
    suspended: { variant: 'danger', label: 'Suspended' },
  };
  const { variant, label } = map[status] || { variant: 'primary', label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

export function RoleBadge({ role }) {
  const map = {
    admin: 'danger',
    editor: 'primary',
    user: 'success',
  };
  return <Badge variant={map[role] || 'primary'}>{role}</Badge>;
}
