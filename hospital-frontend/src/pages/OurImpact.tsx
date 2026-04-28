import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fade = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

export default function OurImpact() {
  return (
    <div className="bg-white min-h-screen">
      {/* ── Hero ── */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-[#fff5f5] via-white to-[#f0f7ff]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-[-80px] w-[500px] h-[500px] rounded-full bg-[#b7131a]/5 blur-3xl" />
          <div className="absolute bottom-[-60px] left-[-80px] w-[400px] h-[400px] rounded-full bg-[#005faf]/5 blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            <motion.span variants={fade} className="inline-flex items-center gap-2 bg-[#b7131a]/10 text-[#b7131a] px-4 py-2 rounded-full text-sm font-semibold font-jakarta">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              Every Life Matters
            </motion.span>
            <motion.h1 variants={fade} className="font-jakarta text-5xl lg:text-6xl font-extrabold text-[#191c1d] leading-tight tracking-tight">
              Every Drop<br /><span className="text-[#b7131a]">Tells a Story</span>
            </motion.h1>
            <motion.p variants={fade} className="text-[#5b403d] text-lg leading-relaxed max-w-xl">
              Vital Life connects those who have the gift of life with those who need it most. Discover the profound impact of your donation through the voices of our community.
            </motion.p>
            <motion.div variants={fade} className="flex flex-wrap gap-4">
              <Link to="/register" className="bg-[#b7131a] text-white px-8 py-3.5 rounded-full font-semibold font-jakarta flex items-center gap-2 shadow-lg hover:shadow-xl hover:bg-[#96101588] transition-all active:scale-95">
                Start Your Story <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
              <Link to="/centers" className="bg-white text-[#191c1d] px-8 py-3.5 rounded-full font-semibold font-jakarta border border-[#e4beb9] hover:bg-[#f3f4f5] transition-all active:scale-95">
                Find Centers
              </Link>
            </motion.div>
          </motion.div>

          {/* Stat grid */}
          <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="grid grid-cols-2 gap-4">
            {[
              { icon: 'volunteer_activism', value: '12.4k+', label: 'Lives Saved Together', bg: 'bg-white border border-[#e4beb9]', valColor: 'text-[#b7131a]' },
              { icon: 'bloodtype', value: '8,200+', label: 'Liters Donated', bg: 'bg-[#b7131a]', valColor: 'text-white', labelColor: 'text-white/80', iconColor: 'text-white' },
              { icon: 'location_on', value: '156', label: 'Active Centers', bg: 'bg-[#005faf]', valColor: 'text-white', labelColor: 'text-white/80', iconColor: 'text-white' },
              { icon: 'diversity_3', value: '45k', label: 'Community Members', bg: 'bg-white border border-[#e4beb9]', valColor: 'text-[#006b1b]' },
            ].map((s, i) => (
              <motion.div key={i} whileHover={{ scale: 1.04 }} className={`${s.bg} p-6 rounded-2xl flex flex-col gap-4 shadow-soft`}>
                <span className={`material-symbols-outlined text-3xl ${s.iconColor ?? 'text-[#b7131a]'}`}>{s.icon}</span>
                <div>
                  <div className={`text-3xl font-extrabold font-jakarta ${s.valColor}`}>{s.value}</div>
                  <div className={`text-sm mt-1 ${s.labelColor ?? 'text-[#5b403d]'}`}>{s.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stories ── */}
      <section className="py-20 bg-[#f8f9fa]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
            <h2 className="font-jakarta text-4xl font-bold text-[#191c1d] mb-3">Voices of Resilience</h2>
            <p className="text-[#5b403d] text-lg max-w-2xl">Real people, real impact. Read how donation transformed lives across our network.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'Liver Transplant Recipient', badge: 'Recipient', badgeBg: 'bg-[#b7131a] text-white', quote: '"The emergency blood transfusion didn\'t just save my life; it gave me the chance to see my daughter graduate."', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACAN4KMGPWHYOzzjJhPefwd-rcGjqtnNoFXxOf3IcI0VaYxojBcakT9Y_AfBAcZkxoFMPnunhM49k-PK-k8PUL4I9z6DQ2Ho2Qe043GunSih9Zoxl-5EFY3OVNezvmzncnxuAwrYJP4UV5BWduir6Wm64rDPMqM0cNwXVtbXl2yIuB97hR6GYdQvCezdsuxvbZv0BQauceyqR8At8AV9YnclLjCs4940hY-uKJZnvkZHPIDPHfW3xVF3zN8xkM1TZ9JB_7CpSC4I4' },
              { name: 'David Chen', role: '50-Time Blood Donor', badge: 'Regular Donor', badgeBg: 'bg-[#005faf] text-white', quote: '"I started donating blood in college. 15 years later, knowing I\'ve potentially helped over 40 people is the most rewarding feeling."', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYVkBEW_YjGL_O8wJ1CjqeiFTqjKf8tcH1P5QsW6W5me-MY4LLj05j_mVYfTl-bnudAFFdEllenCdJYJiUT85uHHxO_ERSbqSXQf0bMuzL_WqZcRw7huGUoxUo6LsnCu1t8GHLVvQYQ1CvDBvtnnQoDHPS2yGHIt70pZ6QLMdw5XVkQAnCcPVXkxdOEAXAdRUs173vIltsxwUy5i2dGTuPHZw9w0I9DjPAWIF5HGW1a9SGMSGhr8ajZa4b1cd5JGGYs190rQ2rwxY' },
              { name: 'Elena Rodriguez', role: 'Critical Care Nurse', badge: 'Impact Partner', badgeBg: 'bg-[#006b1b] text-white', quote: '"Managing the plasma logistics with Vital Life has shown me how a single donation ripple-effects through entire families."', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAY4-lvy9bwkwL0IRkiMKilSE68nvCU5J1QPdhc7KwvrrxZYs5910hgdz_-gk1rcaRJorv-E28YXvgo0xJpWASdW09o1izETIqF_jNSRuiKim6cp5D-uGq9kzLog7n742GSzPBltQZoJXRzU8K9OdgTB6NzBGv8ytQRxA4GJvErhjV9BzfG2y9zk9gKtbSL3MDqRmTKZljkrQUtTYacZ2JfvpUinhOKa4s27gnP2bbUi5vaEGZS5xCDtGdNn7Jq1H3SEp9d82l4BnU' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -6 }} className="bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-high transition-shadow">
                <div className="relative h-56 overflow-hidden">
                  <img className="w-full h-full object-cover" src={s.img} alt={s.name} />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${s.badgeBg}`}>{s.badge}</span>
                </div>
                <div className="p-6 space-y-3">
                  <span className="material-symbols-outlined text-[#b7131a] opacity-30 text-4xl">format_quote</span>
                  <p className="text-[#191c1d] leading-relaxed italic">{s.quote}</p>
                  <div className="pt-4 border-t border-[#e4beb9]">
                    <p className="font-jakarta font-bold text-[#191c1d]">{s.name}</p>
                    <p className="text-sm text-[#5b403d]">{s.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Donate ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-jakarta text-4xl font-bold text-[#191c1d] mb-3">Why Donate?</h2>
            <p className="text-[#5b403d] text-lg max-w-2xl mx-auto">Different donations solve different medical challenges. Your unique gift can address specific needs.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'opacity', title: 'Whole Blood', color: '#b7131a', facts: ['Takes 10–15 mins', 'Every 56 days', 'Universal need'] },
              { icon: 'medication', title: 'Plasma', color: '#005faf', facts: ['Takes ~1 hour', 'Every 28 days', 'Vital for immune support'] },
              { icon: 'diversity_1', title: 'Organ & Tissue', color: '#006b1b', facts: ['Legacy planning', 'Any age can register', 'Up to 8 lives saved'] },
            ].map((d, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} whileHover={{ y: -6 }} className="bg-[#f8f9fa] rounded-2xl p-8 space-y-5 hover:shadow-soft transition-shadow">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: `${d.color}18` }}>
                  <span className="material-symbols-outlined text-2xl" style={{ color: d.color, fontVariationSettings: "'FILL' 1" }}>{d.icon}</span>
                </div>
                <h3 className="font-jakarta text-xl font-bold" style={{ color: d.color }}>{d.title}</h3>
                <ul className="space-y-2">
                  {d.facts.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-[#5b403d] text-sm">
                      <span className="material-symbols-outlined text-base" style={{ color: d.color }}>check_circle</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2.5 rounded-full border-2 font-semibold text-sm transition-all hover:opacity-80" style={{ borderColor: d.color, color: d.color }}>Learn More</button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-[#f8f9fa]">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="max-w-4xl mx-auto bg-[#b7131a] rounded-3xl p-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-[300px] text-white">favorite</span>
          </div>
          <div className="relative z-10 space-y-6">
            <h2 className="font-jakarta text-4xl font-extrabold text-white">Ready to make your mark?</h2>
            <p className="text-white/85 text-lg max-w-xl mx-auto">Join 45,000+ donors who are changing lives every single day. Your next donation could save a life.</p>
            <div className="flex justify-center flex-wrap gap-4">
              <Link to="/register" className="bg-white text-[#b7131a] px-9 py-3.5 rounded-full font-bold font-jakarta hover:bg-[#f3f4f5] transition-all active:scale-95 shadow-lg">Become a Donor</Link>
              <Link to="/centers" className="border-2 border-white text-white px-9 py-3.5 rounded-full font-bold font-jakarta hover:bg-white/10 transition-all active:scale-95">Find Centers</Link>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
