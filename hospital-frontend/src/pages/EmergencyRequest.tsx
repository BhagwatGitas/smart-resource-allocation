import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fade = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.08 } } };

export default function EmergencyRequest() {
  const [type, setType] = useState<'blood' | 'organ'>('blood');

  return (
    <div className="min-h-screen bg-[#f3f4f5] flex items-center justify-center px-4 py-28">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl bg-white rounded-3xl shadow-high overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#b7131a] to-[#d43a3a] p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            </div>
            <div>
              <h1 className="font-jakarta text-xl font-bold text-white">Emergency Request</h1>
              <p className="text-white/75 text-sm">City General Hospital • Vital Life Network</p>
            </div>
          </div>
          <Link to="/" className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-all">
            <span className="material-symbols-outlined text-white text-lg">close</span>
          </Link>
        </div>

        {/* Body */}
        <motion.div variants={stagger} initial="hidden" animate="show" className="p-6 md:p-8 space-y-6">
          {/* Type Toggle */}
          <motion.div variants={fade}>
            <label className="text-sm font-semibold text-[#5b403d] mb-2 block">What is needed?</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setType('blood')}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  type === 'blood'
                    ? 'bg-[#b7131a] text-white shadow-lg'
                    : 'bg-[#f8f9fa] text-[#5b403d] border border-[#e4beb9] hover:bg-[#f3f4f5]'
                }`}
              >
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>bloodtype</span>
                Blood Type
              </button>
              <button
                onClick={() => setType('organ')}
                className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all ${
                  type === 'organ'
                    ? 'bg-[#005faf] text-white shadow-lg'
                    : 'bg-[#f8f9fa] text-[#5b403d] border border-[#e4beb9] hover:bg-[#f3f4f5]'
                }`}
              >
                <span className="material-symbols-outlined text-base">cardiology</span>
                Organ
              </button>
            </div>
          </motion.div>

          {/* Specific Requirement */}
          <motion.div variants={fade} className="space-y-2">
            <label className="text-sm font-semibold text-[#5b403d]">Specific Requirement</label>
            <select className="w-full px-4 py-3.5 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all appearance-none">
              {type === 'blood'
                ? ['O Negative (Universal)', 'O Positive', 'A Negative', 'A Positive', 'B Negative', 'B Positive', 'AB Negative', 'AB Positive'].map(o => <option key={o}>{o}</option>)
                : ['Kidney', 'Liver', 'Heart', 'Lung', 'Cornea'].map(o => <option key={o}>{o}</option>)
              }
            </select>
          </motion.div>

          {/* Quantity & Priority */}
          <motion.div variants={fade} className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#5b403d]">Quantity (Units)</label>
              <input type="number" placeholder="e.g. 5" className="w-full px-4 py-3.5 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] placeholder:text-[#906f6c] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-[#5b403d]">Priority Level</label>
              <select className="w-full px-4 py-3.5 rounded-xl border border-[#b7131a]/30 bg-[#fff5f5] text-[#b7131a] font-semibold focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 transition-all">
                <option>Critical (Life-Saving)</option>
                <option>High (Urgent)</option>
                <option>Medium (Scheduled)</option>
                <option>Low (Routine)</option>
              </select>
            </div>
          </motion.div>

          {/* Notes */}
          <motion.div variants={fade} className="space-y-2">
            <label className="text-sm font-semibold text-[#5b403d]">Delivery Instructions / Notes</label>
            <textarea placeholder="Operating Theater 4, Level 2 South Wing..." rows={3} className="w-full px-4 py-3.5 rounded-xl border border-[#e4beb9] bg-[#f8f9fa] text-[#191c1d] placeholder:text-[#906f6c] focus:outline-none focus:ring-2 focus:ring-[#b7131a]/30 focus:border-[#b7131a] transition-all resize-none" />
          </motion.div>

          {/* Info */}
          <motion.div variants={fade} className="flex items-start gap-3 p-4 bg-[#f0f7ff] rounded-xl border border-[#005faf]/20">
            <span className="material-symbols-outlined text-[#005faf] mt-0.5 shrink-0">info</span>
            <p className="text-sm text-[#5b403d] leading-relaxed">
              Submitting this request will alert all compatible <span className="font-bold text-[#b7131a]">Vital Life</span> centers within a 50km radius. Courier dispatch will be automated upon confirmation.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div variants={fade} className="flex flex-col sm:flex-row gap-3 pt-2">
            <button className="flex-1 py-3.5 rounded-full border-2 border-[#b7131a] text-[#b7131a] font-bold font-jakarta text-sm hover:bg-[#b7131a]/5 transition-all active:scale-95">
              Save as Draft
            </button>
            <button className="flex-1 py-3.5 rounded-full bg-[#b7131a] text-white font-bold font-jakarta text-sm shadow-lg hover:shadow-xl hover:bg-[#9a1016] transition-all active:scale-95 flex items-center justify-center gap-2">
              Submit Request
              <span className="material-symbols-outlined text-base">send</span>
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
