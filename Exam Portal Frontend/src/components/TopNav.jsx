import React from 'react';

export default function TopNav() {
  return (
    <div className="h-16 flex-shrink-0 border-b border-slate-200/80 bg-white flex items-center justify-between px-8">
      <div className="flex-1 max-w-[420px]">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </span>
          <input type="text" className="w-full bg-[#f4f6f8] rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-1.5 focus:ring-[#0B4A99] focus:bg-white transition-all" placeholder="Search questions or sets..." />
        </div>
      </div>
      
      <div className="flex items-center space-x-5">
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
        </button>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </button>
        <div className="flex items-center border-l border-slate-200 pl-5 h-5">
          <span className="text-xs font-semibold text-slate-700 mr-3">Admin Profile</span>
          <img className="w-7 h-7 rounded-full object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Admin" />
        </div>
      </div>
    </div>
  );
}
