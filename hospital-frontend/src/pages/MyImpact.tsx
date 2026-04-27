import { motion } from 'framer-motion';

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const donations = [
  { center: 'Central Blood Bank', status: 'SUCCESSFUL', date: 'May 15, 2024', type: 'Whole Blood', stats: 'Hb: 14.5 g/dL', current: true },
  { center: 'St. Jude Community Hospital', status: 'SUCCESSFUL', date: 'Feb 10, 2024', type: 'Whole Blood', stats: null, current: false },
  { center: 'Regional Medical Center', status: 'SUCCESSFUL', date: 'Nov 22, 2023', type: 'Plasma', stats: null, current: false },
];

const achievements = [
  { icon: 'stars', label: 'First Time Donor', color: '#005faf' },
  { icon: 'medical_services', label: 'Lifesaver', color: '#006b1b' },
  { icon: 'favorite', label: 'Community Hero', color: '#b7131a' },
  { icon: 'emoji_events', label: '4x Donor', color: '#e65100' },
];

export default function MyImpact() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-16">
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">

        {/* ── Header Banner ── */}
        <motion.div variants={fade} className="bg-gradient-to-r from-[#b7131a] to-[#d43a3a] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
          <div>
            <h1 className="font-jakarta text-2xl md:text-3xl font-extrabold text-white">Welcome back, Elena</h1>
            <p className="text-white/80 text-sm mt-1">Your contribution has directly impacted 3 local families this year.</p>
          </div>
          <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-xl shrink-0">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>event</span>
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-wider">Next Donation</p>
              <p className="text-white font-jakarta font-bold">Sept 12, 2024</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* ── Left Column: Profile & Achievements ── */}
          <div className="lg:col-span-4 space-y-6">

            {/* Profile Card */}
            <motion.div variants={fade} className="bg-white rounded-2xl shadow-soft border border-[#e7e8e9] p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#b7131a] to-[#d43a3a] flex items-center justify-center text-white font-jakarta font-extrabold text-xl shadow-lg shrink-0">
                  O-
                </div>
                <div>
                  <h2 className="font-jakarta text-xl font-bold text-[#191c1d]">Elena Rodriguez</h2>
                  <span className="inline-flex items-center gap-1.5 mt-1 px-3 py-1 bg-[#005faf]/10 text-[#005faf] rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Verified Donor
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-5 border-t border-[#e7e8e9]">
                {[
                  { label: 'Total Donations', value: '4 Made', color: '#b7131a', icon: 'volunteer_activism' },
                  { label: 'Lives Saved', value: '3 Lives', color: '#006b1b', icon: 'favorite' },
                  { label: 'Blood Type', value: 'O Negative', color: '#005faf', icon: 'bloodtype' },
                  { label: 'Member Since', value: 'Jan 2023', color: '#5b403d', icon: 'calendar_month' },
                ].map((stat, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-[#5b403d] text-sm">
                      <span className="material-symbols-outlined text-base" style={{ color: stat.color }}>{stat.icon}</span>
                      {stat.label}
                    </div>
                    <span className="font-jakarta font-bold text-sm" style={{ color: stat.color }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={fade} className="bg-white rounded-2xl shadow-soft border border-[#e7e8e9] p-6">
              <h3 className="font-jakarta font-bold text-[#191c1d] text-lg mb-4">Achievements</h3>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((badge, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center p-4 rounded-xl bg-[#f8f9fa] hover:shadow-soft transition-all cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center mb-2" style={{ background: `${badge.color}15` }}>
                      <span className="material-symbols-outlined" style={{ color: badge.color, fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                    </div>
                    <span className="text-xs font-semibold text-[#191c1d] text-center">{badge.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fade} className="bg-white rounded-2xl shadow-soft border border-[#e7e8e9] p-6 space-y-3">
              <h3 className="font-jakarta font-bold text-[#191c1d] text-lg mb-2">Quick Actions</h3>
              {[
                { icon: 'edit', label: 'Edit Profile', desc: 'Update your information' },
                { icon: 'share', label: 'Share Impact', desc: 'Inspire others to donate' },
                { icon: 'notifications', label: 'Alert Settings', desc: 'Manage notifications' },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#f8f9fa] transition-all text-left group">
                  <div className="w-10 h-10 rounded-xl bg-[#f8f9fa] group-hover:bg-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#5b403d] text-lg">{action.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#191c1d] text-sm">{action.label}</p>
                    <p className="text-xs text-[#5b403d]">{action.desc}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#906f6c] text-base group-hover:text-[#b7131a] transition-colors">chevron_right</span>
                </button>
              ))}
            </motion.div>
          </div>

          {/* ── Right Column: Donation History & Impact ── */}
          <div className="lg:col-span-8 space-y-6">

            {/* Impact Stats */}
            <motion.div variants={fade} className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { value: '4', label: 'Donations', icon: 'water_drop', color: '#b7131a' },
                { value: '3', label: 'Lives Saved', icon: 'favorite', color: '#006b1b' },
                { value: '1.8L', label: 'Blood Given', icon: 'science', color: '#005faf' },
                { value: '18mo', label: 'Active Since', icon: 'schedule', color: '#e65100' },
              ].map((s, i) => (
                <motion.div key={i} whileHover={{ y: -3 }} className="bg-white rounded-2xl p-5 shadow-soft border border-[#e7e8e9] text-center hover:shadow-high transition-all">
                  <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${s.color}12` }}>
                    <span className="material-symbols-outlined text-lg" style={{ color: s.color, fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
                  </div>
                  <p className="font-jakarta text-2xl font-extrabold" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-[#5b403d] mt-1">{s.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Donation History */}
            <motion.div variants={fade} className="bg-white rounded-2xl shadow-soft border border-[#e7e8e9] p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b7131a]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
                  <h3 className="font-jakarta font-bold text-[#191c1d] text-lg">Donation History</h3>
                </div>
                <button className="flex items-center gap-1.5 text-[#005faf] text-sm font-semibold hover:underline">
                  <span className="material-symbols-outlined text-base">download</span>
                  Download Report
                </button>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-[#e7e8e9]" />
                <div className="space-y-4">
                  {donations.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.12 }}
                      className="relative flex gap-5"
                    >
                      {/* Timeline dot */}
                      <div className="shrink-0 z-10 mt-1">
                        <div className={`w-[12px] h-[12px] rounded-full border-[3px] ${
                          item.current ? 'border-[#b7131a] bg-white ring-4 ring-[#b7131a]/15' : 'border-[#906f6c] bg-white'
                        }`} style={{ marginLeft: '11px' }} />
                      </div>

                      {/* Card */}
                      <div className="flex-1 p-5 rounded-xl bg-[#f8f9fa] border border-[#e7e8e9] hover:border-[#b7131a]/30 hover:shadow-soft transition-all -mt-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                          <h4 className="font-jakarta font-bold text-[#191c1d]">{item.center}</h4>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#006b1b]/10 text-[#006b1b] rounded-full text-xs font-bold">
                            <span className="material-symbols-outlined text-xs">check_circle</span>
                            {item.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-[#5b403d]">
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">calendar_today</span>
                            {item.date}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">water_drop</span>
                            {item.type}
                          </span>
                          {item.stats && (
                            <span className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">monitoring</span>
                              {item.stats}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Next Steps CTA */}
            <motion.div variants={fade} className="bg-gradient-to-r from-[#005faf] to-[#0077d4] rounded-2xl p-8 text-center relative overflow-hidden">
              <div className="absolute -top-8 -right-8 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[200px] text-white">favorite</span>
              </div>
              <div className="relative z-10">
                <h3 className="font-jakarta text-2xl font-extrabold text-white mb-2">Ready for your next donation?</h3>
                <p className="text-white/80 text-sm mb-6 max-w-md mx-auto">Your blood type O- is in critical demand. Schedule your next appointment and continue saving lives.</p>
                <div className="flex justify-center flex-wrap gap-3">
                  <button className="bg-white text-[#005faf] px-7 py-3 rounded-full font-bold font-jakarta text-sm shadow-lg hover:shadow-xl transition-all active:scale-95">
                    Schedule Donation
                  </button>
                  <button className="border-2 border-white text-white px-7 py-3 rounded-full font-bold font-jakarta text-sm hover:bg-white/10 transition-all active:scale-95">
                    Find Nearest Center
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
