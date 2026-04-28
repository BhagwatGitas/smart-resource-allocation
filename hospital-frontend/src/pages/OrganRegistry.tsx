import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Search, FileText, UserPlus, Clock, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const analyticsData = [
  { month: 'Jan', matches: 45, growth: 30 },
  { month: 'Feb', matches: 52, growth: 45 },
  { month: 'Mar', matches: 48, growth: 60 },
  { month: 'Apr', matches: 70, growth: 85 },
  { month: 'May', matches: 65, growth: 75 },
  { month: 'Jun', matches: 90, growth: 95 },
];

const organs = [
  { name: 'Kidney', available: 8, matched: 124, waiting: 450, color: 'text-red-600', bg: 'bg-red-50' },
  { name: 'Liver', available: 24, matched: 89, waiting: 210, color: 'text-orange-600', bg: 'bg-orange-50' },
  { name: 'Heart', available: 42, matched: 56, waiting: 95, color: 'text-blue-600', bg: 'bg-blue-50' },
  { name: 'Lung', available: 15, matched: 42, waiting: 130, color: 'text-red-600', bg: 'bg-red-50' },
];

export default function OrganRegistry() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest mb-4 inline-block">
            Advanced Resource Allocation
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Organ Registry <span className="text-emerald-600">& Matching</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl">
            Real-time monitoring of organ availability and AI-driven matching for critical patients across the national health network.
          </p>
        </motion.div>

        {/* Analytics Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-emerald-500" size={24} />
                Analytics & Trends
              </h2>
              <p className="text-sm text-slate-500 mt-1">Registry growth and successful AI matches over the last 6 months.</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Matches
              </span>
              <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-blue-500" /> New Pledges
              </span>
            </div>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px'}}
                />
                <Area type="monotone" dataKey="matches" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorMatches)" />
                <Area type="monotone" dataKey="growth" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {organs.map((org, i) => (
            <motion.div
              key={org.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-12 h-12 rounded-2xl ${org.bg} flex items-center justify-center ${org.color}`}>
                  <Activity size={24} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Availability</p>
                  <p className={`text-2xl font-black ${org.color}`}>{org.available}%</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{org.name}</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Matched Today</span>
                  <span className="font-bold text-slate-900">{org.matched}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">On Waitlist</span>
                  <span className="font-bold text-slate-900">{org.waiting}</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-slate-50">
                <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-900 hover:text-white transition-all">
                  View Matching Queue
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Active Matches */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="text-amber-500" size={24} />
                  Active AI Matches
                </h2>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">8 Matches Processing</span>
              </div>
              <div className="space-y-4">
                {[
                  { patient: 'Amit Joshi', id: '#301', organ: 'Kidney', status: 'Matching', urgency: 'Critical', time: '12m ago' },
                  { patient: 'Sunita Rao', id: '#204', organ: 'Liver', status: 'Approved', urgency: 'High', time: '45m ago' },
                  { patient: 'Kiran Shah', id: '#155', organ: 'Heart', status: 'En Route', urgency: 'Critical', time: '2h ago' },
                ].map((match, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-slate-400 border border-slate-100">
                        {match.patient[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{match.patient} <span className="text-slate-400 font-medium ml-1">{match.id}</span></h4>
                        <p className="text-xs text-slate-500">{match.organ} · {match.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                        match.urgency === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>
                        {match.urgency}
                      </span>
                      <span className="text-sm font-bold text-slate-700">{match.status}</span>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-xl shadow-slate-900/20">
              <ShieldCheck className="text-emerald-400 mb-6" size={40} />
              <h3 className="text-xl font-bold mb-4">Register Interest</h3>
              <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                Join the national organ registry as a potential donor. Your pledge can save up to 8 lives.
              </p>
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2">
                <UserPlus size={18} />
                Pledge Donation
              </button>
            </div>

            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-6">Quick Resources</h3>
              <div className="space-y-2">
                {[
                  { label: 'Eligibility Guide', icon: Search },
                  { label: 'Legal Framework', icon: FileText },
                  { label: 'Transplant Process', icon: Clock },
                ].map((item) => (
                  <button key={item.label} className="w-full flex items-center gap-3 p-4 hover:bg-slate-50 rounded-2xl transition-all text-sm font-medium text-slate-600 text-left">
                    <item.icon size={18} className="text-slate-400" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ size, className }: { size: number, className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
