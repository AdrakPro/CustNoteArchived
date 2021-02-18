const state = {
  isMenuDisabled: false,
};

const actions = {
  enableMenu({ commit }) {
    commit('ENABLE_MENU');
  },

  disableMenu({ commit }) {
    commit('DISABLE_MENU');
  },
};

const mutations = {
  ENABLE_MENU(state) {
    state.isMenuDisabled = false;
  },

  DISABLE_MENU(state) {
    state.isMenuDisabled = true;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
