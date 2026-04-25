import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.07 } } };

const sidebarItems = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'emergency', label: 'Active Requests', active: false },
  { icon: 'inventory_2', label: 'Inventory', active: false },
  { icon: 'group', label: 'Donor Database', active: false },
  { icon: 'settings', label: 'Settings', active: false },
];

const requests = [
  { type: 'O-', title: 'Emergency: Trauma Unit A', units: '4 Units Required', time: 'Requested 12m ago', status: 'CRITICAL', statusColor: 'bg-[#b7131a]' },
  { type: 'A+', title: 'Scheduled: Surgery Center', units: '2 Units Required', time: 'Requested 45m ago', status: 'PENDING', statusColor: 'bg-[#e65100]' },
  { type: 'B+', title: 'Replenishment: Maternity Ward', units: '5 Units Required', time: 'Requested in Transit', status: 'EN ROUTE', statusColor: 'bg-[#005faf]' },
];

const inventory = [
  { type: 'O-', label: '(Critical)', pct: 12, color: '#b7131a' },
  { type: 'A+', label: '', pct: 65, color: '#005faf' },
  { type: 'B+', label: '', pct: 82, color: '#006b1b' },
  { type: 'AB+', label: '', pct: 45, color: '#e65100' },
];

export default function HospitalDashboard() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-20">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="hidden lg:flex flex-col w-64 min-h-[calc(100vh-80px)] bg-white border-r border-[#e7e8e9] p-5 sticky top-20"
        >
          {/* Profile */}
          <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#e7e8e9]">
            <div className="w-11 h-11 bg-gradient-to-br from-[#b7131a] to-[#d43a3a] rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">person</span>
            </div>
            <div>
              <p className="font-jakarta font-bold text-[#191c1d] text-sm">Admin Profile</p>
              <p className="text-xs text-[#5b403d]">Administrator</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="space-y-1.5 flex-1">
            {sidebarItems.map((item, i) => (
              <a
                key={i}
                href="#"
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  item.active
                    ? 'bg-[#b7131a]/10 text-[#b7131a]'
                    : 'text-[#5b403d] hover:bg-[#f3f4f5]'
                }`}
              >
                <span className="material-symbols-outlined text-xl" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Emergency Button */}
          <Link to="/emergency" className="flex items-center justify-center gap-2 mt-auto py-3.5 bg-[#b7131a] text-white rounded-xl font-bold font-jakarta text-sm shadow-lg hover:bg-[#9a1016] transition-all active:scale-95">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            New Emergency Request
          </Link>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 max-w-6xl">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            {/* Header */}
            <motion.div variants={fade} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-jakarta text-3xl font-extrabold text-[#191c1d]">Hospital Dashboard</h1>
                <p className="text-[#5b403d] text-sm mt-1">Monitoring real-time blood inventory and active requests</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-[#006b1b]/10 text-[#006b1b] px-4 py-2 rounded-full text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-[#006b1b] animate-pulse" />
                  All Systems Online
                </div>
              </div>
            </motion.div>

            {/* Stat Cards */}
            <motion.div variants={fade} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: 'warning', label: 'Active Requests', value: '12', color: '#b7131a', bg: '#fff5f5' },
                { icon: 'water_drop', label: 'Available Units', value: '142', color: '#005faf', bg: '#f0f7ff' },
                { icon: 'group', label: 'Active Donors', value: '84', color: '#006b1b', bg: '#f0fff4' },
              ].map((stat, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-high transition-all border border-[#e7e8e9]">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: stat.bg }}>
                    <span className="material-symbols-outlined text-xl" style={{ color: stat.color, fontVariationSettings: "'FILL' 1" }}>{stat.icon}</span>
                  </div>
                  <p className="text-xs text-[#5b403d] font-semibold uppercase tracking-wider">{stat.label}</p>
                  <p className="font-jakarta text-3xl font-extrabold mt-1" style={{ color: stat.color }}>{stat.value}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Content Grid */}
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Active Requests - 3 cols */}
              <motion.div variants={fade} className="lg:col-span-3 bg-white rounded-2xl shadow-soft border border-[#e7e8e9] p-6">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#b7131a]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                    <h2 className="font-jakarta font-bold text-[#191c1d] text-lg">Recent Active Requests</h2>
                  </div>
                  <button className="text-[#005faf] text-sm font-semibold hover:underline">View All</button>
                </div>
                <div className="space-y-3">
                  {requests.map((r, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-4 p-4 rounded-xl bg-[#f8f9fa] hover:bg-[#f3f4f5] transition-all cursor-pointer group">
                      <div className="w-11 h-11 rounded-full bg-white border-2 border-[#b7131a] flex items-center justify-center font-jakarta font-extrabold text-[#b7131a] text-sm shrink-0">{r.type}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-jakarta font-bold text-[#191c1d] text-sm truncate">{r.title}</p>
                        <p className="text-xs text-[#5b403d]">{r.units} • {r.time}</p>
                      </div>
                      <span className={`${r.statusColor} text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shrink-0`}>{r.status}</span>
                      <span className="material-symbols-outlined text-[#906f6c] text-base group-hover:text-[#b7131a] transition-colors">chevron_right</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Inventory - 2 cols */}
              <motion.div variants={fade} className="lg:col-span-2 bg-white rounded-2xl shadow-soft border border-[#e7e8e9] p-6">
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-[#005faf]" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                  <h2 className="font-jakarta font-bold text-[#191c1d] text-lg">Inventory Levels</h2>
                </div>
                <div className="space-y-4">
                  {inventory.map((inv, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-[#191c1d]">Type {inv.type} <span className="text-[#5b403d] font-normal">{inv.label}</span></span>
                        <span className="font-bold" style={{ color: inv.color }}>{inv.pct}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#f3f4f5] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${inv.pct}%` }}
                          transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: inv.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-6 py-3 rounded-xl border-2 border-[#005faf] text-[#005faf] font-bold font-jakarta text-sm hover:bg-[#005faf]/5 transition-all">
                  Manage Inventory
                </button>
              </motion.div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
