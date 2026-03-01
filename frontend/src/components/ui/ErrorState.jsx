import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Error</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>Try Again</Button>
      )}
    </div>
  );
}
