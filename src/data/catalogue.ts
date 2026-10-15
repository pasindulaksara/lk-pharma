
export interface CatalogueSubcategory {
    id: string;
    name: string;
    parentId: string | null;
    categorySlug: string;
  }
  
  export interface CatalogueBrand {
    slug: string;
    name: string;
  }
  
  export const catalogueBrands: CatalogueBrand[] = [
    { slug: "biologix", name: "BioLogix" },
    { slug: "air-science", name: "Air Science" },
    { slug: "nuve", name: "NUVE" },
  ];
  
  // Demonstration taxonomy.
  // Expand with approved supplier categories later.
  export const catalogueSubcategories: CatalogueSubcategory[] = [
    // Medical Devices & Diagnostics
    {
      id: "diagnostic-testing",
      name: "Diagnostic Testing",
      parentId: null,
      categorySlug: "medical-devices-diagnostics",
    },
    {
      id: "point-of-care",
      name: "Point-of-Care Testing",
      parentId: "diagnostic-testing",
      categorySlug: "medical-devices-diagnostics",
    },
  
    // Laboratory Equipment & Instruments
    {
      id: "laboratory-instruments",
      name: "Laboratory Instruments",
      parentId: null,
      categorySlug: "laboratory-equipment-instruments",
    },
    {
      id: "centrifuges",
      name: "Centrifuges",
      parentId: "laboratory-instruments",
      categorySlug: "laboratory-equipment-instruments",
    },
    {
      id: "incubators",
      name: "Incubators",
      parentId: "laboratory-instruments",
      categorySlug: "laboratory-equipment-instruments",
    },
    {
      id: "safety-cabinets",
      name: "Biological Safety Cabinets",
      parentId: null,
      categorySlug: "laboratory-equipment-instruments",
    },
    {
      id: "fume-hoods",
      name: "Fume Hoods",
      parentId: null,
      categorySlug: "laboratory-equipment-instruments",
    },
  
    // Laboratory Consumables & Supplies
    {
      id: "laboratory-plastics",
      name: "Laboratory Plastics",
      parentId: null,
      categorySlug: "laboratory-consumables-supplies",
    },
    {
      id: "pipette-tips",
      name: "Pipette Tips",
      parentId: "laboratory-plastics",
      categorySlug: "laboratory-consumables-supplies",
    },
    {
      id: "centrifuge-tubes",
      name: "Centrifuge Tubes",
      parentId: "laboratory-plastics",
      categorySlug: "laboratory-consumables-supplies",
    },
    {
      id: "microplates",
      name: "Microplates",
      parentId: "laboratory-plastics",
      categorySlug: "laboratory-consumables-supplies",
    },
  
    // Cryogenic & Cold-Chain Solutions
    {
      id: "cryogenic-storage",
      name: "Cryogenic Storage",
      parentId: null,
      categorySlug: "cryogenic-cold-chain-solutions",
    },
    {
      id: "cryogenic-vials",
      name: "Cryogenic Vials",
      parentId: "cryogenic-storage",
      categorySlug: "cryogenic-cold-chain-solutions",
    },
    {
      id: "self-standing-vials",
      name: "Self-Standing Vials",
      parentId: "cryogenic-vials",
      categorySlug: "cryogenic-cold-chain-solutions",
    },
  
    // Life Science Reagents & Chemicals
    {
      id: "buffers",
      name: "Buffers",
      parentId: null,
      categorySlug: "life-science-reagents-chemicals",
    },
    {
      id: "cell-culture-buffer",
      name: "Cell Culture Buffer",
      parentId: "buffers",
      categorySlug: "life-science-reagents-chemicals",
    },
    {
      id: "electrophoresis-buffer",
      name: "Electrophoresis Buffer",
      parentId: "buffers",
      categorySlug: "life-science-reagents-chemicals",
    },
    {
      id: "wash-buffer",
      name: "Wash Buffer",
      parentId: "buffers",
      categorySlug: "life-science-reagents-chemicals",
    },
    {
      id: "sodium-citrate-buffer",
      name: "Sodium Citrate Buffer",
      parentId: "buffers",
      categorySlug: "life-science-reagents-chemicals",
    },
    {
      id: "sample-preservation-buffer",
      name: "Sample Preservation Buffer",
      parentId: "buffers",
      categorySlug: "life-science-reagents-chemicals",
    },
    {
      id: "ph-calibration-buffer",
      name: "pH Calibration Buffer",
      parentId: "buffers",
      categorySlug: "life-science-reagents-chemicals",
    },
  
    // Laboratory Software, Digital Solutions & Services
    {
      id: "laboratory-software",
      name: "Laboratory Software",
      parentId: null,
      categorySlug: "laboratory-software-digital-solutions-services",
    },
    {
      id: "lims",
      name: "LIMS",
      parentId: "laboratory-software",
      categorySlug: "laboratory-software-digital-solutions-services",
    },
    {
      id: "eln",
      name: "Electronic Laboratory Notebooks",
      parentId: "laboratory-software",
      categorySlug: "laboratory-software-digital-solutions-services",
    },
    {
      id: "technical-services",
      name: "Technical Services",
      parentId: null,
      categorySlug: "laboratory-software-digital-solutions-services",
    },
    {
      id: "installation",
      name: "Installation & Commissioning",
      parentId: "technical-services",
      categorySlug: "laboratory-software-digital-solutions-services",
    },
    {
      id: "maintenance",
      name: "Maintenance & Calibration Coordination",
      parentId: "technical-services",
      categorySlug: "laboratory-software-digital-solutions-services",
    },
  ];
  
  // Get all descendants of a category, at any depth.
  export function getDescendantIds(parentId: string): string[] {
    const result: string[] = [];
  
    const visit = (id: string) => {
      const children = catalogueSubcategories.filter(
        (item) => item.parentId === id
      );
  
      children.forEach((child) => {
        result.push(child.id);
        visit(child.id);
      });
    };
  
    visit(parentId);
    return result;
  }
  
  // Find all ancestors to automatically open the correct menu.
  export function getAncestorIds(id: string): string[] {
    const ancestors: string[] = [];
    let current = catalogueSubcategories.find(
      (item) => item.id === id
    );
  
    while (current?.parentId) {
      ancestors.push(current.parentId);
      current = catalogueSubcategories.find(
        (item) => item.id === current?.parentId
      );
    }
  
    return ancestors;
  }
  