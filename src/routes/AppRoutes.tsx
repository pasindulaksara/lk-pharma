
import { Link, Route, Routes } from "react-router";

import Home from "../pages/Home";
import About from "../pages/About";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Contact from "../pages/Contact";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/about" element={<About />} />

      <Route path="/products" element={<Products />} />

      <Route
        path="/products/category/:categorySlug"
        element={<Products />}
      />

      <Route
        path="/products/:productSlug"
        element={<ProductDetails />}
      />

      <Route path="/contact" element={<Contact />} />

      <Route
        path="*"
        element={
          <section className="container-site py-24 text-center">
            <h1 className="text-3xl font-bold text-heading">
              Page Not Found
            </h1>

            <Link
              to="/"
              className="mt-5 inline-block text-primary"
            >
              Return Home
            </Link>
          </section>
        }
      />
    </Routes>
  );
}
