import React, { useEffect } from "react";
import Hero from "../components/Hero";
import About from "../components/About.jsx";
import Themes from "../components/Themes";
import Books from "../components/Books";
import Newsletter from "../components/Newsletter";
import Testimonials from "../components/Testimonials";
import Seo from "../components/Seo";

const HomePage = () => {
  useEffect(() => {
    const clean = () => {
      try {
        const targets = document.querySelectorAll(".home-hero .lede, .site-description, .home-intro, .page-lede");
        targets.forEach((el) => { if (!el) return; el.textContent = (el.textContent || "").replace(/\uFFFD/g, ""); });
      } catch {}
    };
    if (typeof window !== "undefined" && "requestIdleCallback" in window) { requestIdleCallback(clean); } else { setTimeout(clean, 0); }
  }, []);
  return (
    <>
      <Seo
        title="Quiet Strength — Self-Help & Productivity for Introverted Women"
        description="Actionable articles, e-books, and courses that help introverted women build confidence, prevent burnout, and thrive on their own terms."
      />
      <div className="space-y-24">
        <Hero />
        <About />
        <Themes />
        <Books />
        <Newsletter />
        <Testimonials />
      </div>
    </>
  );
};

export default HomePage;


