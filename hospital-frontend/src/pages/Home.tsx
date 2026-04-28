import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.1 } } };

export default function Home() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-white via-[#fff5f5] to-[#f0f7ff] pt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-32 right-[-100px] w-[600px] h-[600px] rounded-full bg-[#b7131a]/6 blur-3xl" />
          <div className="absolute bottom-[-80px] left-[-80px] w-[500px] h-[500px] rounded-full bg-[#005faf]/5 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10 py-16">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
            <motion.span variants={fade} className="inline-flex items-center gap-2 bg-[#b7131a]/10 text-[#b7131a] px-5 py-2.5 rounded-full text-sm font-semibold font-jakarta">
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              Saving Lives, One Drop at a Time
            </motion.span>
            <motion.h1 variants={fade} className="font-jakarta font-extrabold text-[#191c1d] leading-tight tracking-tight" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Connect Donors<br />with <span className="text-[#b7131a]">Those in Need</span>
            </motion.h1>
            <motion.p variants={fade} className="text-[#5b403d] text-lg leading-relaxed max-w-lg">
              Vital Life is the bridge between life-saving donors and patients in critical need of blood and organ donations — powered by real-time logistics and compassionate community.
            </motion.p>
            <motion.div variants={fade} className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-[#b7131a] text-white px-8 py-4 rounded-full font-bold font-jakarta text-base flex items-center gap-2 shadow-lg hover:shadow-xl hover:bg-[#9a1016] transition-all active:scale-95">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                Become a Donor
              </Link>
              <Link to="/centers" className="bg-white text-[#191c1d] px-8 py-4 rounded-full font-bold font-jakarta text-base border border-[#e4beb9] hover:bg-[#f3f4f5] transition-all active:scale-95 flex items-center gap-2">
                <span className="material-symbols-outlined">location_on</span>
                Find Centers
              </Link>
            </motion.div>
            <motion.div variants={fade} className="flex gap-8 pt-4">
              {[{ val: '12k+', label: 'Lives Saved' }, { val: '156', label: 'Donation Centers' }, { val: '45k+', label: 'Active Donors' }].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="font-jakarta text-2xl font-extrabold text-[#b7131a]">{s.val}</div>
                  <div className="text-xs text-[#5b403d] mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side image collage */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="relative hidden lg:block">
            <div className="relative h-[520px]">
              <div className="absolute inset-0 bg-gradient-to-br from-[#b7131a]/10 to-[#005faf]/10 rounded-3xl" />
              <img className="absolute inset-0 w-full h-full object-cover rounded-3xl opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlz-lWzAbspYFKdDhFiHJAbrOzNx_eOgdTk6VTJiZv3uv7MYfedeG_W2r7skXxlMdwIXSzCOLEUmrdhQNYzLOyfgmpSHj6dE3wW88RvCH3N6LD5R9v01WjEsZ8QoInglec735I7GBfmgg_zmHJTDudX-rMkRUXemKtlvIHgqhh5-Z-LwmKidWxSB-7AR3Y58d1xLOM2740aj5Bm_wJmOeC_LYC-VwBqxUDYi9OmTPRfm_BgVkpB2qET-V7cfc5sN6zhAWBJQ_1cSY" alt="Donation" />
              {/* Floating card */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="absolute -bottom-6 -left-6 bg-white p-5 rounded-2xl shadow-high flex items-center gap-4">
                <div className="w-12 h-12 bg-[#b7131a]/10 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#b7131a]" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
                </div>
                <div>
                  <div className="font-jakarta font-bold text-[#191c1d]">Emergency Alert</div>
                  <div className="text-xs text-[#5b403d]">O- needed · City Hospital</div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-[#b7131a] animate-pulse ml-2" />
              </motion.div>
              {/* Top badge */}
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }} className="absolute -top-4 -right-4 bg-[#006b1b] text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <span className="font-jakarta font-bold text-sm">248 Lives Saved This Month</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-jakarta text-4xl font-bold text-[#191c1d] mb-3">How It Works</h2>
            <p className="text-[#5b403d] text-lg max-w-xl mx-auto">Three simple steps to make a life-changing difference in your community.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: 'app_registration', title: 'Register as a Donor', desc: 'Sign up in minutes. Tell us your blood type, availability, and nearest donation center preferences.' },
              { step: '02', icon: 'location_on', title: 'Find a Center', desc: 'Browse our network of 156+ certified donation centers. Book your appointment with one click.' },
              { step: '03', icon: 'volunteer_activism', title: 'Save a Life', desc: 'Your donation is tracked in real-time. You\'ll be notified when your gift reaches someone in need.' },
            ].map((step, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative bg-white rounded-2xl p-8 shadow-soft hover:shadow-high transition-shadow group">
                <div className="text-7xl font-extrabold font-jakarta text-[#b7131a]/8 absolute top-6 right-6 leading-none select-none">{step.step}</div>
                <div className="w-14 h-14 bg-[#b7131a]/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-[#b7131a] text-2xl">{step.icon}</span>
                </div>
                <h3 className="font-jakarta text-xl font-bold text-[#191c1d] mb-3">{step.title}</h3>
                <p className="text-[#5b403d] leading-relaxed text-[15px]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Urgency Banner ── */}
      <section className="py-16 bg-[#b7131a]">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
              <span className="text-white/80 font-semibold uppercase tracking-widest text-xs">Live Alert</span>
            </div>
            <h2 className="font-jakarta text-3xl font-extrabold text-white">O- Blood Critically Needed</h2>
            <p className="text-white/80 text-lg">City General Hospital — Trauma Unit A requires urgent donors</p>
          </motion.div>
          <Link to="/centers" className="shrink-0 bg-white text-[#b7131a] px-8 py-4 rounded-full font-bold font-jakarta shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined">emergency</span>
            Respond Now
          </Link>
        </div>
      </section>

      {/* ── Blood Type Grid ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-jakarta text-4xl font-bold text-[#191c1d] mb-3">Live Inventory Monitoring</h2>
            <p className="text-[#5b403d] text-lg max-w-xl mx-auto">Our AI engine tracks real-time availability for both blood and organ registries.</p>
          </motion.div>
          
          {/* Blood Inventory */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#b7131a]/10 flex items-center justify-center text-[#b7131a]">
                <span className="material-symbols-outlined">bloodtype</span>
              </div>
              <h3 className="font-jakarta text-2xl font-bold text-[#191c1d]">Blood Supply Status</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { type: 'O-', level: 'Critical', pct: 12, color: '#b7131a' },
                { type: 'O+', level: 'Low', pct: 31, color: '#e65100' },
                { type: 'A-', level: 'Moderate', pct: 52, color: '#f59e0b' },
                { type: 'A+', level: 'Good', pct: 65, color: '#006b1b' },
                { type: 'B-', level: 'Low', pct: 28, color: '#e65100' },
                { type: 'B+', level: 'Good', pct: 74, color: '#006b1b' },
                { type: 'AB-', level: 'Moderate', pct: 45, color: '#005faf' },
                { type: 'AB+', level: 'Good', pct: 80, color: '#006b1b' },
              ].map((bt, i) => (
                <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ scale: 1.05 }} className="bg-white border border-[#e4beb9] rounded-2xl p-4 flex flex-col items-center gap-2 shadow-soft cursor-pointer">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-jakarta font-extrabold text-white text-sm" style={{ background: bt.color }}>{bt.type}</div>
                  <div className="text-xs font-semibold" style={{ color: bt.color }}>{bt.level}</div>
                  <div className="w-full bg-[#f3f4f5] h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${bt.pct}%`, background: bt.color }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Organ Availability */}
          <div className="pt-8 border-t border-[#e7e8e9]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <span className="material-symbols-outlined">dna</span>
              </div>
              <h3 className="font-jakarta text-2xl font-bold text-[#191c1d]">Organ Registry Status</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { type: 'Kidney', level: 'Critical', pct: 8, color: '#b7131a', icon: 'kidneys' },
                { type: 'Liver', level: 'Low', pct: 24, color: '#e65100', icon: 'vital_signs' },
                { type: 'Heart', level: 'Stable', pct: 42, color: '#005faf', icon: 'favorite' },
                { type: 'Lung', level: 'Critical', pct: 15, color: '#b7131a', icon: 'airway' },
              ].map((org, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft hover:shadow-lg transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400" style={{ fontVariationSettings: "'FILL' 1" }}>{org.icon}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md bg-slate-100 text-slate-500">Live Status</span>
                  </div>
                  <h4 className="font-jakarta text-lg font-bold text-[#191c1d] mb-1">{org.type}</h4>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold" style={{ color: org.color }}>{org.level} Need</span>
                    <span className="text-sm font-black text-slate-400">{org.pct}% Available</span>
                  </div>
                  <div className="w-full bg-[#f3f4f5] h-3 rounded-full overflow-hidden p-0.5">
                    <div className="h-full rounded-full animate-pulse" style={{ width: `${org.pct}%`, background: org.color }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-[#f8f9fa] px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="font-jakarta text-4xl font-extrabold text-[#191c1d]">Ready to Save a Life Today?</h2>
          <p className="text-[#5b403d] text-lg max-w-2xl mx-auto">Every 2 seconds, someone needs blood. Your donation takes less than an hour and can save up to 3 lives.</p>
          <div className="flex justify-center flex-wrap gap-4">
            <Link to="/register" className="bg-[#b7131a] text-white px-10 py-4 rounded-full font-bold font-jakarta shadow-lg hover:shadow-xl hover:bg-[#9a1016] transition-all active:scale-95">Register as Donor</Link>
            <Link to="/our-impact" className="bg-white text-[#191c1d] px-10 py-4 rounded-full font-bold font-jakarta border border-[#e4beb9] hover:bg-[#f3f4f5] transition-all active:scale-95">See Our Impact</Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
