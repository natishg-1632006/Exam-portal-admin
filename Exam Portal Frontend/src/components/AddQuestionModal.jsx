import React, { useState, useEffect } from 'react';

export default function AddQuestionModal({ isOpen, onClose, onSave, initialData }) {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [marks, setMarks] = useState(5);
  const [randomize, setRandomize] = useState(true);
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setText(initialData.text || '');
        setOptions(initialData.options && initialData.options.length >= 2 ? initialData.options : ['', '']);
        setCorrectAnswer(initialData.correctAnswer || '');
        setMarks(initialData.marks || 5);
        setRandomize(initialData.randomize !== undefined ? initialData.randomize : true);
        setStatus(initialData.status || 'Active');
      } else {
        setText('');
        setOptions(['', '']);
        setCorrectAnswer('');
        setMarks(5);
        setRandomize(true);
        setStatus('Active');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  const handleAddOption = () => {
    if (options.length < 8) {
      setOptions(prev => [...prev, '']);
    }
  };

  const handleRemoveOption = (idx) => {
    if (options.length <= 2) return;
    const newOpts = options.filter((_, i) => i !== idx);
    setOptions(newOpts);
    // If removed option was correct answer, reset correct answer
    const removedLabel = `Option ${optionLabels[idx]}`;
    if (correctAnswer === removedLabel) setCorrectAnswer('');
  };

  const handleOptionChange = (idx, val) => {
    setOptions(prev => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) { alert('Please enter the question content.'); return; }
    if (options.some(opt => !opt.trim())) { alert('Please fill in all answer option fields.'); return; }
    if (!correctAnswer) { alert('Please select the correct answer.'); return; }
    onSave({ text, options, correctAnswer, marks, randomize, status });
  };

  const statusConfig = {
    Active: 'bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-300',
    Review: 'bg-amber-50 text-amber-700 border-amber-100 ring-amber-300',
    Error: 'bg-rose-50 text-rose-700 border-rose-100 ring-rose-300',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/20 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose}></div>
      <form onSubmit={handleSubmit} className="relative w-full max-w-[420px] h-full bg-white shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm font-bold text-slate-800">{initialData ? 'Edit Question' : 'Add New Question'}</h2>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">
              {initialData ? 'Update question details' : 'Create a multiple-choice question'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Question Text */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Question Content</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the question text here..."
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0B4A99] focus:border-[#0B4A99] resize-none transition-all"
            />
          </div>

          {/* Dynamic Answer Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Answer Options <span className="text-slate-300 font-normal normal-case">({options.length}/8)</span>
              </label>
              {options.length < 8 && (
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-[10px] font-semibold text-[#0B4A99] hover:underline flex items-center"
                >
                  <svg className="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
                  Add Option
                </button>
              )}
            </div>
            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="relative flex items-center group/opt">
                  <div className="absolute left-2.5 flex items-center justify-center w-5 h-5 rounded bg-slate-50 text-[10px] font-bold text-slate-400 border border-slate-100 flex-shrink-0">
                    {optionLabels[idx]}
                  </div>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${optionLabels[idx]} text`}
                    className="w-full border border-slate-200 rounded-lg pl-10 pr-8 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0B4A99] focus:border-[#0B4A99] transition-all"
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="absolute right-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover/opt:opacity-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[9px] text-slate-400 mt-1.5">Minimum 2 options, maximum 8. Hover an option to remove it.</p>
          </div>

          {/* Correct Answer + Marks + Status row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Correct Answer</label>
              <div className="relative">
                <select
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs appearance-none focus:outline-none focus:ring-1.5 focus:ring-[#0B4A99] focus:border-[#0B4A99] bg-white transition-all"
                >
                  <option value="">Select Answer</option>
                  {options.map((opt, idx) => (
                    <option key={idx} value={`Option ${optionLabels[idx]}`} disabled={!opt.trim()}>
                      Option {optionLabels[idx]}{opt.trim() ? ` - ${opt.slice(0, 20)}${opt.length > 20 ? '…' : ''}` : ' (empty)'}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Marks</label>
              <input
                type="number"
                min={1}
                value={marks}
                onChange={(e) => setMarks(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1.5 focus:ring-[#0B4A99] focus:border-[#0B4A99] transition-all"
              />
            </div>
          </div>

          {/* Status Selector */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Question Status</label>
            <div className="flex space-x-2">
              {['Active', 'Review', 'Error'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className={`flex-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
                    status === s
                      ? `${statusConfig[s]} ring-1`
                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Randomize Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-xl border border-slate-150">
            <div>
              <h4 className="text-[11px] font-semibold text-slate-700">Randomize Options</h4>
              <p className="text-[9px] text-slate-400 font-medium mt-0.5">Shuffle options for each candidate</p>
            </div>
            <button
              type="button"
              onClick={() => setRandomize(!randomize)}
              className={`w-9 h-5 rounded-full relative flex items-center px-0.5 transition-colors duration-200 ${randomize ? 'bg-[#0B4A99]' : 'bg-slate-300'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform duration-200 ${randomize ? 'translate-x-4' : 'translate-x-0'}`}></div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 flex space-x-3 bg-white">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button type="submit" className="flex-1 px-4 py-2 bg-[#0B4A99] text-white rounded-lg font-semibold text-xs hover:bg-[#083A78] transition-colors">
            {initialData ? 'Save Changes' : 'Save Question'}
          </button>
        </div>
      </form>
    </div>
  );
}
