
import { Suspense } from 'react';
import PublicBusinessProfile from './PublicBusinessProfile';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
    { id: '6' },
    { id: '7' },
    { id: '8' },
    { id: '9' },
    { id: '10' },
    { id: 'tech-solutions-co' },
    { id: 'royal-furniture' },
    { id: 'fresh-mart-grocery' },
    { id: 'saudi-electronics' },
    { id: 'gulf-trading' },
  ];
}

function ProfileWrapper({ params }: { params: { id: string } }) {
  return <PublicBusinessProfile businessId={params.id} />;
}

export default function PublicProfilePage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full animate-pulse mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading business profile...</p>
        </div>
      </div>
    }>
      <ProfileWrapper params={params} />
    </Suspense>
  );
}
