
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import {
  FiMenu,
  FiX,
  FiArrowUpRight,
  FiPhone,
  FiMail,
} from "react-icons/fi";

import { navigation } from "../../data/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isProductsActive =
    location.pathname.startsWith("/products");

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* Main Header */}
      <div className="border-b border-border-light">
        <div className="container-site flex h-20 items-center justify-between gap-6">

          {/* Logo */}
          <Link
            to="/"
            className="flex shrink-0 items-center"
            onClick={() => setIsMenuOpen(false)}
          >
            <img
              src="/images/logo/logo.jpeg"
              alt="CHETSA Life Sciences Technology"
              className="h-12 w-auto max-w-44 object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-9 lg:flex"
          >
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) => {
                  const active =
                    isActive ||
                    (item.path === "/products" &&
                      isProductsActive);

                  return `relative py-7 text-sm font-semibold
                    transition-colors duration-200
                    ${
                      active
                        ? "text-primary"
                        : "text-body hover:text-primary"
                    }`;
                }}
              >
                {({ isActive }) => {
                  const active =
                    isActive ||
                    (item.path === "/products" &&
                      isProductsActive);

                  return (
                    <>
                      {item.label}

                      {active && (
                        <span className="absolute right-0 bottom-0 left-0 h-0.5 rounded-full bg-primary" />
                      )}
                    </>
                  );
                }}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center lg:flex">
            <Link
              to="/contact"
              className="btn-primary gap-2 text-sm"
            >
              Get a Quote
              <FiArrowUpRight size={17} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-primary transition-colors hover:bg-section lg:hidden"
            aria-label={
              isMenuOpen ? "Close navigation" : "Open navigation"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? (
              <FiX size={26} />
            ) : (
              <FiMenu size={26} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="border-b border-border-light bg-white lg:hidden"
        >
          <div className="container-site flex flex-col gap-1 py-5">

            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-section text-primary"
                      : "text-body hover:bg-section hover:text-primary"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}

            <Link
              to="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="btn-primary mt-4 gap-2"
            >
              Get a Quote
              <FiArrowUpRight size={17} />
            </Link>
          </div>

          {/* Mobile Contact Information */}
          <div className="container-site border-t border-border-light py-4">
            <div className="flex flex-col gap-3 text-sm text-muted">
              <span className="flex items-center gap-2">
                <FiPhone className="text-secondary" />
                Contact our team
              </span>

              <span className="flex items-center gap-2">
                <FiMail className="text-secondary" />
                Medical & Laboratory Enquiries
              </span>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
