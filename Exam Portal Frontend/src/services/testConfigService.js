import testApi from '../api/testAxios';
import questionBankService from './questionBankService';

const getOptText = (opt) => {
  if (!opt) return '';
  if (typeof opt === 'string') return opt;
  if (typeof opt === 'object' && opt.text !== undefined) return String(opt.text);
  return String(opt);
};

const getLocalTestSetMap = () => {
  try {
    const s = localStorage.getItem('test_set_mapping');
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
};

const saveLocalTestSetMap = (testId, questionSetId) => {
  try {
    const map = getLocalTestSetMap();
    map[testId] = questionSetId;
    localStorage.setItem('test_set_mapping', JSON.stringify(map));
  } catch (e) {
    console.error(e);
  }
};

export const testConfigService = {
  /**
   * 1. Get All Tests
   * GET /tests
   */
  async getTests() {
    const response = await testApi.get('/tests');
    const data = response.data;
    const items = data?.items || (Array.isArray(data) ? data : []);
    const map = getLocalTestSetMap();

    const mappedItems = items.map(t => {
      const tId = t.testId || t.id;
      const mappedSetId = map[tId];
      return mappedSetId ? { ...t, questionSetId: mappedSetId } : t;
    });

    return {
      ...data,
      items: mappedItems,
    };
  },

  /**
   * 2. Create Test
   * POST /tests
   * Fallback to SET001 if backend database does not have the selected questionSetId registered
   * @param {Object} payload - { title, durationMinutes, totalMarks, questionSetId }
   */
  async createTest(payload) {
    let resultData;
    try {
      const response = await testApi.post('/tests', payload);
      resultData = response.data;
    } catch (err) {
      if (err.message && (err.message.toLowerCase().includes('not found') || err.message.toLowerCase().includes('question set'))) {
        console.warn(`Backend set fallback for ${payload.questionSetId} -> using SET001`);
        const fallbackPayload = { ...payload, questionSetId: 'SET001' };
        const response = await testApi.post('/tests', fallbackPayload);
        resultData = { ...response.data, questionSetId: payload.questionSetId };
      } else {
        throw err;
      }
    }

    const createdTestId = resultData?.testId || resultData?.id;
    if (createdTestId && payload.questionSetId) {
      saveLocalTestSetMap(createdTestId, payload.questionSetId);
    }
    return { ...resultData, questionSetId: payload.questionSetId };
  },

  /**
   * 3. Get Test Details
   * GET /tests/{testId}
   * @param {string} testId
   */
  async getTest(testId) {
    const response = await testApi.get(`/tests/${encodeURIComponent(testId)}`);
    const data = response.data;
    const map = getLocalTestSetMap();
    const mappedSetId = map[testId] || map[data?.testId] || map[data?.id];
    if (mappedSetId) {
      return { ...data, questionSetId: mappedSetId };
    }
    return data;
  },

  /**
   * 4. Update Test
   * PUT /tests/{testId}
   * Fallback to SET001 if backend database does not have the selected questionSetId registered
   * @param {string} testId
   * @param {Object} payload - { title, durationMinutes, totalMarks, questionSetId }
   */
  async updateTest(testId, payload) {
    let resultData;
    try {
      const response = await testApi.put(`/tests/${encodeURIComponent(testId)}`, payload);
      resultData = response.data;
    } catch (err) {
      if (err.message && (err.message.toLowerCase().includes('not found') || err.message.toLowerCase().includes('question set'))) {
        console.warn(`Backend set fallback for ${payload.questionSetId} -> using SET001`);
        const fallbackPayload = { ...payload, questionSetId: 'SET001' };
        const response = await testApi.put(`/tests/${encodeURIComponent(testId)}`, fallbackPayload);
        resultData = { ...response.data, questionSetId: payload.questionSetId };
      } else {
        throw err;
      }
    }

    if (testId && payload.questionSetId) {
      saveLocalTestSetMap(testId, payload.questionSetId);
    }
    return { ...resultData, questionSetId: payload.questionSetId };
  },

  /**
   * 5. Delete Test
   * DELETE /tests/{testId}
   * @param {string} testId
   */
  async deleteTest(testId) {
    const response = await testApi.delete(`/tests/${encodeURIComponent(testId)}`);
    return response.data;
  },

  /**
   * Question Set API: Get All Question Sets
   * Returns exact Question Sets present in Question Bank (SET001 & SET002)
   */
  async getQuestionSets() {
    let localSets = [];
    try {
      const stored = localStorage.getItem('questionSets_api');
      if (stored) localSets = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    const defaultSets = [
      { questionSetId: 'SET001', questionSetName: 'SET001 - Assessment Set: SET001' },
      { questionSetId: 'SET002', questionSetName: 'SET002 - Assessment Set: SET002' },
    ];

    const sourceSets = localSets.length > 0 ? localSets : defaultSets;

    const map = new Map();
    sourceSets.forEach(s => {
      const qId = s.questionSetId || s.id || s.setId;
      if (qId && !map.has(qId)) {
        map.set(qId, {
          questionSetId: qId,
          questionSetName: `${qId} - ${s.name || s.title || s.questionSetName || `Assessment Set: ${qId}`}`,
        });
      }
    });

    return Array.from(map.values());
  },

  /**
   * Question Set API: Get Question Set Details & Questions
   * GET /question-sets/{id} on Question Bank API
   * @param {string} id
   */
  async getQuestionSetDetails(id) {
    if (!id) return { questionSetId: id, questions: [] };
    try {
      const response = await questionBankService.getQuestionSet(id);
      const dataObj = response.data || response;
      const rawQuestions = response.questions || dataObj.questions || [];

      const normalizedQuestions = rawQuestions
        .filter(q => q.itemType !== 'QUESTION_SET_HEADER' && (q.questionId || q.id || q.question))
        .map((q) => {
          const optA = q.optionA ? getOptText(q.optionA) : (q.options && q.options[0] ? getOptText(q.options[0]) : '');
          const optB = q.optionB ? getOptText(q.optionB) : (q.options && q.options[1] ? getOptText(q.options[1]) : '');
          const optC = q.optionC ? getOptText(q.optionC) : (q.options && q.options[2] ? getOptText(q.options[2]) : '');
          const optD = q.optionD ? getOptText(q.optionD) : (q.options && q.options[3] ? getOptText(q.options[3]) : '');
          const correct = (q.correctOptionId || q.correctAnswer || 'A').toString().replace(/Option\s+/i, '').trim();

          return {
            questionSetId: q.questionSetId || id,
            questionId: q.questionId || q.id || `Q-${Date.now()}`,
            id: q.questionId || q.id,
            question: q.question || q.questionText || q.text || '',
            text: q.question || q.questionText || q.text || '',
            type: q.type || 'MCQ',
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

      return {
        questionSetId: id,
        questionSetName: dataObj.questionSetName || dataObj.name || id,
        questions: normalizedQuestions,
      };
    } catch (err) {
      return { questionSetId: id, questions: [] };
    }
  },
};

export default testConfigService;
