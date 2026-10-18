
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
} from "react-router";

import {
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiSearch,
  FiX,
} from "react-icons/fi";

import {
  getCategories,
  getBrands,
} from "../../services/catalogue";

import type {
  ApiCategory,
  ApiBrand,
} from "../../types/catalogue";

interface CategoryNodeProps {
  category: ApiCategory;
  allCategories: ApiCategory[];
  selectedSlug: string;
  mainCategorySlug: string;
  makeUrl: (category: string, sub?: string) => string;
  depth?: number;
}

 
function ProductCount({
  count,
}: {
  count: number | string | undefined;
}) {
  const total = Number(count ?? 0);

  // Hide zero and invalid counts.
  if (!Number.isFinite(total) || total <= 0) {
    return null;
  }

  return (
    <span className="ml-auto shrink-0 text-[11px] font-medium tabular-nums text-slate-400">
      {total}
    </span>
  );
}


function CategoryNode({
  category,
  allCategories,
  selectedSlug,
  mainCategorySlug,
  makeUrl,
  depth = 0,
}: CategoryNodeProps) {
  const children = allCategories.filter(
    (item) =>
      Number(item.parent_id) === Number(category.id)
  );

  const selected = selectedSlug === category.slug;

  const selectedCategory = allCategories.find(
    (item) => item.slug === selectedSlug
  );

  let ancestorId = selectedCategory?.parent_id ?? null;
  let hasSelectedDescendant = false;
  const seen = new Set<number>();

  while (
    ancestorId !== null &&
    !seen.has(Number(ancestorId))
  ) {
    if (Number(ancestorId) === Number(category.id)) {
      hasSelectedDescendant = true;
      break;
    }

    seen.add(Number(ancestorId));

    const parent = allCategories.find(
      (item) => Number(item.id) === Number(ancestorId)
    );

    ancestorId = parent?.parent_id ?? null;
  }

  const [manualState, setManualState] = useState<
    "open" | "closed" | null
  >(null);

  const isOpen =
    manualState === "open"
      ? true
      : manualState === "closed"
        ? false
        : hasSelectedDescendant;

  return (
    <div>
      <div
        className={`flex items-center rounded-lg transition-colors ${
          selected
            ? "bg-[#EEF5F9] text-primary"
            : "text-slate-600 hover:bg-slate-50"
        }`}
        style={{
          paddingLeft: `${10 + depth * 13}px`,
        }}
      >
        <Link
          to={makeUrl(
            mainCategorySlug,
            category.slug
          )}
          className={`min-w-0 flex-1 py-2.5 pr-2 text-[13px] ${
            selected ? "font-semibold" : ""
          }`}
        >
          {category.name}
        </Link>

        <ProductCount count={category.product_count} />

        {children.length > 0 ? (
          <button
            type="button"
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${category.name}`}
            aria-expanded={isOpen}
            onClick={() =>
              setManualState(isOpen ? "closed" : "open")
            }
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            {isOpen ? (
              <FiChevronDown size={15} />
            ) : (
              <FiChevronRight size={15} />
            )}
          </button>
        ) : selected ? (
          <FiCheck
            size={14}
            className="mx-3 shrink-0"
          />
        ) : (
          <span className="w-3 shrink-0" />
        )}
      </div>

      {children.length > 0 && isOpen && (
        <div className="mt-0.5">
          {children.map((child) => (
            <CategoryNode
              key={child.id}
              category={child}
              allCategories={allCategories}
              selectedSlug={selectedSlug}
              mainCategorySlug={mainCategorySlug}
              makeUrl={makeUrl}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CategoryFilter() {
  const { pathname } = useLocation();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const activeCategory =
    pathname.match(/^\/products\/category\/([^/]+)/)?.[1] ||
    "";

  const activeSubcategory =
    searchParams.get("sub") || "";

  const selectedBrands = searchParams.getAll("brand");

  const [categories, setCategories] =
    useState<ApiCategory[]>([]);

  const [brands, setBrands] = useState<ApiBrand[]>([]);

  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [openCategories, setOpenCategories] =
    useState<string[]>([]);

  const [brandQuery, setBrandQuery] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadFilters() {
      setLoading(true);
      setError("");

      try {
        const [categoryResponse, brandResponse] =
          await Promise.all([
            getCategories(controller.signal),
            getBrands(controller.signal),
          ]);

        if (controller.signal.aborted) return;

        setCategories(categoryResponse.data || []);
        setBrands(brandResponse.data || []);

        const responseWithTotal =
          categoryResponse as typeof categoryResponse & {
            total_products?: number;
          };

        setTotalProducts(
          Number(responseWithTotal.total_products ?? 0)
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Category filter error:", err);
        setError("Unable to load filters.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadFilters();

    return () => controller.abort();
  }, []);

  const rootCategories = useMemo(
    () =>
      categories.filter(
        (item) =>
          item.parent_id === null ||
          Number(item.parent_id) === 0
      ),
    [categories]
  );

  const matchingBrands = useMemo(
    () =>
      brands.filter((brand) =>
        brand.name
          .toLowerCase()
          .includes(brandQuery.trim().toLowerCase())
      ),
    [brands, brandQuery]
  );

  const makeUrl = (
    categorySlug: string,
    subSlug?: string
  ) => {
    const params = new URLSearchParams(searchParams);

    params.delete("sub");
    params.delete("page");

    if (subSlug) {
      params.set("sub", subSlug);
    }

    const path = categorySlug
      ? `/products/category/${categorySlug}`
      : "/products";

    const query = params.toString();

    return query ? `${path}?${query}` : path;
  };

  const toggleCategory = (slug: string) => {
    setOpenCategories((current) =>
      current.includes(slug)
        ? current.filter((item) => item !== slug)
        : [...current, slug]
    );
  };

  const toggleBrand = (slug: string) => {
    setSearchParams((previous) => {
      const next = new URLSearchParams(previous);
      const selected = next.getAll("brand");

      next.delete("brand");
      next.delete("page");

      const updated = selected.includes(slug)
        ? selected.filter((item) => item !== slug)
        : [...selected, slug];

      updated.forEach((item) =>
        next.append("brand", item)
      );

      return next;
    });
  };

  const hasFilters =
    Boolean(activeCategory) ||
    Boolean(activeSubcategory) ||
    selectedBrands.length > 0 ||
    searchParams.has("q");

  return (
    <aside className="rounded-2xl border border-slate-200/80 bg-white p-4">
      {/* Categories Heading */}
      <div className="border-b border-slate-100 px-2 pb-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Product Categories
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Browse our product range
        </p>
      </div>

      {loading && (
        <p className="px-3 py-5 text-xs text-slate-500">
          Loading categories...
        </p>
      )}

      {error && (
        <p role="alert" className="px-3 py-5 text-xs text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {/* Category Tree */}
          <nav
            aria-label="Product categories"
            className="mt-3 space-y-1"
          >
            <Link
              to={makeUrl("")}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm transition-colors ${
                !activeCategory
                  ? "bg-[#EEF5F9] font-semibold text-primary"
                  : "text-slate-600 hover:bg-slate-50 hover:text-primary"
              }`}
            >
              <span className="min-w-0 flex-1">
                All Products
              </span>

              <ProductCount count={totalProducts} />

              {!activeCategory && (
                <FiCheck size={16} />
              )}
            </Link>

            {rootCategories.map((category) => {
              const children = categories.filter(
                (item) =>
                  Number(item.parent_id) ===
                  Number(category.id)
              );

              const selected =
                activeCategory === category.slug;

              const isOpen =
                selected ||
                openCategories.includes(category.slug);

              return (
                <div key={category.id}>
                  <div
                    className={`flex items-center rounded-lg transition-colors ${
                      selected && !activeSubcategory
                        ? "bg-[#EEF5F9] font-semibold text-primary"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Link
                      to={makeUrl(category.slug)}
                      className="min-w-0 flex-1 px-3 py-3 text-sm"
                    >
                      {category.name}
                    </Link>

                    <ProductCount
                      count={category.product_count}
                    />

                    {children.length > 0 ? (
                      <button
                        type="button"
                        aria-label={`${isOpen ? "Collapse" : "Expand"} ${category.name}`}
                        aria-expanded={isOpen}
                        onClick={() =>
                          toggleCategory(category.slug)
                        }
                        className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                      >
                        {isOpen ? (
                          <FiChevronDown size={15} />
                        ) : (
                          <FiChevronRight size={15} />
                        )}
                      </button>
                    ) : (
                      <span className="mr-3 w-3 shrink-0" />
                    )}
                  </div>

                  {isOpen && children.length > 0 && (
                    <div className="py-1">
                      {children.map((child) => (
                        <CategoryNode
                          key={child.id}
                          category={child}
                          allCategories={categories}
                          selectedSlug={activeSubcategory}
                          mainCategorySlug={category.slug}
                          makeUrl={makeUrl}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Brands */}
          <div className="mt-6 border-t border-slate-100 pt-5">
            <h2 className="px-2 text-sm font-semibold text-slate-900">
              Brands & Manufacturers
            </h2>

            <div className="relative mt-4">
              <FiSearch
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={brandQuery}
                onChange={(event) =>
                  setBrandQuery(event.target.value)
                }
                placeholder="Search brands..."
                aria-label="Search brands"
                className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="mt-3 max-h-52 space-y-1 overflow-y-auto">
              {matchingBrands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(
                      brand.slug
                    )}
                    onChange={() =>
                      toggleBrand(brand.slug)
                    }
                    className="h-4 w-4 accent-primary"
                  />

                  <span className="min-w-0 flex-1">
                    {brand.name}
                  </span>

                  <ProductCount
                    count={brand.product_count}
                  />
                </label>
              ))}

              {matchingBrands.length === 0 && (
                <p className="px-2 py-2 text-xs text-slate-500">
                  No matching brands
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Clear Filters */}
      {hasFilters && (
        <Link
          to="/products"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary"
        >
          <FiX size={15} />
          Clear All Filters
        </Link>
      )}
    </aside>
  );
}
