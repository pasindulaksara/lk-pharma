
import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiClock,
  FiCheckCircle,
  FiPackage,
} from "react-icons/fi";

// Replace with verified CHETSA contact details before launch.
const CONTACT = {
  email: "info@chetsa.example",
  phone: "+94 77 000 0000",
  address: "Colombo, Sri Lanka",
  hours: "Monday – Friday | 9:00 AM – 5:00 PM",
};

const enquiryTypes = [
  "General Enquiry",
  "Product Enquiry",
  "Request a Quotation",
  "Technical Support",
  "Business Partnership",
  "Other",
];

const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-border-light " +
  "bg-white px-4 text-sm text-heading outline-none " +
  "transition-colors placeholder:text-muted/70 " +
  "focus:border-primary focus:ring-2 focus:ring-primary/10";

const labelClass = "block text-sm font-medium text-heading";

export default function Contact() {
  const [searchParams] = useSearchParams();
  const productCode = searchParams.get("product") ?? "";

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    enquiryType: productCode
      ? "Product Enquiry"
      : "General Enquiry",
    product: productCode,
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Frontend-only demonstration.
    // The real enquiry submission will use the PHP API.
    const subject = form.product
      ? `CHETSA Product Enquiry - ${form.product}`
      : `CHETSA - ${form.enquiryType}`;

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Organization: ${form.organization || "Not provided"}`,
      `Enquiry Type: ${form.enquiryType}`,
      `Product: ${form.product || "Not applicable"}`,
      "",
      "Message:",
      form.message,
    ].join("\n");

    const mailtoUrl =
      `mailto:${CONTACT.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;

    // This reflects that an email draft was prepared,
    // not that an email was successfully delivered.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
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
              Contact Us
            </span>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">
            GET IN TOUCH
          </p>

          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-heading md:text-4xl lg:text-5xl">
            Let's Talk About Your Requirements
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
            Looking for medical devices, laboratory equipment,
            consumables or scientific solutions? Connect with
            our team to discuss your requirements.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-14 md:py-20">
        <div className="container-site">
          <div className="grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            {/* Contact Information */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">
                CONTACT INFORMATION
              </span>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-heading md:text-3xl">
                Get in Touch
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-muted">
                Whether you're sourcing a specific product,
                exploring laboratory solutions or looking
                for technical assistance, we're here to help.
              </p>

              <div className="mt-9 space-y-7">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-light bg-section text-primary">
                    <FiPhone size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-heading">
                      Call Us
                    </h3>

                    <a
                      href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                      className="mt-1 inline-block text-sm text-body transition-colors hover:text-primary"
                    >
                      {CONTACT.phone}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-light bg-section text-primary">
                    <FiMail size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-heading">
                      Email Us
                    </h3>

                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="mt-1 inline-block break-all text-sm text-body transition-colors hover:text-primary"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-light bg-section text-primary">
                    <FiMapPin size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-heading">
                      Visit Us
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-body">
                      {CONTACT.address}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border-light bg-section text-primary">
                    <FiClock size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-heading">
                      Business Hours
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-body">
                      {CONTACT.hours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Enquiry Card */}
              <div className="mt-12 rounded-2xl border border-border-light bg-section p-6 md:p-7">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-primary">
                  <FiPackage size={21} />
                </div>

                <h3 className="mt-5 text-lg font-semibold tracking-tight text-heading">
                  Looking for a Specific Product?
                </h3>

                <p className="mt-3 text-sm leading-7 text-muted">
                  Share the product name, model number or
                  technical requirements with our team.
                  We'll help you explore suitable solutions.
                </p>

                <Link
                  to="/products"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
                >
                  Explore Our Products
                  <FiArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            {/* Enquiry Form */}
            <div className="rounded-2xl border border-border-light bg-white p-6 shadow-[0_12px_40px_-20px_rgba(32,84,128,0.12)] sm:p-8 lg:p-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-heading">
                    Send an Enquiry
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-muted">
                    Tell us how we can help you.
                  </p>
                </div>

                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-section text-primary sm:flex">
                  <FiSend size={20} />
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="mt-8 space-y-5"
              >
                {/* Name & Email */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className={labelClass}
                    >
                      Full Name *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Your full name"
                      value={form.name}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className={labelClass}
                    >
                      Email Address *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Phone & Organization */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className={labelClass}
                    >
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="+94 ..."
                      value={form.phone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="organization"
                      className={labelClass}
                    >
                      Organization
                    </label>

                    <input
                      id="organization"
                      name="organization"
                      type="text"
                      autoComplete="organization"
                      placeholder="Company / Institution"
                      value={form.organization}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Enquiry Type */}
                <div>
                  <label
                    htmlFor="enquiryType"
                    className={labelClass}
                  >
                    Enquiry Type *
                  </label>

                  <select
                    id="enquiryType"
                    name="enquiryType"
                    required
                    value={form.enquiryType}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    {enquiryTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Product Reference */}
                <div>
                  <label
                    htmlFor="product"
                    className={labelClass}
                  >
                    Product Name / Code
                  </label>

                  <input
                    id="product"
                    name="product"
                    type="text"
                    placeholder="Enter product name or code (optional)"
                    value={form.product}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className={labelClass}
                  >
                    Your Message *
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    placeholder="Tell us about your requirements..."
                    value={form.message}
                    onChange={handleChange}
                    className="mt-2 w-full resize-y rounded-xl border border-border-light bg-white px-4 py-3 text-sm text-heading outline-none transition-colors placeholder:text-muted/70 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                {/* Mailto Feedback */}
                {submitted && (
                  <div
                    role="status"
                    className="flex items-start gap-3 rounded-xl border border-border-light bg-section px-4 py-3"
                  >
                    <FiCheckCircle
                      size={18}
                      className="mt-0.5 shrink-0 text-accent"
                    />

                    <p className="text-sm leading-6 text-body">
                      Your enquiry has been prepared in your
                      email application. Please send the
                      email to complete your enquiry.
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Send Enquiry
                  <FiArrowUpRight size={18} />
                </button>

                <p className="text-center text-xs leading-5 text-muted">
                  Your email application will open with
                  your enquiry details ready to send.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
