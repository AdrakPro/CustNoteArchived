import Vue from 'vue';
import normalizeData, { SECTIONS_SCHEME } from 'components/utils/dataNormalizer';

const state = {
  previousTitle: null,
  sections: {},
  lessons: {},
};

const getters = {
  getSectionLessonsBy: (state) => (sectionTitle) => state.sections[sectionTitle].lessons,
};

const actions = {
  fetchSections({ commit }, payload) {
    payload.then((docs) => {
      const dataToNormalize = [];
      for (let i = 0, l = docs.length; i < l; ++i) {
        dataToNormalize.push({
          sectionTitle: docs[i].sectionTitle,
          lessons: docs[i].lessons,
        });
      }

      commit('FETCH_SECTIONS', normalizeData(dataToNormalize, SECTIONS_SCHEME));
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

    if (sections !== undefined) {
      state.sections = sections;
    }

    if (lessons !== undefined) {
      state.lessons = lessons;
    }
  },

  CREATE_EMPTY_SECTION(state) {
    Vue.set(state.sections, null, {
      sectionTitle: null,
      lessons: [],
    });
  },

  SET_SECTION(state, sectionTitle) {
    const section = state.sections[state.previousTitle] || { lessons: [] };
    section.sectionTitle = sectionTitle;

    Vue.delete(state.sections, state.previousTitle);
    Vue.set(state.sections, sectionTitle, section);
  },

  DELETE_SECTION(state, sectionTitle) {
    const sectionLessons = state.sections[sectionTitle].lessons;

    for (let i = 0, l = sectionLessons.length; i < l; ++i) {
      Vue.delete(state.lessons, sectionLessons[i]);
    }
    Vue.delete(state.sections, sectionTitle);
  },

  CREATE_EMPTY_LESSON(state, payload) {
    const { sectionTitle, lessonId } = payload;

    state.sections[sectionTitle].lessons.push(null);
    Vue.set(state.lessons, null, {
      lessonTitle: null,
      lessonId,
    });
  },

  SET_LESSON(state, payload) {
    const { sectionTitle, lessonTitle } = payload;

    const lesson = state.lessons[state.previousTitle] || {};
    lesson.lessonTitle = lessonTitle;

    const sectionLessons = state.sections[sectionTitle].lessons;
    const lessonIndex = sectionLessons.findIndex((lessonTitle) => lessonTitle === state.previousTitle);
    sectionLessons[lessonIndex] = lessonTitle;

    Vue.delete(state.lessons, state.previousTitle);
    Vue.set(state.lessons, lessonTitle, lesson);
  },

  DELETE_LESSON(state, payload) {
    const { sectionTitle, lessonTitle } = payload;

    const sectionLessons = state.sections[sectionTitle].lessons;
    sectionLessons.splice(sectionLessons.indexOf(lessonTitle), 1);
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
