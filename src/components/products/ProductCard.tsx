
import { Link } from "react-router";
import { FiArrowUpRight } from "react-icons/fi";
import type { Product } from "../../data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article
      className="
        group relative flex h-full flex-col
        rounded-2xl border border-slate-200/80
        bg-white p-2
        transition-all duration-300
        hover:-translate-y-0.5
        hover:border-slate-300
        hover:shadow-[0_12px_32px_-12px_rgba(15,23,42,0.12)]
      "
    >
      <Link
        to={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="flex h-full flex-col"
      >
        {/* Image surface */}
        <div
          className="
            relative aspect-[4/3] overflow-hidden
            rounded-xl bg-[#F8FAFC]
          "
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="
              h-full w-full object-contain
              p-7 mix-blend-multiply
              transition-transform duration-500
              ease-out group-hover:scale-[1.045]
            "
          />

          {/* Hover action */}
          <span
            className="
              absolute right-3 top-3
              flex h-9 w-9 items-center justify-center
              rounded-lg border border-slate-200
              bg-white/95 text-slate-700
              opacity-0 shadow-sm
              transition-all duration-200
              group-hover:opacity-100
              group-focus-within:opacity-100
            "
          >
            <FiArrowUpRight size={17} />
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-4 pb-4 pt-5">
          <p
            className="
              text-[11px] font-medium uppercase
              tracking-[0.12em] text-slate-500
            "
          >
            {product.category}
          </p>

          <h3
            className="
              mt-2 text-[17px] font-semibold
              leading-snug tracking-tight
              text-slate-900
              transition-colors
              group-hover:text-primary
            "
          >
            {product.name}
          </h3>

          <div className="mt-auto flex items-center justify-between pt-7">
            <span className="text-[13px] font-medium text-slate-600">
              View product
            </span>

            <FiArrowUpRight
              size={17}
              className="
                text-slate-500
                transition-transform duration-200
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
                group-hover:text-primary
              "
            />
          </div>
        </div>
      </Link>
    </article>
  );
}
