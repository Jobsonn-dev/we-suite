import { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/layout/page-shell";
import { BusinessProfileClient } from "@/components/business/business-profile-client";
import { ecosystems } from "@/data/taxonomy";
import { getMockBusinessProfile } from "@/data/mock-db";

export interface CompanyProfile {
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

export interface ProductBrief {
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

export interface ServiceBrief {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  industry_served: string | null;
  coverage: string | null;
  pricing_model: string | null;
}

export interface RelatedCompany {
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = getMockBusinessProfile(slug);
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
  const data = getMockBusinessProfile(slug);
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
