// ============================================================
// WEBUOS Business Taxonomy Data
// Interconnected hierarchy: Ecosystem → Core Sector → Category
// Each Category has Related Products, Services, and Business Profiles
// ============================================================

export interface BusinessProfile {
  name: string;
  type: string;
  location: string;
}

export interface ProductOrService {
  name: string;
  type: "product" | "service";
  description: string;
}

export interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  products: ProductOrService[];
  services: ProductOrService[];
  businessProfiles: BusinessProfile[];
}

export interface CoreSector {
  id: string;
  code: string;
  number: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  categories: Category[];
}

export interface Ecosystem {
  id: string;
  code: string;
  number: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  accent: "gold" | "blue" | "purple";
  image: string;
  categories: CoreSector[];
}

// ============================================================
// ECOSYSTEM 01: INDUSTRIAL ENGINEERING & MANUFACTURING
// ============================================================

const industrial: Ecosystem = {
  id: "industrial",
  code: "IEM",
  number: "01",
  name: "Industrial Engineering & Manufacturing",
  shortName: "Industrial",
  tagline: "Build • Produce • Operate",
  description: "Industries involved in engineering, manufacturing, industrial production, physical products, infrastructure, machinery, energy, transportation, materials, automation, and the physical economy.",
  icon: "Factory",
  accent: "gold",
  image: "/segment-industrial.jpg",
  categories: [
    {
      id: "manufacturing-production",
      code: "IEM-01",
      number: "01",
      name: "Manufacturing & Production",
      description: "Discrete and process manufacturing, fabrication, and production operations.",
      icon: "Factory",
      color: "amber",
      categories: [
        {
          id: "discrete-manufacturing",
          code: "IEM-01-001",
          name: "Discrete Manufacturing",
          description: "Production of distinct items such as parts, assemblies, and finished goods.",
          products: [
            { name: "CNC Machined Components", type: "product", description: "Precision-machined metal and plastic parts." },
            { name: "Assembled Units", type: "product", description: "Finished assembled products and sub-assemblies." },
            { name: "Production Tooling", type: "product", description: "Jigs, fixtures, dies, and molds." },
          ],
          services: [
            { name: "Contract Manufacturing", type: "service", description: "OEM and ODM contract production services." },
            { name: "Production Planning", type: "service", description: "Scheduling, capacity planning, and workflow optimization." },
          ],
          businessProfiles: [
            { name: "Precision Parts Ltd", type: "Contract Manufacturer", location: "Pune, India" },
            { name: "Global Assemblies Inc", type: "OEM Manufacturer", location: "Detroit, USA" },
          ],
        },
        {
          id: "process-manufacturing",
          code: "IEM-01-002",
          name: "Process Manufacturing",
          description: "Production using formulas/recipes — chemicals, food, beverages, pharma.",
          products: [
            { name: "Industrial Chemicals", type: "product", description: "Bulk and specialty chemical products." },
            { name: "Processed Food Products", type: "product", description: "Packaged food and beverage products." },
          ],
          services: [
            { name: "Batch Production", type: "service", description: "Formula-based batch manufacturing services." },
            { name: "Quality Testing", type: "service", description: "Lab testing and certification services." },
          ],
          businessProfiles: [
            { name: "ChemProcess Industries", type: "Chemical Manufacturer", location: "Gujarat, India" },
          ],
        },
        {
          id: "additive-manufacturing",
          code: "IEM-01-003",
          name: "Additive Manufacturing",
          description: "3D printing and rapid prototyping for industrial applications.",
          products: [
            { name: "3D Printed Prototypes", type: "product", description: "Rapid prototypes in metal and polymer." },
            { name: "Custom Tooling", type: "product", description: "Additively manufactured jigs and fixtures." },
          ],
          services: [
            { name: "Design for Additive", type: "service", description: "DfAM consulting and optimization services." },
            { name: "Prototyping Services", type: "service", description: "On-demand 3D printing services." },
          ],
          businessProfiles: [
            { name: "AdditiveTech Solutions", type: "3D Printing Service", location: "Bengaluru, India" },
          ],
        },
      ],
    },
    {
      id: "energy-utilities",
      code: "IEM-02",
      number: "02",
      name: "Energy & Utilities",
      description: "Power generation, renewable energy, oil & gas, and utility infrastructure.",
      icon: "Zap",
      color: "orange",
      categories: [
        {
          id: "renewable-energy",
          code: "IEM-02-001",
          name: "Renewable Energy",
          description: "Solar, wind, hydro, and other clean energy generation.",
          products: [
            { name: "Solar Panels", type: "product", description: "Monocrystalline and polycrystalline PV modules." },
            { name: "Wind Turbines", type: "product", description: "Onshore and offshore wind turbine systems." },
            { name: "Inverters", type: "product", description: "String and central solar inverters." },
          ],
          services: [
            { name: "EPC Services", type: "service", description: "Engineering, procurement, and construction for solar/wind plants." },
            { name: "O&M Services", type: "service", description: "Operations and maintenance for renewable plants." },
          ],
          businessProfiles: [
            { name: "SolarTech Energy", type: "Solar EPC", location: "Jaipur, India" },
            { name: "WindPower Systems", type: "Turbine Manufacturer", location: "Hamburg, Germany" },
          ],
        },
        {
          id: "oil-gas",
          code: "IEM-02-002",
          name: "Oil & Gas",
          description: "Upstream, midstream, and downstream oil & gas operations.",
          products: [
            { name: "Refined Petroleum Products", type: "product", description: "Gasoline, diesel, jet fuel, and lubricants." },
            { name: "Pipeline Equipment", type: "product", description: "Pipes, valves, and pressure vessels." },
          ],
          services: [
            { name: "Drilling Services", type: "service", description: "Onshore and offshore drilling operations." },
            { name: "Refinery Maintenance", type: "service", description: "Turnaround and maintenance services." },
          ],
          businessProfiles: [
            { name: "PetroTech Industries", type: "Refining Company", location: "Mumbai, India" },
          ],
        },
      ],
    },
    {
      id: "construction-infrastructure",
      code: "IEM-03",
      number: "03",
      name: "Construction & Infrastructure",
      description: "Civil, commercial, residential, and industrial construction.",
      icon: "HardHat",
      color: "red",
      categories: [
        {
          id: "civil-construction",
          code: "IEM-03-001",
          name: "Civil Construction",
          description: "Roads, bridges, tunnels, dams, and civil works.",
          products: [
            { name: "Ready Mix Concrete", type: "product", description: "Grade RMC for construction projects." },
            { name: "Structural Steel", type: "product", description: "Beams, columns, and structural sections." },
          ],
          services: [
            { name: "Civil Contracting", type: "service", description: "End-to-end civil works execution." },
            { name: "Project Management", type: "service", description: "Construction project management services." },
          ],
          businessProfiles: [
            { name: "BuildTech Contractors", type: "Civil Contractor", location: "Delhi, India" },
          ],
        },
        {
          id: "commercial-construction",
          code: "IEM-03-002",
          name: "Commercial Construction",
          description: "Office buildings, malls, hospitals, and commercial complexes.",
          products: [
            { name: "Building Materials", type: "product", description: "Cement, aggregates, and finishing materials." },
            { name: "HVAC Systems", type: "product", description: "Heating, ventilation, and AC systems." },
          ],
          services: [
            { name: "Turnkey Construction", type: "service", description: "Design-build commercial projects." },
          ],
          businessProfiles: [
            { name: "CommercialBuild Ltd", type: "Builder", location: "Mumbai, India" },
          ],
        },
      ],
    },
    {
      id: "automotive-mobility",
      code: "IEM-04",
      number: "04",
      name: "Automotive & Mobility",
      description: "Vehicles, components, EVs, and mobility solutions.",
      icon: "Car",
      color: "teal",
      categories: [
        {
          id: "electric-vehicles",
          code: "IEM-04-001",
          name: "Electric Vehicles",
          description: "EV manufacturing, batteries, and charging infrastructure.",
          products: [
            { name: "EV Batteries", type: "product", description: "Lithium-ion battery packs for EVs." },
            { name: "Charging Stations", type: "product", description: "AC and DC fast chargers." },
            { name: "EV Motors", type: "product", description: "Permanent magnet and induction motors." },
          ],
          services: [
            { name: "Charging Installation", type: "service", description: "EV charger installation and maintenance." },
            { name: "Battery Recycling", type: "service", description: "EV battery recycling and second-life services." },
          ],
          businessProfiles: [
            { name: "EVMotors India", type: "EV Manufacturer", location: "Bengaluru, India" },
            { name: "ChargePoint Solutions", type: "Charging Infrastructure", location: "San Francisco, USA" },
          ],
        },
        {
          id: "automotive-components",
          code: "IEM-04-002",
          name: "Automotive Components",
          description: "Parts and systems for ICE and electric vehicles.",
          products: [
            { name: "Engine Components", type: "product", description: "Pistons, crankshafts, and cylinder heads." },
            { name: "Brake Systems", type: "product", description: "Brake pads, calipers, and ABS modules." },
          ],
          services: [
            { name: "Tier-1 Supply", type: "service", description: "OEM component supply and JIT delivery." },
          ],
          businessProfiles: [
            { name: "AutoParts Manufacturing", type: "Tier-1 Supplier", location: "Chennai, India" },
          ],
        },
      ],
    },
    {
      id: "aerospace-defense",
      code: "IEM-05",
      number: "05",
      name: "Aerospace & Defense",
      description: "Aircraft, spacecraft, defense systems, and related technologies.",
      icon: "Plane",
      color: "blue",
      categories: [
        {
          id: "aircraft-manufacturing",
          code: "IEM-05-001",
          name: "Aircraft Manufacturing",
          description: "Commercial and military aircraft production.",
          products: [
            { name: "Aircraft Components", type: "product", description: "Fuselage, wing, and tail assemblies." },
            { name: "Avionics Systems", type: "product", description: "Flight control and navigation electronics." },
          ],
          services: [
            { name: "MRO Services", type: "service", description: "Maintenance, repair, and overhaul." },
          ],
          businessProfiles: [
            { name: "AeroTech Systems", type: "Aerospace Manufacturer", location: "Bengaluru, India" },
          ],
        },
      ],
    },
    {
      id: "industrial-automation",
      code: "IEM-06",
      number: "06",
      name: "Industrial Automation",
      description: "PLC, SCADA, robotics, and smart factory solutions.",
      icon: "Bot",
      color: "green",
      categories: [
        {
          id: "robotics",
          code: "IEM-06-001",
          name: "Robotics",
          description: "Industrial robots for welding, assembly, and material handling.",
          products: [
            { name: "Articulated Robots", type: "product", description: "6-axis industrial robotic arms." },
            { name: "Cobots", type: "product", description: "Collaborative robots for human-robot work." },
            { name: "End Effectors", type: "product", description: "Grippers and tooling for robots." },
          ],
          services: [
            { name: "Robot Integration", type: "service", description: "Turnkey robotic cell integration." },
            { name: "Programming & Commissioning", type: "service", description: "Robot programming and setup services." },
          ],
          businessProfiles: [
            { name: "RoboTech Solutions", type: "Robotics Integrator", location: "Pune, India" },
          ],
        },
        {
          id: "scada-plc",
          code: "IEM-06-002",
          name: "SCADA & PLC Systems",
          description: "Supervisory control and programmable logic controllers.",
          products: [
            { name: "PLC Controllers", type: "product", description: "Programmable logic controllers." },
            { name: "HMI Panels", type: "product", description: "Human-machine interface displays." },
          ],
          services: [
            { name: "Automation Upgrades", type: "service", description: "Legacy system modernization." },
          ],
          businessProfiles: [
            { name: "AutomationControls Ltd", type: "System Integrator", location: "Chennai, India" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// ECOSYSTEM 02: INFORMATION TECHNOLOGY & ARTIFICIAL INTELLIGENCE
// ============================================================

const technologyAI: Ecosystem = {
  id: "technology-ai",
  code: "ITA",
  number: "02",
  name: "Information Technology & Artificial Intelligence",
  shortName: "Technology & AI",
  tagline: "Digital • Data • Intelligence",
  description: "Technology, software, AI, data, cloud, digital infrastructure, and intelligent systems powering the modern economy.",
  icon: "Cpu",
  accent: "blue",
  image: "/segment-technology.jpg",
  categories: [
    {
      id: "software-saas",
      code: "ITA-01",
      number: "01",
      name: "Software & SaaS",
      description: "Enterprise software, cloud applications, and SaaS platforms.",
      icon: "Code2",
      color: "blue",
      categories: [
        {
          id: "erp-software",
          code: "ITA-01-001",
          name: "ERP Software",
          description: "Enterprise resource planning systems for business management.",
          products: [
            { name: "Cloud ERP Suite", type: "product", description: "Full-featured cloud ERP with modules." },
            { name: "ERP Mobile App", type: "product", description: "Mobile access to ERP functions." },
          ],
          services: [
            { name: "ERP Implementation", type: "service", description: "End-to-end ERP deployment and configuration." },
            { name: "ERP Customization", type: "service", description: "Custom module and workflow development." },
          ],
          businessProfiles: [
            { name: "TechERP Solutions", type: "SaaS Company", location: "Bengaluru, India" },
            { name: "CloudERP Inc", type: "Software Vendor", location: "Austin, USA" },
          ],
        },
        {
          id: "crm-software",
          code: "ITA-01-002",
          name: "CRM Software",
          description: "Customer relationship management and sales platforms.",
          products: [
            { name: "Sales CRM Platform", type: "product", description: "Pipeline and contact management SaaS." },
            { name: "Marketing Automation", type: "product", description: "Email and campaign automation tools." },
          ],
          services: [
            { name: "CRM Consulting", type: "service", description: "CRM strategy and implementation." },
            { name: "Data Migration", type: "service", description: "Legacy data migration to new CRM." },
          ],
          businessProfiles: [
            { name: "CRMHub Technologies", type: "SaaS Company", location: "Hyderabad, India" },
          ],
        },
        {
          id: "project-management",
          code: "ITA-01-003",
          name: "Project Management Software",
          description: "Task tracking, collaboration, and project planning tools.",
          products: [
            { name: "Project Tracker", type: "product", description: "Kanban and Gantt-based project tool." },
            { name: "Team Collaboration", type: "product", description: "Chat, file sharing, and wiki platform." },
          ],
          services: [
            { name: "PMO Setup", type: "service", description: "Project management office consulting." },
          ],
          businessProfiles: [
            { name: "ProjectFlow Systems", type: "SaaS Company", location: "Pune, India" },
          ],
        },
      ],
    },
    {
      id: "ai-machine-learning",
      code: "ITA-02",
      number: "02",
      name: "AI & Machine Learning",
      description: "Artificial intelligence, ML models, and intelligent automation.",
      icon: "Brain",
      color: "violet",
      categories: [
        {
          id: "generative-ai",
          code: "ITA-02-001",
          name: "Generative AI",
          description: "LLMs, image generation, and content creation AI.",
          products: [
            { name: "AI Chatbot Platform", type: "product", description: "LLM-powered conversational AI." },
            { name: "Image Generation API", type: "product", description: "Text-to-image generation service." },
          ],
          services: [
            { name: "AI Model Fine-tuning", type: "service", description: "Custom LLM training and fine-tuning." },
            { name: "AI Strategy Consulting", type: "service", description: "AI roadmap and use-case identification." },
          ],
          businessProfiles: [
            { name: "GenAI Labs", type: "AI Company", location: "Bengaluru, India" },
            { name: "OpenAI Solutions", type: "AI Platform", location: "San Francisco, USA" },
          ],
        },
        {
          id: "computer-vision",
          code: "ITA-02-002",
          name: "Computer Vision",
          description: "Image recognition, object detection, and visual analytics.",
          products: [
            { name: "Vision Inspection System", type: "product", description: "AI-based quality inspection for manufacturing." },
            { name: "Face Recognition SDK", type: "product", description: "Facial recognition API and SDK." },
          ],
          services: [
            { name: "Custom Vision Models", type: "service", description: "Domain-specific computer vision model training." },
          ],
          businessProfiles: [
            { name: "VisionAI Technologies", type: "AI Company", location: "Hyderabad, India" },
          ],
        },
      ],
    },
    {
      id: "cloud-computing",
      code: "ITA-03",
      number: "03",
      name: "Cloud Computing",
      description: "Cloud infrastructure, platforms, and managed services.",
      icon: "Cloud",
      color: "cyan",
      categories: [
        {
          id: "cloud-infrastructure",
          code: "ITA-03-001",
          name: "Cloud Infrastructure",
          description: "IaaS, compute, storage, and networking in the cloud.",
          products: [
            { name: "Virtual Machines", type: "product", description: "Scalable cloud compute instances." },
            { name: "Cloud Storage", type: "product", description: "Object and block storage services." },
          ],
          services: [
            { name: "Cloud Migration", type: "service", description: "Lift-and-shift and re-platforming services." },
            { name: "Cloud Architecture", type: "service", description: "Cloud design and optimization consulting." },
          ],
          businessProfiles: [
            { name: "CloudScale Services", type: "Cloud Provider", location: "Mumbai, India" },
          ],
        },
        {
          id: "devops-platform",
          code: "ITA-03-002",
          name: "DevOps & Platform Engineering",
          description: "CI/CD, containers, Kubernetes, and platform tooling.",
          products: [
            { name: "CI/CD Pipeline Tool", type: "product", description: "Automated build and deployment platform." },
            { name: "Container Registry", type: "product", description: "Docker image storage and scanning." },
          ],
          services: [
            { name: "DevOps Setup", type: "service", description: "CI/CD pipeline implementation." },
            { name: "Kubernetes Consulting", type: "service", description: "K8s architecture and migration." },
          ],
          businessProfiles: [
            { name: "DevOpsPro Solutions", type: "DevOps Company", location: "Pune, India" },
          ],
        },
      ],
    },
    {
      id: "cybersecurity",
      code: "ITA-04",
      number: "04",
      name: "Cybersecurity",
      description: "Security software, threat protection, and compliance.",
      icon: "ShieldCheck",
      color: "red",
      categories: [
        {
          id: "endpoint-security",
          code: "ITA-04-001",
          name: "Endpoint Security",
          description: "Antivirus, EDR, and device protection.",
          products: [
            { name: "EDR Platform", type: "product", description: "Endpoint detection and response software." },
            { name: "Mobile Device Management", type: "product", description: "MDM for enterprise devices." },
          ],
          services: [
            { name: "Security Audits", type: "service", description: "Endpoint security assessment." },
          ],
          businessProfiles: [
            { name: "SecureTech Solutions", type: "Security Company", location: "Gurugram, India" },
          ],
        },
        {
          id: "network-security",
          code: "ITA-04-002",
          name: "Network Security",
          description: "Firewalls, IDS/IPS, and network monitoring.",
          products: [
            { name: "Next-Gen Firewall", type: "product", description: "NGFW with deep packet inspection." },
            { name: "SIEM Platform", type: "product", description: "Security information and event management." },
          ],
          services: [
            { name: "Penetration Testing", type: "service", description: "Ethical hacking and vuln assessment." },
          ],
          businessProfiles: [
            { name: "NetGuard Technologies", type: "Security Company", location: "Bengaluru, India" },
          ],
        },
      ],
    },
    {
      id: "data-analytics",
      code: "ITA-05",
      number: "05",
      name: "Data & Analytics",
      description: "BI, data engineering, data warehouses, and analytics platforms.",
      icon: "BarChart3",
      color: "indigo",
      categories: [
        {
          id: "business-intelligence",
          code: "ITA-05-001",
          name: "Business Intelligence",
          description: "Dashboards, reporting, and data visualization.",
          products: [
            { name: "BI Dashboard", type: "product", description: "Interactive analytics dashboards." },
            { name: "Reporting Engine", type: "product", description: "Automated report generation." },
          ],
          services: [
            { name: "BI Implementation", type: "service", description: "Dashboard and KPI development." },
          ],
          businessProfiles: [
            { name: "InsightsTech", type: "Data Company", location: "Hyderabad, India" },
          ],
        },
        {
          id: "data-engineering",
          code: "ITA-05-002",
          name: "Data Engineering",
          description: "ETL/ELT pipelines, data lakes, and data platforms.",
          products: [
            { name: "Data Pipeline Tool", type: "product", description: "ETL/ELT automation platform." },
            { name: "Data Lake Storage", type: "product", description: "Scalable data lake infrastructure." },
          ],
          services: [
            { name: "Data Warehouse Setup", type: "service", description: "Warehouse design and migration." },
          ],
          businessProfiles: [
            { name: "DataEng Solutions", type: "Data Company", location: "Bengaluru, India" },
          ],
        },
      ],
    },
    {
      id: "iot",
      code: "ITA-06",
      number: "06",
      name: "Internet of Things (IoT)",
      description: "Connected devices, sensors, and IoT platforms.",
      icon: "Radio",
      color: "green",
      categories: [
        {
          id: "industrial-iot",
          code: "ITA-06-001",
          name: "Industrial IoT",
          description: "Connected factory equipment, sensors, and predictive maintenance.",
          products: [
            { name: "IoT Sensor Gateway", type: "product", description: "Edge gateway for industrial sensors." },
            { name: "Predictive Maintenance Platform", type: "product", description: "AI-based equipment health monitoring." },
          ],
          services: [
            { name: "IoT Deployment", type: "service", description: "End-to-end industrial IoT setup." },
          ],
          businessProfiles: [
            { name: "IIoT Solutions Ltd", type: "IoT Company", location: "Pune, India" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// ECOSYSTEM 03: PROFESSIONAL, COMMERCIAL & BUSINESS SERVICES
// ============================================================

const businessServices: Ecosystem = {
  id: "business-services",
  code: "PCB",
  number: "03",
  name: "Professional, Commercial & Business Services",
  shortName: "Business Services",
  tagline: "People • Capital • Services",
  description: "The global service economy covering professional expertise, commercial activity, financial services, and business services.",
  icon: "Briefcase",
  accent: "purple",
  image: "/segment-business.jpg",
  categories: [
    {
      id: "business-consulting",
      code: "PCB-01",
      number: "01",
      name: "Business Consulting",
      description: "Strategy, operations, and management consulting services.",
      icon: "Lightbulb",
      color: "purple",
      categories: [
        {
          id: "strategy-consulting",
          code: "PCB-01-001",
          name: "Strategy Consulting",
          description: "Business strategy, growth, and market entry advisory.",
          products: [
            { name: "Strategy Framework Templates", type: "product", description: "Ready-to-use business strategy frameworks." },
          ],
          services: [
            { name: "Growth Strategy Advisory", type: "service", description: "Market analysis and growth planning." },
            { name: "M&A Advisory", type: "service", description: "Merger and acquisition consulting." },
          ],
          businessProfiles: [
            { name: "Strategy Partners LLC", type: "Consulting Firm", location: "Mumbai, India" },
            { name: "Growth Advisory Group", type: "Consulting Firm", location: "New York, USA" },
          ],
        },
        {
          id: "operations-consulting",
          code: "PCB-01-002",
          name: "Operations Consulting",
          description: "Process optimization, lean, and supply chain advisory.",
          products: [
            { name: "Process Audit Toolkit", type: "product", description: "Operations assessment templates." },
          ],
          services: [
            { name: "Lean Implementation", type: "service", description: "Lean manufacturing and operations." },
            { name: "Process Reengineering", type: "service", description: "BPR and workflow optimization." },
          ],
          businessProfiles: [
            { name: "Ops Excellence Consulting", type: "Consulting Firm", location: "Pune, India" },
          ],
        },
      ],
    },
    {
      id: "finance-accounting",
      code: "PCB-02",
      number: "02",
      name: "Finance & Accounting",
      description: "Accounting, tax, audit, and financial advisory services.",
      icon: "Wallet",
      color: "green",
      categories: [
        {
          id: "accounting-services",
          code: "PCB-02-001",
          name: "Accounting Services",
          description: "Bookkeeping, payroll, and financial reporting.",
          products: [
            { name: "Accounting Software", type: "product", description: "Cloud bookkeeping and payroll platform." },
            { name: "Invoice Templates", type: "product", description: "Professional invoicing templates." },
          ],
          services: [
            { name: "Bookkeeping Services", type: "service", description: "Monthly bookkeeping and reconciliation." },
            { name: "Payroll Processing", type: "service", description: "End-to-end payroll management." },
          ],
          businessProfiles: [
            { name: "AccuCount Services", type: "Accounting Firm", location: "Delhi, India" },
          ],
        },
        {
          id: "tax-services",
          code: "PCB-02-002",
          name: "Tax Services",
          description: "Tax planning, filing, and compliance advisory.",
          products: [
            { name: "Tax Filing Software", type: "product", description: "GST and income tax e-filing tool." },
          ],
          services: [
            { name: "Tax Planning Advisory", type: "service", description: "Strategic tax optimization." },
            { name: "GST Compliance", type: "service", description: "GST registration and filing services." },
          ],
          businessProfiles: [
            { name: "TaxWise Consultants", type: "Tax Firm", location: "Mumbai, India" },
          ],
        },
        {
          id: "audit-assurance",
          code: "PCB-02-003",
          name: "Audit & Assurance",
          description: "Statutory audit, internal audit, and risk assurance.",
          products: [],
          services: [
            { name: "Statutory Audit", type: "service", description: "Annual statutory audit services." },
            { name: "Internal Audit", type: "service", description: "Ongoing internal audit and controls." },
          ],
          businessProfiles: [
            { name: "AuditPartners LLP", type: "Audit Firm", location: "Bengaluru, India" },
          ],
        },
      ],
    },
    {
      id: "legal-compliance",
      code: "PCB-03",
      number: "03",
      name: "Legal & Compliance",
      description: "Corporate law, IP, contracts, and regulatory compliance.",
      icon: "Scale",
      color: "indigo",
      categories: [
        {
          id: "corporate-law",
          code: "PCB-03-001",
          name: "Corporate Law",
          description: "Company formation, M&A legal, and corporate governance.",
          products: [
            { name: "Legal Document Templates", type: "product", description: "Contract and agreement templates." },
          ],
          services: [
            { name: "Company Incorporation", type: "service", description: "Business registration and structuring." },
            { name: "M&A Legal Advisory", type: "service", description: "Legal due diligence and deal support." },
          ],
          businessProfiles: [
            { name: "Corporate Legal Associates", type: "Law Firm", location: "Mumbai, India" },
          ],
        },
        {
          id: "intellectual-property",
          code: "PCB-03-002",
          name: "Intellectual Property",
          description: "Patents, trademarks, copyrights, and IP portfolio management.",
          products: [
            { name: "IP Management Software", type: "product", description: "Patent and trademark tracking tool." },
          ],
          services: [
            { name: "Patent Filing", type: "service", description: "Patent application and prosecution." },
            { name: "Trademark Registration", type: "service", description: "Trademark search and filing." },
          ],
          businessProfiles: [
            { name: "IPShield Legal", type: "IP Law Firm", location: "Bengaluru, India" },
          ],
        },
      ],
    },
    {
      id: "marketing-advertising",
      code: "PCB-04",
      number: "04",
      name: "Marketing & Advertising",
      description: "Digital marketing, branding, advertising, and creative services.",
      icon: "Megaphone",
      color: "rose",
      categories: [
        {
          id: "digital-marketing",
          code: "PCB-04-001",
          name: "Digital Marketing",
          description: "SEO, SEM, social media, and content marketing.",
          products: [
            { name: "Marketing Automation Tool", type: "product", description: "Email and social campaign platform." },
            { name: "SEO Analytics Dashboard", type: "product", description: "Rank tracking and SEO reporting." },
          ],
          services: [
            { name: "SEO Services", type: "service", description: "Search engine optimization campaigns." },
            { name: "Social Media Management", type: "service", description: "Content creation and community management." },
          ],
          businessProfiles: [
            { name: "DigitalWave Agency", type: "Digital Marketing Agency", location: "Gurugram, India" },
          ],
        },
        {
          id: "branding-creative",
          code: "PCB-04-002",
          name: "Branding & Creative",
          description: "Brand identity, design, video, and creative production.",
          products: [
            { name: "Brand Asset Library", type: "product", description: "Logo, color, and font asset packs." },
          ],
          services: [
            { name: "Brand Identity Design", type: "service", description: "Logo, brand guidelines, and visual identity." },
            { name: "Video Production", type: "service", description: "Corporate and promo video creation." },
          ],
          businessProfiles: [
            { name: "CreativeStudio Design", type: "Design Agency", location: "Mumbai, India" },
          ],
        },
      ],
    },
    {
      id: "healthcare-services",
      code: "PCB-05",
      number: "05",
      name: "Healthcare & Medical Services",
      description: "Hospitals, clinics, diagnostics, and healthcare management.",
      icon: "Stethoscope",
      color: "red",
      categories: [
        {
          id: "hospital-services",
          code: "PCB-05-001",
          name: "Hospital Services",
          description: "Multi-specialty hospitals and emergency care.",
          products: [
            { name: "Hospital Management Software", type: "product", description: "HIS for patient and ward management." },
          ],
          services: [
            { name: "Emergency Care", type: "service", description: "24/7 emergency and trauma services." },
            { name: "Telemedicine", type: "service", description: "Online doctor consultation." },
          ],
          businessProfiles: [
            { name: "CareWell Hospital", type: "Healthcare Provider", location: "Chennai, India" },
          ],
        },
        {
          id: "diagnostics",
          code: "PCB-05-002",
          name: "Diagnostic Services",
          description: "Pathology, radiology, and lab testing.",
          products: [
            { name: "Lab Test Packages", type: "product", description: "Health checkup and test packages." },
          ],
          services: [
            { name: "Pathology Testing", type: "service", description: "Blood, urine, and tissue testing." },
            { name: "Home Sample Collection", type: "service", description: "Doorstep blood sample collection." },
          ],
          businessProfiles: [
            { name: "DiagnosTech Labs", type: "Diagnostic Lab", location: "Bengaluru, India" },
          ],
        },
      ],
    },
    {
      id: "retail-ecommerce",
      code: "PCB-06",
      number: "06",
      name: "Retail & E-Commerce",
      description: "Online and offline retail, marketplaces, and commerce platforms.",
      icon: "ShoppingCart",
      color: "orange",
      categories: [
        {
          id: "ecommerce-platforms",
          code: "PCB-06-001",
          name: "E-Commerce Platforms",
          description: "Online stores, marketplaces, and D2C brands.",
          products: [
            { name: "E-Commerce Platform", type: "product", description: "Online store builder with payments." },
            { name: "Inventory Management Tool", type: "product", description: "Stock and order management software." },
          ],
          services: [
            { name: "Store Setup Services", type: "service", description: "E-commerce store design and launch." },
            { name: "Marketplace Listing", type: "service", description: "Amazon/Flipkart listing management." },
          ],
          businessProfiles: [
            { name: "ShopOnline Retail", type: "E-Commerce Company", location: "Bengaluru, India" },
          ],
        },
        {
          id: "retail-stores",
          code: "PCB-06-002",
          name: "Retail Stores",
          description: "Physical retail chains, franchises, and specialty stores.",
          products: [
            { name: "POS Software", type: "product", description: "Point-of-sale billing system." },
          ],
          services: [
            { name: "Retail Consulting", type: "service", description: "Store layout and merchandising." },
          ],
          businessProfiles: [
            { name: "RetailMart Chain", type: "Retail Chain", location: "Pune, India" },
          ],
        },
      ],
    },
  ],
};

// ============================================================
// EXPORTS
// ============================================================

export const ecosystems: Ecosystem[] = [industrial, technologyAI, businessServices];

export function getEcosystem(id: string): Ecosystem | undefined {
  return ecosystems.find((e) => e.id === id);
}

export function getCoreSector(
  ecosystemId: string,
  sectorId: string
): { ecosystem: Ecosystem; sector: CoreSector } | undefined {
  const ecosystem = getEcosystem(ecosystemId);
  if (!ecosystem) return undefined;
  const sector = ecosystem.categories.find((c) => c.id === sectorId);
  if (!sector) return undefined;
  return { ecosystem, sector };
}

export function getCategory(
  ecosystemId: string,
  sectorId: string,
  categoryId: string
): { ecosystem: Ecosystem; sector: CoreSector; category: Category } | undefined {
  const result = getCoreSector(ecosystemId, sectorId);
  if (!result) return undefined;
  const category = result.sector.categories.find((c) => c.id === categoryId);
  if (!category) return undefined;
  return { ecosystem: result.ecosystem, sector: result.sector, category };
}

export const taxonomyStats = {
  ecosystems: ecosystems.length,
  coreSectors: ecosystems.reduce((s, e) => s + e.categories.length, 0),
  categories: ecosystems.reduce(
    (s, e) => s + e.categories.reduce((ss, sec) => ss + sec.categories.length, 0),
    0
  ),
  products: ecosystems.reduce(
    (s, e) =>
      s +
      e.categories.reduce(
        (ss, sec) =>
          ss + sec.categories.reduce((sss, c) => sss + c.products.length, 0),
        0
      ),
    0
  ),
  services: ecosystems.reduce(
    (s, e) =>
      s +
      e.categories.reduce(
        (ss, sec) =>
          ss + sec.categories.reduce((sss, c) => sss + c.services.length, 0),
        0
      ),
    0
  ),
  businessProfiles: ecosystems.reduce(
    (s, e) =>
      s +
      e.categories.reduce(
        (ss, sec) =>
          ss + sec.categories.reduce((sss, c) => sss + c.businessProfiles.length, 0),
        0
      ),
    0
  ),
};
