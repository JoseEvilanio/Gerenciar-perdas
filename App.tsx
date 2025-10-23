
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SupplierPage from './components/SupplierPage';
import BonusPage from './components/BonusPage';
import LossPage from './components/LossPage';
import GondolaPage from './components/GondolaPage';
import NegotiationPage from './components/NegotiationPage';
import { MenuIcon } from './components/shared/icons';

type View = 'dashboard' | 'suppliers' | 'bonuses' | 'losses' | 'gondola' | 'negotiations';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'suppliers':
        return <SupplierPage />;
      case 'bonuses':
        return <BonusPage />;
      case 'losses':
        return <LossPage />;
      case 'gondola':
        return <GondolaPage />;
      case 'negotiations':
        return <NegotiationPage />;
      default:
        return <Dashboard />;
    }
  }, [currentView]);

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <main className="flex-1 flex flex-col transition-all duration-300">
        <header className="bg-white shadow-sm p-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-slate-600 hover:text-slate-900 md:hidden mr-4"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-slate-800 capitalize">{currentView.replace('_', ' ')}</h1>
        </header>
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
