import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, CandlestickChart, Repeat2, Wallet, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming cn utility is available

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/markets', label: 'Markets', icon: CandlestickChart },
  { path: '/trading-interface', label: 'Trade', icon: Repeat2 },
  { path: '/wallet-management', label: 'Wallet', icon: Wallet },
  { path: '/earn-section', label: 'Earn', icon: PiggyBank },
];

const AppBottomTabBar: React.FC = () => {
  console.log('AppBottomTabBar loaded');
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 bg-neutral-900 border-t border-neutral-700/50 shadow-lg">
      <div className="flex justify-around items-center h-full max-w-md mx-auto">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = location.pathname === item.path || (item.path === "/" && location.pathname.startsWith("/#")); // Handles root path matching

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center h-full px-2 text-neutral-400 hover:text-neutral-200 transition-colors duration-150 ease-in-out w-[19%]', // w-[19%] to give a bit of space, adjust as needed
                { 'text-yellow-400': isActive }
              )}
            >
              <IconComponent className={cn('h-6 w-6 mb-0.5', { 'stroke-[2.5px]': isActive })} />
              <span className={cn('text-xs font-medium', { 'font-semibold': isActive })}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default AppBottomTabBar;