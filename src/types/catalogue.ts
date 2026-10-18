

export interface ApiCategory {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  sort_order: number;
  product_count?: number;
}

export interface ApiBrand {
  id: number;
  name: string;
  slug: string;
  logo: string | null;
  website: string | null;
  product_count?: number;
}

  export interface ApiProduct {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    short_description: string | null;
    main_image: string | null;
    featured: number | boolean;
    brand_name: string | null;
    brand_slug: string | null;
    category_name: string;
    category_slug: string;
  }
  
  export interface ApiSpecification {
    group_name: string;
    spec_name: string;
    spec_value: string;
  }
  
  export interface ApiModel {
    model_number: string;
    model_name: string | null;
    description: string | null;
  }
  
  export interface ApiDocument {
    title: string;
    file_url: string;
  }
  
  export interface ApiProductDetail extends ApiProduct {
    description: string | null;
    specifications: ApiSpecification[];
    models: ApiModel[];
    documents: ApiDocument[];
  }
  
  export interface Pagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  }
  
  export interface ApiResponse<T> {
    success: boolean;
    data: T;
    pagination?: Pagination;
    message?: string;
  }
  