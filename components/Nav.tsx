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
          ? "bg-[#FAF7F2]/95 backdrop-blur-sm border-b border-[#E8DDD4] shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Yeam.ai"
            width={36}
            height={36}
            className="rounded-lg"
          />
          <span className="font-semibold text-[#1C1C1C] text-lg">Yeam.ai</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#workflow" className="text-sm text-[#5C4A3A] hover:text-[#1C1C1C] transition-colors">How It Works</a>
          <a href="#ai-workforce" className="text-sm text-[#5C4A3A] hover:text-[#1C1C1C] transition-colors">AI Workforce</a>
          <a href="#contact" className="text-sm text-[#5C4A3A] hover:text-[#1C1C1C] transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="https://yeamagentsystem.vercel.app/login"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-[#5C4A3A] text-sm font-medium rounded-lg border border-[#E8DDD4] hover:bg-[#F0EBE4] transition-colors"
          >
            Log In
          </a>
          <a
            href="#contact"
            className="px-4 py-2 bg-[#C4622D] text-white text-sm font-medium rounded-lg hover:bg-[#A8522A] transition-colors"
          >
            Book a Demo
          </a>
        </div>
      </div>
    </header>
  );
}
