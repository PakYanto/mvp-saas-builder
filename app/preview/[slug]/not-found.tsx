export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center px-4">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Toko Tidak Ditemukan</h2>
        <p className="text-gray-600 mb-8">
          Maaf, toko yang Anda cari tidak ditemukan atau belum dipublikasikan.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
