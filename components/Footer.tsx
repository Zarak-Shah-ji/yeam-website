export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">Y</span>
              </div>
              <span className="font-semibold text-white">Yeam.ai</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              AI-embedded EHR for small and mid-size clinics. From patient visit to paid claim.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2">
                {["Dashboard", "Patients", "Claims", "Billing & Appeals", "Analytics"].map((item) => (
                  <li key={item}>
                    <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Company</h4>
              <ul className="space-y-2">
                {[
                  { label: "Book a Demo", href: "#contact" },
                  { label: "Contact", href: "#contact" },
                  { label: "info@yeam.ai", href: "mailto:info@yeam.ai" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Yeam.ai. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            HIPAA-compliant · Built for small & mid-size clinics
          </p>
        </div>
      </div>
    </footer>
  );
}
