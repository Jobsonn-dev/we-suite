// ============================================================
// WEBUOS Business Profile API
// GET /api/businesses/[slug] — full company profile + products + services
// + 5 related companies in the same category (by popularity, excluding self)
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

interface CompanyProfile {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  verified: boolean;
  claimed: boolean;
  registered: boolean;
  business_type: string;
  business_size: string | null;
  established_year: number | null;
  ecosystem: string | null;
  sector_id: string | null;
  category_id: string | null;
  industry: string | null;
  category: string | null;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  district: string | null;
  postal_code: string | null;
  address: string | null;
  business_hours: string | null;
  employee_range: string | null;
  annual_revenue: string | null;
  industries_served: string[];
  markets_served: string[];
  certifications: string[];
  founded_year: number | null;
  social_links: Record<string, string> | null;
  rating: number;
  review_count: number;
  product_count: number;
  service_count: number;
  views: number;
}

interface ProductBrief {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  subcategory: string | null;
  brand: string | null;
  moq: string | null;
  price_range: string | null;
  availability: string | null;
  image_url: string | null;
}

interface ServiceBrief {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  industry_served: string | null;
  coverage: string | null;
  pricing_model: string | null;
}

interface RelatedCompany {
  id: string;
  slug: string;
  name: string;
  verified: boolean;
  business_type: string;
  city: string | null;
  rating: number;
}

interface BusinessProfileResponse {
  company: CompanyProfile;
  products: ProductBrief[];
  services: ServiceBrief[];
  related_companies: RelatedCompany[];
}

function splitList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseSocialLinks(json: string | null): Record<string, string> | null {
  if (!json) return null;
  try {
    const parsed = JSON.parse(json);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed as Record<string, string>;
    }
  } catch {
    // Not valid JSON — ignore
  }
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const company = await db.company.findUnique({
    where: { slug },
    include: {
      products: {
        orderBy: { name: "asc" },
      },
      services: {
        orderBy: { name: "asc" },
      },
    },
  });

  if (!company) {
    return NextResponse.json(
      { error: "Business not found", slug },
      { status: 404 },
    );
  }

  // Increment view count (non-blocking, best-effort)
  db.company
    .update({
      where: { id: company.id },
      data: { views: { increment: 1 } },
    })
    .catch((err) => console.error("[business profile] view-count inc failed", err));

  // Fetch 5 related companies in the same category (excluding this one),
  // sorted by popularity. Fall back to same industry if no category match.
  const relatedWhereBase = {
    id: { not: company.id },
    ...(company.categoryId
      ? { categoryId: company.categoryId }
      : company.industryName
        ? { industryName: company.industryName }
        : {}),
  };
  const relatedCompanies = await db.company.findMany({
    where: relatedWhereBase,
    take: 5,
    orderBy: { popularity: "desc" },
    select: {
      id: true,
      slug: true,
      name: true,
      verified: true,
      businessType: true,
      city: true,
      rating: true,
    },
  });

  const profile: CompanyProfile = {
    id: company.id,
    slug: company.slug,
    name: company.name,
    logo: company.logoUrl,
    verified: company.verified,
    claimed: company.claimed,
    registered: company.registered,
    business_type: company.businessType,
    business_size: company.businessSize,
    established_year: company.establishedYear,
    ecosystem: company.ecosystemId,
    sector_id: company.sectorId,
    category_id: company.categoryId,
    industry: company.industryName,
    category: company.categoryName,
    description: company.description,
    website: company.website,
    email: company.email,
    phone: company.phone,
    country: company.country,
    state: company.state,
    city: company.city,
    district: company.district,
    postal_code: company.postalCode,
    address: company.address,
    business_hours: company.businessHours,
    employee_range: company.employeeRange,
    annual_revenue: company.annualRevenue,
    industries_served: splitList(company.industriesServed),
    markets_served: splitList(company.marketsServed),
    certifications: splitList(company.certifications),
    founded_year: company.foundedYear ?? company.establishedYear,
    social_links: parseSocialLinks(company.socialLinks),
    rating: company.rating,
    review_count: company.reviewCount,
    product_count: company.productCount,
    service_count: company.serviceCount,
    views: company.views,
  };

  const products: ProductBrief[] = company.products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    description: p.description,
    category: p.category,
    subcategory: p.subcategory,
    brand: p.brand,
    moq: p.moq,
    price_range: p.priceRange,
    availability: p.availability,
    image_url: p.imageUrl,
  }));

  const services: ServiceBrief[] = company.services.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    category: s.category,
    industry_served: s.industryServed,
    coverage: s.coverage,
    pricing_model: s.pricingModel,
  }));

  const related: RelatedCompany[] = relatedCompanies.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    verified: c.verified,
    business_type: c.businessType,
    city: c.city,
    rating: c.rating,
  }));

  const response: BusinessProfileResponse = {
    company: profile,
    products,
    services,
    related_companies: related,
  };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
