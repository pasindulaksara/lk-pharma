
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

type Slide = {
  id: number;
  image: string;
  eyebrow: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

const slides: Slide[] = [
  {
    id: 1,
    image: "/images/banners/banner-1.png",
    eyebrow: "WELCOME TO CHETSA",
    title: "Advancing Healthcare Through Quality Solutions",
    description:
      "Explore our range of medical equipment, laboratory supplies, and healthcare consumables.",
    buttonText: "Explore Products",
    buttonLink: "/products",
  },
  {
    id: 2,
    image: "/images/banners/banner-2.png",
    eyebrow: "LABORATORY SOLUTIONS",
    title: "Supporting Science. Enabling Discovery.",
    description:
      "Discover laboratory equipment and consumables designed to support research and diagnostics.",
    buttonText: "View Our Products",
    buttonLink: "/products",
  },
  {
    id: 3,
    image: "/images/banners/banner-3.png",
    eyebrow: "MEDICAL & HEALTHCARE",
    title: "Reliable Products for Modern Healthcare",
    description:
      "Explore medical devices, hospital supplies, and healthcare solutions for professional environments.",
    buttonText: "Contact Our Team",
    buttonLink: "/contact",
  },
];

export default function HeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = () => {
    setActiveSlide(
      (current) => (current + 1) % slides.length
    );
  };

  const previousSlide = () => {
    setActiveSlide(
      (current) =>
        (current - 1 + slides.length) % slides.length
    );
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  // Automatic sliding
  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setActiveSlide(
        (current) => (current + 1) % slides.length
      );
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  const currentSlide = slides[activeSlide];

  return (
    <section
      className="relative isolate overflow-hidden bg-white"
      aria-label="CHETSA featured solutions"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (
          !event.currentTarget.contains(
            event.relatedTarget
          )
        ) {
          setIsPaused(false);
        }
      }}
    >
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden="true"
          className={`
            absolute inset-0
            bg-cover bg-center
            transition-opacity duration-1000 ease-in-out
            ${
              index === activeSlide
                ? "opacity-100"
                : "opacity-0"
            }
          `}
          style={{
            backgroundImage: `url("${slide.image}")`,
          }}
        />
      ))}

      {/* Content */}
      <div
        className="
          container-site relative z-10
          flex min-h-[420px] items-center
          py-16
          md:min-h-[500px] md:py-20
          lg:min-h-[570px]
        "
      >
        <div
          key={currentSlide.id}
          className="w-full max-w-2xl"
        >
          {/* Eyebrow */}
          <span
            className="
              mb-5 inline-block
              border-l-2 border-secondary
              pl-3 text-xs font-bold
              tracking-[0.2em]
              text-secondary uppercase
              md:text-sm
            "
          >
            {currentSlide.eyebrow}
          </span>

          {/* Heading */}
          <h1
            className="
              max-w-[680px]
              text-3xl leading-[1.15]
              font-bold tracking-tight
              text-primary
              sm:text-4xl
              md:text-5xl
              lg:text-[56px]
            "
          >
            {currentSlide.title}
          </h1>

          {/* Description */}
          <p
            className="
              mt-6 max-w-xl
              text-sm leading-7
              text-body
              sm:text-base
              md:text-lg md:leading-8
            "
          >
            {currentSlide.description}
          </p>

          {/* CTA */}
          <Link
            to={currentSlide.buttonLink}
            className="
              mt-8 inline-flex
              items-center justify-center
              gap-3 rounded-lg
              bg-primary px-7 py-3.5
              text-sm font-semibold
              text-white shadow-sm
              transition-all duration-200
              hover:bg-primary-dark
              hover:shadow-md
              md:mt-9
            "
          >
            {currentSlide.buttonText}
            <FiArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Previous Button */}
      <button
        type="button"
        onClick={previousSlide}
        aria-label="Previous slide"
        className="
          absolute top-1/2 left-3
          z-20 hidden -translate-y-1/2
          items-center justify-center
          rounded-full
          border border-primary/15
          bg-white/80 p-3
          text-primary shadow-sm
          backdrop-blur-sm
          transition-all duration-200
          hover:bg-white hover:shadow-md
          xl:flex
        "
      >
        <FiChevronLeft size={22} />
      </button>

      {/* Next Button */}
      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="
          absolute top-1/2 right-3
          z-20 hidden -translate-y-1/2
          items-center justify-center
          rounded-full
          border border-primary/15
          bg-white/80 p-3
          text-primary shadow-sm
          backdrop-blur-sm
          transition-all duration-200
          hover:bg-white hover:shadow-md
          xl:flex
        "
      >
        <FiChevronRight size={22} />
      </button>

      {/* Pagination Dots */}
      <div
        className="
          absolute bottom-6 left-1/2
          z-20 flex -translate-x-1/2
          items-center justify-center
          gap-3
        "
        aria-label="Choose carousel slide"
      >
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={
              activeSlide === index
                ? "true"
                : undefined
            }
            className={`
              h-2 rounded-full
              transition-all duration-300
              ${
                activeSlide === index
                  ? "w-9 bg-primary"
                  : "w-2 bg-primary/30 hover:bg-primary/60"
              }
            `}
          />
        ))}
      </div>
    </section>
  );
}
