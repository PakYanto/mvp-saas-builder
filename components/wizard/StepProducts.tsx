'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

interface Product {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface StepProductsProps {
  initialData: Product[];
  onUpdate: (products: Product[]) => void;
}

interface ProductFormData {
  name: string;
  price: string;
  description: string;
  imageUrl: string;
}

export function StepProducts({ initialData, onUpdate }: StepProductsProps) {
  const [products, setProducts] = useState<Product[]>(initialData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: '',
      price: '',
      description: '',
      imageUrl: '',
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Harap upload file gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
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
      setImagePreview(data.url);
      setValue('imageUrl', data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Gagal upload gambar. Silakan coba lagi.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setValue('imageUrl', '');
  };

  const onSubmit = (data: ProductFormData) => {
    const newProduct: Product = {
      name: data.name,
      price: parseFloat(data.price),
      description: data.description || undefined,
      imageUrl: data.imageUrl || undefined,
    };

    let updatedProducts: Product[];

    if (editingIndex !== null) {
      // Update existing product
      updatedProducts = [...products];
      updatedProducts[editingIndex] = newProduct;
      setEditingIndex(null);
    } else {
      // Add new product
      if (products.length >= 5) {
        alert('Maksimal 5 produk');
        return;
      }
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    onUpdate(updatedProducts);
    reset();
    setImagePreview('');
  };

  const handleEdit = (index: number) => {
    const product = products[index];
    setValue('name', product.name);
    setValue('price', product.price.toString());
    setValue('description', product.description || '');
    setValue('imageUrl', product.imageUrl || '');
    setImagePreview(product.imageUrl || '');
    setEditingIndex(index);
  };

  const handleDelete = (index: number) => {
    if (!confirm('Hapus produk ini?')) return;
    const updatedProducts = products.filter((_, i) => i !== index);
    setProducts(updatedProducts);
    onUpdate(updatedProducts);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    reset();
    setImagePreview('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Produk & Layanan
        </h2>
        <p className="text-gray-600">
          Tambahkan produk atau layanan yang Anda tawarkan (maksimal 5)
        </p>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingIndex !== null ? 'Edit Produk' : 'Tambah Produk'}
        </h3>

        {/* Product Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Nama Produk <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            {...register('name', {
              required: 'Nama produk wajib diisi',
              maxLength: {
                value: 200,
                message: 'Nama produk maksimal 200 karakter',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Contoh: Kopi Arabica Premium"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Product Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
            Harga (Rp) <span className="text-red-500">*</span>
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', {
              required: 'Harga wajib diisi',
              min: {
                value: 0.01,
                message: 'Harga harus lebih dari 0',
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="50000"
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
          )}
        </div>

        {/* Product Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar Produk (Opsional)
          </label>
          <div className="flex items-start space-x-4">
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Product preview"
                  className="w-32 h-32 object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-white">
                <span className="text-gray-400 text-xs">Gambar</span>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-sm text-gray-500">
                PNG, JPG, WebP, atau GIF (Max. 5MB)
              </p>
              {uploading && (
                <p className="mt-1 text-sm text-blue-600">Mengupload...</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi (Opsional)
          </label>
          <textarea
            id="description"
            {...register('description', {
              maxLength: {
                value: 1000,
                message: 'Deskripsi maksimal 1000 karakter',
              },
            })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Deskripsi singkat produk..."
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            {editingIndex !== null ? 'Update Produk' : 'Tambah Produk'}
          </button>
          {editingIndex !== null && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Product List */}
      {products.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Daftar Produk ({products.length}/5)
          </h3>
          <div className="grid gap-4">
            {products.map((product, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg"
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400 text-xs">No Image</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {product.name}
                  </h4>
                  <p className="text-blue-600 font-medium mt-1">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(index)}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(index)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">Belum ada produk. Tambahkan produk pertama Anda di atas.</p>
        </div>
      )}
    </div>
  );
}
