'use client';

import { StoreData } from '@/types/store-config';
import { ThemeProvider } from './ThemeProvider';
import { HeroSection } from './HeroSection';
import { CatalogSection } from './CatalogSection';
import { AboutSection } from './AboutSection';
import { ContactSection } from './ContactSection';
import { FooterSection } from './FooterSection';

interface StoreRendererProps {
  data: StoreData;
}

export function StoreRenderer({ data }: StoreRendererProps) {
  const { config, products, themeColor, storeName } = data;

  return (
    <ThemeProvider themeColor={themeColor}>
      <div className="min-h-screen flex flex-col">
        {/* Header/Navigation */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {config.brand.name}
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                {config.sections.hero.enabled && (
                  <a
                    href="#hero"
                    className="text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                  >
                    Beranda
                  </a>
                )}
                {config.sections.catalog.enabled && (
                  <a
                    href="#catalog"
                    className="text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                  >
                    Produk
                  </a>
                )}
                {config.sections.about.enabled && (
                  <a
                    href="#about"
                    className="text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                  >
                    Tentang
                  </a>
                )}
                {config.sections.contact.enabled && (
                  <a
                    href="#contact"
                    className="text-gray-700 hover:text-[var(--color-primary)] transition-colors"
                  >
                    Kontak
                  </a>
                )}
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <HeroSection config={config.sections.hero} brandName={config.brand.name} />
          <CatalogSection config={config.sections.catalog} products={products} />
          <AboutSection config={config.sections.about} />
          <ContactSection config={config.sections.contact} storeName={storeName} />
        </main>

        {/* Footer */}
        <FooterSection config={config.sections.footer} brandName={config.brand.name} />
      </div>
    </ThemeProvider>
  );
}
