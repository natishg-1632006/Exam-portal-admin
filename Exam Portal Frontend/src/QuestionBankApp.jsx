import React, { useState, useEffect, useCallback } from 'react';
import DashboardOverview from './components/DashboardOverview';
import QuestionSetDetail from './components/QuestionSetDetail';
import CreateSetModal from './components/CreateSetModal';
import AddQuestionModal from './components/AddQuestionModal';
import { ConfirmDialog } from './components/tc/Shared';
import { useToast } from './components/tc/Toast';
import questionBankService from './services/questionBankService';

const getOptText = (opt) => {
  if (!opt) return '';
  if (typeof opt === 'string') return opt;
  if (typeof opt === 'object' && opt.text !== undefined) return String(opt.text);
  return String(opt);
};

const INITIAL_SETS = [
  { id: 'SET001', questionSetId: 'SET001', name: 'Assessment Set: SET001', updated: 'Active set', questionsCount: 5, status: 'Active' },
  { id: 'SET002', questionSetId: 'SET002', name: 'Assessment Set: SET002', updated: 'Active set', questionsCount: 0, status: 'Active' },
];

export default function QuestionBankApp() {
  const toast = useToast();

  const [currentSetId, setCurrentSetId] = useState(null);
  const [activeSetInfo, setActiveSetInfo] = useState(null);
  const [questions, setQuestions] = useState([]);

  const [isCreateSetOpen, setIsCreateSetOpen] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingSet, setEditingSet] = useState(null);
  const [deleteConfirmQuestion, setDeleteConfirmQuestion] = useState(null);

  const [loadingSets, setLoadingSets] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load question sets from localStorage or fallback
  const [sets, setSets] = useState(() => {
    try {
      const s = localStorage.getItem('questionSets_api');
      return s ? JSON.parse(s) : INITIAL_SETS;
    } catch {
      return INITIAL_SETS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('questionSets_api', JSON.stringify(sets));
    } catch (e) {
      console.error(e);
    }
  }, [sets]);

  // Sync initial question count for SET001 & SET002 from backend API on mount
  useEffect(() => {
    setLoadingSets(true);
    Promise.all([
      questionBankService.getQuestionSet('SET001').catch(() => null),
      questionBankService.getQuestionSet('SET002').catch(() => null),
    ])
      .then(([res1, res2]) => {
        const q1Count = res1 ? (res1.questions || res1.data?.questions || []).filter(q => q.itemType !== 'QUESTION_SET_HEADER').length : 5;
        const q2Count = res2 ? (res2.questions || res2.data?.questions || []).filter(q => q.itemType !== 'QUESTION_SET_HEADER').length : 1;

        setSets(prev =>
          prev.map(s => {
            const sid = s.questionSetId || s.id;
            if (sid === 'SET001') return { ...s, questionsCount: q1Count };
            if (sid === 'SET002') return { ...s, questionsCount: q2Count };
            return s;
          })
        );
      })
      .finally(() => {
        setLoadingSets(false);
      });
  }, []);

  // API 2: Get Question Set Details & Questions List
  const fetchSetDetails = useCallback(async (setId) => {
    if (!setId) return;
    setLoadingQuestions(true);
    try {
      const response = await questionBankService.getQuestionSet(setId);
      
      const dataObj = response.data || response;
      const rawQuestions =
        response.questions ||
        dataObj.questions ||
        response.items ||
        dataObj.items ||
        (Array.isArray(response) ? response : Array.isArray(dataObj) ? dataObj : []);

      const normalizedQuestions = rawQuestions
        .filter(q => q.itemType !== 'QUESTION_SET_HEADER' && (q.questionId || q.id || q.question))
        .map((q) => {
          const optA = q.optionA ? getOptText(q.optionA) : (q.options && q.options[0] ? getOptText(q.options[0]) : '');
          const optB = q.optionB ? getOptText(q.optionB) : (q.options && q.options[1] ? getOptText(q.options[1]) : '');
          const optC = q.optionC ? getOptText(q.optionC) : (q.options && q.options[2] ? getOptText(q.options[2]) : '');
          const optD = q.optionD ? getOptText(q.optionD) : (q.options && q.options[3] ? getOptText(q.options[3]) : '');
          const correct = (q.correctOptionId || q.correctAnswer || 'A').toString().replace(/Option\s+/i, '').trim();

          return {
            questionSetId: q.questionSetId || setId,
            questionId: q.questionId || q.id || `Q-${Date.now()}`,
            id: q.questionId || q.id,
            question: q.question || q.questionText || q.text || '',
            text: q.question || q.questionText || q.text || '',
            optionA: optA,
            optionB: optB,
            optionC: optC,
            optionD: optD,
            options: [
              { optionId: 'A', text: optA },
              { optionId: 'B', text: optB },
              { optionId: 'C', text: optC },
              { optionId: 'D', text: optD },
            ],
            correctAnswer: correct,
            correctOptionId: correct,
            marks: q.marks !== undefined ? Number(q.marks) : 1,
          };
        });

      setQuestions(normalizedQuestions);

      // Update total questions count in sets list
      setSets(prev =>
        prev.map(s => (s.questionSetId === setId || s.id === setId ? { ...s, questionsCount: normalizedQuestions.length } : s))
      );
    } catch (err) {
      console.error('Failed to fetch question set details:', err);
      if (err.message && err.message.includes('404')) {
        setQuestions([]);
      } else {
        toast && toast({ type: 'error', title: 'Error Loading Set', message: err.message });
      }
    } finally {
      setLoadingQuestions(false);
    }
  }, [toast]);

  // Handle set navigation
  const handleNavigateToSet = (setObj) => {
    const setId = setObj.questionSetId || setObj.id;
    setCurrentSetId(setId);
    setActiveSetInfo(setObj);
    fetchSetDetails(setId);
  };

  // API 1: Create Question Set
  const handleSaveQuestionSet = async (newQuestionSetId) => {
    setSubmitting(true);
    try {
      const res = await questionBankService.createQuestionSet(newQuestionSetId);
      const createdId = res?.data?.questionSetId || newQuestionSetId;

      const newSetItem = {
        id: createdId,
        questionSetId: createdId,
        name: res?.data?.title || `Assessment Set: ${createdId}`,
        updated: 'Created just now',
        questionsCount: 0,
        status: 'Active',
      };

      setSets(prev => {
        const exists = prev.some(s => s.questionSetId === createdId || s.id === createdId);
        return exists ? prev.map(s => (s.questionSetId === createdId ? newSetItem : s)) : [newSetItem, ...prev];
      });

      setIsCreateSetOpen(false);
      setEditingSet(null);
      toast && toast({ type: 'success', title: 'Question Set Created', message: res.message || `Question Set '${createdId}' created successfully!` });
    } catch (err) {
      toast && toast({ type: 'error', title: 'Failed to Create Set', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // API 4 & 5: Create or Update Question
  const handleSaveQuestion = async (formData) => {
    setSubmitting(true);
    try {
      const targetSetId = formData.questionSetId || currentSetId;
      const targetQId = formData.questionId;

      if (editingQuestion) {
        // API 5: Update Question
        await questionBankService.updateQuestion(targetSetId, targetQId, formData);
        toast && toast({ type: 'success', title: 'Question Updated', message: `Question ${targetQId} updated successfully!` });
      } else {
        // API 4: Create Question
        await questionBankService.createQuestion(formData);
        toast && toast({ type: 'success', title: 'Question Saved', message: `Question ${targetQId} saved successfully!` });
      }

      setIsAddQuestionOpen(false);
      setEditingQuestion(null);

      // Auto refresh questions list
      if (currentSetId) {
        fetchSetDetails(currentSetId);
      }
    } catch (err) {
      toast && toast({ type: 'error', title: 'Failed to Save Question', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  // API 6: Delete Question
  const handleDeleteQuestionConfirm = async () => {
    if (!deleteConfirmQuestion) return;
    setSubmitting(true);
    try {
      const qSetId = deleteConfirmQuestion.questionSetId || currentSetId;
      const qId = deleteConfirmQuestion.questionId || deleteConfirmQuestion.id;
      await questionBankService.deleteQuestion(qSetId, qId);
      toast && toast({ type: 'success', title: 'Question Deleted', message: `Question ${qId} deleted successfully!` });
      setDeleteConfirmQuestion(null);

      // Auto refresh questions list
      if (currentSetId) {
        fetchSetDetails(currentSetId);
      }
    } catch (err) {
      toast && toast({ type: 'error', title: 'Failed to Delete Question', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleArchiveSet = (setId) => {
    setSets(prev =>
      prev.map(s => (s.questionSetId === setId || s.id === setId ? { ...s, status: s.status === 'Archived' ? 'Active' : 'Archived' } : s))
    );
    toast && toast({ type: 'info', title: 'Set Updated', message: `Question Set '${setId}' status toggled.` });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 text-slate-800">
      {!currentSetId ? (
        <DashboardOverview
          sets={sets}
          loading={loadingSets}
          onNavigateToSet={handleNavigateToSet}
          onCreateSet={() => { setEditingSet(null); setIsCreateSetOpen(true); }}
          onEditSet={(s) => { setEditingSet(s); setIsCreateSetOpen(true); }}
          onDeleteSet={(setId) => setSets(prev => prev.filter(s => s.questionSetId !== setId && s.id !== setId))}
          onToggleArchiveSet={handleToggleArchiveSet}
        />
      ) : (
        <QuestionSetDetail
          set={activeSetInfo || sets.find(s => s.questionSetId === currentSetId || s.id === currentSetId)}
          questions={questions}
          loading={loadingQuestions}
          onBack={() => { setCurrentSetId(null); setActiveSetInfo(null); setQuestions([]); }}
          onAddQuestion={() => { setEditingQuestion(null); setIsAddQuestionOpen(true); }}
          onEditQuestion={(q) => { setEditingQuestion(q); setIsAddQuestionOpen(true); }}
          onDeleteQuestion={(q) => setDeleteConfirmQuestion(q)}
          onArchiveSet={handleToggleArchiveSet}
        />
      )}

      {/* Create / Edit Set Modal */}
      <CreateSetModal
        isOpen={isCreateSetOpen}
        onClose={() => { setIsCreateSetOpen(false); setEditingSet(null); }}
        onSave={handleSaveQuestionSet}
        initialSetId={editingSet?.questionSetId || editingSet?.id}
        loading={submitting}
      />

      {/* Add / Edit Question Modal */}
      <AddQuestionModal
        isOpen={isAddQuestionOpen}
        onClose={() => { setIsAddQuestionOpen(false); setEditingQuestion(null); }}
        onSave={handleSaveQuestion}
        initialData={editingQuestion}
        currentQuestionSetId={currentSetId}
        loading={submitting}
      />

      {/* Delete Question Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteConfirmQuestion}
        title="Delete Question?"
        description={`Are you sure you want to delete question '${deleteConfirmQuestion?.questionId || deleteConfirmQuestion?.id}'?`}
        confirmLabel="Delete Question"
        danger
        onConfirm={handleDeleteQuestionConfirm}
        onCancel={() => setDeleteConfirmQuestion(null)}
      />
    </div>
  );
}
