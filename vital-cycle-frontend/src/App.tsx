import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Centers from './pages/Centers';
import EmergencyRequest from './pages/EmergencyRequest';
import HospitalDashboard from './pages/HospitalDashboard';
import MyImpact from './pages/MyImpact';
import OurImpact from './pages/OurImpact';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/centers" element={<Centers />} />
          <Route path="/emergency" element={<EmergencyRequest />} />
          <Route path="/dashboard" element={<HospitalDashboard />} />
          <Route path="/my-impact" element={<MyImpact />} />
          <Route path="/our-impact" element={<OurImpact />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="font-inter text-[#191c1d] flex flex-col min-h-screen">
        <TopNav />
        <div className="flex-grow">
          <AnimatedRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
