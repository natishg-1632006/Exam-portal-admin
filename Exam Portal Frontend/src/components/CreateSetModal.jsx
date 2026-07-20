import React, { useState, useEffect } from 'react';

export default function CreateSetModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Data Science');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name || '');
        setDesc(initialData.desc || '');
        setCategory(initialData.category || 'Data Science');
      } else {
        setName('');
        setDesc('');
        setCategory('Data Science');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a set name.');
      return;
    }
    if (!desc.trim()) {
      alert('Please enter a description.');
      return;
    }
    onSave({
      name,
      desc,
      category
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/20 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click closer */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Drawer Panel */}
      <form onSubmit={handleSubmit} className="relative w-full max-w-[380px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800">
            {initialData ? 'Edit Question Set' : 'Create Question Set'}
          </h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Set Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Advanced TypeScript Patterns" 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0B4A99] focus:border-[#0B4A99] transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Description</label>
              <textarea 
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder="Briefly describe the purpose of this set..." 
                rows={3} 
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0B4A99] focus:border-[#0B4A99] resize-none transition-all"
              ></textarea>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</label>
              <div className="relative">
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs appearance-none focus:outline-none focus:ring-1.5 focus:ring-[#0B4A99] focus:border-[#0B4A99] bg-white transition-all"
                >
                  <option value="Data Science">Data Science</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            
            {/* Import Dropzone */}
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-slate-100 flex items-center justify-center mb-2.5 text-[#0B4A99] group-hover:scale-105 transition-transform">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
              </div>
              <h4 className="text-[11px] font-semibold text-slate-700">Import from JSON/CSV</h4>
              <p className="text-[9px] text-slate-400 mt-0.5 font-medium">Drag and drop your file here</p>
            </div>
          </div>
        </div>
        
        {/* Footer actions */}
        <div className="p-5 border-t border-slate-100 flex justify-between space-x-3 bg-white">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 px-4 py-2 bg-[#0B4A99] text-white rounded-lg font-semibold text-xs hover:bg-[#083A78] transition-colors">
            {initialData ? 'Save Changes' : 'Create Set'}
          </button>
        </div>
      </form>
    </div>
  );
}
