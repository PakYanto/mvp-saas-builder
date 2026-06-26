import { StoreConfig, Product } from '@/types/store-config';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  config: StoreConfig['sections']['catalog'];
  products: Product[];
}

export function CatalogSection({ config, products }: CatalogSectionProps) {
  if (!config.enabled) return null;

  return (
    <section id="catalog" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {config.title}
          </h2>
          <div className="w-24 h-1 bg-[var(--color-primary)] mx-auto"></div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada produk tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
