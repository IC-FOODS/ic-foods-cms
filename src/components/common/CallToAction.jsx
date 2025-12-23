/**
 * CallToAction Component
 * CTA section with background and action buttons
 */

import Button from '../ui/Button';

export default function CallToAction({
  title,
  description,
  primaryCTA,
  secondaryCTA,
  variant = 'primary',
  className = '',
}) {
  const variants = {
    primary: 'bg-primary-600 text-white',
    secondary: 'bg-gray-900 text-white',
    gradient: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white',
  };

  return (
    <section
      className={`py-16 md:py-24 ${variants[variant]} ${className}`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        {description && (
          <p className="text-lg md:text-xl mb-8 opacity-90">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryCTA && (
            <Button
              href={primaryCTA.href}
              onClick={primaryCTA.onClick}
              variant={variant === 'primary' ? 'secondary' : 'primary'}
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
              className={
                variant === 'primary'
                  ? 'border-white text-white hover:bg-white hover:text-primary-600'
                  : ''
              }
            >
              {secondaryCTA.label}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

