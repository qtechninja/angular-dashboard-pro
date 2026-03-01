import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

export default function Table({ children, className = '' }) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }) {
  return (
    <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
      {children}
    </thead>
  );
}

export function Th({ children, sortable, sorted, order, onSort, className = '' }) {
  if (!sortable) {
    return (
      <th className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${className}`}>
        {children}
      </th>
    );
  }

  return (
    <th
      className={`px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors select-none ${className}`}
      onClick={onSort}
    >
      <div className="flex items-center gap-1">
        {children}
        {sorted ? (
          order === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
        )}
      </div>
    </th>
  );
}

export function Tbody({ children }) {
  return <tbody className="divide-y divide-gray-200 dark:divide-gray-700">{children}</tbody>;
}

export function Tr({ children, className = '', ...props }) {
  return (
    <tr className={`hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
}

export function Td({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 text-gray-700 dark:text-gray-300 ${className}`}>
      {children}
    </td>
  );
}
