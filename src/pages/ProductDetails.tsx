
import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiDownload,
  FiFileText,
  FiLayers,
} from "react-icons/fi";

import { products } from "../data/products";
import { catalogueBrands } from "../data/catalogue";
import ProductCard from "../components/products/ProductCard";

export default function ProductDetails() {
  const { productSlug } = useParams();

  const product = products.find(
    (item) => item.slug === productSlug
  );

  if (!product) {
    return (
      <section className="container-site py-24 text-center">
        <h1 className="text-3xl font-semibold text-heading">
          Product Not Found
        </h1>

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
    <ProductDetailContent key={product.id} product={product} />
  );
}

type ProductType = (typeof products)[number];

function ProductDetailContent({
  product,
}: {
  product: ProductType;
}) {
  const gallery = product.images?.length
    ? product.images
    : [product.image];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);

  const brand = catalogueBrands.find(
    (item) => item.slug === product.brandSlug
  );

  const activeVariant = product.variants?.[selectedVariant];
  const enquiryCode = activeVariant?.sku ?? product.code;

  const enquiryUrl =
    `/contact?product=${encodeURIComponent(enquiryCode)}`;

  const relatedProducts = products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.categorySlug === product.categorySlug
    )
    .slice(0, 3);

  return (
    <div className="bg-white">
      <section className="py-10 md:py-16">
        <div className="container-site">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-10 flex flex-wrap items-center gap-2 text-sm text-slate-500"
          >
            <Link to="/" className="hover:text-primary">
              Home
            </Link>

            <span>/</span>

            <Link to="/products" className="hover:text-primary">
              Products
            </Link>

            <span>/</span>

            <Link
              to={`/products/category/${product.categorySlug}`}
              className="hover:text-primary"
            >
              {product.category}
            </Link>

            <span>/</span>

            <span className="text-heading">
              {product.name}
            </span>
          </nav>

          <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Gallery */}
            <div>
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-slate-200/80 bg-[#F8FAFC] p-8 md:p-12">
                <img
                  src={gallery[activeImage]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>

              {gallery.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {gallery.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-pressed={activeImage === index}
                      className={`h-20 w-20 overflow-hidden rounded-xl border p-2 transition-colors ${
                        activeImage === index
                          ? "border-primary"
                          : "border-slate-200 hover:border-slate-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                {product.category}
              </p>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-heading md:text-4xl">
                {product.name}
              </h1>

              <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 border-b border-slate-100 pb-6 text-sm">
                <div>
                  <span className="text-slate-500">
                    Product Code
                  </span>
                  <p className="mt-1 font-semibold text-slate-900">
                    {enquiryCode}
                  </p>
                </div>

                {brand && (
                  <div>
                    <span className="text-slate-500">
                      Manufacturer
                    </span>
                    <p className="mt-1 font-semibold text-slate-900">
                      {brand.name}
                    </p>
                  </div>
                )}
              </div>

              <p className="mt-7 text-base leading-8 text-body">
                {product.description}
              </p>

              {/* Variant Options */}
              {product.variants &&
                product.variants.length > 0 && (
                  <div className="mt-8">
                    <label
                      htmlFor="product-variant"
                      className="block text-sm font-semibold text-slate-900"
                    >
                      Available Options
                    </label>

                    <select
                      id="product-variant"
                      value={selectedVariant}
                      onChange={(event) =>
                        setSelectedVariant(Number(event.target.value))
                      }
                      className="mt-3 h-12 w-full max-w-sm rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none focus:border-primary"
                    >
                      {product.variants.map((variant, index) => (
                        <option key={variant.sku} value={index}>
                          {variant.label} — {variant.sku}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {/* Enquiry Button */}
              <div className="mt-9">
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
            </div>
          </div>

          {/* Specifications and Documents */}
          <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <FiLayers className="text-primary" size={19} />

                <h2 className="text-xl font-semibold text-heading">
                  Technical Specifications
                </h2>
              </div>

              {product.specifications.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200/80">
                  {product.specifications.map((spec) => (
                    <div
                      key={spec.label}
                      className="grid gap-2 border-b border-slate-100 px-5 py-4 text-sm last:border-b-0 sm:grid-cols-[200px_1fr]"
                    >
                      <span className="text-slate-500">
                        {spec.label}
                      </span>

                      <span className="font-medium text-slate-900">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="rounded-2xl border border-slate-200 p-6 text-sm text-slate-500">
                  Detailed technical specifications will be added soon.
                </p>
              )}
            </div>

            <div>
              <div className="mb-5 flex items-center gap-3">
                <FiFileText className="text-primary" size={19} />

                <h2 className="text-xl font-semibold text-heading">
                  Documents
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-200/80 p-4">
                {product.documents?.length ? (
                  <div className="space-y-2">
                    {product.documents.map((document) => (
                      <a
                        key={document.url}
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 rounded-lg p-3 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
                      >
                        <span>{document.title}</span>
                        <FiDownload className="shrink-0" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="p-2 text-sm leading-6 text-slate-500">
                    Product brochures and datasheets will be available
                    when supplied by the manufacturer.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="border-t border-slate-100 bg-[#F8FAFC] py-16">
          <div className="container-site">
            <div className="mb-8 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-bold tracking-tight text-heading">
                Related Products
              </h2>

              <Link
                to={`/products/category/${product.categorySlug}`}
                className="text-sm font-medium text-primary hover:text-secondary"
              >
                View Category
                <FiArrowUpRight
                  size={16}
                  className="ml-2 inline"
                />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
