// ============================================================
// WEBUOS Search Engine Seed Data
// Generates Companies, Products, Services, Industries,
// Technologies, Locations based on the taxonomy
// ============================================================

import { PrismaClient } from "@prisma/client";
import { ecosystems } from "../src/data/taxonomy";

const db = new PrismaClient();

// Slugify helper
function slug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Location pool to enrich company records
const locationPool = [
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

const businessTypes = [
  "Manufacturer",
  "Supplier",
  "Distributor",
  "Wholesaler",
  "Service Provider",
  "Consultant",
  "Startup",
  "Enterprise",
];

const businessSizes = ["Startup", "Small", "Medium", "Large", "Enterprise"];
const employeeRanges = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const certifications = [
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

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function takeRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

async function main() {
  console.log("🚀 Seeding WEBUOS search engine data...");

  // Clean up
  await db.searchEvent.deleteMany();
  await db.savedBusiness.deleteMany();
  await db.searchSynonym.deleteMany();
  await db.searchHistory.deleteMany();
  await db.product.deleteMany();
  await db.service.deleteMany();
  await db.company.deleteMany();
  await db.industry.deleteMany();
  await db.technology.deleteMany();
  await db.location.deleteMany();
  await db.user.deleteMany();

  // -----------------------------------------------------------
  // 1. Synonyms (for query understanding)
  // -----------------------------------------------------------
  const synonyms = [
    { term: "IT", synonyms: "Information Technology,Tech,Software" },
    { term: "AI", synonyms: "Artificial Intelligence,Machine Learning,ML,Intelligence" },
    { term: "ML", synonyms: "Machine Learning,AI,Artificial Intelligence" },
    { term: "ERP", synonyms: "Enterprise Resource Planning,Enterprise Software" },
    { term: "B2B", synonyms: "Business to Business,Wholesale,Trade" },
    { term: "Manufacturer", synonyms: "Manufacturing Company,Producer,Fabricator,OEM" },
    { term: "Supplier", synonyms: "Vendor,Distributor,Wholesaler,Trader" },
    { term: "Company", synonyms: "Business,Organization,Firm,Enterprise" },
    { term: "SaaS", synonyms: "Software as a Service,Cloud Software,Subscription Software" },
    { term: "CNC", synonyms: "Computer Numerical Control,Machining,Automated Machining" },
    { term: "EV", synonyms: "Electric Vehicle,Electric Mobility,Battery Vehicle" },
    { term: "IoT", synonyms: "Internet of Things,Connected Devices,Smart Devices" },
    { term: "CRM", synonyms: "Customer Relationship Management,Sales Software" },
    { term: "Cybersecurity", synonyms: "Cyber Security,Information Security,InfoSec" },
    { term: "Cloud", synonyms: "Cloud Computing,Cloud Services,Cloud Infrastructure" },
  ];
  for (const s of synonyms) {
    await db.searchSynonym.create({ data: s });
  }
  console.log(`✓ Created ${synonyms.length} synonyms`);

  // -----------------------------------------------------------
  // 2. Locations
  // -----------------------------------------------------------
  const locationSet = new Map<string, typeof locationPool[number] & { type: string }>();
  for (const loc of locationPool) {
    const citySlug = slug(loc.city);
    locationSet.set(citySlug, { ...loc, type: "City" });
    if (loc.state && !locationSet.has(slug(loc.state))) {
      locationSet.set(slug(loc.state), { ...loc, city: loc.state, type: "State" });
    }
    if (!locationSet.has(slug(loc.country))) {
      locationSet.set(slug(loc.country), { ...loc, city: loc.country, type: "Country" });
    }
  }
  const locations: { id: string; name: string; type: string; country: string | null; state: string | null; city: string | null }[] = [];
  for (const loc of locationSet.values()) {
    const created = await db.location.create({
      data: {
        slug: slug(loc.city),
        name: loc.city,
        type: loc.type,
        country: loc.country,
        state: loc.state,
        city: loc.city,
        businessCount: 0,
        industries: "",
        popularCompanies: "",
      },
    });
    locations.push(created);
  }
  console.log(`✓ Created ${locations.length} locations`);

  // -----------------------------------------------------------
  // 3. Industries (from taxonomy categories)
  // -----------------------------------------------------------
  let industryCount = 0;
  for (const eco of ecosystems) {
    for (const sector of eco.categories) {
      await db.industry.create({
        data: {
          slug: slug(sector.name),
          name: sector.name,
          description: sector.description,
          ecosystemId: eco.id,
          sectorId: sector.id,
          categoryCount: sector.categories.length,
          companyCount: 0,
          productCount: 0,
          serviceCount: 0,
          technologyCount: 0,
        },
      });
      industryCount++;
      // Industries at the subcategory level too
      for (const subcat of sector.categories) {
        await db.industry.create({
          data: {
            slug: slug(subcat.name),
            name: subcat.name,
            description: subcat.description,
            ecosystemId: eco.id,
            sectorId: sector.id,
            categoryId: subcat.id,
            categoryCount: 0,
            companyCount: 0,
            productCount: 0,
            serviceCount: 0,
            technologyCount: 0,
          },
        });
        industryCount++;
      }
    }
  }
  console.log(`✓ Created ${industryCount} industries`);

  // -----------------------------------------------------------
  // 4. Technologies
  // -----------------------------------------------------------
  const technologies = [
    { name: "Artificial Intelligence", type: "AI", providers: "OpenAI,Google,Anthropic", useCases: "Chatbots,Recommendations,Vision", industries: "Software,Automotive,Healthcare" },
    { name: "Machine Learning", type: "AI", providers: "TensorFlow,PyTorch,Scikit-learn", useCases: "Prediction,Classification,Recommendation", industries: "Finance,Retail,Manufacturing" },
    { name: "Cloud Computing", type: "Cloud", providers: "AWS,Azure,Google Cloud", useCases: "Hosting,Scalability,Disaster Recovery", industries: "Software,Finance,Healthcare" },
    { name: "Kubernetes", type: "Platform", providers: "CNCF,AWS,Google", useCases: "Container Orchestration,Microservices", industries: "Software,IT" },
    { name: "Blockchain", type: "Platform", providers: "Ethereum,Hyperledger,Solana", useCases: "Smart Contracts,Supply Chain Traceability", industries: "Finance,Logistics" },
    { name: "IoT", type: "Platform", providers: "AWS IoT,Azure IoT,Google Cloud IoT", useCases: "Predictive Maintenance,Smart Factory,Asset Tracking", industries: "Manufacturing,Logistics,Energy" },
    { name: "Computer Vision", type: "AI", providers: "OpenCV,TensorFlow,PyTorch", useCases: "Quality Inspection,Face Recognition,OCR", industries: "Manufacturing,Security,Retail" },
    { name: "DevOps", type: "Methodology", providers: "Jenkins,GitLab,GitHub Actions", useCases: "CI/CD,Automation,Monitoring", industries: "Software,IT" },
    { name: "Microservices", type: "Architecture", providers: "Spring Boot,.NET Core,Node.js", useCases: "Scalable Applications,API Gateway", industries: "Software,Finance" },
    { name: "Generative AI", type: "AI", providers: "OpenAI,Anthropic,Mistral", useCases: "Content Generation,Code Assistance,Chatbots", industries: "Marketing,Software,Customer Service" },
    { name: "Robotics", type: "Automation", providers: "ABB,Fanuc,KUKA", useCases: "Welding,Assembly,Material Handling", industries: "Manufacturing,Automotive,Aerospace" },
    { name: "ERP", type: "Software", providers: "SAP,Oracle,Microsoft", useCases: "Resource Planning,Finance,Inventory", industries: "Manufacturing,Retail,Healthcare" },
    { name: "CRM", type: "Software", providers: "Salesforce,HubSpot,Zoho", useCases: "Sales Management,Customer Service,Marketing", industries: "Software,Finance,Retail" },
    { name: "Cybersecurity", type: "Security", providers: "CrowdStrike,Palo Alto,Fortinet", useCases: "Threat Protection,SIEM,Endpoint Security", industries: "Finance,Government,Healthcare" },
    { name: "Big Data", type: "Data", providers: "Hadoop,Spark,Databricks", useCases: "Analytics,Data Warehousing,ETL", industries: "Finance,Retail,Healthcare" },
    { name: "5G", type: "Network", providers: "Ericsson,Nokia,Huawei", useCases: "High-speed Mobile,Low Latency,IoT Connectivity", industries: "Telecom,Automotive" },
    { name: "Augmented Reality", type: "AR/VR", providers: "Microsoft,Apple,Meta", useCases: "Training,Remote Assistance,Marketing", industries: "Manufacturing,Healthcare,Retail" },
    { name: "3D Printing", type: "Additive", providers: "Stratasys,3D Systems,Carbon", useCases: "Prototyping,Custom Parts,Tooling", industries: "Manufacturing,Aerospace,Healthcare" },
    { name: "Solar Power", type: "Energy", providers: "First Solar,SunPower,Trina Solar", useCases: "Power Generation,Rooftop Solar,Solar Farms", industries: "Energy,Construction" },
    { name: "Electric Vehicles", type: "Mobility", providers: "Tesla,BYD,Rivian", useCases: "Passenger EVs,Commercial EVs,Charging", industries: "Automotive,Energy" },
  ];
  let techCount = 0;
  for (const t of technologies) {
    await db.technology.create({
      data: {
        slug: slug(t.name),
        name: t.name,
        type: t.type,
        description: `${t.name} is a ${t.type} technology used for ${t.useCases}.`,
        providers: t.providers,
        useCases: t.useCases,
        industries: t.industries,
        companyCount: Math.floor(Math.random() * 50) + 5,
      },
    });
    techCount++;
  }
  console.log(`✓ Created ${techCount} technologies`);

  // -----------------------------------------------------------
  // 5. Companies, Products, Services from taxonomy
  // -----------------------------------------------------------
  let companyCount = 0;
  let productCount = 0;
  let serviceCount = 0;
  const locBusinessCount: Record<string, number> = {};

  for (const eco of ecosystems) {
    for (const sector of eco.categories) {
      for (const subcat of sector.categories) {
        const profileCompanies = subcat.businessProfiles;
        const extraCount = 2;
        const totalToCreate = profileCompanies.length + extraCount;

        for (let i = 0; i < totalToCreate; i++) {
          const isProfile = i < profileCompanies.length;
          const profile = isProfile ? profileCompanies[i] : null;
          const name = profile?.name ?? `${subcat.name} ${["Solutions", "Industries", "Systems", "Labs", "Technologies", "Group", "Worldwide"][i % 7]}`;
          const loc = pickRandom(locationPool);
          const locKey = slug(loc.city);
          locBusinessCount[locKey] = (locBusinessCount[locKey] ?? 0) + 1;

          const bType = isProfile ? profile!.type : pickRandom(businessTypes);
          const isVerified = Math.random() > 0.4;
          const companySlug = `${slug(name)}-${slug(loc.city)}-${companyCount + 1}`;

          const company = await db.company.create({
            data: {
              slug: companySlug,
              name,
              logoUrl: null,
              verified: isVerified,
              claimed: Math.random() > 0.6,
              registered: true,
              pendingVerification: !isVerified && Math.random() > 0.5,
              businessType: bType,
              businessSize: pickRandom(businessSizes),
              establishedYear: 1980 + Math.floor(Math.random() * 44),
              ecosystemId: eco.id,
              sectorId: sector.id,
              categoryId: subcat.id,
              industryName: sector.name,
              categoryName: subcat.name,
              description: `${name} is a leading ${bType.toLowerCase()} in the ${subcat.name} sector, part of the ${eco.name} ecosystem. We deliver high-quality ${subcat.name.toLowerCase()} solutions to clients across ${loc.country} and global markets.`,
              website: `https://${slug(name)}.com`,
              email: `contact@${slug(name)}.com`,
              phone: `+1-555-01${String(companyCount).padStart(3, "0")}`,
              country: loc.country,
              state: loc.state,
              city: loc.city,
              district: `${loc.city} Central`,
              postalCode: String(100000 + Math.floor(Math.random() * 899999)),
              latitude: loc.lat,
              longitude: loc.lng,
              address: `${100 + i} Business Avenue, ${loc.city}`,
              businessHours: "Mon-Fri: 9:00 AM - 6:00 PM",
              employeeRange: pickRandom(employeeRanges),
              annualRevenue: pickRandom(["$1M-$10M", "$10M-$50M", "$50M-$200M", "$200M-$1B", "$1B+"]),
              industriesServed: [sector.name, subcat.name, eco.shortName].join(","),
              marketsServed: takeRandom(["India", "USA", "Europe", "Middle East", "Asia Pacific", "Africa"], 3).join(","),
              certifications: takeRandom(certifications, Math.floor(Math.random() * 3) + 1).join(","),
              foundedYear: 1980 + Math.floor(Math.random() * 44),
              socialLinks: JSON.stringify({
                linkedin: `https://linkedin.com/company/${slug(name)}`,
                twitter: `https://twitter.com/${slug(name)}`,
              }),
              rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
              reviewCount: Math.floor(Math.random() * 250) + 5,
              views: Math.floor(Math.random() * 5000) + 100,
              popularity: Math.random(),
            },
          });
          companyCount++;

          // Products
          for (const p of subcat.products) {
            await db.product.create({
              data: {
                slug: `${slug(p.name)}-${companyCount}-${productCount + 1}`,
                name: p.name,
                description: p.description,
                companyId: company.id,
                category: subcat.name,
                subcategory: sector.name,
                brand: name,
                specifications: JSON.stringify({ material: "Premium Grade", warranty: "12 months" }),
                moq: ["1 unit", "10 units", "100 units", "1 ton"][productCount % 4],
                priceRange: ["$100-$500", "$500-$5K", "$5K-$50K", "Quote on Request"][productCount % 4],
                currency: "USD",
                availability: ["In Stock", "Made to Order", "Pre-Order"][productCount % 3],
                exporter: Math.random() > 0.5,
                country: loc.country,
                state: loc.state,
                city: loc.city,
              },
            });
            productCount++;
          }

          // Services
          for (const s of subcat.services) {
            await db.service.create({
              data: {
                slug: `${slug(s.name)}-${companyCount}-${serviceCount + 1}`,
                name: s.name,
                description: s.description,
                companyId: company.id,
                category: subcat.name,
                industryServed: sector.name,
                coverage: pickRandom(["Local", "National", "Global"]),
                pricingModel: pickRandom(["Hourly", "Fixed", "Subscription", "Quote"]),
                availability: "Available",
                country: loc.country,
                state: loc.state,
                city: loc.city,
              },
            });
            serviceCount++;
          }

          await db.company.update({
            where: { id: company.id },
            data: {
              productCount: subcat.products.length,
              serviceCount: subcat.services.length,
            },
          });
        }
      }
    }
  }
  console.log(`✓ Created ${companyCount} companies`);
  console.log(`✓ Created ${productCount} products`);
  console.log(`✓ Created ${serviceCount} services`);

  // -----------------------------------------------------------
  // 6. Update location business counts
  // -----------------------------------------------------------
  for (const loc of locations) {
    const cnt = locBusinessCount[slug(loc.name)] ?? 0;
    await db.location.update({
      where: { id: loc.id },
      data: { businessCount: cnt },
    });
  }

  // -----------------------------------------------------------
  // 7. Update industry company/product/service counts
  // -----------------------------------------------------------
  const allIndustries = await db.industry.findMany();
  for (const ind of allIndustries) {
    const companies = await db.company.count({
      where: {
        OR: [
          { industryName: ind.name },
          { categoryName: ind.name },
        ],
      },
    });
    const products = await db.product.count({
      where: { OR: [{ category: ind.name }, { subcategory: ind.name }] },
    });
    const services = await db.service.count({
      where: { OR: [{ category: ind.name }, { industryServed: ind.name }] },
    });
    await db.industry.update({
      where: { id: ind.id },
      data: {
        companyCount: companies,
        productCount: products,
        serviceCount: services,
      },
    });
  }

  // -----------------------------------------------------------
  // 8. Seed user
  // -----------------------------------------------------------
  await db.user.create({
    data: {
      email: "demo@webuos.com",
      name: "WEBUOS Demo User",
    },
  });

  console.log("\n✅ WEBUOS search engine seed complete!");
  console.log(`   - ${synonyms.length} synonyms`);
  console.log(`   - ${locations.length} locations`);
  console.log(`   - ${industryCount} industries`);
  console.log(`   - ${techCount} technologies`);
  console.log(`   - ${companyCount} companies`);
  console.log(`   - ${productCount} products`);
  console.log(`   - ${serviceCount} services`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
