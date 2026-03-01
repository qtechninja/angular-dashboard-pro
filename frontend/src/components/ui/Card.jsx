export default function Card({ children, className = '', ...props }) {
  return (
    <div className={`card dark:bg-gray-800 dark:border-gray-700 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`card-body ${className}`}>{children}</div>;
}
