import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/centers', label: 'Centers' },
  { to: '/our-impact', label: 'Impact' },
  { to: '/register', label: 'Register' },
  { to: '/emergency', label: 'Emergency' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/my-impact', label: 'My Profile' },
];

export default function TopNav() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/95 border-b border-[#e7e8e9] shadow-sm backdrop-blur-md">
        <div className="flex justify-between items-center px-4 md:px-8 h-20 max-w-7xl mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-jakarta text-2xl font-extrabold text-[#b7131a] tracking-tight">Vital Cycle</Link>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`font-jakarta text-sm font-semibold px-4 py-2 rounded-lg transition-all ${
                    location.pathname === link.to
                      ? 'bg-[#b7131a]/10 text-[#b7131a]'
                      : 'text-[#5b403d] hover:bg-[#f3f4f5] hover:text-[#191c1d]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/emergency" className="hidden lg:flex items-center gap-2 px-5 py-2.5 bg-[#b7131a] text-white rounded-full font-bold font-jakarta text-sm shadow-lg hover:bg-[#9a1016] transition-all active:scale-95">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
              Emergency
            </Link>
            <Link to="/my-impact" className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full hover:bg-[#f3f4f5] transition-all">
              <span className="material-symbols-outlined text-[#5b403d]">account_circle</span>
            </Link>
            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#f3f4f5]">
              <span className="material-symbols-outlined text-[#191c1d]">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-0 right-0 z-40 bg-white border-b border-[#e7e8e9] shadow-lg md:hidden"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-jakarta text-sm font-semibold transition-all ${
                    location.pathname === link.to
                      ? 'bg-[#b7131a]/10 text-[#b7131a]'
                      : 'text-[#5b403d] hover:bg-[#f3f4f5]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/emergency"
                onClick={() => setMobileOpen(false)}
                className="block mt-3 text-center py-3 bg-[#b7131a] text-white rounded-xl font-bold font-jakarta text-sm"
              >
                Emergency Request
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
