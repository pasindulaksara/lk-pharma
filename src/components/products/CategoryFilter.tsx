
import { useState } from "react";
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

import { categories } from "../../data/categories";
import {
  catalogueBrands,
  catalogueSubcategories,
  getAncestorIds,
  type CatalogueSubcategory,
} from "../../data/catalogue";

interface TreeNodeProps {
  item: CatalogueSubcategory;
  selectedId: string;
  makeUrl: (category: string, sub?: string) => string;
  depth?: number;
}

function TreeNode({
  item,
  selectedId,
  makeUrl,
  depth = 0,
}: TreeNodeProps) {
  const children = catalogueSubcategories.filter(
    (node) => node.parentId === item.id
  );

  const selected = item.id === selectedId;
  const hasSelectedDescendant =
    getAncestorIds(selectedId).includes(item.id);

  const [manuallyOpen, setManuallyOpen] = useState(false);
  const [manuallyClosed, setManuallyClosed] = useState(false);

  const isOpen = manuallyClosed
    ? false
    : manuallyOpen || hasSelectedDescendant;

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
          to={makeUrl(item.categorySlug, item.id)}
          className={`min-w-0 flex-1 py-2.5 pr-2 text-[13px] ${
            selected ? "font-semibold" : ""
          }`}
        >
          {item.name}
        </Link>

        {children.length > 0 ? (
          <button
            type="button"
            aria-label={`${isOpen ? "Collapse" : "Expand"} ${item.name}`}
            aria-expanded={isOpen}
            onClick={() => {
              if (isOpen) {
                setManuallyOpen(false);
                setManuallyClosed(true);
              } else {
                setManuallyOpen(true);
                setManuallyClosed(false);
              }
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
          >
            {isOpen ? (
              <FiChevronDown size={15} />
            ) : (
              <FiChevronRight size={15} />
            )}
          </button>
        ) : selected ? (
          <FiCheck size={14} className="mr-3 shrink-0" />
        ) : null}
      </div>

      {children.length > 0 && isOpen && (
        <div className="mt-0.5">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              selectedId={selectedId}
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
  const [searchParams, setSearchParams] = useSearchParams();

  const activeCategory =
    pathname.match(/^\/products\/category\/([^/]+)/)?.[1] || "";

  const activeSubcategory = searchParams.get("sub") || "";
  const selectedBrands = searchParams.getAll("brand");

  const [openCategories, setOpenCategories] = useState<string[]>([]);
  const [brandQuery, setBrandQuery] = useState("");

  const makeUrl = (category: string, sub?: string) => {
    const params = new URLSearchParams(searchParams);

    params.delete("sub");
    params.delete("page");

    if (sub) params.set("sub", sub);

    const path = category
      ? `/products/category/${category}`
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

      updated.forEach((item) => next.append("brand", item));
      return next;
    });
  };

  const matchingBrands = catalogueBrands.filter((brand) =>
    brand.name.toLowerCase().includes(brandQuery.toLowerCase())
  );

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <aside className="rounded-2xl border border-slate-200/80 bg-white p-4">
      {/* Categories */}
      <div className="border-b border-slate-100 px-2 pb-4">
        <h2 className="text-sm font-semibold text-slate-900">
          Product Categories
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Browse our product range
        </p>
      </div>

      <nav aria-label="Product categories" className="mt-3 space-y-1">
        <Link
          to={makeUrl("")}
          className={`flex items-center justify-between rounded-lg px-3 py-3 text-sm transition-colors ${
            !activeCategory
              ? "bg-[#EEF5F9] font-semibold text-primary"
              : "text-slate-600 hover:bg-slate-50 hover:text-primary"
          }`}
        >
          All Products
          {!activeCategory && <FiCheck size={16} />}
        </Link>

        {categories.map((category) => {
          const selected = activeCategory === category.slug;
          const roots = catalogueSubcategories.filter(
            (item) =>
              item.categorySlug === category.slug &&
              item.parentId === null
          );

          const isOpen =
            selected || openCategories.includes(category.slug);

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

                {roots.length > 0 && (
                  <button
                    type="button"
                    aria-label={`${isOpen ? "Collapse" : "Expand"} ${category.name}`}
                    aria-expanded={isOpen}
                    onClick={() => toggleCategory(category.slug)}
                    className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-slate-100"
                  >
                    {isOpen ? (
                      <FiChevronDown size={15} />
                    ) : (
                      <FiChevronRight size={15} />
                    )}
                  </button>
                )}
              </div>

              {isOpen && roots.length > 0 && (
                <div className="py-1">
                  {roots.map((root) => (
                    <TreeNode
                      key={`${category.slug}-${root.id}`}
                      item={root}
                      selectedId={activeSubcategory}
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
            onChange={(event) => setBrandQuery(event.target.value)}
            placeholder="Search brands..."
            aria-label="Search brands"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-primary"
          />
        </div>

        <div className="mt-3 max-h-52 space-y-1 overflow-y-auto">
          {matchingBrands.map((brand) => (
            <label
              key={brand.slug}
              className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.slug)}
                onChange={() => toggleBrand(brand.slug)}
                className="h-4 w-4 accent-primary"
              />
              <span>{brand.name}</span>
            </label>
          ))}

          {matchingBrands.length === 0 && (
            <p className="px-2 py-2 text-xs text-slate-500">
              No matching brands
            </p>
          )}
        </div>
      </div>

      {/* Clear */}
      {(activeCategory ||
        activeSubcategory ||
        selectedBrands.length > 0 ||
        searchParams.has("q")) && (
        <Link
          to="/products"
          onClick={() => {
            // Navigation clears URL filters.
          }}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary"
        >
          <FiX size={15} />
          Clear All Filters
        </Link>
      )}
    </aside>
  );
}
