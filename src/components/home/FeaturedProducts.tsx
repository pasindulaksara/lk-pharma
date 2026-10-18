
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { FiArrowUpRight } from "react-icons/fi";

import ProductCard from "../products/ProductCard";
import { getProducts } from "../../services/catalogue";
import { resolveAssetUrl } from "../../services/api";

import type { Product } from "../../data/products";
import type { ApiProduct } from "../../types/catalogue";

// Convert PHP product data to our existing ProductCard format.
// This lets us keep ProductCard.tsx completely unchanged.
function mapProduct(product: ApiProduct): Product {
  return {
    id: Number(product.id),
    name: product.name,
    slug: product.slug,
    code: product.sku || "",
    category: product.category_name,
    categorySlug: product.category_slug,
    brandSlug: product.brand_slug || undefined,
    image: resolveAssetUrl(product.main_image),
    featured: Boolean(Number(product.featured)),
    description: product.short_description || "",
    specifications: [],
  };
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function loadFeaturedProducts() {
      try {
        const response = await getProducts(
          { limit: 48 },
          controller.signal
        );

        if (controller.signal.aborted) return;

        const featured = response.data
          .filter((product) => Number(product.featured) === 1)
          .slice(0, 4)
          .map(mapProduct);

        setProducts(featured);
      } catch (err) {
        if (controller.signal.aborted) return;

        console.error("Failed to load featured products:", err);
        setError(true);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadFeaturedProducts();

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="container-site">

        {/* Section heading */}
        <div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              Discover Our Range
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-heading md:text-4xl">
              Featured Products
            </h2>

            <p className="mt-3 text-base leading-7 text-muted">
              Explore selected medical and laboratory
              products from our catalogue.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-secondary"
          >
            View all products
            <FiArrowUpRight size={17} />
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-border-light bg-white p-2"
              >
                <div className="aspect-[4/3] animate-pulse rounded-xl bg-section" />
                <div className="space-y-3 px-3 py-5">
                  <div className="h-3 w-24 animate-pulse rounded bg-section" />
                  <div className="h-5 w-4/5 animate-pulse rounded bg-section" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product cards — original ProductCard preserved */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}

        {/* No featured products */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-border-light bg-section px-6 py-12 text-center">
            <p className="text-sm text-muted">
              Featured products will be available soon.
            </p>
          </div>
        )}

        {/* API error */}
        {!loading && error && (
          <div className="rounded-2xl border border-border-light bg-section px-6 py-12 text-center">
            <p className="text-sm text-muted">
              Products are temporarily unavailable.
              Please try again later.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
