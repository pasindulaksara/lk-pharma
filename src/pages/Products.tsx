
import { useEffect, useState } from "react";

import {
  Link,
  useParams,
  useSearchParams,
} from "react-router";

import {
  FiArrowRight,
  FiPackage,
  FiSliders,
  FiAlertCircle,
} from "react-icons/fi";

import ProductCard from "../components/products/ProductCard";
import CategoryFilter from "../components/products/CategoryFilter";
import ProductSearch from "../components/products/ProductSearch";

import {
  getProducts,
  getCategories,
} from "../services/catalogue";

import { resolveAssetUrl } from "../services/api";

import type { Product } from "../data/products";

import type {
  ApiProduct,
  ApiCategory,
  Pagination,
} from "../types/catalogue";

const PAGE_SIZE = 12;

// Convert PHP API products to the existing ProductCard format.
function mapProduct(product: ApiProduct): Product {
  return {
    id: Number(product.id),
    name: product.name,
    slug: product.slug,
    code: product.sku || "",
    category: product.category_name || "",
    categorySlug: product.category_slug || "",
    brandSlug: product.brand_slug || undefined,
    image: resolveAssetUrl(product.main_image),
    featured: Boolean(Number(product.featured)),
    description: product.short_description || "",
    specifications: [],
  };
}

export default function Products() {
  const { categorySlug } = useParams();

  const [searchParams, setSearchParams] =
    useSearchParams();

  // URL filters
  const query = searchParams.get("q") ?? "";

  const sort =
    searchParams.get("sort") === "za"
      ? "za"
      : "az";

  // The new CategoryFilter stores a category SLUG in "sub".
  const subcategorySlug =
    searchParams.get("sub") ?? "";

  const selectedBrands =
    searchParams.getAll("brand");

  const requestedPage = Number(
    searchParams.get("page") || 1
  );

  const page =
    Number.isSafeInteger(requestedPage) &&
    requestedPage > 0
      ? requestedPage
      : 1;

  // Dynamic categories from MySQL
  const [categories, setCategories] =
    useState<ApiCategory[]>([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  // Products from MySQL
  const [products, setProducts] =
    useState<Product[]>([]);

  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // Load category names from the PHP API.
  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      try {
        const response = await getCategories(
          controller.signal
        );

        if (controller.signal.aborted) return;

        setCategories(response.data || []);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error(
          "Failed to load categories:",
          err
        );
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => controller.abort();
  }, []);

  // Find the active main category using MySQL data.
  const activeCategory = categories.find(
    (category) =>
      category.slug === categorySlug
  );

  // Find the selected nested category using MySQL data.
  const selectedSubcategory = categories.find(
    (category) =>
      category.slug === subcategorySlug
  );

  // Selected subcategory overrides the parent category.
  // PHP will include descendants of the selected category.
  const selectedCategorySlug =
    subcategorySlug || categorySlug || "";

  // PHP accepts multiple brand slugs separated by commas.
  const brandFilter =
    selectedBrands.join(",");

  // Dynamic page title.
  const pageTitle =
    selectedSubcategory?.name ||
    activeCategory?.name ||
    "Explore Our Products";

  // Load published products from the PHP API.
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      setLoading(true);
      setError("");
      setProducts([]);
      setPagination(null);

      try {
        const response = await getProducts(
          {
            page,
            limit: PAGE_SIZE,
            search: query.trim(),
            category: selectedCategorySlug,
            brand: brandFilter,
            sort,
          },
          controller.signal
        );

        if (controller.signal.aborted) return;

        if (!response.success) {
          throw new Error(
            "The products API returned an error."
          );
        }

        setProducts(
          (response.data || []).map(mapProduct)
        );

        setPagination(
          response.pagination ?? null
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error(
          "Failed to load CHETSA products:",
          err
        );

        setError(
          "We couldn't load the products. Please try again."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProducts();

    return () => controller.abort();
  }, [
    page,
    query,
    sort,
    selectedCategorySlug,
    brandFilter,
  ]);

  const totalProducts =
    pagination?.total ?? 0;

  const totalPages = Math.max(
    1,
    pagination?.total_pages ?? 1
  );

  const currentPage = page;

  // Update search or sort filters.
  const updateParam = (
    key: string,
    value: string
  ) => {
    setSearchParams(
      (previous) => {
        const next =
          new URLSearchParams(previous);

        // Reset pagination when filters change.
        next.delete("page");

        if (value.trim()) {
          next.set(key, value);
        } else {
          next.delete(key);
        }

        return next;
      },
      {
        replace: key === "q",
      }
    );
  };

  // Server-side pagination.
  const goToPage = (nextPage: number) => {
    const safePage = Math.max(
      1,
      Math.min(totalPages, nextPage)
    );

    setSearchParams((previous) => {
      const next =
        new URLSearchParams(previous);

      if (safePage === 1) {
        next.delete("page");
      } else {
        next.set(
          "page",
          String(safePage)
        );
      }

      return next;
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Heading */}
      <section className="border-b border-slate-100 bg-[#F8FAFC] py-14">
        <div className="container-site">
          <nav
            aria-label="Breadcrumb"
            className="mb-5 flex items-center gap-2 text-xs text-slate-500"
          >
            <Link
              to="/"
              className="hover:text-primary"
            >
              Home
            </Link>

            <FiArrowRight size={12} />

            <Link
              to="/products"
              className="hover:text-primary"
            >
              Products
            </Link>

            {activeCategory && (
              <>
                <FiArrowRight size={12} />

                <Link
                  to={`/products/category/${activeCategory.slug}`}
                  className="hover:text-primary"
                >
                  {activeCategory.name}
                </Link>
              </>
            )}

            {selectedSubcategory && (
              <>
                <FiArrowRight size={12} />

                <span className="text-heading">
                  {selectedSubcategory.name}
                </span>
              </>
            )}
          </nav>

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            CHETSA PRODUCT CATALOGUE
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-heading md:text-4xl">
            {categoriesLoading &&
            selectedCategorySlug
              ? "Explore Our Products"
              : pageTitle}
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
            Explore laboratory equipment, medical devices,
            consumables, reagents and scientific solutions.
          </p>
        </div>
      </section>

      {/* Catalogue */}
      <section className="py-12 md:py-16">
        <div className="container-site">
          <div className="grid items-start gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <CategoryFilter />
              </div>
            </div>

            {/* Main Listing */}
            <div className="min-w-0">
              {/* Search and Sort */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <ProductSearch
                    value={query}
                    onChange={(value) =>
                      updateParam("q", value)
                    }
                  />
                </div>

                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(event) =>
                    updateParam(
                      "sort",
                      event.target.value
                    )
                  }
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-primary"
                >
                  <option value="az">
                    Name: A–Z
                  </option>

                  <option value="za">
                    Name: Z–A
                  </option>
                </select>
              </div>

              {/* Mobile Filters */}
              <details className="mt-5 lg:hidden">
                <summary className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-4 text-sm font-medium text-slate-700">
                  <FiSliders />
                  Categories & Brands
                </summary>

                <div className="mt-3">
                  <CategoryFilter />
                </div>
              </details>

              {/* Results Count */}
              <div className="my-7">
                <p
                  aria-live="polite"
                  className="text-sm text-slate-500"
                >
                  {loading ? (
                    "Loading products..."
                  ) : error ? (
                    "Unable to load products"
                  ) : (
                    <>
                      Showing{" "}
                      <span className="font-semibold text-heading">
                        {totalProducts}
                      </span>{" "}
                      products
                    </>
                  )}
                </p>
              </div>

              {/* Loading Skeleton */}
              {loading && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({
                    length: 6,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200/80 bg-white p-2"
                    >
                      <div className="aspect-[4/3] animate-pulse rounded-xl bg-[#F8FAFC]" />

                      <div className="space-y-3 px-4 py-5">
                        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

                        <div className="h-5 w-4/5 animate-pulse rounded bg-slate-100" />

                        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* API Error */}
              {!loading && error && (
                <div
                  role="alert"
                  className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center"
                >
                  <FiAlertCircle
                    size={32}
                    className="mb-4 text-slate-400"
                  />

                  <h2 className="text-lg font-semibold text-heading">
                    Unable to Load Products
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      window.location.reload()
                    }
                    className="mt-5 text-sm font-semibold text-primary"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Products Grid */}
              {!loading &&
                !error &&
                products.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                      {products.map(
                        (product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                          />
                        )
                      )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-10 flex items-center justify-center gap-3">
                        <button
                          type="button"
                          disabled={
                            currentPage <= 1
                          }
                          onClick={() =>
                            goToPage(
                              currentPage - 1
                            )
                          }
                          className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Previous
                        </button>

                        <span className="text-sm text-slate-600">
                          {currentPage} /{" "}
                          {totalPages}
                        </span>

                        <button
                          type="button"
                          disabled={
                            currentPage >=
                            totalPages
                          }
                          onClick={() =>
                            goToPage(
                              currentPage + 1
                            )
                          }
                          className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}

              {/* Empty State */}
              {!loading &&
                !error &&
                products.length === 0 && (
                  <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                    <FiPackage
                      size={32}
                      className="mb-4 text-slate-400"
                    />

                    <h2 className="text-lg font-semibold text-heading">
                      No Products Found
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                      Try another category, brand
                      or search term.
                    </p>

                    <Link
                      to="/products"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                    >
                      Clear Filters

                      <FiArrowRight />
                    </Link>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
