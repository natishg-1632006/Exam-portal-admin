import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiPlus, FiChevronDown, FiChevronUp, FiMove } from 'react-icons/fi';
import { Badge, ConfirmDialog, EmptyState, IconBtn } from './Shared';
import CreateQuestionModal from './CreateQuestionModal';
import { useToast } from './Toast';

/* ─── Individual Question Card ──────────────────────────────────── */
function QuestionCard({ question, onEdit, onDelete }) {
  const diffColor = { Easy: 'emerald', Medium: 'amber', Hard: 'red' }[question.difficulty] || 'slate';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-white rounded-[14px] border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Question Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between mb-2.5">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <Badge status={question.type} />
            <Badge status={question.difficulty} />
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
            <IconBtn icon={<FiEdit2 className="w-3.5 h-3.5" />} onClick={() => onEdit(question)} tooltip="Edit" variant="primary" />
            <IconBtn icon={<FiTrash2 className="w-3.5 h-3.5" />} onClick={() => onDelete(question.questionId)} tooltip="Delete" variant="danger" />
          </div>
        </div>
        <p className="text-sm font-medium text-slate-800 leading-relaxed">{question.question}</p>
      </div>

      {/* Options — MCQ */}
      {question.type === 'MCQ' && question.options?.length > 0 && (
        <div className="px-4 pb-3 space-y-1.5">
          {question.options.map((opt, i) => {
            const isCorrect = opt.optionId === question.correctOptionId;
            return (
              <div
                key={opt.optionId}
                className={`flex items-center px-3 py-2 rounded-[10px] border text-xs transition-all ${isCorrect ? 'border-green-300 bg-green-50' : 'border-slate-100 bg-slate-50/50'}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-2.5 flex-shrink-0 ${isCorrect ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}>
                  {isCorrect && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className={`font-bold mr-2 ${isCorrect ? 'text-green-600' : 'text-slate-400'}`}>{String.fromCharCode(65 + i)}.</span>
                <span className={`flex-1 ${isCorrect ? 'text-green-700 font-semibold' : 'text-slate-600'}`}>{opt.text}</span>
                {isCorrect && (
                  <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded-full">Correct</span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Marks */}
      <div className="px-4 pb-3 pt-1 flex items-center space-x-4 border-t border-slate-100 mt-1">
        <span className="text-[11px] font-semibold text-green-600">+{question.marks} marks</span>
        {question.negativeMarks > 0 && (
          <span className="text-[11px] font-semibold text-red-500">-{question.negativeMarks} negative</span>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Section Accordion ─────────────────────────────────────────── */
function SectionAccordion({ section, onEditSection, onDeleteSection, onAddQuestion, onEditQuestion, onDeleteQuestion }) {
  const [expanded, setExpanded] = useState(true);
  const [qModalOpen, setQModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);
  const [deleteQId, setDeleteQId] = useState(null);
  const toast = useToast();

  const activeQuestions = (section.questions || []).filter(q => !q.isDeleted);

  const handleDeleteQuestion = () => {
    onDeleteQuestion(section.sectionId, deleteQId);
    setDeleteQId(null);
    toast({ type: 'success', title: 'Question Deleted', message: 'The question has been soft-deleted.' });
  };

  const handleSaveQuestion = (data) => {
    if (editQuestion) {
      onEditQuestion(section.sectionId, editQuestion.questionId, data);
      toast({ type: 'success', title: 'Question Updated', message: 'Question saved successfully.' });
    } else {
      onAddQuestion(section.sectionId, data);
      toast({ type: 'success', title: 'Question Added', message: 'New question added to section.' });
    }
    setEditQuestion(null);
    setQModalOpen(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[14px] border border-slate-200/80 shadow-sm overflow-hidden"
      >
        {/* Section Header */}
        <div
          className="flex items-center px-5 py-4 cursor-pointer hover:bg-slate-50/60 transition-colors select-none"
          onClick={() => setExpanded(e => !e)}
        >
          <div className="w-8 h-8 rounded-xl bg-[#2563EB]/10 text-[#2563EB] font-bold text-sm flex items-center justify-center flex-shrink-0 mr-3.5">
            {section.displayOrder}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-bold text-slate-800 truncate">{section.title}</h4>
              <Badge status="Active" size="xs" />
            </div>
            <div className="flex items-center space-x-3 mt-0.5 text-[11px] text-slate-400 font-medium">
              <span>{activeQuestions.length} questions</span>
              <span>•</span>
              <span>{section.totalMarks} marks</span>
              <span>•</span>
              <span className="text-amber-600 font-semibold flex items-center"><span className="mr-0.5">⏱</span>{section.durationMinutes || 30} min limit</span>
              {section.questionSetId && <><span>•</span><span className="text-slate-500 font-medium bg-slate-100 px-1.5 py-0.2 rounded">Set: {section.questionSetId}</span></>}
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-3" onClick={e => e.stopPropagation()}>
            <IconBtn icon={<FiPlus className="w-3.5 h-3.5" />} onClick={() => { setEditQuestion(null); setQModalOpen(true); }} tooltip="Add Question" variant="primary" />
            <IconBtn icon={<FiEdit2 className="w-3.5 h-3.5" />} onClick={() => onEditSection(section)} tooltip="Edit Section" variant="ghost" />
            <IconBtn icon={<FiTrash2 className="w-3.5 h-3.5" />} onClick={() => onDeleteSection(section.sectionId)} tooltip="Delete Section" variant="danger" />
          </div>
          <div className="ml-2 text-slate-400">
            {expanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {/* Section Content */}
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                {activeQuestions.length === 0 ? (
                  <EmptyState
                    icon={<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    title="No questions yet"
                    description="Add questions to this section to build the exam."
                    action={
                      <button onClick={() => { setEditQuestion(null); setQModalOpen(true); }} className="flex items-center px-4 py-2 bg-[#2563EB] text-white rounded-[10px] font-semibold text-xs hover:bg-blue-700 transition-colors">
                        <FiPlus className="w-3.5 h-3.5 mr-1.5" /> Add Question
                      </button>
                    }
                  />
                ) : (
                  <div className="space-y-3 mt-3">
                    {activeQuestions.map(q => (
                      <QuestionCard
                        key={q.questionId}
                        question={q}
                        onEdit={(q) => { setEditQuestion(q); setQModalOpen(true); }}
                        onDelete={(qid) => setDeleteQId(qid)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <CreateQuestionModal
        isOpen={qModalOpen}
        onClose={() => { setQModalOpen(false); setEditQuestion(null); }}
        onSave={handleSaveQuestion}
        initial={editQuestion}
        sectionTitle={section.title}
      />
      <ConfirmDialog
        isOpen={!!deleteQId}
        title="Delete Question?"
        description="This question will be soft-deleted and can be restored later."
        onConfirm={handleDeleteQuestion}
        onCancel={() => setDeleteQId(null)}
      />
    </>
  );
}

export default SectionAccordion;
