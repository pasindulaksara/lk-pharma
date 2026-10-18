 
import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
} from "react-router";

import {
  FiMenu,
  FiX,
  FiArrowUpRight,
  FiChevronDown,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";

import { navigation } from "../../data/navigation";
import { getCategories } from "../../services/catalogue";

import type { ApiCategory } from "../../types/catalogue";

// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getChildren(
  categories: ApiCategory[],
  parentId: number
): ApiCategory[] {
  return categories.filter(
    (item) => Number(item.parent_id) === parentId
  );
}

function getAncestorIds(
  categories: ApiCategory[],
  categorySlug: string
): number[] {
  const ancestors: number[] = [];

  let current = categories.find(
    (item) => item.slug === categorySlug
  );

  const visited = new Set<number>();

  while (
    current &&
    current.parent_id !== null &&
    Number(current.parent_id) !== 0
  ) {
    const parentId = Number(current.parent_id);

    if (visited.has(parentId)) break;

    visited.add(parentId);
    ancestors.push(parentId);

    current = categories.find(
      (item) => Number(item.id) === parentId
    );
  }

  return ancestors;
}

function categoryUrl(
  rootSlug: string,
  subSlug?: string
): string {
  const base = `/products/category/${encodeURIComponent(
    rootSlug
  )}`;

  if (!subSlug) return base;

  return `${base}?sub=${encodeURIComponent(subSlug)}`;
}

// --------------------------------------------------
// Nested Category Tree
// --------------------------------------------------

interface CategoryTreeProps {
  categories: ApiCategory[];
  rootSlug: string;
  closeMenu: () => void;
  selectedSubcategory?: string;
  parentId: number;
  depth?: number;
}

function CategoryTree({
  categories,
  rootSlug,
  closeMenu,
  selectedSubcategory = "",
  parentId,
  depth = 0,
}: CategoryTreeProps) {
  const nodes = getChildren(categories, parentId);

  if (nodes.length === 0) return null;

  return (
    <div
      className={
        depth === 0
          ? "space-y-1"
          : "mt-1 space-y-1"
      }
    >
      {nodes.map((node) => (
        <CategoryTreeNode
          key={node.id}
          node={node}
          categories={categories}
          rootSlug={rootSlug}
          depth={depth}
          closeMenu={closeMenu}
          selectedSubcategory={selectedSubcategory}
        />
      ))}
    </div>
  );
}

interface CategoryTreeNodeProps {
  node: ApiCategory;
  categories: ApiCategory[];
  rootSlug: string;
  depth: number;
  closeMenu: () => void;
  selectedSubcategory: string;
}

function CategoryTreeNode({
  node,
  categories,
  rootSlug,
  depth,
  closeMenu,
  selectedSubcategory,
}: CategoryTreeNodeProps) {
  const hasChildren = categories.some(
    (item) =>
      Number(item.parent_id) === Number(node.id)
  );

  const isSelected =
    selectedSubcategory === node.slug;

  const isAncestor =
    selectedSubcategory !== "" &&
    getAncestorIds(
      categories,
      selectedSubcategory
    ).includes(Number(node.id));

  const [manualOpen, setManualOpen] = useState<
    boolean | null
  >(null);

  const isOpen = manualOpen ?? isAncestor;

  const target = categoryUrl(
    rootSlug,
    node.slug
  );

  return (
    <div>
      <div
        className={`flex items-center rounded-lg transition-colors ${
          isSelected
            ? "bg-section text-primary"
            : "text-body hover:bg-section"
        }`}
        style={{
          paddingLeft: `${depth * 14 + 8}px`,
        }}
      >
        <Link
          to={target}
          onClick={closeMenu}
          className={`min-w-0 flex-1 py-2.5 pr-2 text-[13px] leading-5 transition-colors hover:text-primary ${
            isSelected
              ? "font-semibold"
              : "font-medium"
          }`}
        >
          {node.name}
        </Link>

        {hasChildren && (
          <button
            type="button"
            aria-label={`${
              isOpen ? "Collapse" : "Expand"
            } ${node.name}`}
            aria-expanded={isOpen}
            onClick={() => setManualOpen(!isOpen)}
            className="mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-white hover:text-primary"
          >
            {isOpen ? (
              <FiChevronDown size={15} />
            ) : (
              <FiChevronRight size={15} />
            )}
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <CategoryTree
          categories={categories}
          rootSlug={rootSlug}
          parentId={Number(node.id)}
          depth={depth + 1}
          closeMenu={closeMenu}
          selectedSubcategory={selectedSubcategory}
        />
      )}
    </div>
  );
}

// --------------------------------------------------
// Header
// --------------------------------------------------

export default function Header() {
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  const [isMegaOpen, setIsMegaOpen] =
    useState(false);

  const [categories, setCategories] =
    useState<ApiCategory[]>([]);

  const [categoriesLoading, setCategoriesLoading] =
    useState(true);

  const [categoriesError, setCategoriesError] =
    useState(false);

  const [activeCategory, setActiveCategory] =
    useState("");

  const [mobileExpanded, setMobileExpanded] =
    useState<string[]>([]);

  // --------------------------------------------------
  // Load Categories from PHP API
  // --------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    async function loadCategories() {
      setCategoriesLoading(true);
      setCategoriesError(false);

      try {
        const response = await getCategories(
          controller.signal
        );

        if (controller.signal.aborted) return;

        if (!response.success) {
          throw new Error(
            "Unable to load categories"
          );
        }

        setCategories(response.data || []);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error(
          "Header category loading error:",
          error
        );

        setCategoriesError(true);
      } finally {
        if (!controller.signal.aborted) {
          setCategoriesLoading(false);
        }
      }
    }

    void loadCategories();

    return () => controller.abort();
  }, []);

  // Only top-level MySQL categories belong
  // in the left column of the mega menu.
  const rootCategories = useMemo(
    () =>
      categories.filter(
        (category) =>
          category.parent_id === null ||
          Number(category.parent_id) === 0
      ),
    [categories]
  );

  const isProductsActive =
    location.pathname.startsWith("/products");

  const currentCategory =
    location.pathname.match(
      /^\/products\/category\/([^/]+)\/?$/
    )?.[1] || "";

  const selectedSubcategory =
    new URLSearchParams(
      location.search
    ).get("sub") ?? "";

  // --------------------------------------------------
  // Close Menus on Navigation
  // --------------------------------------------------

  useEffect(() => {
    setIsMenuOpen(false);
    setIsMegaOpen(false);
  }, [
    location.pathname,
    location.search,
  ]);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsMegaOpen(false);
  };

  const toggleMobileCategory = (
    slug: string
  ) => {
    setMobileExpanded((previous) =>
      previous.includes(slug)
        ? previous.filter(
            (item) => item !== slug
          )
        : [...previous, slug]
    );
  };

  // Prefer the category currently being browsed.
  // Otherwise show the first main category.
  const highlightedCategory =
    rootCategories.find(
      (item) =>
        item.slug === activeCategory
    ) ||
    rootCategories.find(
      (item) =>
        item.slug === currentCategory
    ) ||
    rootCategories[0];

  return (
    <header
      className="sticky top-0 z-50 bg-white shadow-sm"
      onMouseLeave={() =>
        setIsMegaOpen(false)
      }
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsMegaOpen(false);
          setIsMenuOpen(false);
        }
      }}
    >
      {/* Main Header */}
      <div className="border-b border-border-light">
        <div className="container-site flex h-20 items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenus}
            className="flex shrink-0 items-center"
          >
            <img
              src="/images/logo/logo.jpeg"
              alt="CHETSA Life Sciences Technology"
              className="h-12 w-auto max-w-44 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-9 lg:flex"
          >
            {navigation.map((item) => {
              if (item.path === "/products") {
                return (
                  <div
                    key={item.path}
                    className="relative"
                    onMouseEnter={() =>
                      setIsMegaOpen(true)
                    }
                  >
                    <button
                      type="button"
                      aria-expanded={isMegaOpen}
                      aria-controls="products-mega-menu"
                      onClick={() =>
                        setIsMegaOpen(
                          (previous) => !previous
                        )
                      }
                      className={`relative flex items-center gap-1.5 py-7 text-sm font-semibold transition-colors ${
                        isProductsActive || isMegaOpen
                          ? "text-primary"
                          : "text-body hover:text-primary"
                      }`}
                    >
                      Products

                      <FiChevronDown
                        size={14}
                        className={`transition-transform duration-200 ${
                          isMegaOpen
                            ? "rotate-180"
                            : ""
                        }`}
                      />

                      {(isProductsActive ||
                        isMegaOpen) && (
                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary" />
                      )}
                    </button>
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onMouseEnter={() =>
                    setIsMegaOpen(false)
                  }
                  onClick={closeMenus}
                  className={({ isActive }) =>
                    `relative py-7 text-sm font-semibold transition-colors duration-200 ${
                      isActive
                        ? "text-primary"
                        : "text-body hover:text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}

                      {isActive && (
                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center lg:flex">
            <Link
              to="/contact"
              onMouseEnter={() =>
                setIsMegaOpen(false)
              }
              onClick={closeMenus}
              className="btn-primary gap-2 text-sm"
            >
              Get a Quote

              <FiArrowUpRight size={17} />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            type="button"
            onClick={() => {
              setIsMenuOpen(
                (previous) => !previous
              );

              setIsMegaOpen(false);
            }}
            className="rounded-lg p-2 text-primary transition-colors hover:bg-section lg:hidden"
            aria-label={
              isMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <FiX size={26} />
            ) : (
              <FiMenu size={26} />
            )}
          </button>
        </div>
      </div>

      {/* Desktop Products Mega Menu */}
      {isMegaOpen && (
        <div
          id="products-mega-menu"
          className="absolute inset-x-0 top-full hidden border-b border-border-light bg-white shadow-[0_22px_40px_-20px_rgba(32,84,128,0.18)] lg:block"
        >
          <div className="container-site py-7">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  EXPLORE OUR SOLUTIONS
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-heading">
                  Product Catalogue
                </h2>
              </div>

              <Link
                to="/products"
                onClick={closeMenus}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary"
              >
                View All Products

                <FiArrowUpRight size={17} />
              </Link>
            </div>

            <div className="grid overflow-hidden rounded-2xl border border-border-light lg:grid-cols-[330px_minmax(0,1fr)]">

              {/* Main Categories */}
              <div className="max-h-[min(65vh,520px)] overflow-y-auto border-r border-border-light bg-section p-3">

                {categoriesLoading && (
                  <p className="px-4 py-4 text-sm text-muted">
                    Loading categories...
                  </p>
                )}

                {categoriesError && (
                  <p
                    role="alert"
                    className="px-4 py-4 text-sm text-muted"
                  >
                    Categories are temporarily unavailable.
                  </p>
                )}

                {!categoriesLoading &&
                  !categoriesError &&
                  rootCategories.map((category) => {
                    const active =
                      highlightedCategory?.slug ===
                      category.slug;

                    return (
                      <div
                        key={category.id}
                        onMouseEnter={() =>
                          setActiveCategory(
                            category.slug
                          )
                        }
                        className={`flex items-center rounded-xl transition-colors ${
                          active
                            ? "bg-white text-primary shadow-sm"
                            : "text-body hover:bg-white/70"
                        }`}
                      >
                        <Link
                          to={categoryUrl(
                            category.slug
                          )}
                          onClick={closeMenus}
                          onFocus={() =>
                            setActiveCategory(
                              category.slug
                            )
                          }
                          className={`min-w-0 flex-1 px-4 py-3 text-[13px] leading-5 ${
                            active
                              ? "font-semibold"
                              : "font-medium"
                          }`}
                        >
                          {category.name}
                        </Link>

                        <button
                          type="button"
                          onClick={() =>
                            setActiveCategory(
                              category.slug
                            )
                          }
                          aria-label={`Show subcategories of ${category.name}`}
                          className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg hover:bg-section"
                        >
                          <FiChevronRight
                            size={16}
                          />
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Nested Subcategories */}
              <div className="max-h-[min(65vh,520px)] overflow-y-auto p-7">
                {highlightedCategory &&
                  !categoriesLoading &&
                  !categoriesError && (
                    <>
                      <div className="flex items-start justify-between gap-5 border-b border-border-light pb-5">
                        <div>
                          <h3 className="text-lg font-semibold tracking-tight text-heading">
                            {highlightedCategory.name}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-muted">
                            Browse products and solutions
                            in this category.
                          </p>
                        </div>

                        <Link
                          to={categoryUrl(
                            highlightedCategory.slug
                          )}
                          onClick={closeMenus}
                          aria-label={`Browse ${highlightedCategory.name}`}
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-light text-primary hover:bg-section"
                        >
                          <FiArrowUpRight
                            size={18}
                          />
                        </Link>
                      </div>

                      <div className="mt-5">
                        {getChildren(
                          categories,
                          Number(highlightedCategory.id)
                        ).length > 0 ? (
                          <CategoryTree
                            key={highlightedCategory.id}
                            categories={categories}
                            rootSlug={
                              highlightedCategory.slug
                            }
                            parentId={Number(
                              highlightedCategory.id
                            )}
                            selectedSubcategory={
                              highlightedCategory.slug ===
                              currentCategory
                                ? selectedSubcategory
                                : ""
                            }
                            closeMenu={closeMenus}
                          />
                        ) : (
                          <p className="py-4 text-sm leading-6 text-muted">
                            Browse all products in
                            this category.
                          </p>
                        )}
                      </div>
                    </>
                  )}

                <div className="mt-7 border-t border-border-light pt-5">
                  <Link
                    to="/products"
                    onClick={closeMenus}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-secondary"
                  >
                    Explore Complete Catalogue

                    <FiArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-border-light bg-white lg:hidden"
        >
          <div className="container-site flex flex-col gap-1 py-5">
            {navigation.map((item) => {
              if (item.path === "/products") {
                return (
                  <div key={item.path}>
                    <div className="flex items-center rounded-lg hover:bg-section">
                      <Link
                        to="/products"
                        onClick={closeMenus}
                        className={`flex-1 px-4 py-3 text-sm font-medium ${
                          isProductsActive
                            ? "text-primary"
                            : "text-body"
                        }`}
                      >
                        Products
                      </Link>

                      <button
                        type="button"
                        aria-label="Expand product categories"
                        aria-expanded={mobileExpanded.includes(
                          "products"
                        )}
                        onClick={() =>
                          toggleMobileCategory(
                            "products"
                          )
                        }
                        className="flex h-11 w-11 items-center justify-center text-primary"
                      >
                        {mobileExpanded.includes(
                          "products"
                        ) ? (
                          <FiChevronDown />
                        ) : (
                          <FiChevronRight />
                        )}
                      </button>
                    </div>

                    {mobileExpanded.includes(
                      "products"
                    ) && (
                      <div className="mt-1 space-y-1 border-l border-border-light pl-3">

                        {categoriesLoading && (
                          <p className="px-3 py-3 text-xs text-muted">
                            Loading categories...
                          </p>
                        )}

                        {!categoriesLoading &&
                          categoriesError && (
                            <p className="px-3 py-3 text-xs text-muted">
                              Categories are temporarily unavailable.
                            </p>
                          )}

                        {!categoriesLoading &&
                          !categoriesError &&
                          rootCategories.map(
                            (category) => {
                              const expanded =
                                mobileExpanded.includes(
                                  category.slug
                                );

                              const hasChildren =
                                getChildren(
                                  categories,
                                  Number(category.id)
                                ).length > 0;

                              return (
                                <div
                                  key={category.id}
                                >
                                  <div className="flex items-center rounded-lg hover:bg-section">
                                    <Link
                                      to={categoryUrl(
                                        category.slug
                                      )}
                                      onClick={
                                        closeMenus
                                      }
                                      className="min-w-0 flex-1 px-3 py-3 text-[13px] font-medium leading-5 text-heading"
                                    >
                                      {
                                        category.name
                                      }
                                    </Link>

                                    {hasChildren && (
                                      <button
                                        type="button"
                                        aria-label={`${
                                          expanded
                                            ? "Collapse"
                                            : "Expand"
                                        } ${
                                          category.name
                                        }`}
                                        aria-expanded={
                                          expanded
                                        }
                                        onClick={() =>
                                          toggleMobileCategory(
                                            category.slug
                                          )
                                        }
                                        className="flex h-10 w-10 shrink-0 items-center justify-center text-primary"
                                      >
                                        {expanded ? (
                                          <FiChevronDown />
                                        ) : (
                                          <FiChevronRight />
                                        )}
                                      </button>
                                    )}
                                  </div>

                                  {expanded &&
                                    hasChildren && (
                                      <div className="pl-2">
                                        <CategoryTree
                                          categories={
                                            categories
                                          }
                                          rootSlug={
                                            category.slug
                                          }
                                          parentId={Number(
                                            category.id
                                          )}
                                          selectedSubcategory={
                                            category.slug ===
                                            currentCategory
                                              ? selectedSubcategory
                                              : ""
                                          }
                                          closeMenu={
                                            closeMenus
                                          }
                                        />
                                      </div>
                                    )}
                                </div>
                              );
                            }
                          )}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={closeMenus}
                  className={({ isActive }) =>
                    `rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-section text-primary"
                        : "text-body hover:bg-section hover:text-primary"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}

            <Link
              to="/contact"
              onClick={closeMenus}
              className="btn-primary mt-4 gap-2"
            >
              Get a Quote

              <FiArrowUpRight size={17} />
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
