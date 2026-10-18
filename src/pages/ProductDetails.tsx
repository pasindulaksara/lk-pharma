 
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiChevronDown,
  FiDownload,
  FiFileText,
  FiImage,
  FiLayers,
} from "react-icons/fi";

import ProductCard from "../components/products/ProductCard";
import { getProduct, getProducts } from "../services/catalogue";
import { resolveAssetUrl } from "../services/api";

import type { Product } from "../data/products";
import type {
  ApiProduct,
  ApiProductDetail,
} from "../types/catalogue";

type Tab = "overview" | "specifications" | "documents";

type Specification = ApiProductDetail["specifications"][number];

function mapProduct(item: ApiProduct): Product {
  return {
    id: Number(item.id),
    name: item.name,
    slug: item.slug,
    code: item.sku || "",
    category: item.category_name || "",
    categorySlug: item.category_slug || "",
    brandSlug: item.brand_slug || undefined,
    image: resolveAssetUrl(item.main_image),
    featured: Boolean(Number(item.featured)),
    description: item.short_description || "",
    specifications: [],
  };
}

// Example:
// "Technical specifications — Model: NC 23B"
// becomes "NC 23B".
function modelFromGroup(group: string): string {
  const match = group.match(/\bModel\s*:\s*(.+)$/i);
  return match ? match[1].trim() : "";
}

function normalized(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function cleanGroupName(group: string): string {
  return group
    .replace(/\s*[—–-]\s*Model\s*:.+$/i, "")
    .trim() || "General Specifications";
}

function ProductDetailsContent({
  product,
  relatedProducts,
}: {
  product: ApiProductDetail;
  relatedProducts: Product[];
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedModel, setSelectedModel] = useState("");
  const [expandedOverview, setExpandedOverview] = useState(false);
  const [imageError, setImageError] = useState(false);

  const specs = useMemo(
    () => product.specifications || [],
    [product.specifications]
  );

  const documents = product.documents || [];

  // Collect model names from both model records and spec groups.
  // This also works if models.csv was incomplete.
  const availableModels = useMemo(() => {
    const names: string[] = [];

    for (const model of product.models || []) {
      const name = (
        model.model_number ||
        model.model_name ||
        ""
      ).trim();

      if (
        name &&
        !names.some((existing) =>
          normalized(existing) === normalized(name)
        )
      ) {
        names.push(name);
      }
    }

    for (const spec of specs) {
      const name = modelFromGroup(spec.group_name || "");

      if (
        name &&
        !names.some((existing) =>
          normalized(existing) === normalized(name)
        )
      ) {
        names.push(name);
      }
    }

    return names;
  }, [product.models, specs]);

  const activeModel = selectedModel || availableModels[0] || "";

  // Show general specs plus specifications belonging to
  // the selected model only.
  const visibleSpecs = useMemo(() => {
    return specs.filter((spec) => {
      const groupModel = modelFromGroup(spec.group_name || "");

      if (!groupModel) return true;
      if (!activeModel) return true;

      return normalized(groupModel) === normalized(activeModel);
    });
  }, [specs, activeModel]);

  const specGroups = useMemo(() => {
    const groups: Record<string, Specification[]> = {};

    for (const spec of visibleSpecs) {
      const title = cleanGroupName(spec.group_name || "");

      if (!groups[title]) groups[title] = [];

      groups[title].push(spec);
    }

    return Object.entries(groups);
  }, [visibleSpecs]);

  const fullDescription =
    product.description?.trim() ||
    product.short_description?.trim() ||
    "";

  const overviewText =
    !expandedOverview && fullDescription.length > 550
      ? fullDescription.slice(0, 550).trimEnd() + "..."
      : fullDescription;

  const mainImage = resolveAssetUrl(product.main_image);

  const enquiryReference =
    activeModel || product.sku || product.name;

  const enquiryUrl =
    `/contact?product=${encodeURIComponent(enquiryReference)}`;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "specifications", label: "Technical Specifications" },
    { id: "documents", label: "Documents" },
  ];

  return (
    <div className="bg-white">
      <section className="py-10 md:py-14">
        <div className="container-site">

          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap items-center gap-2 text-xs text-slate-500"
          >
            <Link to="/" className="hover:text-primary">
              Home
            </Link>

            <span>/</span>

            <Link to="/products" className="hover:text-primary">
              Products
            </Link>

            {product.category_slug && (
              <>
                <span>/</span>
                <Link
                  to={`/products/category/${product.category_slug}`}
                  className="hover:text-primary"
                >
                  {product.category_name}
                </Link>
              </>
            )}

            <span>/</span>

            <span className="text-heading">
              {product.name}
            </span>
          </nav>

          {/* Product Header */}
          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">

            {/* Image */}
            <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] p-8 md:p-12">
              {mainImage && !imageError ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  loading="eager"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="h-full w-full object-contain mix-blend-multiply"
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-slate-400">
                  <FiImage size={40} />
                  <span className="text-sm">
                    Product image unavailable
                  </span>
                </div>
              )}
            </div>

            {/* Product Summary */}
            <div className="lg:pt-4">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                {product.category_name || "Scientific Equipment"}
              </p>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-heading md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-b border-slate-100 pb-6 text-sm">
                {product.brand_name && (
                  <div>
                    <span className="text-slate-500">
                      Manufacturer
                    </span>
                    <p className="mt-1 font-semibold text-slate-900">
                      {product.brand_name}
                    </p>
                  </div>
                )}

                {product.sku?.trim() && (
                  <div>
                    <span className="text-slate-500">
                      Product Code
                    </span>
                    <p className="mt-1 font-semibold text-slate-900">
                      {product.sku}
                    </p>
                  </div>
                )}
              </div>

              {/* Short introduction, not the entire scraped text */}
              {fullDescription && (
                <p className="mt-6 line-clamp-4 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {product.short_description?.trim() &&
                  product.short_description.trim().length > 50
                    ? product.short_description
                    : fullDescription.slice(0, 320)}
                </p>
              )}

              {/* Model Selector */}
              {availableModels.length > 1 && (
                <div className="mt-8 rounded-xl border border-slate-200 bg-[#F8FAFC] p-5">
                  <label
                    htmlFor="product-model"
                    className="block text-sm font-semibold text-slate-900"
                  >
                    Select Product Model
                  </label>

                  <div className="relative mt-3">
                    <select
                      id="product-model"
                      value={activeModel}
                      onChange={(event) =>
                        setSelectedModel(event.target.value)
                      }
                      className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 pr-10 text-sm font-medium text-heading outline-none focus:border-primary"
                    >
                      {availableModels.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>

                    <FiChevronDown
                      size={17}
                      className="pointer-events-none absolute right-4 top-4 text-slate-500"
                    />
                  </div>

                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Select a model to view its technical specifications.
                  </p>

                  <button
                    type="button"
                    onClick={() => setTab("specifications")}
                    className="mt-3 text-xs font-semibold text-primary hover:text-secondary"
                  >
                    View model specifications →
                  </button>
                </div>
              )}

              {/* Enquiry */}
              <div className="mt-8">
                <Link
                  to={enquiryUrl}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Enquire About This Product
                  <FiArrowUpRight size={18} />
                </Link>

                <p className="mt-3 text-xs text-slate-500">
                  Contact our team for availability and product information.
                </p>
              </div>

              {/* PDF Quick Link */}
              {documents.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTab("documents")}
                  className="mt-5 flex items-center gap-2 text-sm font-medium text-primary hover:text-secondary"
                >
                  <FiFileText size={17} />
                  View Product Catalogues
                  <FiArrowUpRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Information Tabs */}
          <div className="mt-14 border-b border-slate-200">
            <div
              role="tablist"
              aria-label="Product information"
              className="flex gap-6 overflow-x-auto sm:gap-9"
            >
              {tabs.map((item) => (
                <button
                  key={item.id}
                  id={`tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={tab === item.id}
                  aria-controls={`panel-${item.id}`}
                  onClick={() => setTab(item.id)}
                  className={`shrink-0 border-b-2 pb-4 text-sm font-semibold transition-colors ${
                    tab === item.id
                      ? "border-primary text-primary"
                      : "border-transparent text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Overview */}
          {tab === "overview" && (
            <div
              id="panel-overview"
              role="tabpanel"
              aria-labelledby="tab-overview"
              className="max-w-4xl py-10"
            >
              <h2 className="text-xl font-semibold text-heading">
                Product Overview
              </h2>

              {fullDescription ? (
                <>
                  <div className="mt-5 whitespace-pre-line break-words text-sm leading-8 text-slate-600">
                    {overviewText}
                  </div>

                  {fullDescription.length > 550 && (
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedOverview((previous) => !previous)
                      }
                      className="mt-5 text-sm font-semibold text-primary hover:text-secondary"
                    >
                      {expandedOverview
                        ? "Show Less"
                        : "Read Full Description"}
                    </button>
                  )}
                </>
              ) : (
                <p className="mt-5 text-sm text-slate-500">
                  Product overview is not available yet.
                </p>
              )}
            </div>
          )}

          {/* Technical Specifications */}
          {tab === "specifications" && (
            <div
              id="panel-specifications"
              role="tabpanel"
              aria-labelledby="tab-specifications"
              className="py-10"
            >
              <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FiLayers size={20} className="text-primary" />

                  <div>
                    <h2 className="text-xl font-semibold text-heading">
                      Technical Specifications
                    </h2>

                    {activeModel && (
                      <p className="mt-1 text-sm text-slate-500">
                        Model: {activeModel}
                      </p>
                    )}
                  </div>
                </div>

                {availableModels.length > 1 && (
                  <select
                    aria-label="Choose specification model"
                    value={activeModel}
                    onChange={(event) =>
                      setSelectedModel(event.target.value)
                    }
                    className="h-11 min-w-40 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium outline-none focus:border-primary"
                  >
                    {availableModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {visibleSpecs.length > 0 ? (
                <div className="max-w-5xl space-y-8">
                  {specGroups.map(([groupName, groupSpecs]) => (
                    <div key={groupName}>
                      <h3 className="mb-3 text-sm font-semibold text-heading">
                        {groupName}
                      </h3>

                      <div className="overflow-hidden rounded-xl border border-slate-200">
                        {groupSpecs.map((spec, index) => (
                          <div
                            key={`${groupName}-${spec.spec_name}-${index}`}
                            className={`grid gap-2 px-5 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] ${
                              index % 2 === 0
                                ? "bg-[#F8FAFC]"
                                : "bg-white"
                            } ${
                              index !== groupSpecs.length - 1
                                ? "border-b border-slate-100"
                                : ""
                            }`}
                          >
                            <span className="text-slate-600">
                              {spec.spec_name}
                            </span>

                            <span className="whitespace-pre-line break-words font-medium text-slate-900">
                              {spec.spec_value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-slate-200 bg-[#F8FAFC] p-6 text-sm text-slate-500">
                  Technical specifications are not available for
                  this model yet.
                </div>
              )}
            </div>
          )}

          {/* Documents */}
          {tab === "documents" && (
            <div
              id="panel-documents"
              role="tabpanel"
              aria-labelledby="tab-documents"
              className="max-w-3xl py-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <FiFileText size={20} className="text-primary" />

                <h2 className="text-xl font-semibold text-heading">
                  Product Documents
                </h2>
              </div>

              {documents.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  {documents.map((document, index) => {
                    const url = resolveAssetUrl(
                      document.file_url
                    );

                    if (!url) return null;

                    return (
                      <a
                        key={`${url}-${index}`}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-5 text-sm transition-colors last:border-b-0 hover:bg-[#F8FAFC]"
                      >
                        <span className="flex items-center gap-3 font-medium text-slate-800">
                          <FiFileText
                            className="shrink-0 text-primary"
                            size={19}
                          />
                          {document.title || "Product Document"}
                        </span>

                        <FiDownload
                          size={18}
                          className="shrink-0 text-primary"
                        />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="rounded-xl border border-slate-200 p-6 text-sm text-slate-500">
                  Product brochures and datasheets will be
                  available when supplied by the manufacturer.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-100 bg-[#F8FAFC] py-14">
          <div className="container-site">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-heading">
                Related Products
              </h2>

              <Link
                to={`/products/category/${product.category_slug}`}
                className="text-sm font-medium text-primary hover:text-secondary"
              >
                View Category
                <FiArrowUpRight size={16} className="ml-2 inline" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  product={item}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function ProductDetails() {
  const { productSlug } = useParams();

  const [product, setProduct] =
    useState<ApiProductDetail | null>(null);

  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);
      setRelatedProducts([]);

      if (!productSlug) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      try {
        const response = await getProduct(
          productSlug,
          controller.signal
        );

        if (controller.signal.aborted) return;

        if (!response.success || !response.data?.id) {
          setError("Product not found.");
          return;
        }

        const current = response.data;
        setProduct(current);

        if (current.category_slug) {
          try {
            const relatedResponse = await getProducts(
              {
                category: current.category_slug,
                limit: 24,
                page: 1,
              },
              controller.signal
            );

            if (controller.signal.aborted) return;

            setRelatedProducts(
              (relatedResponse.data || [])
                .filter(
                  (item) =>
                    Number(item.id) !== Number(current.id)
                )
                .slice(0, 3)
                .map(mapProduct)
            );
          } catch (relatedError) {
            if (!controller.signal.aborted) {
              console.error(
                "Related products error:",
                relatedError
              );
            }
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Product details error:", err);
        setError("Unable to load product information.");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadProduct();

    return () => controller.abort();
  }, [productSlug]);

  if (loading) {
    return (
      <div className="container-site py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-2xl bg-[#F8FAFC]" />
          <div className="space-y-5 py-10">
            <div className="h-5 w-28 animate-pulse rounded bg-slate-100" />
            <div className="h-12 w-4/5 animate-pulse rounded bg-slate-100" />
            <div className="h-6 w-2/3 animate-pulse rounded bg-slate-100" />
            <div className="h-12 w-48 animate-pulse rounded bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <section className="container-site py-24 text-center">
        <h1 className="text-3xl font-semibold text-heading">
          {error === "Product not found."
            ? "Product Not Found"
            : "Unable to Load Product"}
        </h1>

        <p className="mt-4 text-sm text-slate-500">
          {error || "This product is unavailable."}
        </p>

        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 text-primary"
        >
          <FiArrowLeft />
          Back to Products
        </Link>
      </section>
    );
  }

  return (
    <ProductDetailsContent
      key={product.id}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
