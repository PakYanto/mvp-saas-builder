'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';

interface StepBrandProps {
  initialData: {
    storeName: string;
    tagline: string;
    category: string;
    logoUrl: string;
    themeColor: string;
  };
  onUpdate: (data: Partial<StepBrandProps['initialData']>) => void;
}

interface FormData {
  storeName: string;
  tagline: string;
  category: string;
  themeColor: string;
}

export function StepBrand({ initialData, onUpdate }: StepBrandProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      storeName: initialData.storeName,
      tagline: initialData.tagline,
      category: initialData.category,
      themeColor: initialData.themeColor,
    },
  });

  const [uploading, setUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(initialData.logoUrl);

  // Watch form changes and update parent
  const formValues = watch();
  useEffect(() => {
    const { storeName, tagline, category, themeColor } = formValues;
    onUpdate({ storeName, tagline, category, themeColor });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues.storeName, formValues.tagline, formValues.category, formValues.themeColor, onUpdate]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Harap upload file gambar');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setLogoPreview(data.url);
      onUpdate({ logoUrl: data.url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Gagal upload logo. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const removeLogo = () => {
    setLogoPreview('');
    onUpdate({ logoUrl: '' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informasi Toko Anda
        </h2>
        <p className="text-gray-600">
          Mari mulai dengan informasi dasar tentang toko Anda
        </p>
      </div>

      <form className="space-y-6">
        {/* Store Name */}
        <div>
          <label
            htmlFor="storeName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nama Toko <span className="text-red-500">*</span>
          </label>
          <input
            id="storeName"
            type="text"
            {...register('storeName', {
              required: 'Nama toko wajib diisi',
              minLength: {
                value: 3,
                message: 'Nama toko minimal 3 karakter',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Toko Kopi Nikmat"
          />
          {errors.storeName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.storeName.message}
            </p>
          )}
        </div>

        {/* Tagline */}
        <div>
          <label
            htmlFor="tagline"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tagline (Opsional)
          </label>
          <input
            id="tagline"
            type="text"
            {...register('tagline')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Kopi berkualitas dengan harga terjangkau"
          />
          <p className="mt-1 text-sm text-gray-500">
            Slogan singkat yang menggambarkan bisnis Anda
          </p>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Kategori Bisnis <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            {...register('category', { required: true })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="umum">Umum</option>
            <option value="minimal">Minimal</option>
            <option value="fashion">Fashion</option>
            <option value="fnb">Makanan & Minuman</option>
          </select>
        </div>

        {/* Logo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logo (Opsional)
          </label>
          <div className="flex items-start space-x-4">
            {logoPreview ? (
              <div className="relative">
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="w-24 h-24 object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
                <span className="text-gray-400 text-xs">Logo</span>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG, atau GIF (Max. 2MB)
              </p>
              {uploading && (
                <p className="mt-1 text-sm text-blue-600">
                  Mengupload...
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Theme Color */}
        <div>
          <label
            htmlFor="themeColor"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Warna Tema
          </label>
          <div className="flex items-center space-x-4">
            <input
              id="themeColor"
              type="color"
              {...register('themeColor')}
              className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-600">
              Pilih warna utama untuk toko Anda
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}
