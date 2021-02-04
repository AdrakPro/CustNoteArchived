import Vue from 'vue';

const state = {
  previousTitle: null,
  isMenuDisabled: false,
  sections: {},
};

const getters = {
  getLessonsBy: (state) => (sectionTitle) => Object.values(state.sections)
    .find((section) => section.sectionTitle === sectionTitle).lessons,

  getSectionKeyBy: (state) => (sectionTitle) => Number.parseInt(Object.keys(state.sections)[
    Object.values(state.sections).findIndex((section) => section.sectionTitle === sectionTitle)
  ], 10),
};

const actions = {
  fetchSections({ commit }, payload) {
    payload.then((docs) => {
      const docsArray = [];
      for (let i = 0, l = docs.length; i < l; ++i) {
        docsArray.push({
          sectionTitle: docs[i].sectionTitle,
          lessons: docs[i].lessons,
        });
      }

      commit('FETCH_SECTIONS', docsArray);
    });
  },

  createEmptySection({ commit }, payload) {
    commit('CREATE_EMPTY_SECTION', payload);
  },

  setSectionTitle({ commit }, payload) {
    commit('SET_SECTION_TITLE', payload);
  },

  deleteSection({ commit }, sectionKey) {
    commit('DELETE_SECTION', sectionKey);
  },

  createEmptyLesson({ commit }, payload) {
    commit('CREATE_EMPTY_LESSON', payload);
  },

  setLessonTitle({ commit }, payload) {
    commit('SET_LESSON_TITLE', payload);
  },

  deleteLesson({ commit }, payload) {
    commit('DELETE_LESSON', payload);
  },

  enableMenu({ commit }) {
    commit('ENABLE_MENU');
  },

  disableMenu({ commit }) {
    commit('DISABLE_MENU');
  },

  setPreviousTitle({ commit }, title) {
    commit('SET_PREVIOUS_TITLE', title);
  },
};

const mutations = {
  FETCH_SECTIONS(state, sections) {
    for (let i = 0, l = sections.length; i < l; ++i) {
      Vue.set(state.sections, i, sections[i]);
    }
  },

  CREATE_EMPTY_SECTION(state, payload) {
    const { sectionKey, section } = payload;

    state.sections[sectionKey] = section;
  },

  SET_SECTION_TITLE(state, payload) {
    const { sectionKey, sectionTitle } = payload;

    state.sections[sectionKey].sectionTitle = sectionTitle;
  },

  DELETE_SECTION(state, sectionKey) {
    Vue.delete(state.sections, sectionKey);
  },

  CREATE_EMPTY_LESSON(state, payload) {
    const { sectionKey, lessonKey, lesson } = payload;

    state.sections[sectionKey].lessons[lessonKey] = lesson;
  },

  SET_LESSON_TITLE(state, payload) {
    const { sectionKey, lessonKey, lessonTitleValue } = payload;

    state.sections[sectionKey].lessons[lessonKey].lessonTitle = lessonTitleValue;
  },

  DELETE_LESSON(state, payload) {
    const { sectionKey, lessonKey } = payload;

    Vue.delete(state.sections[sectionKey].lessons, lessonKey);
  },

  ENABLE_MENU(state) {
    state.isMenuDisabled = false;
  },

  DISABLE_MENU(state) {
    state.isMenuDisabled = true;
  },

  SET_PREVIOUS_TITLE(state, title) {
    state.previousTitle = title;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
