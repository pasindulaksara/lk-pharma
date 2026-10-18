
import { useEffect, useState } from "react";

import {
  getProducts,
  type ProductQuery,
} from "../services/catalogue";

import type {
  ApiProduct,
  Pagination,
} from "../types/catalogue";

export function useCatalogueProducts(
  query: ProductQuery = {}
) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    page = 1,
    limit = 12,
    search = "",
    category = "",
    brand = "",
  } = query;

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getProducts(
      { page, limit, search, category, brand },
      controller.signal
    )
      .then((response) => {
        setProducts(response.data);
        setPagination(response.pagination ?? null);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load products"
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [page, limit, search, category, brand]);

  return {
    products,
    pagination,
    loading,
    error,
  };
}
