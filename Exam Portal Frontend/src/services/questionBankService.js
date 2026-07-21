import api from '../api/axios';

const formatQuestionPayload = (payload) => {
  const optA = typeof payload.optionA === 'string' ? payload.optionA : (payload.optionA?.text || '');
  const optB = typeof payload.optionB === 'string' ? payload.optionB : (payload.optionB?.text || '');
  const optC = typeof payload.optionC === 'string' ? payload.optionC : (payload.optionC?.text || '');
  const optD = typeof payload.optionD === 'string' ? payload.optionD : (payload.optionD?.text || '');
  const cAns = (payload.correctOptionId || payload.correctAnswer || 'A').toString().replace(/Option\s+/i, '').trim().toUpperCase();

  return {
    questionSetId: payload.questionSetId,
    questionId: payload.questionId,
    question: payload.question || payload.questionText || payload.text || '',
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
    correctAnswer: cAns,
    correctOptionId: cAns,
    marks: Number(payload.marks || 1),
  };
};

/**
 * Service functions for Question Bank Module backend API integration
 */
export const questionBankService = {
  /**
   * API 0: Get All Question Sets
   * GET /question-sets
   */
  async getQuestionSets() {
    const response = await api.get('/question-sets');
    return response.data;
  },

  /**
   * API 1: Create Question Set
   * POST /question-sets
   * @param {string} questionSetId - e.g. "SET001"
   */
  async createQuestionSet(questionSetId) {
    const response = await api.post('/question-sets', { questionSetId });
    return response.data;
  },

  /**
   * API 2: Get Question Set Details & Question List
   * GET /question-sets/{questionSetId}
   * @param {string} questionSetId - e.g. "SET001"
   */
  async getQuestionSet(questionSetId) {
    const response = await api.get(`/question-sets/${encodeURIComponent(questionSetId)}`);
    return response.data;
  },

  /**
   * API 3: Get Single Question
   * GET /questions/{questionSetId}/{questionId}
   * @param {string} questionSetId
   * @param {string} questionId
   */
  async getQuestion(questionSetId, questionId) {
    const response = await api.get(`/questions/${encodeURIComponent(questionSetId)}/${encodeURIComponent(questionId)}`);
    return response.data;
  },

  /**
   * API 4: Create Question
   * POST /questions
   * @param {Object} rawPayload
   */
  async createQuestion(rawPayload) {
    const payload = formatQuestionPayload(rawPayload);
    const response = await api.post('/questions', payload);
    return response.data;
  },

  /**
   * API 5: Update Question
   * PUT /questions/{questionSetId}/{questionId}
   * @param {string} questionSetId
   * @param {string} questionId
   * @param {Object} rawPayload
   */
  async updateQuestion(questionSetId, questionId, rawPayload) {
    const payload = formatQuestionPayload(rawPayload);
    const response = await api.put(`/questions/${encodeURIComponent(questionSetId)}/${encodeURIComponent(questionId)}`, payload);
    return response.data;
  },

  /**
   * API 6: Delete Question
   * DELETE /questions/{questionSetId}/{questionId}
   * @param {string} questionSetId
   * @param {string} questionId
   */
  async deleteQuestion(questionSetId, questionId) {
    const response = await api.delete(`/questions/${encodeURIComponent(questionSetId)}/${encodeURIComponent(questionId)}`);
    return response.data;
  },
};

export default questionBankService;
