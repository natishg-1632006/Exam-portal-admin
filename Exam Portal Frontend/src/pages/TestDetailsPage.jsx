import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiArrowLeft, FiEdit2, FiTrash2, FiGlobe, FiPlus,
  FiClock, FiAward, FiLayers, FiCheckCircle, FiEye, FiAlertTriangle,
} from 'react-icons/fi';
import { Badge, StatMini, ConfirmDialog, EmptyState } from '../components/tc/Shared';
import SectionAccordion from '../components/tc/SectionAccordion';
import { CreateTestDrawer, CreateSectionModal } from '../components/tc/Forms';
import { useToast } from '../components/tc/Toast';
import MOCK_TESTS, { getTestById, saveTest } from '../data/testConfig';

/* ─── Complete View Modal ─────────────────────────────────────────── */
function CompleteViewModal({ test, onClose }) {
  if (!test) return null;
  return (
    <div className="fixed inset-0 z-[900] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[88vh] flex flex-col"
      >
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Complete Test View</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Full hierarchy: test → sections → questions → options</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* Test Header */}
          <div className="bg-[#2563EB] text-white rounded-[14px] p-5">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-base">{test.title}</h3>
              <Badge status={test.status} />
            </div>
            <div className="flex items-center space-x-4 mt-3 text-blue-200 text-xs">
              <span>⏱ {test.durationMinutes} min</span>
              <span>• 📚 {(test.sections || []).filter(s => !s.isDeleted).length} sections</span>
            </div>
            {test.description && <p className="text-blue-100 text-xs mt-2 leading-relaxed">{test.description}</p>}
          </div>

          {/* Sections */}
          {(test.sections || []).filter(s => !s.isDeleted).map((sec, si) => (
            <div key={sec.sectionId} className="border border-slate-200 rounded-[14px] overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center space-x-3">
                <div className="w-6 h-6 rounded-lg bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold flex items-center justify-center">{sec.displayOrder}</div>
                <h4 className="font-bold text-slate-700 text-sm">{sec.title}</h4>
                <div className="ml-auto flex items-center space-x-3 text-[11px] font-medium">
                  <span className="text-amber-600 font-semibold">⏱ {sec.durationMinutes || 30} min</span>
                </div>
              </div>
              <div className="p-4 space-y-3">
                {(sec.questions || []).filter(q => !q.isDeleted).map((q, qi) => (
                  <div key={q.questionId} className="bg-white border border-slate-200 rounded-[12px] p-3.5">
                    <div className="flex items-start justify-between mb-2.5">
                      <span className="text-[11px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">Q{qi + 1}</span>
                      <div className="flex items-center space-x-1.5">
                        <Badge status={q.difficulty} size="xs" />
                        <Badge status={q.type} size="xs" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-800 mb-2.5 leading-relaxed">{q.question}</p>
                    {q.type === 'MCQ' && q.options && (
                      <div className="space-y-1.5">
                        {q.options.map((opt, oi) => (
                          <div key={opt.optionId} className={`flex items-center px-3 py-2 rounded-[8px] text-xs border ${opt.optionId === q.correctOptionId ? 'border-green-300 bg-green-50 text-green-700' : 'border-slate-100 text-slate-600'}`}>
                            <span className={`font-bold mr-2 ${opt.optionId === q.correctOptionId ? 'text-green-500' : 'text-slate-300'}`}>{String.fromCharCode(65 + oi)}.</span>
                            {opt.text}
                            {opt.optionId === q.correctOptionId && <span className="ml-auto text-[10px] font-bold text-green-600">✓ Correct</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {(sec.questions || []).filter(q => !q.isDeleted).length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4">No questions in this section</p>
                )}
              </div>
            </div>
          ))}
          {(test.sections || []).filter(s => !s.isDeleted).length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8">No sections added yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────── */
export default function TestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [testData, setTestDataState] = useState(() => {
    const t = getTestById(id);
    return t ? JSON.parse(JSON.stringify(t)) : null;
  });

  const setTestData = (updater) => {
    setTestDataState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (next) saveTest(next);
      return next;
    });
  };

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [deleteSection, setDeleteSection] = useState(null);
  const [deleteTest, setDeleteTest] = useState(false);
  const [completeView, setCompleteView] = useState(false);

  // Tab State: 'ALL' or specific sectionId
  const [activeSectionTab, setActiveSectionTab] = useState('ALL');

  if (!testData) return (
    <div className="text-center py-20 text-slate-400">
      <p className="text-sm font-medium">Test not found.</p>
      <button onClick={() => navigate('/test-configuration')} className="mt-4 px-4 py-2 bg-[#2563EB] text-white rounded-[10px] text-xs font-semibold">Back to Test Configuration</button>
    </div>
  );

  const activeSections = (testData.sections || []).filter(s => !s.isDeleted).sort((a, b) => a.displayOrder - b.displayOrder);
  const totalQuestions = activeSections.reduce((sum, s) => sum + (s.questions || []).filter(q => !q.isDeleted).length, 0);

  // Duration summation & validation
  const existingDurationSum = activeSections.reduce((sum, s) => sum + (s.durationMinutes || 30), 0);
  const isOverDuration = testData.durationMinutes > 0 && existingDurationSum > testData.durationMinutes;
  const excessTime = existingDurationSum - testData.durationMinutes;

  // Filter sections to render based on active tab
  const displayedSections = activeSectionTab === 'ALL'
    ? activeSections
    : activeSections.filter(s => s.sectionId === activeSectionTab);

  /* ── Handlers ─ */
  const handleUpdateTest = (data) => {
    setTestData(prev => ({ ...prev, ...data }));
    toast({ type: 'success', title: 'Test Updated', message: 'Changes saved successfully.' });
  };

  const handlePublish = () => {
    setTestData(prev => ({ ...prev, status: 'Published' }));
    toast({ type: 'success', title: 'Published!', message: `"${testData.title}" is now live.` });
  };

  const handleSaveSection = (data) => {
    if (editSection) {
      setTestData(prev => ({
        ...prev,
        sections: prev.sections.map(s => s.sectionId === editSection.sectionId ? { ...s, ...data } : s),
      }));
      toast({ type: 'success', title: 'Section Updated', message: 'Section saved.' });
    } else {
      const newSec = { sectionId: `SEC-${Date.now()}`, ...data, questionsCount: 0, isDeleted: false, questions: [] };
      setTestData(prev => ({ ...prev, sections: [...(prev.sections || []), newSec] }));
      toast({ type: 'success', title: 'Section Added', message: `"${data.title}" added.` });
    }
    setEditSection(null);
  };

  const handleDeleteSection = () => {
    setTestData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.sectionId === deleteSection ? { ...s, isDeleted: true } : s),
    }));
    toast({ type: 'success', title: 'Section Deleted', message: 'Section soft-deleted.' });
    setDeleteSection(null);
    if (activeSectionTab === deleteSection) setActiveSectionTab('ALL');
  };

  const handleAddQuestion = (sectionId, data) => {
    const newQ = { questionId: `Q-${Date.now()}`, ...data, isDeleted: false };
    setTestData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.sectionId === sectionId ? { ...s, questions: [...(s.questions || []), newQ] } : s),
    }));
  };

  const handleEditQuestion = (sectionId, questionId, data) => {
    setTestData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.sectionId === sectionId
        ? { ...s, questions: s.questions.map(q => q.questionId === questionId ? { ...q, ...data } : q) }
        : s
      ),
    }));
  };

  const handleDeleteQuestion = (sectionId, questionId) => {
    setTestData(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.sectionId === sectionId
        ? { ...s, questions: s.questions.map(q => q.questionId === questionId ? { ...q, isDeleted: true } : q) }
        : s
      ),
    }));
  };

  const handleDeleteTest = () => {
    toast({ type: 'success', title: 'Test Deleted', message: `"${testData.title}" soft-deleted.` });
    navigate('/test-configuration');
  };

  return (
    <div className="max-w-[1050px] mx-auto space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
        <button onClick={() => navigate('/test-configuration')} className="hover:text-[#2563EB] transition-colors">Test Configuration</button>
        <span>›</span>
        <span className="text-slate-600 font-semibold truncate max-w-xs">{testData.title}</span>
      </div>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[14px] border border-slate-200/80 shadow-sm"
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-5">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center space-x-3 mb-1.5">
                <h1 className="text-xl font-bold text-slate-900 truncate">{testData.title}</h1>
                <Badge status={testData.status} />
              </div>
              {testData.description && (
                <p className="text-xs text-slate-500 leading-relaxed mt-1 max-w-2xl">{testData.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button onClick={() => setCompleteView(true)} className="flex items-center px-3 py-2 border border-slate-200 text-slate-600 rounded-[10px] font-semibold text-xs hover:bg-slate-50 transition-colors">
                <FiEye className="w-3.5 h-3.5 mr-1.5" /> Full View
              </button>
              {testData.status !== 'Published' && (
                <button onClick={handlePublish} className="flex items-center px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded-[10px] font-semibold text-xs hover:bg-green-100 transition-colors">
                  <FiGlobe className="w-3.5 h-3.5 mr-1.5" /> Publish
                </button>
              )}
              <button onClick={() => setEditDrawerOpen(true)} className="flex items-center px-3 py-2 border border-slate-200 text-slate-600 rounded-[10px] font-semibold text-xs hover:bg-slate-50 transition-colors">
                <FiEdit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
              </button>
              <button onClick={() => setDeleteTest(true)} className="flex items-center px-3 py-2 border border-red-200 text-red-600 rounded-[10px] font-semibold text-xs hover:bg-red-50 transition-colors">
                <FiTrash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <FiClock className="w-4 h-4" />, label: 'Overall Duration', value: `${testData.durationMinutes} min`, color: 'blue' },
              { icon: <FiLayers className="w-4 h-4" />, label: 'Sections', value: activeSections.length, color: 'slate' },
              { icon: <FiCheckCircle className="w-4 h-4" />, label: 'Questions', value: totalQuestions, color: 'green' },
            ].map(item => (
              <StatMini key={item.label} {...item} />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Duration Overuse Alert Banner */}
      {isOverDuration ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-[14px] flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-3 text-xs text-red-800">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
              <FiAlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">Warning: Section time duration exceeds test duration!</p>
              <p className="text-red-600 mt-0.5">
                Total allocated time for sections is <span className="font-bold">{existingDurationSum} min</span>, which is <span className="font-bold">{excessTime} min more</span> than the overall test limit (<span className="font-bold">{testData.durationMinutes} min</span>).
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditDrawerOpen(true)}
            className="px-3.5 py-2 bg-red-600 text-white rounded-[10px] font-semibold text-xs hover:bg-red-700 transition-colors flex-shrink-0"
          >
            Adjust Test Duration
          </button>
        </div>
      ) : (
        <div className="px-4 py-2.5 bg-blue-50/60 border border-blue-100 rounded-[14px] flex items-center justify-between text-xs text-blue-800">
          <div className="flex items-center space-x-2 font-medium">
            <FiClock className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Time Allocation Budget:</span>
            <span className="font-bold text-slate-800">{existingDurationSum} / {testData.durationMinutes} min</span>
            <span className="text-slate-400">({testData.durationMinutes - existingDurationSum} min remaining)</span>
          </div>
        </div>
      )}

      {/* Sections Section & Tab Switcher */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800">Section Management</h2>
            <p className="text-xs text-slate-400 mt-0.5">Click a section tab to view its questions one at a time</p>
          </div>
          <button
            onClick={() => { setEditSection(null); setSectionModalOpen(true); }}
            className="flex items-center px-3.5 py-2 bg-[#2563EB] text-white rounded-[10px] font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FiPlus className="w-3.5 h-3.5 mr-1.5" /> Integrate Question Set
          </button>
        </div>

        {/* Section Tabs (One section at a time navigation) */}
        {activeSections.length > 0 && (
          <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-[14px] border border-slate-200/80 shadow-xs overflow-x-auto">
            <button
              onClick={() => setActiveSectionTab('ALL')}
              className={`px-3.5 py-2 rounded-[10px] text-xs font-semibold transition-all whitespace-nowrap ${
                activeSectionTab === 'ALL'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              All Sections ({activeSections.length})
            </button>
            {activeSections.map(sec => {
              const isActive = activeSectionTab === sec.sectionId;
              return (
                <button
                  key={sec.sectionId}
                  onClick={() => setActiveSectionTab(sec.sectionId)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-[10px] text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/60'
                  }`}
                >
                  <span>{sec.title}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-white/20 text-white' : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                  }`}>
                    ⏱ {sec.durationMinutes || 30}m
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Section List (Single Section or All Sections view) */}
        <div className="space-y-3">
          {activeSections.length === 0 ? (
            <EmptyState
              icon={<FiLayers className="w-7 h-7" />}
              title="No sections integrated yet"
              description="Integrate Question Sets from Question Bank and configure time limits for each set."
              action={
                <button onClick={() => setSectionModalOpen(true)} className="flex items-center px-4 py-2 bg-[#2563EB] text-white rounded-[10px] font-semibold text-xs hover:bg-blue-700">
                  <FiPlus className="w-3.5 h-3.5 mr-1.5" /> Integrate Question Set
                </button>
              }
            />
          ) : (
            displayedSections.map(section => (
              <SectionAccordion
                key={section.sectionId}
                section={section}
                onEditSection={s => { setEditSection(s); setSectionModalOpen(true); }}
                onDeleteSection={id => setDeleteSection(id)}
                onAddQuestion={handleAddQuestion}
                onEditQuestion={handleEditQuestion}
                onDeleteQuestion={handleDeleteQuestion}
              />
            ))
          )}
        </div>
      </div>

      {/* ── Modals & Drawers ── */}
      <CreateTestDrawer isOpen={editDrawerOpen} onClose={() => setEditDrawerOpen(false)} onSave={handleUpdateTest} initial={testData} />
      <CreateSectionModal
        isOpen={sectionModalOpen}
        onClose={() => { setSectionModalOpen(false); setEditSection(null); }}
        onSave={handleSaveSection}
        initial={editSection}
        testDuration={testData.durationMinutes}
        existingDurationSum={existingDurationSum}
        onRedirectToUpdateTest={() => setEditDrawerOpen(true)}
      />
      <ConfirmDialog isOpen={!!deleteSection} title="Delete Section?" description="All questions in this section will also be soft-deleted." onConfirm={handleDeleteSection} onCancel={() => setDeleteSection(null)} />
      <ConfirmDialog isOpen={deleteTest} title="Delete Test?" description={`"${testData.title}" will be soft-deleted.`} onConfirm={handleDeleteTest} onCancel={() => setDeleteTest(false)} />
      {completeView && <CompleteViewModal test={testData} onClose={() => setCompleteView(false)} />}
    </div>
  );
}
