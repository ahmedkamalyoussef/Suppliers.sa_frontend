import BusinessProfile from "./BusinessProfile";

export async function generateStaticParams() {
  // Return some sample business IDs for static generation
  // You can modify this to return actual business IDs from your data
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

export default function BusinessPage({ params }: { params: { id: string } }) {
  return <BusinessProfile />;
}
