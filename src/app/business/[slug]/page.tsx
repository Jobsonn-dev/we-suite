import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageShell } from "@/components/layout/page-shell";
import { BusinessProfileClient } from "@/components/business/business-profile-client";
import { ecosystems } from "@/data/taxonomy";

interface CompanyProfile {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  verified: boolean;
  claimed: boolean;
  registered: boolean;
  pendingVerification: boolean;
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

export interface BusinessProfileData {
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
    // ignore
  }
  return null;
}

async function getBusinessProfile(slug: string): Promise<BusinessProfileData | null> {
  const company = await db.company.findUnique({
    where: { slug },
    include: {
      products: { orderBy: { name: "asc" } },
      services: { orderBy: { name: "asc" } },
    },
  });

  if (!company) return null;

  // Increment view count (best-effort, non-blocking)
  db.company
    .update({
      where: { id: company.id },
      data: { views: { increment: 1 } },
    })
    .catch((err) => console.error("[business profile] view-count inc failed", err));

  // Fetch 5 related companies in the same category, by popularity
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
    pendingVerification: company.pendingVerification,
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

  return {
    company: profile,
    products,
    services,
    related_companies: related,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getBusinessProfile(slug);
  if (!data) {
    return {
      title: "Business Not Found — WEBUOS",
      description: "The requested business profile could not be found on WEBUOS.",
    };
  }
  const { company } = data;
  const title = `${company.name} — WEBUOS Business Profile`;
  const description =
    company.description ??
    `${company.name} is a ${company.business_type.toLowerCase()} based in ${company.city}, ${company.country}.`;

  const reqHeaders = await headers();
  const host = reqHeaders.get("host") ?? "webuos.com";
  const proto = reqHeaders.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;
  const canonicalUrl = `${origin}/business/${company.slug}`;

  // LocalBusiness structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description: company.description,
    url: company.website ?? canonicalUrl,
    telephone: company.phone,
    email: company.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.address,
      addressLocality: company.city,
      addressRegion: company.state,
      postalCode: company.postal_code,
      addressCountry: company.country,
    },
    ...(company.rating > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: company.rating,
            reviewCount: company.review_count,
          },
        }
      : {}),
    foundingDate: company.founded_year ? String(company.founded_year) : undefined,
  };

  return {
    title,
    description,
    alternates: { canonical: `/business/${company.slug}` },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "WEBUOS",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "application/ld+json": JSON.stringify(structuredData),
    },
  };
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getBusinessProfile(slug);
  if (!data) notFound();

  // Look up the ecosystem for accent coloring
  const ecosystem = ecosystems.find((e) => e.id === data.company.ecosystem);
  const accent = ecosystem?.accent ?? "blue";

  return (
    <PageShell>
      <BusinessProfileClient data={data} accent={accent} />
    </PageShell>
  );
}
