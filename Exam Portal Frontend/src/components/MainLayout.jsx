import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopNav />
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
