
import { Link } from "react-router";
import {
  FiArrowUpRight,
  FiCheckCircle,
} from "react-icons/fi";

const expertise = [
  "Medical Equipment & Devices",
  "Laboratory Solutions",
  "Hospital Consumables",
  "Diagnostic Products",
];

export default function AboutSection() {
  return (
    <section className="section-space overflow-hidden bg-section">
      <div className="container-site">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* LEFT - IMAGE */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/home/about-chetsa.jpg"
                alt="Modern life sciences laboratory"
                loading="lazy"
                className="h-[340px] w-full object-cover md:h-[480px] lg:h-[540px]"
              />
            </div>

            {/* Decorative accent */}
            <div className="absolute -bottom-5 -right-5 -z-10 hidden h-40 w-40 rounded-2xl bg-secondary/10 md:block" />

            {/* Small image label */}
            <div className="absolute bottom-5 left-5 rounded-lg border border-white/50 bg-white/95 px-5 py-4 shadow-sm backdrop-blur-sm">
              <span className="block text-xs font-semibold uppercase tracking-widest text-secondary">
                CHETSA
              </span>

              <p className="mt-1 text-sm font-semibold text-primary">
                Life Sciences Technology
              </p>
            </div>
          </div>

          {/* RIGHT - CONTENT */}
          <div>
            {/* Eyebrow */}
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-secondary" />

              <span className="text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                About Our Company
              </span>
            </div>

            {/* Title */}
            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight text-heading md:text-4xl lg:text-[42px]">
              Supporting Healthcare
              <span className="text-primary">
                {" "}Through Life Sciences
                & Technology
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 text-base leading-8 text-body">
              Chetsa Life Sciences Technology (PVT) Ltd
              focuses on medical equipment, medical devices,
              hospital consumables, and laboratory supplies.
            </p>

            <p className="mt-4 text-base leading-8 text-muted">
              Explore our product solutions for healthcare,
              laboratory, research, and diagnostic
              environments.
            </p>

            {/* Expertise */}
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {expertise.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3"
                >
                  <FiCheckCircle
                    size={19}
                    className="shrink-0 text-accent"
                  />

                  <span className="text-sm font-medium text-heading">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <Link
                to="/about"
                className="inline-flex items-center gap-3 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-primary-dark"
              >
                More About CHETSA
                <FiArrowUpRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
