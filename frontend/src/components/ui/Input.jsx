export default function Input({ label, error, id, className = '', ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ label, error, id, children, className = '', ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
        }`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, id, className = '', ...props }) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={className}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-400 ${
          error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
