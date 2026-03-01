import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

const icons = {
  success: CheckCircle,
  error: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-300',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
  info: 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-300',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => {
        const Icon = icons[toast.type] || icons.info;
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${colors[toast.type] || colors.info}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-0.5 rounded hover:bg-black/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
