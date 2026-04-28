import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#e7e8e9] w-full py-12 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <Link to="/" className="font-jakarta text-xl font-extrabold text-[#b7131a]">Vital Life</Link>
            <p className="text-sm text-[#5b403d] mt-2 max-w-xs">Saving lives through timely donation. Connecting donors with those in need.</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms of Service', href: '#' },
              { label: 'Hospital Partners', href: '#' },
              { label: 'Contact Support', href: '#' },
            ].map((link, i) => (
              <a key={i} className="font-jakarta text-xs uppercase tracking-widest text-[#5b403d] hover:text-[#b7131a] transition-colors" href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#e7e8e9] text-center">
          <p className="font-jakarta text-xs text-[#906f6c]">
            © 2026 Vital Life. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
