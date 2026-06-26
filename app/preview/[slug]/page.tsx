import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getProjectBySlug } from '@/lib/get-project';
import { StoreRenderer } from '@/components/renderer/StoreRenderer';

interface PreviewPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PreviewPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);

  if (!data) {
    return {
      title: 'Store Not Found',
    };
  }

  return {
    title: `${data.storeName} - ${data.config.brand.tagline || 'Online Store'}`,
    description: data.config.sections.about.enabled 
      ? data.config.sections.about.content.slice(0, 160)
      : `Temukan produk terbaik dari ${data.storeName}`,
    openGraph: {
      title: data.storeName,
      description: data.config.brand.tagline || '',
      type: 'website',
    },
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { slug } = await params;
  const data = await getProjectBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      <StoreRenderer data={data} />
      
      {/* CTA Banner */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--color-primary)] text-white py-4 shadow-lg z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
            <p className="text-sm sm:text-base text-center sm:text-left">
              Tertarik membuat toko online seperti ini?
            </p>
            <a
              href="/"
              className="inline-block bg-white text-[var(--color-primary)] font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              Minta Dibuatkan
            </a>
          </div>
        </div>
      </div>
      
      {/* Add padding to main content so it's not hidden by CTA banner */}
      <div className="h-20"></div>
    </>
  );
}
