/**
 * Badge Component
 * Status and category badges with color variants
 */

export default function Badge({
  children,
  variant = 'default',
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium';

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
  };

  const classes = `${baseStyles} ${variants[variant]} ${className}`;

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}

