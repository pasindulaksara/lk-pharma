
import { useMemo } from "react";
import {
  Link,
  useParams,
  useSearchParams,
} from "react-router";
import {
  FiArrowRight,
  FiPackage,
  FiSliders,
} from "react-icons/fi";

import ProductCard from "../components/products/ProductCard";
import CategoryFilter from "../components/products/CategoryFilter";
import ProductSearch from "../components/products/ProductSearch";

import { products } from "../data/products";
import { categories } from "../data/categories";
import {
  catalogueBrands,
  catalogueSubcategories,
  getDescendantIds,
} from "../data/catalogue";

const PAGE_SIZE = 12;

export default function Products() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") === "za" ? "za" : "az";
  const subcategoryId = searchParams.get("sub") ?? "";
  const selectedBrands = searchParams.getAll("brand");

  const requestedPage = Number(searchParams.get("page") || 1);
  const page =
    Number.isSafeInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

  const activeCategory = categories.find(
    (category) => category.slug === categorySlug
  );

  const selectedSubcategory = catalogueSubcategories.find(
    (item) =>
      item.id === subcategoryId &&
      item.categorySlug === categorySlug
  );

  const filteredProducts = useMemo(() => {
    const term = query.trim().toLowerCase();

    const matchingSubcategories = selectedSubcategory
      ? new Set([
          selectedSubcategory.id,
          ...getDescendantIds(selectedSubcategory.id),
        ])
      : null;

    return products
      .filter((product) => {
        const categoryMatch =
          !categorySlug ||
          product.categorySlug === categorySlug;

        const subcategoryMatch =
          !matchingSubcategories ||
          (product.subcategoryId !== undefined &&
            matchingSubcategories.has(product.subcategoryId));

        const brandMatch =
          selectedBrands.length === 0 ||
          (product.brandSlug !== undefined &&
            selectedBrands.includes(product.brandSlug));

        const brandName =
          catalogueBrands.find(
            (brand) => brand.slug === product.brandSlug
          )?.name ?? "";

        const searchMatch =
          !term ||
          [
            product.name,
            product.code,
            product.category,
            brandName,
            product.description,
          ].some((value) => value.toLowerCase().includes(term));

        return (
          categoryMatch &&
          subcategoryMatch &&
          brandMatch &&
          searchMatch
        );
      })
      .sort((a, b) =>
        sort === "za"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name)
      );
  }, [
    categorySlug,
    selectedSubcategory,
    selectedBrands.join("|"),
    query,
    sort,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const updateParam = (key: string, value: string) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);

        next.delete("page");

        if (value.trim()) {
          next.set(key, value);
        } else {
          next.delete(key);
        }

        return next;
      },
      { replace: key === "q" }
    );
  };

  const goToPage = (nextPage: number) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);

      if (nextPage === 1) {
        next.delete("page");
      } else {
        next.set("page", String(nextPage));
      }

      return next;
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
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <FiArrowRight size={12} />
            <Link to="/products" className="hover:text-primary">
              Products
            </Link>
          </nav>

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            CHETSA PRODUCT CATALOGUE
          </span>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-heading md:text-4xl">
            {selectedSubcategory?.name ||
              activeCategory?.name ||
              "Explore Our Products"}
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
            {/* Sidebar */}
            <div className="hidden lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <CategoryFilter />
              </div>
            </div>

            {/* Main Listing */}
            <div className="min-w-0">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <ProductSearch
                    value={query}
                    onChange={(value) => updateParam("q", value)}
                  />
                </div>

                <select
                  aria-label="Sort products"
                  value={sort}
                  onChange={(event) =>
                    updateParam("sort", event.target.value)
                  }
                  className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-primary"
                >
                  <option value="az">Name: A–Z</option>
                  <option value="za">Name: Z–A</option>
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

              <div className="my-7">
                <p aria-live="polite" className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-heading">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>
              </div>

              {visibleProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {visibleProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-3">
                      <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                      >
                        Previous
                      </button>

                      <span className="text-sm text-slate-600">
                        {currentPage} / {totalPages}
                      </span>

                      <button
                        type="button"
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center">
                  <FiPackage
                    size={32}
                    className="mb-4 text-slate-400"
                  />

                  <h2 className="text-lg font-semibold text-heading">
                    No Products Found
                  </h2>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    Try another category, brand or search term.
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
