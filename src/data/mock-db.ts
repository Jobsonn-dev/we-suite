// ============================================================
// WEBUOS In-Memory Mock Database
// Complete, pure TypeScript mock data layer for the WEBUOS UI
// No backend database or Prisma dependencies required.
// ============================================================

import { ecosystems } from "@/data/taxonomy";

// ------------------------------------------------------------
// Types
// ------------------------------------------------------------

export interface MockCompany {
  id: string;
  slug: string;
  name: string;
  logoUrl: string | null;
  verified: boolean;
  claimed: boolean;
  registered: boolean;
  pendingVerification: boolean;
  businessType: string;
  businessSize: string;
  establishedYear: number;
  ecosystemId: string;
  sectorId: string;
  categoryId: string;
  industryName: string;
  categoryName: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  district: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  address: string;
  businessHours: string;
  employeeRange: string;
  annualRevenue: string;
  industriesServed: string;
  marketsServed: string;
  certifications: string;
  foundedYear: number;
  socialLinks: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  serviceCount: number;
  views: number;
  popularity: number;
}

export interface MockProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  companyId: string;
  companyName: string;
  category: string;
  subcategory: string;
  brand: string;
  specifications: string;
  moq: string;
  priceRange: string;
  currency: string;
  availability: string;
  exporter: boolean;
  country: string;
  state: string;
  city: string;
  imageUrl: string | null;
}

export interface MockService {
  id: string;
  slug: string;
  name: string;
  description: string;
  companyId: string;
  companyName: string;
  category: string;
  industryServed: string;
  coverage: string;
  pricingModel: string;
  availability: string;
  country: string;
  state: string;
  city: string;
}

export interface MockIndustry {
  id: string;
  slug: string;
  name: string;
  description: string;
  ecosystemId: string;
  sectorId: string;
  categoryId?: string;
  categoryCount: number;
  companyCount: number;
  productCount: number;
  serviceCount: number;
  technologyCount: number;
}

export interface MockTechnology {
  id: string;
  slug: string;
  name: string;
  type: string;
  description: string;
  providers: string;
  useCases: string;
  industries: string;
  companyCount: number;
}

export interface MockLocation {
  id: string;
  slug: string;
  name: string;
  type: string;
  country: string;
  state: string;
  city: string;
  businessCount: number;
  industries: string;
  popularCompanies: string;
}

export interface MockSynonym {
  id: string;
  term: string;
  synonyms: string;
}

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ------------------------------------------------------------
// 1. Synonyms
// ------------------------------------------------------------

export const MOCK_SYNONYMS: MockSynonym[] = [
  { id: "syn-1", term: "IT", synonyms: "Information Technology,Tech,Software" },
  { id: "syn-2", term: "AI", synonyms: "Artificial Intelligence,Machine Learning,ML,Intelligence" },
  { id: "syn-3", term: "ML", synonyms: "Machine Learning,AI,Artificial Intelligence" },
  { id: "syn-4", term: "ERP", synonyms: "Enterprise Resource Planning,Enterprise Software" },
  { id: "syn-5", term: "B2B", synonyms: "Business to Business,Wholesale,Trade" },
  { id: "syn-6", term: "Manufacturer", synonyms: "Manufacturing Company,Producer,Fabricator,OEM" },
  { id: "syn-7", term: "Supplier", synonyms: "Vendor,Distributor,Wholesaler,Trader" },
  { id: "syn-8", term: "Company", synonyms: "Business,Organization,Firm,Enterprise" },
  { id: "syn-9", term: "SaaS", synonyms: "Software as a Service,Cloud Software,Subscription Software" },
  { id: "syn-10", term: "CNC", synonyms: "Computer Numerical Control,Machining,Automated Machining" },
  { id: "syn-11", term: "EV", synonyms: "Electric Vehicle,Electric Mobility,Battery Vehicle" },
  { id: "syn-12", term: "IoT", synonyms: "Internet of Things,Connected Devices,Smart Devices" },
  { id: "syn-13", term: "CRM", synonyms: "Customer Relationship Management,Sales Software" },
  { id: "syn-14", term: "Cybersecurity", synonyms: "Cyber Security,Information Security,InfoSec" },
  { id: "syn-15", term: "Cloud", synonyms: "Cloud Computing,Cloud Services,Cloud Infrastructure" },
];

// ------------------------------------------------------------
// 2. Locations Pool & Locations
// ------------------------------------------------------------

const LOCATION_POOL = [
  { city: "Bengaluru", state: "Karnataka", country: "India", lat: 12.9716, lng: 77.5946 },
  { city: "Mumbai", state: "Maharashtra", country: "India", lat: 19.076, lng: 72.8777 },
  { city: "Pune", state: "Maharashtra", country: "India", lat: 18.5204, lng: 73.8567 },
  { city: "Chennai", state: "Tamil Nadu", country: "India", lat: 13.0827, lng: 80.2707 },
  { city: "Hyderabad", state: "Telangana", country: "India", lat: 17.385, lng: 78.4867 },
  { city: "Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.209 },
  { city: "Gurugram", state: "Haryana", country: "India", lat: 28.4595, lng: 77.0266 },
  { city: "Ahmedabad", state: "Gujarat", country: "India", lat: 23.0225, lng: 72.5714 },
  { city: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lng: 75.7873 },
  { city: "San Francisco", state: "California", country: "USA", lat: 37.7749, lng: -122.4194 },
  { city: "Austin", state: "Texas", country: "USA", lat: 30.2672, lng: -97.7431 },
  { city: "Detroit", state: "Michigan", country: "USA", lat: 42.3314, lng: -83.0458 },
  { city: "New York", state: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
  { city: "Hamburg", state: "Hamburg", country: "Germany", lat: 53.5511, lng: 9.9937 },
  { city: "Munich", state: "Bavaria", country: "Germany", lat: 48.1351, lng: 11.582 },
  { city: "London", state: "England", country: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { city: "Singapore", state: "Singapore", country: "Singapore", lat: 1.3521, lng: 103.8198 },
  { city: "Tokyo", state: "Tokyo", country: "Japan", lat: 35.6762, lng: 139.6503 },
  { city: "Dubai", state: "Dubai", country: "United Arab Emirates", lat: 25.2048, lng: 55.2708 },
  { city: "Shanghai", state: "Shanghai", country: "China", lat: 31.2304, lng: 121.4737 },
];

export const MOCK_LOCATIONS: MockLocation[] = LOCATION_POOL.map((loc, idx) => ({
  id: `loc-${idx + 1}`,
  slug: slugify(loc.city),
  name: loc.city,
  type: "City",
  country: loc.country,
  state: loc.state,
  city: loc.city,
  businessCount: 12 + ((idx * 7) % 35),
  industries: "Technology, Manufacturing, Automotive, Finance",
  popularCompanies: "Global Tech, Precision Parts, CyberGuard",
}));

// ------------------------------------------------------------
// 3. Technologies
// ------------------------------------------------------------

export const MOCK_TECHNOLOGIES: MockTechnology[] = [
  { id: "tech-1", slug: "artificial-intelligence", name: "Artificial Intelligence", type: "AI", description: "Artificial Intelligence technologies including neural networks, generative AI, and intelligent agents.", providers: "OpenAI,Google,Anthropic,Microsoft", useCases: "Chatbots,Recommendations,Vision,Autonomous Systems", industries: "Software,Automotive,Healthcare,Finance", companyCount: 48 },
  { id: "tech-2", slug: "machine-learning", name: "Machine Learning", type: "AI", description: "Machine Learning algorithms and platforms for predictive analytics and classification.", providers: "TensorFlow,PyTorch,Scikit-learn,Databricks", useCases: "Prediction,Classification,Recommendation,Forecasting", industries: "Finance,Retail,Manufacturing,Healthcare", companyCount: 42 },
  { id: "tech-3", slug: "cloud-computing", name: "Cloud Computing", type: "Cloud", description: "Scalable cloud infrastructure, serverless compute, and distributed storage.", providers: "AWS,Azure,Google Cloud,Oracle Cloud", useCases: "Hosting,Scalability,Disaster Recovery,Enterprise Systems", industries: "Software,Finance,Healthcare,Media", companyCount: 65 },
  { id: "tech-4", slug: "kubernetes", name: "Kubernetes", type: "Platform", description: "Production-grade container orchestration for automated deployment, scaling, and management.", providers: "CNCF,AWS EKS,Google GKE,Azure AKS", useCases: "Container Orchestration,Microservices,CI/CD", industries: "Software,IT,Telecom", companyCount: 38 },
  { id: "tech-5", slug: "blockchain", name: "Blockchain", type: "Platform", description: "Decentralized ledger technology for secure verification and supply chain traceability.", providers: "Ethereum,Hyperledger,Solana,Polygon", useCases: "Smart Contracts,Supply Chain Traceability,Digital Identity", industries: "Finance,Logistics,Real Estate", companyCount: 24 },
  { id: "tech-6", slug: "iot", name: "IoT", type: "Platform", description: "Internet of Things connected devices, industrial sensors, and telemetry telemetry platforms.", providers: "AWS IoT,Azure IoT,Siemens MindSphere,PTC ThingWorx", useCases: "Predictive Maintenance,Smart Factory,Asset Tracking,Fleet Management", industries: "Manufacturing,Logistics,Energy,Agriculture", companyCount: 52 },
  { id: "tech-7", slug: "computer-vision", name: "Computer Vision", type: "AI", description: "Automated visual analysis, optical inspection, and real-time object detection.", providers: "OpenCV,TensorFlow Vision,Roboflow,AWS Rekognition", useCases: "Quality Inspection,Face Recognition,OCR,Autonomous Driving", industries: "Manufacturing,Security,Retail,Healthcare", companyCount: 31 },
  { id: "tech-8", slug: "devops", name: "DevOps", type: "Methodology", providers: "Jenkins,GitLab,GitHub Actions,Terraform", useCases: "CI/CD,Automation,Monitoring,Infrastructure as Code", industries: "Software,IT,Finance", companyCount: 45, description: "DevOps pipelines and cloud automation methodologies." },
  { id: "tech-9", slug: "microservices", name: "Microservices", type: "Architecture", providers: "Spring Boot,Node.js,Go,gRPC", useCases: "Scalable Applications,API Gateway,Event-Driven Architecture", industries: "Software,Finance,E-Commerce", companyCount: 50, description: "Microservices architectures and API platforms." },
  { id: "tech-10", slug: "generative-ai", name: "Generative AI", type: "AI", providers: "OpenAI,Anthropic,Mistral,Meta Llama", useCases: "Content Generation,Code Assistance,Enterprise Chatbots,Search Synthesis", industries: "Marketing,Software,Customer Service,Legal", companyCount: 55, description: "LLMs and generative foundational models." },
  { id: "tech-11", slug: "robotics", name: "Robotics", type: "Automation", providers: "ABB,Fanuc,KUKA,Yaskawa", useCases: "Welding,Assembly,Material Handling,Palletizing", industries: "Manufacturing,Automotive,Aerospace,Logistics", companyCount: 36, description: "Industrial robotics and collaborative cobots." },
  { id: "tech-12", slug: "erp", name: "ERP", type: "Software", providers: "SAP,Oracle,Microsoft Dynamics,Zoho ERP", useCases: "Resource Planning,Finance,Inventory,Procurement", industries: "Manufacturing,Retail,Healthcare,Wholesale", companyCount: 70, description: "Enterprise Resource Planning systems." },
  { id: "tech-13", slug: "crm", name: "CRM", type: "Software", providers: "Salesforce,HubSpot,Zoho CRM,Zendesk", useCases: "Sales Management,Customer Service,Lead Tracking,Marketing Automation", industries: "Software,Finance,Retail,Professional Services", companyCount: 62, description: "Customer Relationship Management solutions." },
  { id: "tech-14", slug: "cybersecurity", name: "Cybersecurity", type: "Security", providers: "CrowdStrike,Palo Alto,Fortinet,Cloudflare", useCases: "Threat Protection,SIEM,Zero Trust,Endpoint Security", industries: "Finance,Government,Healthcare,Technology", companyCount: 58, description: "Comprehensive enterprise security and threat detection." },
  { id: "tech-15", slug: "big-data", name: "Big Data", type: "Data", providers: "Apache Spark,Snowflake,Databricks,BigQuery", useCases: "Analytics,Data Warehousing,ETL Pipelines,Customer Insights", industries: "Finance,Retail,Healthcare,Telecom", companyCount: 44, description: "Big data infrastructure and analytics pipelines." },
  { id: "tech-16", slug: "5g", name: "5G", type: "Network", providers: "Ericsson,Nokia,Qualcomm,Cisco", useCases: "High-speed Mobile,Low Latency,Private Networks,IoT Connectivity", industries: "Telecom,Automotive,Smart Cities", companyCount: 28, description: "Next-generation cellular and private 5G networks." },
  { id: "tech-17", slug: "augmented-reality", name: "Augmented Reality", type: "AR/VR", providers: "Apple,Microsoft HoloLens,Meta,Unity", useCases: "Field Training,Remote Assistance,Architectural Visualization", industries: "Manufacturing,Healthcare,Retail,Architecture", companyCount: 22, description: "Spatial computing and augmented reality interfaces." },
  { id: "tech-18", slug: "3d-printing", name: "3D Printing", type: "Additive", providers: "Stratasys,3D Systems,Carbon,EOS", useCases: "Rapid Prototyping,Custom Parts,Production Tooling,Medical Implants", industries: "Manufacturing,Aerospace,Healthcare,Automotive", companyCount: 26, description: "Additive manufacturing and industrial 3D printing." },
  { id: "tech-19", slug: "solar-power", name: "Solar Power", type: "Energy", providers: "First Solar,SunPower,Trina Solar,Enphase", useCases: "Clean Power Generation,Rooftop Solar,Industrial Microgrids", industries: "Energy,Construction,Manufacturing", companyCount: 34, description: "Photovoltaic energy solutions and solar storage." },
  { id: "tech-20", slug: "electric-vehicles", name: "Electric Vehicles", type: "Mobility", providers: "Tesla,BYD,Rivian,ABB E-Mobility", useCases: "Passenger EVs,Commercial Fleet Electrification,EV Charging Infrastructure", industries: "Automotive,Transportation,Energy", companyCount: 40, description: "Electric mobility and charging infrastructure." },
];

// ------------------------------------------------------------
// 4. Build Industries, Companies, Products, Services from Taxonomy
// ------------------------------------------------------------

const BUSINESS_TYPES = [
  "Manufacturer",
  "Supplier",
  "Distributor",
  "Wholesaler",
  "Service Provider",
  "Consultant",
  "Startup",
  "Enterprise",
];

const BUSINESS_SIZES = ["Startup", "Small", "Medium", "Large", "Enterprise"];
const EMPLOYEE_RANGES = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const CERTIFICATIONS = [
  "ISO 9001",
  "ISO 14001",
  "ISO 27001",
  "ISO 45001",
  "Six Sigma",
  "CE Marking",
  "RoHS",
  "UL Listed",
  "GMP",
  "NABL",
];

export const MOCK_INDUSTRIES: MockIndustry[] = [];
export const MOCK_COMPANIES: MockCompany[] = [];
export const MOCK_PRODUCTS: MockProduct[] = [];
export const MOCK_SERVICES: MockService[] = [];

let companyIdx = 0;
let productIdx = 0;
let serviceIdx = 0;

for (const eco of ecosystems) {
  for (const sector of eco.categories) {
    // Sector-level industry
    MOCK_INDUSTRIES.push({
      id: `ind-${MOCK_INDUSTRIES.length + 1}`,
      slug: slugify(sector.name),
      name: sector.name,
      description: sector.description,
      ecosystemId: eco.id,
      sectorId: sector.id,
      categoryCount: sector.categories.length,
      companyCount: 15,
      productCount: 25,
      serviceCount: 20,
      technologyCount: 4,
    });

    for (const subcat of sector.categories) {
      // Category-level industry
      MOCK_INDUSTRIES.push({
        id: `ind-${MOCK_INDUSTRIES.length + 1}`,
        slug: slugify(subcat.name),
        name: subcat.name,
        description: subcat.description,
        ecosystemId: eco.id,
        sectorId: sector.id,
        categoryId: subcat.id,
        categoryCount: 0,
        companyCount: 8,
        productCount: subcat.products.length * 3,
        serviceCount: subcat.services.length * 3,
        technologyCount: 3,
      });

      const profileCompanies = subcat.businessProfiles || [];
      const extraCount = 2;
      const totalToCreate = profileCompanies.length + extraCount;

      for (let i = 0; i < totalToCreate; i++) {
        companyIdx++;
        const isProfile = i < profileCompanies.length;
        const profile = isProfile ? profileCompanies[i] : null;
        const name = profile?.name ?? `${subcat.name} ${["Solutions", "Industries", "Systems", "Labs", "Technologies", "Group", "Global"][companyIdx % 7]}`;
        const loc = LOCATION_POOL[(companyIdx * 3) % LOCATION_POOL.length];
        const bType = isProfile ? profile!.type : BUSINESS_TYPES[companyIdx % BUSINESS_TYPES.length];
        const isVerified = companyIdx % 3 !== 0;
        const companyId = `comp-${companyIdx}`;
        const companySlug = `${slugify(name)}-${slugify(loc.city)}-${companyIdx}`;

        const companyObj: MockCompany = {
          id: companyId,
          slug: companySlug,
          name,
          logoUrl: null,
          verified: isVerified,
          claimed: companyIdx % 2 === 0,
          registered: true,
          pendingVerification: !isVerified && companyIdx % 5 === 0,
          businessType: bType,
          businessSize: BUSINESS_SIZES[companyIdx % BUSINESS_SIZES.length],
          establishedYear: 1990 + (companyIdx % 33),
          ecosystemId: eco.id,
          sectorId: sector.id,
          categoryId: subcat.id,
          industryName: sector.name,
          categoryName: subcat.name,
          description: `${name} is a leading ${bType.toLowerCase()} in the ${subcat.name} sector, part of the ${eco.name} ecosystem. We deliver high-quality ${subcat.name.toLowerCase()} solutions to clients across ${loc.country} and global markets.`,
          website: `https://${slugify(name)}.com`,
          email: `contact@${slugify(name)}.com`,
          phone: `+1-555-01${String(companyIdx).padStart(3, "0")}`,
          country: loc.country,
          state: loc.state,
          city: loc.city,
          district: `${loc.city} Central`,
          postalCode: String(100000 + ((companyIdx * 987) % 899999)),
          latitude: loc.lat,
          longitude: loc.lng,
          address: `${100 + companyIdx} Business Boulevard, ${loc.city}`,
          businessHours: "Mon-Fri: 9:00 AM - 6:00 PM",
          employeeRange: EMPLOYEE_RANGES[companyIdx % EMPLOYEE_RANGES.length],
          annualRevenue: ["$1M-$10M", "$10M-$50M", "$50M-$200M", "$200M-$1B", "$1B+"][companyIdx % 5],
          industriesServed: [sector.name, subcat.name, eco.shortName].join(", "),
          marketsServed: ["India", "USA", "Europe", "Middle East", "Asia Pacific", "Latin America"].slice(0, 3).join(", "),
          certifications: CERTIFICATIONS.slice(0, (companyIdx % 3) + 1).join(", "),
          foundedYear: 1990 + (companyIdx % 33),
          socialLinks: JSON.stringify({
            linkedin: `https://linkedin.com/company/${slugify(name)}`,
            twitter: `https://twitter.com/${slugify(name)}`,
          }),
          rating: 4.0 + ((companyIdx % 10) / 10),
          reviewCount: 15 + ((companyIdx * 13) % 200),
          productCount: subcat.products.length,
          serviceCount: subcat.services.length,
          views: 350 + ((companyIdx * 89) % 5000),
          popularity: (companyIdx % 100) / 100,
        };

        MOCK_COMPANIES.push(companyObj);

        // Products
        for (const p of subcat.products) {
          productIdx++;
          MOCK_PRODUCTS.push({
            id: `prod-${productIdx}`,
            slug: `${slugify(p.name)}-${companyIdx}-${productIdx}`,
            name: p.name,
            description: p.description,
            companyId: companyId,
            companyName: name,
            category: subcat.name,
            subcategory: sector.name,
            brand: name,
            specifications: JSON.stringify({ material: "Industrial Grade", warranty: "12-24 months" }),
            moq: ["1 unit", "10 units", "100 units", "Custom Batch"][productIdx % 4],
            priceRange: ["$100-$500", "$500-$5K", "$5K-$50K", "Contact for Quote"][productIdx % 4],
            currency: "USD",
            availability: ["In Stock", "Made to Order", "Lead Time: 2-4 Weeks"][productIdx % 3],
            exporter: productIdx % 2 === 0,
            country: loc.country,
            state: loc.state,
            city: loc.city,
            imageUrl: null,
          });
        }

        // Services
        for (const s of subcat.services) {
          serviceIdx++;
          MOCK_SERVICES.push({
            id: `serv-${serviceIdx}`,
            slug: `${slugify(s.name)}-${companyIdx}-${serviceIdx}`,
            name: s.name,
            description: s.description,
            companyId: companyId,
            companyName: name,
            category: subcat.name,
            industryServed: sector.name,
            coverage: ["Local", "National", "Global", "Regional"][serviceIdx % 4],
            pricingModel: ["Hourly Rate", "Fixed Milestone", "Annual Contract", "Custom Quote"][serviceIdx % 4],
            availability: "Available",
            country: loc.country,
            state: loc.state,
            city: loc.city,
          });
        }
      }
    }
  }
}

// ------------------------------------------------------------
// 5. In-Memory Search History
// ------------------------------------------------------------

export interface MockSavedSearch {
  id: string;
  query: string;
  created_at: string;
}

const IN_MEMORY_SAVED_SEARCHES: MockSavedSearch[] = [
  { id: "save-1", query: "CNC Machining Manufacturers in India", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "save-2", query: "AI Software Companies in San Francisco", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "save-3", query: "Industrial Robotics Automation Suppliers", created_at: new Date(Date.now() - 172800000).toISOString() },
];

export function getMockSavedSearches(): MockSavedSearch[] {
  return [...IN_MEMORY_SAVED_SEARCHES];
}

export function saveMockSearch(query: string): MockSavedSearch {
  const item: MockSavedSearch = {
    id: `save-${Date.now()}`,
    query,
    created_at: new Date().toISOString(),
  };
  IN_MEMORY_SAVED_SEARCHES.unshift(item);
  if (IN_MEMORY_SAVED_SEARCHES.length > 50) IN_MEMORY_SAVED_SEARCHES.pop();
  return item;
}

// ------------------------------------------------------------
// 6. Business Profile Lookup
// ------------------------------------------------------------

export interface BusinessProfileData {
  company: {
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
  };
  products: {
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
  }[];
  services: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    industry_served: string | null;
    coverage: string | null;
    pricing_model: string | null;
  }[];
  related_companies: {
    id: string;
    slug: string;
    name: string;
    verified: boolean;
    business_type: string;
    city: string | null;
    rating: number;
  }[];
}

export function getMockBusinessProfile(slug: string): BusinessProfileData | null {
  const company = MOCK_COMPANIES.find((c) => c.slug === slug || c.id === slug) || MOCK_COMPANIES[0];
  if (!company) return null;

  const products = MOCK_PRODUCTS.filter((p) => p.companyId === company.id).map((p) => ({
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

  const services = MOCK_SERVICES.filter((s) => s.companyId === company.id).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    description: s.description,
    category: s.category,
    industry_served: s.industryServed,
    coverage: s.coverage,
    pricing_model: s.pricingModel,
  }));

  const related = MOCK_COMPANIES.filter(
    (c) => c.id !== company.id && (c.categoryId === company.categoryId || c.ecosystemId === company.ecosystemId)
  )
    .slice(0, 5)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      verified: c.verified,
      business_type: c.businessType,
      city: c.city,
      rating: c.rating,
    }));

  let socialLinks: Record<string, string> | null = null;
  try {
    socialLinks = JSON.parse(company.socialLinks);
  } catch {
    socialLinks = null;
  }

  return {
    company: {
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
      industries_served: company.industriesServed.split(",").map((s) => s.trim()).filter(Boolean),
      markets_served: company.marketsServed.split(",").map((s) => s.trim()).filter(Boolean),
      certifications: company.certifications.split(",").map((s) => s.trim()).filter(Boolean),
      founded_year: company.foundedYear,
      social_links: socialLinks,
      rating: company.rating,
      review_count: company.reviewCount,
      product_count: products.length,
      service_count: services.length,
      views: company.views,
    },
    products,
    services,
    related_companies: related,
  };
}

// ------------------------------------------------------------
// 7. Suggestions Lookup
// ------------------------------------------------------------

export interface MockSuggestion {
  label: string;
  type: "query" | "company" | "product" | "service" | "industry" | "technology" | "location";
  slug?: string;
  description?: string;
}

export function getMockSuggestions(q: string): MockSuggestion[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];

  const out: MockSuggestion[] = [];
  const seen = new Set<string>();

  const push = (s: MockSuggestion) => {
    const key = `${s.type}:${s.label.toLowerCase()}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };

  // 1. Companies
  for (const c of MOCK_COMPANIES) {
    if (c.name.toLowerCase().includes(query) || c.industryName.toLowerCase().includes(query)) {
      push({ label: c.name, type: "company", slug: c.slug, description: c.industryName });
      if (out.length >= 3) break;
    }
  }

  // 2. Products
  for (const p of MOCK_PRODUCTS) {
    if (p.name.toLowerCase().includes(query)) {
      push({ label: p.name, type: "product", slug: p.slug, description: p.category });
      if (out.length >= 6) break;
    }
  }

  // 3. Services
  for (const s of MOCK_SERVICES) {
    if (s.name.toLowerCase().includes(query)) {
      push({ label: s.name, type: "service", slug: s.slug, description: s.category });
      if (out.length >= 8) break;
    }
  }

  // 4. Industries
  for (const ind of MOCK_INDUSTRIES) {
    if (ind.name.toLowerCase().includes(query)) {
      push({ label: ind.name, type: "industry", slug: ind.slug, description: ind.description });
      if (out.length >= 9) break;
    }
  }

  // 5. Technologies
  for (const tech of MOCK_TECHNOLOGIES) {
    if (tech.name.toLowerCase().includes(query)) {
      push({ label: tech.name, type: "technology", slug: tech.slug, description: tech.type });
      if (out.length >= 10) break;
    }
  }

  // 6. Query expansions
  const suffixes = ["Manufacturers", "Suppliers", "Services", "Companies"];
  for (const suf of suffixes) {
    if (out.length >= 10) break;
    push({ label: `${q} ${suf}`, type: "query" });
  }

  return out.slice(0, 10);
}
