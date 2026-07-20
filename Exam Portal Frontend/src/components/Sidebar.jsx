import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-60 flex-shrink-0 h-full bg-white border-r border-slate-200/80 flex flex-col justify-between">
      <div>
        <div className="h-16 flex items-center px-6">
          <h1 className="text-[17px] font-bold text-[#0B4A99] tracking-tight">Question Bank</h1>
        </div>
        <nav className="mt-2 px-3">
          <div className="flex items-center px-4 py-2.5 bg-[#F0F4FA] rounded-lg text-[#0B4A99] font-semibold text-sm cursor-pointer">
            <svg className="w-4 h-4 mr-3 text-[#0B4A99]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
            Question Bank
          </div>
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center mb-4 px-2">
          <div className="w-9 h-9 rounded-full bg-[#0B4A99] text-white flex items-center justify-center font-bold text-xs">
            AU
          </div>
          <div className="ml-3">
            <p className="text-xs font-semibold text-slate-800">Admin User</p>
            <p className="text-[10px] text-slate-400 font-medium">Hiring Admin</p>
          </div>
        </div>
        <button className="flex items-center px-2 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 w-full transition-colors">
          <svg className="w-4 h-4 mr-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </div>
  );
}
