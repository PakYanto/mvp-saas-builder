export interface StoreConfig {
  version: string;
  templateId: string;
  brand: {
    name: string;
    tagline?: string;
    logoUrl?: string | null;
  };
  sections: {
    hero: {
      enabled: boolean;
      headline: string;
      subheadline: string;
      ctaText: string;
      backgroundImage?: string | null;
    };
    catalog: {
      enabled: boolean;
      title: string;
      layout: 'grid' | 'list';
    };
    about: {
      enabled: boolean;
      title: string;
      content: string;
    };
    contact: {
      enabled: boolean;
      title: string;
      phone?: string;
      whatsapp?: string;
      email?: string;
      address?: string;
    };
    footer: {
      enabled: boolean;
      copyrightText: string;
      socialLinks?: {
        instagram?: string | null;
        facebook?: string | null;
        twitter?: string | null;
      };
    };
  };
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  imageUrl?: string | null;
  sortOrder: number;
}

export interface StoreData {
  config: StoreConfig;
  products: Product[];
  themeColor: string;
  storeName: string;
  slug: string;
}
