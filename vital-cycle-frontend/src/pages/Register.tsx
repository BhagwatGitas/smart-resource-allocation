import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

const steps = ['Personal', 'Health', 'Preferences'];

export default function Register() {
  const [step, setStep] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff5f5] via-white to-[#f0f7ff] pt-28 pb-16 px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#b7131a]/10 text-[#b7131a] px-4 py-2 rounded-full text-sm font-semibold font-jakarta mb-4">
            <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
            Join Our Community
          </div>
          <h1 className="font-jakarta text-4xl font-extrabold text-[#191c1d] mb-3">Register as a Donor</h1>
          <p className="text-[#5b403d] text-base leading-relaxed max-w-md mx-auto">
            Your selfless act can save up to three lives. Start your donation journey today.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 px-4">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 flex-1">
              <motion.div
                animate={i <= step ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 0.3 }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-jakarta font-bold text-sm shrink-0 transition-all duration-300 ${
                  i <= step ? 'bg-[#b7131a] text-white shadow-lg' : 'bg-[#e7e8e9] text-[#5b403d]'
                }`}
              >
                {i < step ? (
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  i + 1
                )}
              </motion.div>
              <span className={`text-sm font-semibold font-jakarta hidden sm:block ${i <= step ? 'text-[#b7131a]' : 'text-[#5b403d]'}`}>{s}</span>
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 rounded-full overflow-hidden bg-[#e7e8e9]">
                  <div className={`h-full rounded-full transition-all duration-500 ${i < step ? 'w-full bg-[#b7131a]' : 'w-0'}`} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-soft p-8 md:p-10"
          layout
        >
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div key="personal" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#b7131a] text-2xl">person</span>
                  <h2 className="font-jakarta text-xl font-bold text-[#191c1d]">Personal Details</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div variants={fade} className="space-y-2">
                    <label className="text-sm font-semibold text-[#5b403d]">Full Legal Name</label>
                    <input type="text" placeholder="e.g. Sarah Jenkins" className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] placeholder:text-[#906f6c] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all" />
                  </motion.div>
                  <motion.div variants={fade} className="space-y-2">
                    <label className="text-sm font-semibold text-[#5b403d]">Date of Birth</label>
                    <input type="date" className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all" />
                  </motion.div>
                </div>
                <motion.div variants={fade} className="space-y-2 mt-5">
                  <label className="text-sm font-semibold text-[#5b403d]">Email Address</label>
                  <input type="email" placeholder="sarah@example.com" className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] placeholder:text-[#906f6c] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all" />
                </motion.div>
                <motion.div variants={fade} className="space-y-2 mt-5">
                  <label className="text-sm font-semibold text-[#5b403d]">Phone Number</label>
                  <input type="tel" placeholder="+1 (555) 123-4567" className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] placeholder:text-[#906f6c] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all" />
                </motion.div>
                <motion.div variants={fade} className="space-y-2 mt-5">
                  <label className="text-sm font-semibold text-[#5b403d]">Residential Address</label>
                  <input type="text" placeholder="Street, City, State, Zip" className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] placeholder:text-[#906f6c] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all" />
                </motion.div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div key="health" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#b7131a] text-2xl">health_and_safety</span>
                  <h2 className="font-jakarta text-xl font-bold text-[#191c1d]">Health Information</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div variants={fade} className="space-y-2">
                    <label className="text-sm font-semibold text-[#5b403d]">Blood Type</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all">
                      <option value="">Select blood type</option>
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </motion.div>
                  <motion.div variants={fade} className="space-y-2">
                    <label className="text-sm font-semibold text-[#5b403d]">Weight (kg)</label>
                    <input type="number" placeholder="e.g. 70" className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] placeholder:text-[#906f6c] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all" />
                  </motion.div>
                </div>
                <motion.div variants={fade} className="space-y-2 mt-5">
                  <label className="text-sm font-semibold text-[#5b403d]">Medical Conditions (if any)</label>
                  <textarea placeholder="List any conditions, medications, or allergies..." rows={3} className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] placeholder:text-[#906f6c] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all resize-none" />
                </motion.div>
                <motion.div variants={fade} className="space-y-2 mt-5">
                  <label className="text-sm font-semibold text-[#5b403d]">Last Donation Date</label>
                  <input type="date" className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all" />
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="preferences" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-[#b7131a] text-2xl">tune</span>
                  <h2 className="font-jakarta text-xl font-bold text-[#191c1d]">Donation Preferences</h2>
                </div>
                <motion.div variants={fade} className="space-y-2">
                  <label className="text-sm font-semibold text-[#5b403d]">Preferred Donation Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Whole Blood', 'Plasma', 'Organ'].map(t => (
                      <button key={t} className="px-4 py-3 rounded-xl border border-[#e4beb9] text-[#191c1d] text-sm font-semibold hover:bg-[#b7131a] hover:text-white hover:border-[#b7131a] transition-all focus:bg-[#b7131a] focus:text-white focus:border-[#b7131a]">{t}</button>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fade} className="space-y-2 mt-5">
                  <label className="text-sm font-semibold text-[#5b403d]">Preferred Center</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all">
                    <option value="">Select a donation center</option>
                    <option>Central Blood Bank</option>
                    <option>City General Hospital</option>
                    <option>Regional Medical Center</option>
                  </select>
                </motion.div>
                <motion.div variants={fade} className="space-y-2 mt-5">
                  <label className="text-sm font-semibold text-[#5b403d]">Availability</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Weekdays', 'Weekends', 'Mornings', 'Afternoons'].map(t => (
                      <button key={t} className="px-4 py-3 rounded-xl border border-[#e4beb9] text-[#191c1d] text-sm font-semibold hover:bg-[#005faf] hover:text-white hover:border-[#005faf] transition-all focus:bg-[#005faf] focus:text-white">{t}</button>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fade} className="flex items-start gap-3 mt-6 p-4 bg-[#f0f7ff] rounded-xl border border-[#005faf]/20">
                  <span className="material-symbols-outlined text-[#005faf] mt-0.5">info</span>
                  <p className="text-sm text-[#5b403d] leading-relaxed">By registering, you agree to receive notifications about donation opportunities and emergency requests in your area.</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-[#e4beb9]/50">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold font-jakarta text-sm transition-all ${step === 0 ? 'invisible' : 'text-[#5b403d] hover:bg-[#f3f4f5]'}`}
            >
              <span className="material-symbols-outlined text-base">arrow_back</span> Previous
            </button>
            <button
              onClick={() => step < 2 ? setStep(s => s + 1) : alert('Registration submitted!')}
              className="flex items-center gap-2 bg-[#b7131a] text-white px-8 py-3 rounded-full font-bold font-jakarta text-sm shadow-lg hover:shadow-xl hover:bg-[#9a1016] transition-all active:scale-95"
            >
              {step < 2 ? 'Continue' : 'Submit Registration'}
              <span className="material-symbols-outlined text-base">{step < 2 ? 'arrow_forward' : 'check'}</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
