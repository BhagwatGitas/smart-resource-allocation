import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const centers = [
  { name: 'Manhattan Life Center', loc: '122 E 42nd St, New York, NY', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS5CMdMLggDhTZjKzSvdH0rPA4xIC5PsZDquf04Zux-u8VeWVXxdWboHghllWjrjaSsPEgm0NemI7el88g8In4lDNGnD1RByulVT6Vi1CQvyQoI1tBUv6k0TpLHaHPczXIrYE42FI-gA6gv7bdBilQFtGe5JzJF-EiaRKVQ1b5rmdkkXTFRtjiOcaT2Yh1Dz0remCp_9_TbdZWk5ysyfxbgKtacUCTaHJi-oQcua6K4g1L1sapohaoNptXxXn0VJwpbtfmvAWOCnQ', needs: 'O- Negative Needed', available: 'Today, 2:30 PM', needColor: '#b7131a' },
  { name: 'Brooklyn Hope Point', loc: '450 Flatbush Ave, Brooklyn, NY', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPITIAKsknUFL0N7VZDW9yR4PREp8c3Y0veZlNLfrx0DqweSUDhz5a8HooqBygKDkRSPUNC932dHSJBCy3kem22OMfF03huWW1ZaRZ1VbnsxvGTy0F6Osj4OzZ3TZ4uxWKLXfD4DDMhb91hwJhJapWuwZb9N8DoZZfD5I9lLd8fzLxghdRr6L7CXs4zkPW38j_tB4DFMcROnEfGMRn_B5hBiPR12mDRTLTJ29xqzu19tqpwAUa5qZudLjjIvi9Wv5a5neTKj5pvbA', needs: 'All Blood Types', available: 'Tomorrow, 9:00 AM', needColor: '#005faf' },
  { name: 'Queens Unity Center', loc: '34-02 Queens Blvd, LIC, NY', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtN1BRFKkcSfC_RoIuTIOaMyqenuVeg-DCtlV9_wJslJTLvuhIuEB1O-b7qfu6bapEVhfZk_Y6M2DhYUANsH_4wza1RFA3gto37Ztiqsyrt1vFGDloxEYzcEKfxjUBPhnxyNHVMiPPK-ozF1v5nTaTBdLCzFy6F6AR3pCyCaM6w1CGDV3ig5pjQnKHdcO6NoiLYojBLMGjy7cXjMcQI4nCfk6tNXfvrR1bKA5Z3MCn9mCBlv2BBAkx5ZOp6YTbU_ocNTLALAJJYmA', needs: 'AB+ Highly Needed', available: 'Today, 4:45 PM', needColor: '#e65100' },
];

export default function Centers() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20">
      <div className="flex">
        {/* Sidebar Filter */}
        <motion.aside
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="hidden lg:flex flex-col w-72 min-h-[calc(100vh-80px)] bg-white border-r border-[#e7e8e9] p-6 sticky top-20 overflow-y-auto"
        >
          <h3 className="font-jakarta text-xl font-bold text-[#191c1d] mb-6">Filters</h3>

          <div className="space-y-6 flex-1">
            {/* Availability */}
            <div>
              <label className="text-sm font-semibold text-[#5b403d] mb-2 block">Availability</label>
              <label className="flex items-center gap-3 p-3 bg-[#f8f9fa] rounded-xl cursor-pointer hover:bg-[#f3f4f5] transition-colors">
                <input defaultChecked className="w-4 h-4 rounded border-[#e4beb9] text-[#b7131a] focus:ring-[#b7131a]" type="checkbox" />
                <span className="text-[#191c1d] text-sm">Open Now</span>
              </label>
            </div>

            {/* Distance */}
            <div>
              <label className="text-sm font-semibold text-[#5b403d] mb-2 block">Distance (within 25 miles)</label>
              <input className="w-full h-2 bg-[#e1e3e4] rounded-lg appearance-none cursor-pointer accent-[#b7131a]" type="range" />
              <div className="flex justify-between text-xs text-[#906f6c] mt-1">
                <span>5 miles</span>
                <span>50 miles</span>
              </div>
            </div>

            {/* Blood Type Filter */}
            <div>
              <label className="text-sm font-semibold text-[#5b403d] mb-2 block">Urgent Blood Type Needs</label>
              <div className="grid grid-cols-4 gap-2">
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((type) => (
                  <button
                    key={type}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      ['A+', 'O+', 'O-'].includes(type)
                        ? 'border-2 border-[#b7131a] bg-[#fff5f5] text-[#b7131a]'
                        : 'border border-[#e4beb9] text-[#5b403d] hover:border-[#b7131a] hover:text-[#b7131a]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#e7e8e9] mt-6">
            <Link to="/register" className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#b7131a] text-white rounded-xl font-bold font-jakarta text-sm shadow-lg hover:bg-[#9a1016] transition-all active:scale-95">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
              Register as Donor
            </Link>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-5xl mx-auto">
            {/* Header */}
            <motion.div variants={fade} className="mb-8">
              <nav className="flex items-center gap-2 text-xs text-[#906f6c] mb-2">
                <span>Directory</span>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-[#5b403d]">Donation Centers</span>
              </nav>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="font-jakarta text-3xl font-extrabold text-[#191c1d]">Find a Center</h1>
                  <p className="text-[#5b403d] text-base mt-1 max-w-lg">Every drop counts. Locate your nearest center and book a life-saving appointment today.</p>
                </div>
                <button className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white border border-[#e4beb9] rounded-xl text-sm font-semibold text-[#5b403d] hover:bg-[#f3f4f5] transition-all">
                  <span className="material-symbols-outlined text-base">sort</span>
                  Sort By
                </button>
              </div>
            </motion.div>

            {/* Center Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {centers.map((center, i) => (
                <motion.div
                  key={i}
                  variants={fade}
                  whileHover={{ y: -6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-high transition-all group"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={center.img} alt={center.name} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#006b1b]" />
                      <span className="text-[#006b1b] text-xs font-bold">Open Now</span>
                    </div>
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <h3 className="font-jakarta text-lg font-bold text-[#191c1d]">{center.name}</h3>
                      <p className="text-[#5b403d] text-sm flex items-center gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {center.loc}
                      </p>
                    </div>
                    <span className="inline-flex px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: `${center.needColor}12`, color: center.needColor }}>{center.needs}</span>
                    <div className="flex items-center justify-between pt-4 border-t border-[#e7e8e9]">
                      <div>
                        <span className="text-[#906f6c] text-xs">Next available</span>
                        <p className="text-[#191c1d] text-sm font-semibold">{center.available}</p>
                      </div>
                      <button className="bg-[#b7131a] text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-lg hover:bg-[#9a1016] transition-all active:scale-95">Book</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
