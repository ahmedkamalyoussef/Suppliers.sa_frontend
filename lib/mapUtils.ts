export interface MapMarkerItem {
  id: string | number;
  supplierId: string | number;
  supplierName: string;
  name: string;
  branchId?: string | number | null;
  branchName?: string | null;
  address: string;
  lat: number;
  lng: number;
  type: string;
  category: string;
  categories: string[];
  businessType?: string;
  profileImage?: string;
  rating: number;
  reviewsCount: number;
  status: string;
  phone: string;
  contactEmail: string;
  slug?: string;
  isMainLocation: boolean;
  isBranch: boolean;
}

/**
 * Transforms an array of raw business/supplier objects into map marker items.
 * ALWAYS generates a primary marker for the supplier's Main Business Location,
 * AND generates distinct markers for ALL additional registered Branch Locations.
 */
export function transformBusinessesToMapItems(businesses: any[]): MapMarkerItem[] {
  if (!Array.isArray(businesses)) return [];

  const markers: MapMarkerItem[] = [];

  businesses.forEach((business) => {
    if (!business) return;

    const supplierId = business.id;
    const supplierName = business.name || business.business_name || business.businessName || "Supplier";
    const slug = business.slug;
    const category = business.category?.toLowerCase()?.replace(/\s+/g, "-") || "other";
    const categories = business.categories || (business.category ? [business.category] : []);
    const businessType = business.businessType || business.type || "Supplier";
    const profileImage = business.businessImage || business.profileImage || business.image;
    const rating = Number(business.rating) || 0;
    const reviewsCount = Number(business.reviewsCount) || 0;
    const status = business.status || "active";
    const mainPhone = business.mainPhone || business.phone || "";
    const contactEmail = business.contactEmail || business.email || "";

    // 1. Primary (Main) Business Location Marker
    const mainLat = Number(business.latitude ?? business.lat);
    const mainLng = Number(business.longitude ?? business.lng);

    if (Number.isFinite(mainLat) && Number.isFinite(mainLng) && (mainLat !== 0 || mainLng !== 0)) {
      markers.push({
        id: `${supplierId}_main`,
        supplierId,
        supplierName,
        name: supplierName,
        branchName: null,
        address: business.address || "",
        lat: mainLat,
        lng: mainLng,
        type: businessType,
        category,
        categories,
        businessType,
        profileImage,
        rating,
        reviewsCount,
        status,
        phone: mainPhone,
        contactEmail,
        slug,
        isMainLocation: true,
        isBranch: false,
      });
    }

    // 2. Additional Branch Markers
    if (Array.isArray(business.branches) && business.branches.length > 0) {
      business.branches.forEach((branch: any, idx: number) => {
        const branchLat = Number(branch.location?.lat ?? branch.latitude);
        const branchLng = Number(branch.location?.lng ?? branch.longitude);

        if (Number.isFinite(branchLat) && Number.isFinite(branchLng) && (branchLat !== 0 || branchLng !== 0)) {
          markers.push({
            id: `${supplierId}_branch_${branch.id || idx}`,
            supplierId,
            supplierName,
            name: supplierName,
            branchId: branch.id,
            branchName: branch.name || `Branch ${idx + 1}`,
            address: branch.address || business.address || "",
            lat: branchLat,
            lng: branchLng,
            type: businessType,
            category,
            categories,
            businessType,
            profileImage,
            rating,
            reviewsCount,
            status,
            phone: branch.phone || mainPhone,
            contactEmail: branch.email || contactEmail,
            slug,
            isMainLocation: false,
            isBranch: true,
          });
        }
      });
    }
  });

  return markers;
}
