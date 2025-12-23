/**
 * SectionHeader Component
 * Consistent header styling for page sections
 */

export default function SectionHeader({
  title,
  subtitle,
  description,
  className = '',
}) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {subtitle && (
        <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-2">
          {subtitle}
        </p>
      )}
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

