import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Buat Preview Website Toko Online dalam{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              5 Menit
            </span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
            Mockup profesional untuk meyakinkan calon klien. Gratis, tanpa coding.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/builder"
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
            >
              Buat Preview Toko Gratis
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Kenapa Harus Pakai Ini?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Platform tercepat buat bikin preview website toko online
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 inline-flex rounded-lg bg-blue-600 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cepat & Mudah
              </h3>
              <p className="text-gray-600">
                Buat preview website toko online dalam 5 menit, tanpa perlu coding atau skill teknis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 inline-flex rounded-lg bg-indigo-600 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Preview Real-Time
              </h3>
              <p className="text-gray-600">
                Lihat hasil website langsung saat kamu mengisi form. Preview interaktif dan responsif.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="relative rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50 to-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4 inline-flex rounded-lg bg-purple-600 p-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Link Shareable
              </h3>
              <p className="text-gray-600">
                Kirim link preview ke calon klien lewat WhatsApp, email, atau medsos dengan gampang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Gimana Caranya?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tiga langkah gampang buat bikin preview website toko online
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-2xl font-bold text-white shadow-lg">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Isi Form
              </h3>
              <p className="text-gray-600">
                Masukkan info toko: nama, logo, produk, dan kontak. Form gampang banget.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-bold text-white shadow-lg">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Preview
              </h3>
              <p className="text-gray-600">
                Lihat hasil website secara langsung. Edit dan sesuaikan sampai perfect sesuai keinginan.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-2xl font-bold text-white shadow-lg">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Share Link
              </h3>
              <p className="text-gray-600">
                Dapetin link unik dan bagikan ke calon klien. Mereka bisa lihat preview kapan aja, di mana aja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Siap Bikin Preview Website Toko Kamu?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Mulai sekarang dan dapetin preview profesional dalam hitungan menit. Gratis, tanpa ribet.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/builder"
              className="rounded-full bg-white px-8 py-4 text-base font-semibold text-blue-600 shadow-xl hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
            >
              Mulai Buat Preview
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-6">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-gray-400 text-sm">
            © 2026 MVP SaaS Builder. Platform preview website toko online tercepat di Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
