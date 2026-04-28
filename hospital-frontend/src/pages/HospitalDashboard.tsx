import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { 
  LayoutDashboard, 
  Droplet, 
  Users, 
  ShieldCheck, 
  FileText, 
  Search, 
  Bell, 
  Settings, 
  LogOut, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  UserPlus,
  Dna,
  Activity,
  Calendar,
  MoreVertical
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const fade = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.05 } } };

type Role = 'ADMIN' | 'DOCTOR' | 'NURSE' | 'PATIENT';

const sidebarConfig: Record<Role, any[]> = {
  ADMIN: [
    { icon: LayoutDashboard, label: 'Overview', id: 'overview' },
    { icon: Droplet, label: 'Blood Inventory', id: 'inventory' },
    { icon: Dna, label: 'Organ Registry', id: 'matching' },
    { icon: AlertTriangle, label: 'Priority Queue', id: 'requests' },
    { icon: Users, label: 'User Directory', id: 'users' },
    { icon: FileText, label: 'Analytics', id: 'reports' },
  ],
  DOCTOR: [
    { icon: LayoutDashboard, label: 'Medical Dashboard', id: 'overview' },
    { icon: Droplet, label: 'Request Resources', id: 'requests' },
    { icon: Dna, label: 'Organ Matching', id: 'matching' },
    { icon: Clock, label: 'My Requests', id: 'my-requests' },
  ],
  NURSE: [
    { icon: LayoutDashboard, label: 'Nursing Station', id: 'overview' },
    { icon: Droplet, label: 'Blood Requests', id: 'requests' },
    { icon: Activity, label: 'Patient Vitals', id: 'status' },
  ],
  PATIENT: [
    { icon: LayoutDashboard, label: 'My Portal', id: 'overview' },
    { icon: Clock, label: 'Treatment History', id: 'my-requests' },
    { icon: Calendar, label: 'Appointments', id: 'appointments' },
  ]
};

const mockBloodData = [
  { name: 'A+', units: 45, status: 'Safe' },
  { name: 'A-', units: 12, status: 'Warning' },
  { name: 'B+', units: 38, status: 'Safe' },
  { name: 'B-', units: 4, status: 'Critical' },
  { name: 'O+', units: 52, status: 'Safe' },
  { name: 'O-', units: 2, status: 'Critical' },
  { name: 'AB+', units: 18, status: 'Safe' },
  { name: 'AB-', units: 7, status: 'Warning' },
];

const mockRequests = [
  { id: '#REQ-102', patient: 'Anjali Sharma', type: 'O-', urgency: 'P1', status: 'In Lab', time: '12m ago', category: 'Blood' },
  { id: '#REQ-098', patient: 'Rahul Verma', type: 'A+', urgency: 'P2', status: 'Matched', time: '45m ago', category: 'Blood' },
  { id: '#REQ-085', patient: 'Sanjay Gupta', type: 'AB+', urgency: 'P4', status: 'Fulfilled', time: '2h ago', category: 'Blood' },
  { id: '#REQ-105', patient: 'Priya Das', type: 'B-', urgency: 'P1', status: 'Pending', time: 'Just now', category: 'Blood' },
  { id: '#REQ-201', patient: 'Amit Joshi', type: 'Kidney', urgency: 'P1', status: 'Matching', time: '5m ago', category: 'Organ' },
  { id: '#REQ-202', patient: 'Sunita Rao', type: 'Liver', urgency: 'P1', status: 'Approved', time: '18m ago', category: 'Organ' },
];

const chartData = [
  { day: 'Mon', usage: 24, collection: 30 },
  { day: 'Tue', usage: 18, collection: 25 },
  { day: 'Wed', usage: 42, collection: 20 },
  { day: 'Thu', usage: 30, collection: 35 },
  { day: 'Fri', usage: 25, collection: 28 },
  { day: 'Sat', usage: 15, collection: 22 },
  { day: 'Sun', usage: 10, collection: 15 },
];

export default function HospitalDashboard() {
  const [role, setRole] = useState<Role>('ADMIN');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarItems = sidebarConfig[role];

  const renderOverview = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      {/* Dynamic Hero Section */}
      <div className="bg-gradient-to-r from-[#b7131a] to-[#8e0f14] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold font-outfit mb-2">
            Welcome back, {role === 'ADMIN' ? 'Chief Admin' : role === 'PATIENT' ? 'Ravi Sharma' : 'Medical Staff'}.
          </h2>
          <p className="text-red-100 opacity-90 max-w-xl">
            {role === 'ADMIN' 
              ? 'All critical systems are online. You have 2 pending approvals in the priority queue.' 
              : role === 'PATIENT'
              ? 'Your recovery is on track. We found a match for your transplant request.'
              : 'Inventory is stable, but O- is at critical levels. Please check the blood bank logs.'}
          </p>
          <div className="mt-6 flex gap-4">
            <button className="bg-white text-[#b7131a] px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 transition-all shadow-lg">
              Generate Report
            </button>
            <button className="bg-red-600/30 backdrop-blur-md border border-white/20 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/10 transition-all">
              System Logs
            </button>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-[-20%] left-[20%] w-64 h-64 bg-rose-500/20 rounded-full blur-3xl" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+0.1%', trendColor: 'text-emerald-500' },
          { label: 'Active Requests', value: '24', icon: Bell, color: 'text-red-600', bg: 'bg-red-50', trend: '+12%', trendColor: 'text-red-500' },
          { label: 'Pending Organs', value: '08', icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2%', trendColor: 'text-amber-500' },
          { label: 'Critical Units', value: '02', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50', trend: 'Severe', trendColor: 'text-rose-500' },
        ].map((stat, i) => (
          <motion.div key={i} variants={fade} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className={`text-xs font-bold ${stat.trendColor} px-2 py-1 bg-slate-50 rounded-lg`}>{stat.trend}</span>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 font-outfit">{stat.value}</h3>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts & Tables Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Resources Performance</h3>
              <p className="text-sm text-slate-500">Inventory usage vs collections (weekly)</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-2 outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b7131a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#b7131a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorColl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="usage" stroke="#b7131a" strokeWidth={3} fillOpacity={1} fill="url(#colorUsage)" />
                <Area type="monotone" dataKey="collection" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorColl)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">Critical Shortages</h3>
          <div className="space-y-4">
            {mockBloodData.filter(b => b.status !== 'Safe').map((b, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-lg ${b.status === 'Critical' ? 'bg-rose-500' : 'bg-amber-500'}`}>
                  {b.name}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-800">{b.units} Units Remaining</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${b.status === 'Critical' ? 'text-rose-500' : 'text-amber-500'}`}>{b.status}</p>
                </div>
                <button className="text-red-600 font-bold text-xs hover:underline">Restock</button>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-4 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all">
            View All Inventory
          </button>
        </div>
      </div>
    </motion.div>
  );

  const renderInventory = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Blood Bank Inventory</h2>
          <p className="text-slate-500">Real-time stock monitoring across all units.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search blood type..." 
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-[#b7131a] transition-all text-sm"
            />
          </div>
          <button className="bg-[#b7131a] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-200">
            <Droplet size={18} />
            Add Stock
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockBloodData.map((b, i) => (
          <motion.div 
            key={i} 
            variants={fade}
            className={`bg-white p-6 rounded-3xl border-2 transition-all ${
              b.status === 'Critical' ? 'border-rose-100 bg-rose-50/10' : 
              b.status === 'Warning' ? 'border-amber-100 bg-amber-50/10' : 
              'border-slate-50 hover:border-red-100 shadow-sm'
            }`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg ${
                b.status === 'Critical' ? 'bg-rose-500 text-white' : 
                b.status === 'Warning' ? 'bg-amber-500 text-white' : 
                'bg-red-100 text-[#b7131a]'
              }`}>
                {b.name}
              </div>
              <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                b.status === 'Critical' ? 'bg-rose-100 text-rose-600' : 
                b.status === 'Warning' ? 'bg-amber-100 text-amber-600' : 
                'bg-emerald-100 text-emerald-600'
              }`}>
                {b.status}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-slate-800 font-outfit">{b.units}</p>
              <p className="text-slate-500 text-sm font-bold">Units Available</p>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-50 flex justify-between items-center">
              <div className="flex -space-x-2">
                {[1,2,3].map(x => (
                  <div key={x} className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white" />
                ))}
                <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">+12</div>
              </div>
              <button className="text-red-600 font-bold text-xs">History</button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderRequests = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Priority Request Queue</h2>
          <p className="text-slate-500">AI-ranked requests sorted by clinical urgency.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
            <Filter size={18} />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-left">Request ID</th>
              <th className="px-8 py-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-left">Patient</th>
              <th className="px-8 py-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-left">Type</th>
              <th className="px-8 py-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-left">Urgency</th>
              <th className="px-8 py-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-left">Status</th>
              <th className="px-8 py-4 font-bold text-slate-400 text-xs uppercase tracking-widest text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {mockRequests.map((req, i) => (
              <tr key={i} className="hover:bg-slate-50/80 transition-colors group">
                <td className="px-8 py-6 font-bold text-slate-800 text-sm">{req.id}</td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-bold">
                      {req.patient.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-bold text-slate-800 text-sm">{req.patient}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-700 text-xs border border-slate-200">
                    {req.type}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black ${
                    req.urgency === 'P1' ? 'bg-rose-100 text-rose-600' : 
                    req.urgency === 'P2' ? 'bg-amber-100 text-amber-600' : 
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {req.urgency}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${req.status === 'Fulfilled' ? 'bg-emerald-500' : 'bg-[#b7131a] animate-pulse'}`} />
                    <span className="text-sm font-bold text-slate-600">{req.status}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <button className="bg-slate-100 text-slate-600 p-2 rounded-lg hover:bg-[#b7131a] hover:text-white transition-all">
                    <ArrowUpRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );

  const renderUsers = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">User Directory</h2>
          <p className="text-slate-500">Manage all system participants and their roles.</p>
        </div>
        <button className="bg-[#b7131a] text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-200">
          <UserPlus size={18} />
          Register New User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Dr. Sneha Mehta', role: 'Doctor', dept: 'Cardiology', status: 'Online' },
          { name: 'Nurse Priya Patel', role: 'Nurse', dept: 'ICU Ward B', status: 'On Shift' },
          { name: 'Ravi Admin', role: 'Administrator', dept: 'System Ops', status: 'Online' },
          { name: 'Vijay Kumar', role: 'Donor', dept: 'Blood Bank', status: 'Active' },
          { name: 'Amit Joshi', role: 'Patient', dept: 'General Ward', status: 'Admitted' },
        ].map((user, i) => (
          <motion.div key={i} variants={fade} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#b7131a] font-black text-xl">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-800 truncate">{user.name}</h4>
              <p className="text-xs font-bold text-red-600 uppercase tracking-tighter mb-1">{user.role}</p>
              <p className="text-xs text-slate-400">{user.dept}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={18} /></button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  const renderAccessControl = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-bold text-slate-800">System Access Security</h2>
        <p className="text-slate-500 mb-8">Granular role-based permissions management.</p>
        
        <div className="grid gap-6">
          {[
            { title: 'Patient Data Isolation', desc: 'Patients can only view their own request status and history.', enabled: true },
            { title: 'Cross-Hospital Matching', desc: 'Allow AI to search for donors in the partner hospital network.', enabled: true },
            { title: 'Manual Inventory Override', desc: 'Permit doctors to manually adjust stock levels in emergencies.', enabled: false },
            { title: 'Deceased Donor Protocol', desc: 'Enable certification workflow for brain-dead donors.', enabled: true },
            { title: 'Auto-Replenish Alerts', desc: 'Send automatic SMS/Email to donors when stock hits critical thresholds.', enabled: false },
          ].map((policy, i) => (
            <motion.div key={i} variants={fade} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="max-w-lg">
                <h4 className="text-lg font-bold text-slate-800 mb-1">{policy.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{policy.desc}</p>
              </div>
              <div className={`w-14 h-7 rounded-full relative cursor-pointer transition-all duration-300 ${policy.enabled ? 'bg-[#b7131a]' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${policy.enabled ? 'right-1' : 'left-1'}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderReports = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Analytics</h2>
          <p className="text-slate-500">Comprehensive performance metrics and AI insights.</p>
        </div>
        <button className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg">
          Download PDF Report
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Supply vs Demand</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="usageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#b7131a" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#b7131a" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="collGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="usage" stroke="#b7131a" strokeWidth={4} fillOpacity={1} fill="url(#usageGrad)" />
                <Area type="monotone" dataKey="collection" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#collGrad)" />
                <Legend iconType="circle" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Registry Distribution</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Blood Donors', value: 4500, color: '#b7131a' },
                    { name: 'Organ Pledges', value: 1200, color: '#10b981' },
                    { name: 'Emergencies', value: 300, color: '#3b82f6' },
                  ]}
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { color: '#b7131a' },
                    { color: '#10b981' },
                    { color: '#3b82f6' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderMatching = () => (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Organ Matching Registry</h2>
          <p className="text-slate-500">AI-powered compatibility matching and transplant queue.</p>
        </div>
        <button className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-200">
          <Dna size={18} />
          New Search
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {mockRequests.filter(r => r.category === 'Organ').map((req, i) => (
          <motion.div key={i} variants={fade} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-emerald-600 font-black text-xl">
                  {req.patient[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{req.patient}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{req.id} · {req.time}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                req.urgency === 'P1' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
              }`}>
                {req.urgency} Priority
              </span>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-500">Target Organ</span>
                <span className="text-sm font-black text-slate-900">{req.type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Matching Status</span>
                <span className="flex items-center gap-2 text-sm font-black text-emerald-600">
                  <Activity size={14} className="animate-pulse" />
                  {req.status}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Top Potential Matches</p>
              {[1, 2].map(m => (
                <div key={m} className="flex justify-between items-center p-3 bg-white border border-slate-100 rounded-xl">
                  <span className="text-xs font-bold text-slate-600">Donor #{m * 42} (Compatibility: 98%)</span>
                  <button className="text-[10px] font-black text-blue-600 hover:underline uppercase">Review</button>
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2">
              <Activity size={18} />
              Open Matching Lab
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex flex-col w-80 min-h-screen bg-white border-r border-slate-100 p-8 fixed left-0 top-0 z-40"
      >
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-[#b7131a] rounded-2xl flex items-center justify-center shadow-lg shadow-red-200">
            <Droplet className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black font-outfit text-slate-800 tracking-tighter">Vital Life</h1>
        </div>

        {/* Role Switcher (Mock Auth) */}
        <div className="mb-10 p-5 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Active Portal</p>
          <div className="grid grid-cols-2 gap-2">
            {(['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT'] as Role[]).map(r => (
              <button 
                key={r}
                onClick={() => { setRole(r); setActiveTab('overview'); }}
                className={`text-[10px] font-black py-2 rounded-xl transition-all border ${
                  role === r ? 'bg-[#b7131a] border-[#b7131a] text-white shadow-md' : 'bg-white border-slate-200 text-slate-400 hover:border-red-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-4">Navigation</p>
          {sidebarItems.map((item, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-sm transition-all group ${
                activeTab === item.id
                  ? 'bg-red-50 text-[#b7131a] shadow-sm border border-red-100'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="truncate">{item.label}</span>
              {activeTab === item.id && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-[#b7131a]" />}
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-slate-50">
          <div className="bg-slate-50 rounded-3xl p-5 flex items-center gap-4 group cursor-pointer hover:bg-slate-100 transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm font-black text-[#b7131a]">
              {role[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#b7131a] text-sm truncate">User Profile</p>
              <p className="text-[10px] font-black text-[#b7131a] uppercase tracking-tight">{role}</p>
            </div>
            <LogOut size={18} className="text-slate-300 group-hover:text-rose-500 transition-all" />
          </div>
        </div>
      </motion.aside>

      {/* Main Container */}
      <main className="flex-1 ml-0 lg:ml-80 min-h-screen">
        <header className="sticky top-0 bg-slate-50/80 backdrop-blur-xl border-b border-slate-100 px-8 py-6 z-30 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">{sidebarItems.find(i => i.id === activeTab)?.label}</h2>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
               <Calendar size={14} />
               {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl outline-none focus:border-[#b7131a] transition-all text-xs w-64 shadow-sm"
              />
            </div>
            <button className="relative w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm hover:shadow-md transition-all">
              <Bell size={18} />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <button className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm hover:shadow-md transition-all">
              <Settings size={18} />
            </button>
          </div>
        </header>

        <div className="p-8 lg:p-12 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={role + activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'inventory' && renderInventory()}
              {activeTab === 'requests' && renderRequests()}
              {activeTab === 'matching' && renderMatching()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'access' && renderAccessControl()}
              {activeTab === 'reports' && renderReports()}
              
              {/* Fallback for tabs not yet fully detailed in this sweep */}
              {!['overview', 'inventory', 'requests', 'users', 'access', 'reports'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[40px] border border-slate-100 border-dashed">
                  <div className="w-20 h-20 bg-red-50 text-[#b7131a] rounded-3xl flex items-center justify-center mb-6">
                    <Activity size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Module "{activeTab}" is initializing</h3>
                  <p className="text-slate-400">We are connecting this module to the AI Priority Engine...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
