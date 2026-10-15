
import { Link } from "react-router";
import { FiArrowUpRight } from "react-icons/fi";
import ProductCard from "../products/ProductCard";
import { featuredProducts } from "../../data/products";

export default function FeaturedProducts() {
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

        {/* Product cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
