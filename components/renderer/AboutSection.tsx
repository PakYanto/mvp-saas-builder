import { StoreConfig } from '@/types/store-config';

interface AboutSectionProps {
  config: StoreConfig['sections']['about'];
}

export function AboutSection({ config }: AboutSectionProps) {
  if (!config.enabled) return null;

  return (
    <section id="about" className="py-16 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h2>
          <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
            {config.content}
          </p>
        </div>
      </div>
    </section>
  );
}
