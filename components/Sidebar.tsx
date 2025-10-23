
import React from 'react';
import {
  DashboardIcon,
  SupplierIcon,
  BonusIcon,
  LossIcon,
  GondolaIcon,
  NegotiationIcon,
  CloseIcon,
} from './shared/icons';

type View = 'dashboard' | 'suppliers' | 'bonuses' | 'losses' | 'gondola' | 'negotiations';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, setIsOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'suppliers', label: 'Fornecedores', icon: SupplierIcon },
    { id: 'bonuses', label: 'Bonificações', icon: BonusIcon },
    { id: 'losses', label: 'Perdas', icon: LossIcon },
    { id: 'gondola', label: 'Pontos de Gôndola', icon: GondolaIcon },
    { id: 'negotiations', label: 'Negociações', icon: NegotiationIcon },
  ];

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => (
    <li>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentView(item.id as View);
          if (window.innerWidth < 768) { // md breakpoint
            setIsOpen(false);
          }
        }}
        className={`flex items-center p-3 my-1 rounded-lg transition-colors duration-200 ${
          currentView === item.id
            ? 'bg-sky-600 text-white shadow-md'
            : 'text-slate-200 hover:bg-sky-800 hover:text-white'
        }`}
      >
        <item.icon className="w-6 h-6 mr-3" />
        <span className="font-medium">{item.label}</span>
      </a>
    </li>
  );

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      ></div>
      <aside
        className={`bg-slate-900 text-white flex flex-col transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } absolute md:relative w-64 h-full md:translate-x-0`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white">Gestor SCM</h2>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-slate-300 hover:text-white">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-1 p-4">
          <ul>
            {navItems.map((item) => (
              <NavLink key={item.id} item={item} />
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-700">
          <p className="text-xs text-slate-400">&copy; 2024 Gestor SCM</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
