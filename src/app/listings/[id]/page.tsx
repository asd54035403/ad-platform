import { mockListings } from '../../../lib/mockData';
import ListingDetailClient from './ListingDetailClient';

// 為靜態導出生成所有可能的參數
export async function generateStaticParams() {
  // 返回所有mock listings的id
  return mockListings.map((listing) => ({
    id: listing.id,
  }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: Props) {
  const { id } = await params;
  
  return <ListingDetailClient listingId={id} />;
}