
import { Link } from "react-router";
import {
  FiArrowUpRight,
  FiArrowUp,
  FiMail,
  FiMapPin,
} from "react-icons/fi";

import { navigation } from "../../data/navigation";
import { categories } from "../../data/categories";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="border-t border-slate-200 bg-[#F8FAFC]">

      {/* Main Footer */}
      <div className="container-site py-16 md:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_1fr_1fr] lg:gap-10">

          {/* Company */}
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/images/logo/logo.jpeg"
                alt="CHETSA"
                className="h-24 w-auto max-w-[190px] object-contain"
              />
            </Link>

            <p className="mt-5 text-sm font-medium text-slate-800">
              Chetsa Life Sciences Technology (PVT) Ltd
            </p>

            <p className="mt-3 max-w-xs text-sm leading-7 text-slate-500">
              Explore medical equipment, medical devices,
              hospital consumables, and laboratory
              products for healthcare and scientific
              applications.
            </p>

            {/* Contact Link */}
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-secondary"
            >
              Get in Touch
              <FiArrowUpRight size={16} />
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-6 text-sm font-semibold text-slate-900">
              Quick Links
            </h3>

            <ul className="space-y-3.5">
              {navigation.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-500 transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h3 className="mb-6 text-sm font-semibold text-slate-900">
              Our Products
            </h3>

            <ul className="space-y-3.5">
              {categories.slice(0, 6).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products/category/${category.slug}`}
                    className="text-sm text-slate-500 transition-colors hover:text-primary"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-6 text-sm font-semibold text-slate-900">
              Get in Touch
            </h3>

            <p className="text-sm leading-7 text-slate-500">
              Have questions about our products?
              Reach out to our team for further
              information.
            </p>

            <div className="mt-6 space-y-4">

              <Link
                to="/contact"
                className="flex items-start gap-3 text-sm text-slate-600 transition-colors hover:text-primary"
              >
                <FiMail
                  size={18}
                  className="mt-0.5 shrink-0 text-secondary"
                />
                <span>Send an Enquiry</span>
              </Link>

              <Link
                to="/contact"
                className="flex items-start gap-3 text-sm text-slate-600 transition-colors hover:text-primary"
              >
                <FiMapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-secondary"
                />
                <span>Contact Information</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-200">
        <div className="container-site flex flex-col gap-5 py-6 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-500">
            © {currentYear} Chetsa Life Sciences Technology
            (PVT) Ltd. All rights reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex w-fit items-center gap-2 text-xs font-medium text-slate-500 transition-colors hover:text-primary"
          >
            Back to Top
            <FiArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
}
