import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data found', message, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      {message && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm">{message}</p>}
      {action && onAction && (
        <Button onClick={onAction}>{action}</Button>
      )}
    </div>
  );
}
