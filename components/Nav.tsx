"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="Yeam.ai"
            width={32}
            height={32}
            className="rounded-lg"
          />
          <span className="font-semibold text-slate-900 text-lg">Yeam.ai</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">How It Works</a>
          <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
        </nav>

        <a
          href="#contact"
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book a Demo
        </a>
      </div>
    </header>
  );
}
