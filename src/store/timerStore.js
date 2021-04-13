const getDefaultState = () => ({
  timer: null,
  progressBar: 0,
  timeSpent: 0,
  sessions: [],
  isTimerNotPaused: true,
});

const SECOND = 1000;

const state = getDefaultState();

const getters = {
  totalTime: (state) => state.sessions.reduce((a, b) => a + b, 0),
};

const actions = {
  setTimer({ commit }, timer) {
    commit('SET_TIMER', timer);
  },

  stopTimer({ commit }) {
    commit('STOP_TIMER');
    commit('RESET_TIMER');
  },

  startTimer({ commit }) {
    const timer = setInterval(() => {
      if (state.isTimerNotPaused) {
        commit('INCREMENT_TIME');
        commit('UPDATE_PROGRESS_BAR');
      }
    }, SECOND);

    commit('SET_TIMER', timer);
  },

  addSession({ commit }, time) {
    commit('ADD_SESSION', time);
  },

  popSession({ commit }) {
    commit('POP_SESSION');
  },

  switchPausingTimer({ commit }) {
    commit('SWITCH_PAUSING_TIMER');
  },

  resetTimer({ commit }) {
    commit('RESET_TIMER');
  },
};

const mutations = {
  SET_TIMER(state, timer) {
    state.timer = timer;
  },

  STOP_TIMER(state) {
    clearInterval(state.timer);
  },

  INCREMENT_TIME(state) {
    state.timeSpent += SECOND;
  },

  UPDATE_PROGRESS_BAR(state) {
    const totalTime = state.sessions.reduce((a, b) => a + b, 0);

    state.progressBar = state.timeSpent / totalTime;
  },

  SWITCH_PAUSING_TIMER(state) {
    state.isTimerNotPaused = !state.isTimerNotPaused;
  },

  ADD_SESSION(state, time) {
    state.sessions.push(time);
  },

  POP_SESSION(state) {
    state.sessions.pop();
  },

  RESET_TIMER(state) {
    Object.assign(state, getDefaultState());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
