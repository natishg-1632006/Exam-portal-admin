import React, { useState } from 'react';

const QUESTIONS_PER_PAGE = 10;

const statusConfig = {
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  Review: 'bg-amber-50 text-amber-700 border-amber-100',
  Error: 'bg-rose-50 text-rose-700 border-rose-100',
};
const dotConfig = {
  Active: 'bg-emerald-500',
  Review: 'bg-amber-500',
  Error: 'bg-rose-500',
};

export default function QuestionSetDetail({ set, questions, onBack, onAddQuestion, onEditQuestion, onDeleteQuestion, onArchiveSet, onEditSet, onImportCSV, onChangeStatus }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(questions.length / QUESTIONS_PER_PAGE));
  const paginatedQuestions = questions.slice((page - 1) * QUESTIONS_PER_PAGE, page * QUESTIONS_PER_PAGE);

  // Reset to page 1 if current page becomes invalid
  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [questions.length]);

  return (
    <div className="max-w-[1100px] mx-auto">
      {/* Back link */}
      <button
        onClick={onBack}
        className="flex items-center text-xs font-semibold text-slate-400 hover:text-slate-700 mb-5 transition-colors"
      >
        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Question Bank
      </button>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{set.name}</h2>
          <p className="text-slate-400 mt-2 text-xs leading-relaxed">{set.desc}</p>
          <span className="inline-flex items-center mt-2 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {set.category}
          </span>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => onImportCSV()}
            className="flex items-center px-3.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Import CSV
          </button>
          <button
            onClick={() => onArchiveSet(set.id)}
            className="flex items-center px-3.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
            {set.status === 'Archived' ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={() => onEditSet(set)}
            className="flex items-center px-3.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-semibold text-xs hover:bg-slate-50 transition-colors shadow-sm"
          >
            <svg className="w-3.5 h-3.5 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            Edit Set
          </button>
          <button
            onClick={onAddQuestion}
            className="flex items-center px-4 py-2 bg-[#0B4A99] text-white rounded-lg font-semibold text-xs hover:bg-[#083A78] transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            Add Question
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-slate-200/70 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/20">
              <th className="px-5 py-3 w-[45%]">Question Text</th>
              <th className="px-5 py-3">Marks</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Created Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedQuestions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-xs text-slate-400">
                  No questions yet. Click <strong>+ Add Question</strong> or <strong>Import CSV</strong> to get started.
                </td>
              </tr>
            ) : paginatedQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-5 py-4 text-xs font-semibold text-slate-800 leading-relaxed">{q.text}</td>
                <td className="px-5 py-4 text-xs font-bold text-slate-700">{q.marks}</td>
                <td className="px-5 py-4">
                  {/* Clickable status badge to cycle status */}
                  <div className="relative group/status">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer ${statusConfig[q.status] || statusConfig.Active}`}>
                      <span className={`w-1 h-1 rounded-full mr-1.5 ${dotConfig[q.status] || dotConfig.Active}`}></span>
                      {q.status}
                    </span>
                    {/* Status change dropdown on hover */}
                    <div className="hidden group-hover/status:block absolute left-0 top-6 z-20 bg-white border border-slate-100 rounded-lg shadow-lg py-1 min-w-[90px]">
                      {['Active', 'Review', 'Error'].filter(s => s !== q.status).map(s => (
                        <button
                          key={s}
                          onClick={() => onChangeStatus(q.id, s)}
                          className={`w-full text-left px-3 py-1.5 text-[10px] font-semibold hover:bg-slate-50 flex items-center ${
                            s === 'Active' ? 'text-emerald-700' : s === 'Review' ? 'text-amber-700' : 'text-rose-700'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full mr-2 ${dotConfig[s]}`}></span>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-[11px] text-slate-400 font-medium">{q.date}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end h-5">
                    <div className="group-hover:hidden text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
                    </div>
                    <div className="hidden group-hover:flex items-center space-x-2">
                      <button
                        onClick={() => onEditQuestion(q)}
                        className="text-slate-400 hover:text-[#0B4A99] transition-colors p-1"
                        title="Edit Question"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                      </button>
                      <button
                        onClick={() => onDeleteQuestion(q.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete Question"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/20">
          <span className="text-[10px] text-slate-400 font-medium">
            Showing {paginatedQuestions.length} of {questions.length} questions
          </span>
          {totalPages > 1 && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold text-xs transition-colors ${
                    p === page
                      ? 'bg-[#0B4A99] text-white shadow-sm'
                      : 'border border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M9 5l7 7-7 7"></path></svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
