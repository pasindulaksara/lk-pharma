
export interface ProductVariant {
  sku: string;
  label: string;
}

export interface ProductDocument {
  title: string;
  url: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  code: string;
  category: string;
  categorySlug: string;
  subcategoryId?: string;
  brandSlug?: string;
  image: string;
  images?: string[];
  featured: boolean;
  description: string;
  specifications: {
    label: string;
    value: string;
  }[];
  variants?: ProductVariant[];
  documents?: ProductDocument[];
}

export const products: Product[] = [
  {
    id: 1,
    name: "Laboratory Centrifuge",
    slug: "laboratory-centrifuge",
    code: "DEMO-001",
    category: "Laboratory Equipment & Instruments",
    categorySlug: "laboratory-equipment-instruments",
    subcategoryId: "centrifuges",
    image: "/images/home/featured/centrifuge.jpg",
    featured: true,
    description:
      "Demonstration laboratory centrifuge for sample separation.",
    specifications: [
      { label: "Application", value: "Sample Separation" },
    ],
  },
  {
    id: 2,
    name: "Adjustable Micropipette",
    slug: "adjustable-micropipette",
    code: "DEMO-002",
    category: "Laboratory Equipment & Instruments",
    categorySlug: "laboratory-equipment-instruments",
    image: "/images/home/featured/micropipette.jpg",
    featured: true,
    description:
      "Demonstration adjustable micropipette for liquid handling.",
    specifications: [
      { label: "Application", value: "Liquid Handling" },
    ],
  },
  {
    id: 3,
    name: "Centrifuge Tubes",
    slug: "centrifuge-tubes",
    code: "DEMO-003",
    category: "Laboratory Consumables & Supplies",
    categorySlug: "laboratory-consumables-supplies",
    subcategoryId: "centrifuge-tubes",
    image: "/images/home/featured/tubes.jpg",
    featured: true,
    description:
      "Demonstration centrifuge tubes for laboratory samples.",
    specifications: [
      { label: "Product Type", value: "Centrifuge Tubes" },
    ],
  },
  {
    id: 4,
    name: "Patient Monitor",
    slug: "patient-monitor",
    code: "DEMO-004",
    category: "Medical Devices & Diagnostics",
    categorySlug: "medical-devices-diagnostics",
    image: "/images/home/featured/patient-monitor.jpg",
    featured: true,
    description:
      "Demonstration patient monitoring equipment.",
    specifications: [
      { label: "Application", value: "Patient Monitoring" },
    ],
  },
  {
    id: 5,
    name: "Self-Standing Cryogenic Vials",
    slug: "self-standing-cryogenic-vials",
    code: "DEMO-005",
    category: "Cryogenic & Cold-Chain Solutions",
    categorySlug: "cryogenic-cold-chain-solutions",
    subcategoryId: "self-standing-vials",
    brandSlug: "biologix",
    image: "/images/home/featured/tubes.jpg",
    featured: false,
    description:
      "Illustrative cryogenic vial product. Exact technical details are pending manufacturer confirmation.",
    specifications: [
      { label: "Product Type", value: "Cryogenic Vial" },
      { label: "Design", value: "Self-standing" },
    ],
    variants: [
      { sku: "DEMO-005-A", label: "Small Pack" },
      { sku: "DEMO-005-B", label: "Bulk Pack" },
    ],
  },
  {
    id: 6,
    name: "Biological Safety Cabinet",
    slug: "biological-safety-cabinet",
    code: "DEMO-006",
    category: "Laboratory Equipment & Instruments",
    categorySlug: "laboratory-equipment-instruments",
    subcategoryId: "safety-cabinets",
    brandSlug: "air-science",
    image: "/images/home/laboratory-equipment.jpg",
    featured: false,
    description:
      "Illustrative Air Science equipment listing. Exact model and specifications are pending confirmation.",
    specifications: [],
  },
  {
    id: 7,
    name: "Laboratory Incubator",
    slug: "laboratory-incubator",
    code: "DEMO-007",
    category: "Laboratory Equipment & Instruments",
    categorySlug: "laboratory-equipment-instruments",
    subcategoryId: "incubators",
    brandSlug: "nuve",
    image: "/images/home/laboratory-equipment.jpg",
    featured: false,
    description:
      "Illustrative NUVE equipment listing. Exact model and specifications are pending confirmation.",
    specifications: [],
  },
];

export const featuredProducts = products
  .filter((product) => product.featured)
  .slice(0, 4);
