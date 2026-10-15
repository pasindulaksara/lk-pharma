
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  description: string;
}

export const categories: Category[] = [
  {
    id: 1,
    name: "Medical Devices & Diagnostics",
    slug: "medical-devices-diagnostics",
    image: "/images/categories/medical-devices.jpg",
    description: "Medical technology and diagnostic solutions.",
  },
  {
    id: 2,
    name: "Laboratory Equipment & Instruments",
    slug: "laboratory-equipment-instruments",
    image: "/images/categories/laboratory-equipment.jpg",
    description:
      "Equipment for research, testing and laboratory operations.",
  },
  {
    id: 3,
    name: "Laboratory Consumables & Supplies",
    slug: "laboratory-consumables-supplies",
    image: "/images/categories/laboratory-consumables.jpg",
    description: "Everyday products used in laboratories.",
  },
  {
    id: 4,
    name: "Cryogenic & Cold-Chain Solutions",
    slug: "cryogenic-cold-chain-solutions",
    image: "/images/categories/laboratory-consumables.jpg",
    description: "Low-temperature storage and sample preservation.",
  },
  {
    id: 5,
    name: "Life Science Reagents & Chemicals",
    slug: "life-science-reagents-chemicals",
    image: "/images/categories/diagnostics.jpg",
    description: "Reagents and materials for research and diagnostics.",
  },
  {
    id: 6,
    name: "Laboratory Software & Digital Solutions and Services",
    slug: "laboratory-software-digital-solutions-services",
    image: "/images/categories/laboratory-equipment.jpg",
    description:
      "Laboratory software, digital solutions and technical services.",
  },
];
