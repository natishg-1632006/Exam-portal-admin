import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiGrid, FiDatabase, FiFileText, FiSend, FiGlobe,
  FiMonitor, FiBarChart2, FiSettings, FiLogOut,
} from 'react-icons/fi';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <FiGrid className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Question Bank', path: '/question-bank', icon: <FiDatabase className="w-4 h-4" /> },
      { label: 'Test Configuration', path: '/test-configuration', icon: <FiFileText className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Delivery',
    items: [
      { label: 'Assignments', path: '/assignments', icon: <FiSend className="w-4 h-4" />, disabled: true },
      { label: 'Published Tests', path: '/published', icon: <FiGlobe className="w-4 h-4" />, disabled: true },
      { label: 'Exam Sessions', path: '/sessions', icon: <FiMonitor className="w-4 h-4" />, disabled: true },
    ],
  },
  {
    label: 'Insights',
    items: [
      { label: 'Analytics', path: '/analytics', icon: <FiBarChart2 className="w-4 h-4" />, disabled: true },
      { label: 'Settings', path: '/settings', icon: <FiSettings className="w-4 h-4" />, disabled: true },
    ],
  },
];

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="w-[220px] flex-shrink-0 h-full bg-white border-r border-slate-200/80 flex flex-col">
      {/* Logo */}
      <div className="h-[60px] flex items-center px-5 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 bg-[#2563EB] rounded-[10px] flex items-center justify-center">
            <FiFileText className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-[15px] font-bold text-slate-900 tracking-tight">Exam Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.08em] px-3 mb-1.5">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.path);
                if (item.disabled) {
                  return (
                    <div
                      key={item.path}
                      className="flex items-center px-3 py-2 rounded-[10px] text-slate-300 cursor-not-allowed opacity-60"
                    >
                      <span className="mr-2.5 flex-shrink-0">{item.icon}</span>
                      <span className="text-xs font-medium">{item.label}</span>
                      <span className="ml-auto text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded-full font-semibold">Soon</span>
                    </div>
                  );
                }
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-[10px] transition-all text-xs font-medium ${
                      active
                        ? 'bg-[#2563EB]/10 text-[#2563EB] font-semibold'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    <span className={`mr-2.5 flex-shrink-0 ${active ? 'text-[#2563EB]' : 'text-slate-400'}`}>{item.icon}</span>
                    {item.label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Footer */}
      <div className="flex-shrink-0 border-t border-slate-100 p-3">
        <div className="flex items-center p-2 rounded-[10px] hover:bg-slate-50 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-[10px] bg-[#2563EB] text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">
            AU
          </div>
          <div className="ml-2.5 flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-800 truncate">Admin User</p>
            <p className="text-[10px] text-slate-400 font-medium truncate">Hiring Admin</p>
          </div>
          <FiLogOut className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
