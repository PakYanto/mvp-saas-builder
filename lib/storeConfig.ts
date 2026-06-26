// StoreConfig Type Definition

export interface StoreConfig {
  version: number;
  templateId: string;
  brand: {
    storeName: string;
    tagline?: string;
    logoUrl?: string;
    themeColor: string;
    category: string;
  };
  sections: {
    hero: {
      enabled: boolean;
      headline: string;
      subheadline?: string;
      ctaText: string;
      backgroundImageUrl?: string;
    };
    catalog: {
      enabled: boolean;
      title: string;
      layout: 'grid' | 'list';
    };
    about: {
      enabled: boolean;
      title: string;
      body: string;
    };
    contact: {
      enabled: boolean;
      whatsapp?: string;
      instagram?: string;
      address?: string;
    };
    footer: {
      enabled: boolean;
      showPoweredBy: boolean;
    };
  };
  products: Array<{
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    description?: string;
    sortOrder: number;
  }>;
}

export function generateSlug(storeName: string): string {
  return storeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Math.random().toString(36).substr(2, 6);
}

export function createDefaultStoreConfig(
  storeName: string,
  category: string,
  templateId: string
): StoreConfig {
  return {
    version: 1,
    templateId,
    brand: {
      storeName,
      themeColor: '#3B82F6',
      category,
    },
    sections: {
      hero: {
        enabled: true,
        headline: `Selamat datang di ${storeName}`,
        subheadline: 'Belanja mudah langsung dari sini',
        ctaText: 'Lihat Produk',
      },
      catalog: {
        enabled: true,
        title: 'Produk Kami',
        layout: 'grid',
      },
      about: {
        enabled: true,
        title: 'Tentang Kami',
        body: `${storeName} adalah toko terpercaya yang melayani dengan sepenuh hati.`,
      },
      contact: {
        enabled: true,
      },
      footer: {
        enabled: true,
        showPoweredBy: true,
      },
    },
    products: [],
  };
}
