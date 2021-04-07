const getDefaultState = () => ({
  selectedSubject: {
    id: null,
    style: null,
    content: '',
  },
});

const state = getDefaultState();

const actions = {
  setSelectedSubject({ commit }, subject) {
    commit('SET_SELECTED_SUBJECT', subject);
  },

  setSubjectContent({ commit }, payload) {
    commit('SET_SUBJECT_CONTENT', payload);
  },

  selectSubject({ commit }, payload) {
    const { select, subject } = payload;
    const subjectStyle = select ? 'selected-node' : 'subject-node';

    commit('SELECT_SUBJECT', { subject, subjectStyle });
  },

  resetSelectedSubject({ commit }) {
    commit('RESET_SELECTED_SUBJECT');
  },
};

const mutations = {
  SET_SELECTED_SUBJECT(state, subject) {
    state.selectedSubject = subject;
  },

  SET_SUBJECT_CONTENT(state, payload) {
    const { subject, content } = payload;

    subject.content = content;
  },

  SELECT_SUBJECT(state, payload) {
    const { subject, subjectStyle } = payload;

    subject.style = subjectStyle;
  },

  RESET_SELECTED_SUBJECT(state) {
    Object.assign(state, getDefaultState());
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
