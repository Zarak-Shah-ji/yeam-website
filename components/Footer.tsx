import Image from "next/image";
import ThemeToggle from "./ThemeToggle";
import FooterMark from "./FooterMark";

const LINKS = [
  { label: "Free worklist", href: "/#triage" },
  { label: "Pricing",       href: "/pricing" },
  { label: "Architecture",  href: "/architecture" },
  { label: "Contact",       href: "/#contact" },
  { label: "info@yeam.ai",  href: "mailto:info@yeam.ai" },
  { label: "747-388-6386",  href: "tel:7473886386" },
];

export default function Footer() {
  return (
    <footer className="relative bg-[#FFFFFF] border-t border-[#E0E6F5] py-20 px-6 overflow-hidden">
      <FooterMark />

      <div className="relative max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
          <Image
            src="/logo.png"
            alt="Yeam.ai"
            width={36}
            height={36}
            className="rounded-lg"
            style={{ filter: "brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(400%) hue-rotate(184deg) brightness(142%)" }}
          />

          <nav>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-2">
              {[
                ...LINKS.slice(0, 3),
                { label: "Blog", href: "/blog" },
                ...LINKS.slice(3),
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-[#4A5A7A] hover:text-[#1A4FBF] transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="border-t border-[#E0E6F5] pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[#5A6A8A]">
            © {new Date().getFullYear()} Yeam.ai. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-[#8A9BBF]">
              Built for HIPAA workflows · SOC 2 Ready · FHIR R4 on the roadmap
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
