
import { Link } from "react-router";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiActivity,
  FiCpu,
  FiLayers,
  FiThermometer,
  FiDroplet,
  FiMonitor,
  FiCheck,
  FiGlobe,
  FiBox,
  FiTool,
} from "react-icons/fi";

import { categories } from "../data/categories";

// Demo manufacturer references.
// Replace with the client's approved partner list and logos.
const partners = [
  {
    name: "BioLogix",
    description: "Laboratory consumables and life science products",
    website: "https://biologixusa.com/",
  },
  {
    name: "Air Science",
    description: "Laboratory safety and containment equipment",
    website: "https://www.airscience.com/",
  },
  {
    name: "NUVE",
    description: "Laboratory equipment and instruments",
    website: "https://nuve.com.tr/",
  },
];

const solutionIcons = [
  FiActivity,
  FiCpu,
  FiLayers,
  FiThermometer,
  FiDroplet,
  FiMonitor,
];

const strengths = [
  {
    number: "01",
    icon: FiBox,
    title: "Broad Product Portfolio",
    description:
      "Explore product categories spanning diagnostic devices, laboratory instruments, consumables, cryogenic systems and life science reagents.",
  },
  {
    number: "02",
    icon: FiGlobe,
    title: "Manufacturer-Focused Solutions",
    description:
      "Browse scientific products organized by application, equipment type and manufacturer to help identify suitable solutions.",
  },
  {
    number: "03",
    icon: FiTool,
    title: "Beyond Product Supply",
    description:
      "Our areas of focus include laboratory software, equipment integration, installation, maintenance and technical services.",
  },
];

export default function About() {
  return (
    <main className="bg-white">
      {/* ===================================
          1. PAGE INTRODUCTION
      =================================== */}
      <section className="border-b border-border-light bg-section py-14 md:py-16">
        <div className="container-site">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs text-muted"
          >
            <Link
              to="/"
              className="transition-colors hover:text-primary"
            >
              Home
            </Link>

            <FiArrowRight size={13} />

            <span className="font-medium text-heading">
              About Us
            </span>
          </nav>

          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            ABOUT CHETSA
          </span>

          <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-heading md:text-5xl">
            Advancing Science.
            <br />
            <span className="text-primary">
              Supporting Healthcare.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
            CHETSA Life Sciences Technology focuses on
            scientific products, laboratory technologies
            and solutions that support modern research,
            diagnostics and healthcare applications.
          </p>
        </div>
      </section>

      {/* ===================================
          2. WHO WE ARE
      =================================== */}
      <section className="py-16 md:py-24">
        <div className="container-site">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative overflow-hidden rounded-2xl bg-section">
              <img
                src="/images/home/about-chetsa.jpg"
                alt="Modern laboratory environment"
                loading="lazy"
                className="aspect-[5/4] w-full object-cover"
              />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                WHO WE ARE
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-heading md:text-4xl">
                Connecting Scientific Needs
                with Practical Solutions
              </h2>

              <p className="mt-6 text-base leading-8 text-body">
                CHETSA Life Sciences Technology (Pvt) Ltd
                focuses on medical devices, laboratory
                equipment, scientific consumables and
                life science solutions.
              </p>

              <p className="mt-4 text-base leading-8 text-muted">
                Our product and service areas span
                diagnostic technologies, laboratory
                instruments, cryogenic solutions,
                research reagents, digital technologies
                and laboratory support services.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Medical and diagnostic technologies",
                  "Laboratory equipment and supplies",
                  "Scientific and digital solutions",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-section text-accent">
                      <FiCheck size={16} />
                    </span>

                    <span className="text-sm font-medium text-heading">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================
          3. OUR SOLUTIONS
      =================================== */}
      <section className="border-y border-border-light bg-section py-16 md:py-20">
        <div className="container-site">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
              WHAT WE OFFER
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-heading md:text-4xl">
              Our Solutions
            </h2>

            <p className="mt-4 text-base leading-8 text-muted">
              Six specialized areas covering medical
              diagnostics, laboratory science and
              scientific technology.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, index) => {
              const Icon = solutionIcons[index] ?? FiLayers;

              return (
                <Link
                  key={category.id}
                  to={`/products/category/${category.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border-light bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_32px_-16px_rgba(32,84,128,0.15)]"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-section text-primary">
                      <Icon size={22} />
                    </span>

                    <FiArrowUpRight
                      size={18}
                      className="text-muted transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold leading-snug tracking-tight text-heading">
                    {category.name}
                  </h3>

                  <p className="mt-3 flex-1 text-sm leading-7 text-muted">
                    {category.description}
                  </p>

                  <span className="mt-6 text-sm font-semibold text-primary">
                    Explore Products
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================
          4. OUR BRANDS & PARTNERS
      =================================== */}
      <section className="py-16 md:py-24">
        <div className="container-site">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                GLOBAL MANUFACTURERS
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-heading md:text-4xl">
                Our Brands & Partners
              </h2>

              <p className="mt-4 text-base leading-8 text-muted">
                Explore manufacturers and scientific
                product brands across laboratory,
                medical and life science applications.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
            >
              Browse Products
              <FiArrowUpRight size={17} />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-44 flex-col justify-between rounded-2xl border border-border-light bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_12px_32px_-16px_rgba(32,84,128,0.12)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-section text-primary">
                    <FiGlobe size={21} />
                  </div>

                  <FiArrowUpRight
                    size={18}
                    className="text-muted transition-colors group-hover:text-primary"
                  />
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold tracking-tight text-heading">
                    {partner.name}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {partner.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================
          5. WHY CHETSA
      =================================== */}
      <section className="border-y border-border-light bg-section py-16 md:py-20">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
                OUR APPROACH
              </span>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-heading md:text-4xl">
                Why Explore Solutions with CHETSA?
              </h2>

              <p className="mt-4 text-base leading-8 text-muted">
                Our areas of focus bring together
                scientific products, laboratory
                technologies and supporting services.
              </p>
            </div>

            <div className="divide-y divide-border-light border-y border-border-light">
              {strengths.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="grid gap-4 py-6 sm:grid-cols-[52px_1fr]"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border-light bg-white text-primary">
                      <Icon size={20} />
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-heading">
                          {item.title}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm leading-7 text-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================
          6. CONTACT CTA
      =================================== */}
      <section className="py-16 md:py-24">
        <div className="container-site">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl bg-primary px-7 py-10 md:flex-row md:items-center md:px-12 md:py-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                LET'S CONNECT
              </span>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-white md:text-3xl">
                Have a Product or Laboratory Requirement?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/80">
                Contact CHETSA to discuss medical
                equipment, laboratory supplies and
                scientific solution requirements.
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex shrink-0 items-center justify-center gap-3 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-section"
            >
              Contact Us
              <FiArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
