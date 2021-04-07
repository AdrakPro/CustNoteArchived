import Vue from 'vue';
import normalizeData from 'components/utils/dataNormalizer';

const state = {
  previousTitle: null,
  sections: {},
  lessons: {},
};

const getters = {
  getLessons: (state) => (title) => state.sections[title].lessons,
};

const actions = {
  fetchSections({ commit }, payload) {
    payload.then((docs) => {
      const dataToNormalize = [];
      for (let i = 0, l = docs.length; i < l; ++i) {
        dataToNormalize.push({
          title: docs[i].title,
          lessons: docs[i].lessons.filter((lesson) => lesson !== null),
        });
      }

      commit('FETCH_SECTIONS', normalizeData(dataToNormalize));
    });
  },

  createEmptySection({ commit }) {
    commit('CREATE_EMPTY_SECTION');
  },

  setSection({ commit }, sectionTitle) {
    commit('SET_SECTION', sectionTitle);
  },

  deleteSection({ commit }, sectionTitle) {
    commit('DELETE_SECTION', sectionTitle);
  },

  createEmptyLesson({ commit }, payload) {
    commit('CREATE_EMPTY_LESSON', payload);
  },

  setLesson({ commit }, payload) {
    commit('SET_LESSON', payload);
  },

  deleteLesson({ commit }, payload) {
    commit('DELETE_LESSON', payload);
  },

  setPreviousTitle({ commit }, title) {
    commit('SET_PREVIOUS_TITLE', title);
  },
};

const mutations = {
  FETCH_SECTIONS(state, data) {
    const { sections, lessons } = data.entities;

    state.sections = sections || {};
    state.lessons = lessons || {};
  },

  CREATE_EMPTY_SECTION(state) {
    Vue.set(state.sections, null, {
      title: null,
      lessons: [],
    });
  },

  SET_SECTION(state, title) {
    const section = state.sections[state.previousTitle] || { lessons: [] };

    section.title = title;

    Vue.delete(state.sections, state.previousTitle);
    Vue.set(state.sections, title, section);
  },

  DELETE_SECTION(state, title) {
    const { lessons } = state.sections[title];

    for (let i = 0, l = lessons.length; i < l; ++i) {
      Vue.delete(state.lessons, lessons[i]);
    }
    Vue.delete(state.sections, title);
  },

  CREATE_EMPTY_LESSON(state, payload) {
    const { sectionTitle, id } = payload;

    state.sections[sectionTitle].lessons.push(null);

    Vue.set(state.lessons, null, {
      title: null,
      id,
    });
  },

  SET_LESSON(state, payload) {
    const { sectionTitle, lessonTitle } = payload;
    const { lessons } = state.sections[sectionTitle];
    const lessonIndex = lessons.findIndex((title) => title === state.previousTitle);
    const lesson = state.lessons[state.previousTitle] || {};

    lessons[lessonIndex] = lessonTitle;
    lesson.title = lessonTitle;

    Vue.delete(state.lessons, state.previousTitle);
    Vue.set(state.lessons, lessonTitle, lesson);
  },

  DELETE_LESSON(state, payload) {
    const { sectionTitle, lessonTitle } = payload;
    const { lessons } = state.sections[sectionTitle];

    lessons.splice(lessons.indexOf(lessonTitle), 1);
    Vue.delete(state.lessons, lessonTitle);
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
