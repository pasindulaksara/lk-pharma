
import { Link } from "react-router";
import {
  FiArrowRight,
  FiActivity,
  FiHeart,
  FiPackage,
  FiTool,
  FiLayers,
  FiSearch,
} from "react-icons/fi";

import { categories } from "../../data/categories";

const categoryIcons = [
  FiActivity,
  FiHeart,
  FiPackage,
  FiTool,
  FiLayers,
  FiSearch,
];

export default function ProductCategories() {
  return (
    <section className="section-space bg-white">
      <div className="container-site">

        {/* Section Heading */}
        <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="mb-3 block text-xs font-bold uppercase tracking-[0.18em] text-secondary">
              Explore Our Solutions
            </span>

            <h2 className="text-3xl font-bold tracking-tight text-heading md:text-4xl">
              Our Product Categories
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
              Explore our range of medical, healthcare,
              and laboratory products.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
          >
            View All Products
            <FiArrowRight size={17} />
          </Link>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const CategoryIcon = categoryIcons[index];

            return (
              <Link
                key={category.id}
                to={`/products/category/${category.slug}`}
                className="group relative flex min-h-[260px] flex-col justify-between overflow-hidden rounded-xl border border-border-light bg-[#F3F8FA] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-secondary/40 hover:shadow-lg"
              >

                {/* Background Image */}
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 w-[75%] bg-cover bg-center opacity-85 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  style={{
                    backgroundImage: `url("${category.image}")`,
                  }}
                />

                {/* Light Gradient Overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#F3F8FA] from-30% via-[#F3F8FA]/75 via-55% to-transparent" />

                {/* Card Content */}
                <div className="relative z-10 flex flex-1 flex-col justify-between">

                  {/* Icon and Title */}
                  <div>
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-primary shadow-sm backdrop-blur-sm transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                      <CategoryIcon size={22} />
                    </div>

                    <h3 className="max-w-[85%] text-xl font-semibold text-heading transition-colors group-hover:text-primary">
                      {category.name}
                    </h3>

                    <p className="mt-2 max-w-[72%] text-sm leading-6 text-muted">
                      {category.description}
                    </p>
                  </div>

                  {/* Explore Link */}
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                    Explore Category
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </div>

                </div>

                {/* Top Accent */}
                <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />

              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
