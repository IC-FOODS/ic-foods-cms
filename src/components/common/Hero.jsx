/**
 * Hero Component
 * Hero section with title, subtitle, description, and CTAs
 */

import Button from '../ui/Button';

export default function Hero({
  title,
  subtitle,
  description,
  primaryCTA,
  secondaryCTA,
  image,
  className = '',
}) {
  return (
    <section
      className={`relative bg-gradient-to-br from-primary-50 via-white to-primary-50 py-20 md:py-32 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            {subtitle && (
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-wider mb-4">
                {subtitle}
              </p>
            )}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              {primaryCTA && (
                <Button
                  href={primaryCTA.href}
                  onClick={primaryCTA.onClick}
                  size="lg"
                >
                  {primaryCTA.label}
                </Button>
              )}
              {secondaryCTA && (
                <Button
                  href={secondaryCTA.href}
                  onClick={secondaryCTA.onClick}
                  variant="outline"
                  size="lg"
                >
                  {secondaryCTA.label}
                </Button>
              )}
            </div>
          </div>

          {/* Image */}
          {image && (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-2xl transform rotate-3 opacity-20"></div>
              <img
                src={image}
                alt=""
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

