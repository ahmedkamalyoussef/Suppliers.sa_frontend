import { Suspense } from "react";
import dynamic from 'next/dynamic';

// Import the client component dynamically with no SSR
const ProfileClient = dynamic(
  () => import('./ProfileClient'),
  { ssr: false, loading: () => (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
        <p className="text-gray-600 text-lg">جاري التحميل...</p>
      </div>
    </div>
  )}
);

export function generateStaticParams() {
  return [];
}

function ProfileWrapper({ params }: { params: { id: string } }) {
  return <ProfileClient id={params.id} />;
}

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400 rounded-full animate-pulse mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading business profile...</p>
          </div>
        </div>
      }
    >
      <ProfileWrapper params={params} />
    </Suspense>
  );
}
