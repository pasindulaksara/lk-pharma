
import { Link } from "react-router";
import {
  FiArrowUpRight,
  FiMessageCircle,
} from "react-icons/fi";

export default function ContactCTA() {
  return (
    <section className="bg-white pb-20 md:pb-24">
      <div className="container-site">
        <div className="relative overflow-hidden rounded-2xl border border-[#E5EBF0] bg-[#F5F8FA] px-7 py-12 sm:px-12 md:py-16 lg:px-16">

          {/* Subtle decoration */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-primary/5" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full border border-primary/5" />

          <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">

            {/* Content */}
            <div className="max-w-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-primary ring-1 ring-slate-200/80">
                  <FiMessageCircle size={18} />
                </span>

                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                  Let's Connect
                </span>
              </div>

              <h2 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight text-heading sm:text-3xl md:text-[34px]">
                Looking for Medical or
                Laboratory Solutions?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-muted sm:text-base">
                Connect with our team to discuss your
                medical equipment, laboratory products,
                and healthcare supply requirements.
              </p>
            </div>

            {/* Contact Button */}
            <div className="shrink-0">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-6 py-3.5 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-dark hover:shadow-md"
              >
                Contact Our Team
                <FiArrowUpRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
