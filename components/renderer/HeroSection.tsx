import { StoreConfig } from '@/types/store-config';

interface HeroSectionProps {
  config: StoreConfig['sections']['hero'];
  brandName: string;
}

export function HeroSection({ config, brandName }: HeroSectionProps) {
  if (!config.enabled) return null;

  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {config.headline}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {config.subheadline}
          </p>
          <a
            href="#catalog"
            className="inline-block bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {config.ctaText}
          </a>
        </div>
      </div>
    </section>
  );
}
