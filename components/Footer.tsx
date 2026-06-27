import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Footer() {
  return (
    <footer className="relative bg-[#1C1C1C] py-12 px-6 overflow-hidden">
      {/* Background YEAM text */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ animation: "footerPulse 6s ease-in-out infinite" }}
      >
        <span
          className="font-black text-white select-none"
          style={{ fontSize: "clamp(6rem, 20vw, 16rem)", opacity: 0.04, letterSpacing: "0.15em" }}
        >
          YEAM
        </span>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <Image
                src="/logo.png"
                alt="Yeam.ai"
                width={32}
                height={32}
                className="rounded-lg"
                style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(400%) hue-rotate(184deg) brightness(142%)" }}
              />
              <span className="font-semibold text-white text-base">Yeam.ai</span>
            </div>
            <p className="text-sm text-[#8A8A8A] max-w-xs leading-relaxed">
              AI medical workforce for clinics. Receptionist, Scribe, Coder, Nurse, and Billing agents working 24/7.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2">
                {["Dashboard", "Patients", "Claims", "Billing & Appeals", "Analytics"].map((item) => (
                  <li key={item}>
                    <a
                      href="https://yeamagentsystem.vercel.app/login"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#8A8A8A] hover:text-[#6B9BF0] transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider mb-3">Company</h4>
              <ul className="space-y-2">
                {[
                  { label: "Book a Demo", href: "#contact" },
                  { label: "Contact",     href: "#contact" },
                  { label: "info@yeam.ai", href: "mailto:info@yeam.ai" },
                  { label: "747-388-6386", href: "tel:7473886386" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-[#8A8A8A] hover:text-[#6B9BF0] transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-[#2A2A2A] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#5A5A5A]">
            © {new Date().getFullYear()} Yeam.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-[#3A3A3A]">
              HIPAA Compliant · SOC 2 Ready · HL7/FHIR Compatible
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
