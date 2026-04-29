import BusinessProfile from "./BusinessProfile";

export async function generateStaticParams() {
  return Array.from({ length: 1000 }, (_, i) => ({
    id: (i + 1).toString()
  }));
}

export default function BusinessPage({ params }: { params: { id: string } }) {
  return <BusinessProfile />;
}
