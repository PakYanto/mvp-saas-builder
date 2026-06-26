'use client';

import { StoreRenderer } from '@/components/renderer/StoreRenderer';
import { WizardState } from '@/lib/useWizard';
import { StoreData } from '@/types/store-config';

interface LivePreviewPaneProps {
  wizardState: WizardState;
}

export function LivePreviewPane({ wizardState }: LivePreviewPaneProps) {
  // Transform wizard state to StoreData format
  const storeData: StoreData = {
    storeName: wizardState.storeName || 'Nama Toko',
    slug: 'preview',
    themeColor: wizardState.themeColor || '#3B82F6',
    config: {
      version: '1.0',
      templateId: wizardState.templateId || 'default',
      brand: {
        name: wizardState.storeName || 'Nama Toko',
        tagline: wizardState.tagline || undefined,
        logoUrl: wizardState.logoUrl || null,
      },
      sections: {
        hero: {
          enabled: true,
          headline: wizardState.storeName || 'Selamat Datang',
          subheadline: wizardState.tagline || 'Temukan produk berkualitas di toko kami',
          ctaText: 'Lihat Produk',
          backgroundImage: null,
        },
        catalog: {
          enabled: true,
          title: 'Produk Kami',
          layout: 'grid',
        },
        about: {
          enabled: true,
          title: 'Tentang Kami',
          content: 'Kami menyediakan produk berkualitas dengan layanan terbaik.',
        },
        contact: {
          enabled: true,
          title: 'Hubungi Kami',
          whatsapp: wizardState.contact.whatsapp || undefined,
          phone: undefined,
          email: undefined,
          address: wizardState.contact.address || undefined,
        },
        footer: {
          enabled: true,
          copyrightText: `© 2024 ${wizardState.storeName || 'Toko Anda'}. All rights reserved.`,
          socialLinks: {
            instagram: wizardState.contact.instagram || null,
            facebook: null,
            twitter: null,
          },
        },
      },
    },
    products: wizardState.products.map((p, index) => ({
      id: `preview-${index}`,
      name: p.name,
      price: p.price,
      description: p.description || null,
      imageUrl: p.imageUrl || null,
      sortOrder: index,
    })),
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Preview Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Desktop View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Mobile View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white shadow-lg mx-auto" style={{ maxWidth: '1200px' }}>
          <div className="transform scale-90 origin-top">
            <StoreRenderer data={storeData} />
          </div>
        </div>
      </div>

      {/* Preview Footer Info */}
      <div className="bg-white border-t px-4 py-2">
        <p className="text-xs text-gray-500 text-center">
          Preview akan diperbarui secara otomatis saat Anda mengubah data
        </p>
      </div>
    </div>
  );
}
