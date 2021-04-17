const getDefaultState = () => ({
  timer: null,
  sessions: [],
  timeSpent: 0,
  isTimerNotPaused: true,
});

const second = 1000;

const state = getDefaultState();

const actions = {
  stopTimer({ commit }) {
    commit('STOP_TIMER');
  },

  startTimer({ commit }) {
    const timer = setInterval(() => {
      if (state.isTimerNotPaused) {
        commit('INCREMENT_TIME');
      }
    }, second);

    commit('SET_TIMER', timer);
  },

  addSession({ commit }, time) {
    commit('ADD_SESSION', time);
  },

  shiftSession({ commit }) {
    commit('SHIFT_SESSION');
  },

  switchPausingTimer({ commit }) {
    commit('SWITCH_PAUSING_TIMER');
  },
};

const mutations = {
  SET_TIMER(state, timer) {
    state.timer = timer;
  },

  STOP_TIMER(state) {
    clearInterval(state.timer);
    Object.assign(state, getDefaultState());
  },

  INCREMENT_TIME(state) {
    state.timeSpent += second;
  },

  ADD_SESSION(state, time) {
    state.sessions.push(time);
  },

  SHIFT_SESSION(state) {
    state.sessions.shift();
  },

  SWITCH_PAUSING_TIMER(state) {
    state.isTimerNotPaused = !state.isTimerNotPaused;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
