
import { apiGet } from "./api";

import type {
  ApiResponse,
  ApiCategory,
  ApiBrand,
  ApiProduct,
  ApiProductDetail,
} from "../types/catalogue";

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  sort?: "az" | "za";
}

export function getCategories(signal?: AbortSignal) {
  return apiGet<ApiResponse<ApiCategory[]>>(
    "categories",
    {},
    signal
  );
}

export function getBrands(signal?: AbortSignal) {
  return apiGet<ApiResponse<ApiBrand[]>>(
    "brands",
    {},
    signal
  );
}

export function getProducts(
  query: ProductQuery = {},
  signal?: AbortSignal
) {
  return apiGet<ApiResponse<ApiProduct[]>>(
    "products",
    {
      page: query.page,
      limit: query.limit,
      search: query.search,
      category: query.category,
      brand: query.brand,
      sort: query.sort,
    },
    signal
  );
}

export function getProduct(
  slug: string,
  signal?: AbortSignal
) {
  return apiGet<ApiResponse<ApiProductDetail>>(
    "product",
    { slug },
    signal
  );
}
