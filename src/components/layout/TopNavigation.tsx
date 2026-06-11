import { NavLink } from 'react-router-dom';
import type { UserProfile } from '../../types/domain';
import { cn } from '../../utils/classNames';

const navItems = [
  { to: '/', label: '成长中心' },
  { to: '/trends', label: '成长趋势' },
  { to: '/works', label: '成果库' },
  { to: '/badges', label: '勋章中心' },
];

interface TopNavigationProps {
  user: UserProfile;
}

export function TopNavigation({ user }: TopNavigationProps) {
  return (
    <header className="sticky top-4 z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <nav className="flex flex-col gap-4 rounded-card border border-white/70 bg-white/80 p-3 shadow-card backdrop-blur-2xl lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-3">
          <NavLink to="/" className="flex items-center gap-3 rounded-2xl px-2 py-1">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-growth-primary to-growth-secondary text-xl shadow-lg shadow-blue-200/60">
              🌱
            </span>
            <span>
              <span className="block text-base font-black tracking-tight text-growth-ink">
                Learning Growth
              </span>
              <span className="block text-xs font-semibold text-slate-400">成长仪表盘</span>
            </span>
          </NavLink>

          <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2 lg:hidden">
            <span className="text-lg">{user.avatar}</span>
            <span className="text-sm font-bold text-growth-ink">Lv.{user.level}</span>
          </div>
        </div>

        <div className="flex w-full min-w-0 gap-2 overflow-x-auto rounded-2xl bg-slate-50/80 p-1 [scrollbar-width:thin] lg:w-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-bold transition duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-growth-primary to-growth-secondary text-white shadow-lg shadow-blue-200/50'
                    : 'text-slate-600 hover:bg-white hover:text-growth-ink',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 rounded-2xl bg-white px-4 py-2 shadow-sm ring-1 ring-slate-100 lg:flex">
          <span className="text-2xl">{user.avatar}</span>
          <span>
            <span className="block text-sm font-bold text-growth-ink">{user.name}</span>
            <span className="block text-xs text-slate-400">
              Lv.{user.level} · {user.title}
            </span>
          </span>
        </div>
      </nav>
    </header>
  );
}
