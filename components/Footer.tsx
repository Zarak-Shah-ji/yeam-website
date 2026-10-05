import ThemeToggle from "./ThemeToggle";
import FooterMark from "./FooterMark";
import LogoMark from "./LogoMark";

const LINKS = [
  { label: "Free worklist", href: "/worklist" },
  { label: "Pricing",       href: "/pricing" },
  { label: "Architecture",  href: "/architecture" },
  { label: "Contact",       href: "/#contact" },
  { label: "info@yeam.ai",  href: "mailto:info@yeam.ai" },
  { label: "747-388-6386",  href: "tel:7473886386" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[#E0E6F5] bg-[#FFFFFF] px-6 pt-16 pb-8 md:pt-20">
      {/* Content first, with its divider, so no rule ever crosses the wordmark. */}
      <div className="relative z-10 mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between md:gap-10">
          <div className="max-w-xs">
            <LogoMark size={36} />
            <p className="mt-4 text-sm leading-relaxed text-[#5A6A8A]">
              The billing layer between your EHR and the payer. Private by default.
            </p>
          </div>

          <nav>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
              {[
                ...LINKS.slice(0, 3),
                { label: "Blog", href: "/blog" },
                ...LINKS.slice(3),
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-[#4A5A7A] transition-colors hover:text-[#1A4FBF]">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#E0E6F5] pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-[#5A6A8A]">
            © {new Date().getFullYear()} Yeam. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-xs text-[#8A9BBF]">
              Built for HIPAA workflows · BAA for real claim data · FHIR R4 on the roadmap
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* The oversized wordmark as a signature band under the content: its own
          space, fading up out of the surface, with nothing crossing it. */}
      <div className="relative mx-auto mt-10 h-36 max-w-[1600px] md:h-48">
        <FooterMark />
      </div>
    </footer>
  );
}
