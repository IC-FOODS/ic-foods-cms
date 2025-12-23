/**
 * Card Component
 * A flexible card container with hover effects
 */

export default function Card({
  children,
  className = '',
  hover = true,
  padding = 'md',
  ...props
}) {
  const baseStyles =
    'bg-white rounded-xl shadow-sm border border-gray-100 transition-all duration-300';

  const hoverStyles = hover
    ? 'hover:shadow-lg hover:border-gray-200 hover:-translate-y-1'
    : '';

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const classes = `${baseStyles} ${hoverStyles} ${paddings[padding]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

