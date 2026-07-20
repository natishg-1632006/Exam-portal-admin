import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from './components/DashboardOverview';
import QuestionSetDetail from './components/QuestionSetDetail';
import CreateSetModal from './components/CreateSetModal';
import AddQuestionModal from './components/AddQuestionModal';
import ImportCSVModal from './components/ImportCSVModal';

const INITIAL_SETS = [
  { id: 1, name: 'Java Basics', updated: 'Last updated 2 days ago', desc: 'Foundational Java concepts including syntax, memory management, and OOP principles.', questionsCount: 4, status: 'Active', category: 'Backend' },
  { id: 2, name: 'React Advanced', updated: 'Last updated 1 week ago', desc: 'Hooks, Context API, suspense, custom rendering, and architectural patterns.', questionsCount: 0, status: 'Active', category: 'Frontend' },
  { id: 3, name: 'Python Data Structures', updated: 'Last updated 5 hours ago', desc: 'Comprehensive lists, dictionaries, trees, graphs, and time complexity analysis.', questionsCount: 0, status: 'Draft', category: 'Data Science' }
];

const INITIAL_QUESTIONS = [
  { id: 1, setId: 1, text: 'What is the difference between JRE, JDK, and JVM?', marks: 5, status: 'Active', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', dotColor: 'bg-emerald-500', date: 'Oct 24, 2023', options: ['JRE is JVM + libraries', 'JDK is compiler + JRE', 'JVM executes bytecode', 'All of the above'], correctAnswer: 'Option D', randomize: true },
  { id: 2, setId: 1, text: 'Explain the concept of inheritance in Java and how it differs from interfaces.', marks: 10, status: 'Review', statusColor: 'bg-amber-50 text-amber-700 border-amber-100', dotColor: 'bg-amber-500', date: 'Oct 26, 2023', options: ['Inheritance permits code reuse', 'Interfaces define a contract', 'Java supports single inheritance', 'All of the above'], correctAnswer: 'Option D', randomize: true },
  { id: 3, setId: 1, text: 'What are the primitive data types in Java and their memory footprints?', marks: 2, status: 'Active', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', dotColor: 'bg-emerald-500', date: 'Nov 02, 2023', options: ['int is 4 bytes', 'double is 8 bytes', 'boolean is 1 bit', 'All of the above'], correctAnswer: 'Option D', randomize: true },
  { id: 4, setId: 1, text: 'How do you declare a constant in Java using modifiers?', marks: 3, status: 'Error', statusColor: 'bg-rose-50 text-rose-700 border-rose-100', dotColor: 'bg-rose-500', date: 'Nov 05, 2023', options: ['Using const keyword', 'Using static final keywords', 'Using constant keyword', 'Using final only'], correctAnswer: 'Option B', randomize: false },
];

const STATUS_META = {
  Active: { statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-100', dotColor: 'bg-emerald-500' },
  Review: { statusColor: 'bg-amber-50 text-amber-700 border-amber-100', dotColor: 'bg-amber-500' },
  Error: { statusColor: 'bg-rose-50 text-rose-700 border-rose-100', dotColor: 'bg-rose-500' },
};

export default function QuestionBankApp() {
  const [currentSetId, setCurrentSetId] = useState(null);
  const [isCreateSetOpen, setIsCreateSetOpen] = useState(false);
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [isImportCSVOpen, setIsImportCSVOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingSet, setEditingSet] = useState(null);

  const [sets, setSets] = useState(() => {
    try { const s = localStorage.getItem('questionSets'); return s ? JSON.parse(s) : INITIAL_SETS; } catch { return INITIAL_SETS; }
  });

  const [questions, setQuestions] = useState(() => {
    try { const q = localStorage.getItem('questions'); return q ? JSON.parse(q) : INITIAL_QUESTIONS; } catch { return INITIAL_QUESTIONS; }
  });

  useEffect(() => { localStorage.setItem('questionSets', JSON.stringify(sets)); }, [sets]);
  useEffect(() => { localStorage.setItem('questions', JSON.stringify(questions)); }, [questions]);

  const handleCreateSetClick = () => { setEditingSet(null); setIsCreateSetOpen(true); };
  const handleEditSetClick = (set) => { setEditingSet(set); setIsCreateSetOpen(true); };

  const handleSaveSet = (setData) => {
    if (editingSet) {
      setSets(prev => prev.map(s => s.id === editingSet.id ? { ...s, ...setData, updated: 'Updated just now' } : s));
    } else {
      const newSet = { id: Date.now(), questionsCount: 0, status: 'Draft', updated: 'Created just now', ...setData };
      setSets(prev => [newSet, ...prev]);
    }
    setIsCreateSetOpen(false);
    setEditingSet(null);
  };

  const handleDeleteSet = (id) => {
    if (!confirm('Delete this set and all its questions?')) return;
    setSets(prev => prev.filter(s => s.id !== id));
    setQuestions(prev => prev.filter(q => q.setId !== id));
    if (currentSetId === id) setCurrentSetId(null);
  };

  const handleToggleArchiveSet = (id) => {
    setSets(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Archived' ? 'Active' : 'Archived' } : s));
  };

  const handleAddQuestionClick = () => { setEditingQuestion(null); setIsAddQuestionOpen(true); };
  const handleEditQuestionClick = (q) => { setEditingQuestion(q); setIsAddQuestionOpen(true); };

  const handleDeleteQuestion = (id) => {
    if (!confirm('Delete this question?')) return;
    setQuestions(prev => prev.filter(q => q.id !== id));
    setSets(prev => prev.map(s => s.id === currentSetId ? { ...s, questionsCount: Math.max(0, s.questionsCount - 1) } : s));
  };

  const handleSaveQuestion = (data) => {
    const meta = STATUS_META[data.status] || STATUS_META.Active;
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? { ...q, text: data.text, marks: data.marks, options: data.options, correctAnswer: data.correctAnswer, randomize: data.randomize, status: data.status, ...meta } : q));
    } else {
      const newQ = { id: Date.now(), setId: currentSetId, text: data.text, marks: data.marks, options: data.options, correctAnswer: data.correctAnswer, randomize: data.randomize, status: data.status, ...meta, date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) };
      setQuestions(prev => [...prev, newQ]);
      setSets(prev => prev.map(s => s.id === currentSetId ? { ...s, questionsCount: s.questionsCount + 1 } : s));
    }
    setIsAddQuestionOpen(false);
    setEditingQuestion(null);
  };

  const handleChangeQuestionStatus = (questionId, newStatus) => {
    const meta = STATUS_META[newStatus] || STATUS_META.Active;
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, status: newStatus, ...meta } : q));
  };

  const handleImportCSV = (importedQuestions) => {
    const meta = STATUS_META.Active;
    const newQuestions = importedQuestions.map((q) => ({ id: Date.now() + Math.random(), setId: currentSetId, text: q.text, marks: q.marks, options: q.options, correctAnswer: q.correctAnswer, randomize: q.randomize, status: q.status || 'Active', ...(STATUS_META[q.status] || meta), date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) }));
    setQuestions(prev => [...prev, ...newQuestions]);
    setSets(prev => prev.map(s => s.id === currentSetId ? { ...s, questionsCount: s.questionsCount + newQuestions.length } : s));
    setIsImportCSVOpen(false);
  };

  const activeSet = sets.find(s => s.id === currentSetId);
  const activeQuestions = questions.filter(q => q.setId === currentSetId);

  return (
    <>
      {currentSetId === null ? (
        <DashboardOverview
          sets={sets}
          onNavigateToSet={(set) => setCurrentSetId(set.id)}
          onCreateSet={handleCreateSetClick}
          onEditSet={handleEditSetClick}
          onDeleteSet={handleDeleteSet}
          onToggleArchiveSet={handleToggleArchiveSet}
        />
      ) : (
        <QuestionSetDetail
          set={activeSet}
          questions={activeQuestions}
          onBack={() => setCurrentSetId(null)}
          onAddQuestion={handleAddQuestionClick}
          onEditQuestion={handleEditQuestionClick}
          onDeleteQuestion={handleDeleteQuestion}
          onArchiveSet={handleToggleArchiveSet}
          onEditSet={handleEditSetClick}
          onImportCSV={() => setIsImportCSVOpen(true)}
          onChangeStatus={handleChangeQuestionStatus}
        />
      )}

      <CreateSetModal isOpen={isCreateSetOpen} onClose={() => { setIsCreateSetOpen(false); setEditingSet(null); }} onSave={handleSaveSet} initialData={editingSet} />
      <AddQuestionModal isOpen={isAddQuestionOpen} onClose={() => { setIsAddQuestionOpen(false); setEditingQuestion(null); }} onSave={handleSaveQuestion} initialData={editingQuestion} />
      <ImportCSVModal isOpen={isImportCSVOpen} onClose={() => setIsImportCSVOpen(false)} onImport={handleImportCSV} />
    </>
  );
}
