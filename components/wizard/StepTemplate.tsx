'use client';

import { useEffect, useState } from 'react';

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  previewImage?: string | null;
  _count?: {
    projects: number;
  };
}

interface StepTemplateProps {
  selectedTemplateId: string;
  category: string;
  onSelectTemplate: (templateId: string) => void;
}

export function StepTemplate({
  selectedTemplateId,
  category,
  onSelectTemplate,
}: StepTemplateProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = category
          ? `/api/templates?category=${encodeURIComponent(category)}`
          : '/api/templates';

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch templates');
        }

        const data = await response.json();
        setTemplates(data.templates || []);
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Gagal memuat template. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, [category]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Pilih Template</h2>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Pilih Template</h2>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pilih Template
        </h2>
        <p className="text-gray-600">
          Pilih desain yang sesuai dengan bisnis kamu. Bisa diubah nanti.
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">
            Tidak ada template tersedia untuk kategori ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => onSelectTemplate(template.id)}
              className={`relative bg-white border-2 rounded-lg p-4 text-left transition-all hover:shadow-lg ${
                selectedTemplateId === template.id
                  ? 'border-blue-600 ring-2 ring-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Preview Image */}
              <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                {template.previewImage ? (
                  <img
                    src={template.previewImage}
                    alt={`Preview ${template.name}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Template Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {template.name}
                  </h3>
                  {selectedTemplateId === template.id && (
                    <div className="bg-blue-600 text-white rounded-full p-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
                {template._count && template._count.projects > 0 && (
                  <p className="text-xs text-gray-500">
                    Digunakan oleh {template._count.projects} toko
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
