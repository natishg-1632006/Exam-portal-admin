import React, { useState } from 'react';

const QUESTIONS_PER_PAGE = 10;

export default function QuestionSetDetail({ set, questions, onBack, onAddQuestion, onEditQuestion, onDeleteQuestion, onArchiveSet, onEditSet }) {
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
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
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
            className="flex items-center px-4 py-2 bg-[#0B4A99] text-[#ffffff] rounded-lg font-semibold text-xs hover:bg-[#083A78] transition-colors shadow-sm"
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
              <th className="px-5 py-3 w-[65%]">Question Text</th>
              <th className="px-5 py-3">Created Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedQuestions.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-5 py-10 text-center text-xs text-slate-400">
                  No questions yet. Click <strong>+ Add Question</strong> to get started.
                </td>
              </tr>
            ) : paginatedQuestions.map((q) => (
              <tr key={q.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-5 py-4 text-xs font-semibold text-slate-800 leading-relaxed">{q.text}</td>
                <td className="px-5 py-4 text-xs text-slate-400 font-medium">{q.date || 'Oct 24, 2023'}</td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/20 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({questions.length} total questions)
            </span>
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors text-[11px]"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-6 h-6 rounded text-[11px] font-semibold transition-colors ${page === p ? 'bg-[#0B4A99] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-2.5 py-1 border border-slate-200 rounded text-slate-600 font-semibold disabled:opacity-40 hover:bg-slate-50 transition-colors text-[11px]"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
