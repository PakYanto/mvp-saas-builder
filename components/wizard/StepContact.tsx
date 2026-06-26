'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

interface ContactData {
  whatsapp: string;
  instagram: string;
  address: string;
}

interface StepContactProps {
  initialData: ContactData;
  onUpdate: (data: ContactData) => void;
}

export function StepContact({ initialData, onUpdate }: StepContactProps) {
  const {
    register,
    formState: { errors },
    watch,
  } = useForm<ContactData>({
    defaultValues: {
      whatsapp: initialData.whatsapp,
      instagram: initialData.instagram,
      address: initialData.address,
    },
  });

  // Watch form changes and update parent
  const formValues = watch();
  useEffect(() => {
    onUpdate(formValues);
  }, [formValues, onUpdate]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Informasi Kontak
        </h2>
        <p className="text-gray-600">
          Buat pelanggan dapat menghubungi Anda dengan mudah
        </p>
      </div>

      <form className="space-y-6">
        {/* WhatsApp Number */}
        <div>
          <label
            htmlFor="whatsapp"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nomor WhatsApp <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="whatsapp"
              type="tel"
              {...register('whatsapp', {
                required: 'Nomor WhatsApp wajib diisi',
                pattern: {
                  value: /^(\+62|62|0)[0-9]{9,13}$/,
                  message: 'Format nomor tidak valid (contoh: +6281234567890 atau 081234567890)',
                },
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+6281234567890 atau 081234567890"
            />
          </div>
          {errors.whatsapp && (
            <p className="mt-1 text-sm text-red-600">
              {errors.whatsapp.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Pelanggan dapat menghubungi Anda langsung via WhatsApp
          </p>
        </div>

        {/* Instagram Handle */}
        <div>
          <label
            htmlFor="instagram"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Instagram (Opsional)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              @
            </span>
            <input
              id="instagram"
              type="text"
              {...register('instagram', {
                pattern: {
                  value: /^[a-zA-Z0-9._]{1,30}$/,
                  message: 'Username Instagram tidak valid (tanpa @)',
                },
              })}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="username_anda"
            />
          </div>
          {errors.instagram && (
            <p className="mt-1 text-sm text-red-600">
              {errors.instagram.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Tulis username tanpa simbol @ (contoh: toko_kopi)
          </p>
        </div>

        {/* Address */}
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Alamat (Opsional)
          </label>
          <textarea
            id="address"
            {...register('address', {
              maxLength: {
                value: 500,
                message: 'Alamat maksimal 500 karakter',
              },
            })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Jl. Contoh No. 123, Kelurahan, Kecamatan, Kota, Provinsi"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">
              {errors.address.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Alamat lengkap toko atau tempat usaha Anda
          </p>
        </div>

        {/* Info Box */}
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
                Tips Informasi Kontak
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Pastikan nomor WhatsApp aktif dan bisa dihubungi</li>
                  <li>Instagram membantu pelanggan melihat katalog produk Anda</li>
                  <li>Alamat lengkap memudahkan pelanggan menemukan toko fisik Anda</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
