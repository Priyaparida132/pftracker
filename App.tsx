
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  LogOut, 
  PlusCircle,
  TrendingUp,
  Info,
  Menu
} from 'lucide-react';
import { storageService } from './services/storage';

// Views
import Dashboard from './views/Dashboard';
import Transactions from './views/Transactions';
import Budgets from './views/Budgets';
import Auth from './views/Auth';
import About from './views/About';

const App = () => {
  const [data, setData] = useState(storageService.getData());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const refreshData = () => {
    setData(storageService.getData());
  };

  const handleLogout = () => {
    storageService.setUser(null);
    refreshData();
  };

  if (!data.user) {
    return <Auth onAuthSuccess={refreshData} />;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex bg-gray-50">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="h-full flex flex-col">
            <div className="p-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Wallet className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">
                FinTrack Pro
              </span>
            </div>

            <nav className="flex-1 px-4 space-y-2">
              <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/transactions" icon={<Receipt size={20} />} label="Transactions" onClick={() => setIsSidebarOpen(false)} />
              <SidebarLink to="/budgets" icon={<TrendingUp size={20} />} label="Budgets" onClick={() => setIsSidebarOpen(false)} />
              <div className="pt-4 mt-4 border-t border-gray-100">
                <SidebarLink to="/about" icon={<Info size={20} />} label="About Project" onClick={() => setIsSidebarOpen(false)} />
              </div>
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold border-2 border-white shadow-sm">
                  {data.user.name.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate text-gray-900">{data.user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{data.user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-10">
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold md:block hidden text-gray-800">Welcome, {data.user.name.split(' ')[0]}!</h1>
            <div className="flex items-center gap-4">
               <Link 
                to="/transactions" 
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all shadow-md active:scale-95"
               >
                 <PlusCircle size={18} />
                 <span>New Entry</span>
               </Link>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
            <Routes>
              <Route path="/" element={<Dashboard data={data} />} />
              <Route path="/transactions" element={<Transactions data={data} onUpdate={refreshData} />} />
              <Route path="/budgets" element={<Budgets data={data} onUpdate={refreshData} />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </HashRouter>
  );
};

const SidebarLink = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-medium scale-[1.02]' 
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
      `}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default App;
