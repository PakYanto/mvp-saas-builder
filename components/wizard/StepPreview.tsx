'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { StoreRenderer } from '@/components/renderer/StoreRenderer';
import { WizardState } from '@/lib/useWizard';
import { StoreData } from '@/types/store-config';

interface StepPreviewProps {
  wizardState: WizardState;
}

export function StepPreview({ wizardState }: StepPreviewProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Convert wizard state to StoreData format for preview
  const previewData: StoreData = {
    config: {
      version: '1.0',
      templateId: wizardState.templateId,
      brand: {
        name: wizardState.storeName,
        tagline: wizardState.tagline || undefined,
        logoUrl: wizardState.logoUrl || null,
      },
      sections: {
        hero: {
          enabled: true,
          headline: wizardState.storeName,
          subheadline: wizardState.tagline || 'Selamat datang di toko kami',
          ctaText: 'Hubungi Kami',
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
          content: `${wizardState.storeName} menyediakan produk dan layanan berkualitas untuk memenuhi kebutuhan Anda.`,
        },
        contact: {
          enabled: true,
          title: 'Hubungi Kami',
          whatsapp: wizardState.contact.whatsapp || undefined,
          address: wizardState.contact.address || undefined,
        },
        footer: {
          enabled: true,
          copyrightText: `© 2024 ${wizardState.storeName}. All rights reserved.`,
          socialLinks: {
            instagram: wizardState.contact.instagram
              ? `https://instagram.com/${wizardState.contact.instagram.replace('@', '')}`
              : null,
            facebook: null,
            twitter: null,
          },
        },
      },
    },
    products: wizardState.products.map((product, index) => ({
      id: `preview-${index}`,
      name: product.name,
      price: product.price,
      description: product.description || null,
      imageUrl: product.imageUrl || null,
      sortOrder: index,
    })),
    themeColor: wizardState.themeColor,
    storeName: wizardState.storeName,
    slug: 'preview',
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      // Prepare project data
      const projectData = {
        userId: 'default-user', // TODO: Replace with actual user ID from auth
        templateId: wizardState.templateId,
        storeName: wizardState.storeName,
        tagline: wizardState.tagline || undefined,
        logoUrl: wizardState.logoUrl || undefined,
        category: wizardState.category,
        themeColor: wizardState.themeColor,
      };

      // Create project
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (!projectResponse.ok) {
        const errorData = await projectResponse.json();
        throw new Error(errorData.error || 'Failed to create project');
      }

      const project = await projectResponse.json();

      // Add products if any
      if (wizardState.products.length > 0) {
        const productPromises = wizardState.products.map((product, index) =>
          fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              projectId: project.id,
              name: product.name,
              price: product.price,
              description: product.description || undefined,
              imageUrl: product.imageUrl || undefined,
              sortOrder: index,
            }),
          })
        );

        await Promise.all(productPromises);
      }

      // Update project with contact info in storeConfig
      const updatedConfig = {
        ...previewData.config,
        sections: {
          ...previewData.config.sections,
          contact: {
            ...previewData.config.sections.contact,
            whatsapp: wizardState.contact.whatsapp,
            address: wizardState.contact.address,
          },
          footer: {
            ...previewData.config.sections.footer,
            socialLinks: {
              instagram: wizardState.contact.instagram
                ? `https://instagram.com/${wizardState.contact.instagram.replace('@', '')}`
                : null,
              facebook: null,
              twitter: null,
            },
          },
        },
      };

      await fetch(`/api/projects/${project.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeConfig: JSON.stringify(updatedConfig),
        }),
      });

      // Clear wizard state from localStorage
      localStorage.removeItem('wizard-state');

      // Redirect to preview page
      router.push(`/preview/${project.slug}`);
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : 'Gagal menyimpan project. Silakan coba lagi.');
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Preview & Simpan
        </h2>
        <p className="text-gray-600">
          Lihat tampilan akhir website kamu sebelum disimpan
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Ringkasan</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Nama Toko:</span>
            <p className="font-medium text-gray-900">{wizardState.storeName}</p>
          </div>
          
          {wizardState.tagline && (
            <div>
              <span className="text-gray-600">Tagline:</span>
              <p className="font-medium text-gray-900">{wizardState.tagline}</p>
            </div>
          )}
          
          <div>
            <span className="text-gray-600">Kategori:</span>
            <p className="font-medium text-gray-900 capitalize">{wizardState.category}</p>
          </div>
          
          <div>
            <span className="text-gray-600">Jumlah Produk:</span>
            <p className="font-medium text-gray-900">{wizardState.products.length} produk</p>
          </div>
          
          <div>
            <span className="text-gray-600">WhatsApp:</span>
            <p className="font-medium text-gray-900">{wizardState.contact.whatsapp || '-'}</p>
          </div>
          
          {wizardState.contact.instagram && (
            <div>
              <span className="text-gray-600">Instagram:</span>
              <p className="font-medium text-gray-900">@{wizardState.contact.instagram}</p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex items-center justify-center">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-8 py-3 text-base font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
        >
          {isSaving ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Menyimpan...
            </span>
          ) : (
            '🚀 Simpan & Buat Link'
          )}
        </button>
      </div>

      {/* Preview Section */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Preview Website
        </h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-600">
                preview.tokoweb.com/your-store
              </div>
            </div>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            <StoreRenderer data={previewData} />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Apa yang terjadi setelah menyimpan?
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Website kamu langsung bisa diakses</li>
                <li>Link unik bakal dibuat buat share ke pelanggan</li>
                <li>Kamu bisa edit website kapan aja di dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
