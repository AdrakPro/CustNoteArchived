const getDefaultState = () => ({
  timer: null,
  sessions: [],
  timeSpent: 0,
  totalTime: 0,
  progress: 0,
  timerText: '0:0:0',
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
        commit('UPDATE_PROGRESS_BAR');
        commit('UPDATE_TIMER');
      }

      const { electron, notify } = this._vm.$q;
      const sendNotification = (color, message) => {
        electron.ipcRenderer.send('flash-icon');
        notify({
          color,
          textColor: 'white',
          message,
          timeout: 4 * second,
        });
      };

      if (state.sessions[0] === state.timeSpent && state.timeSpent !== state.totalTime) {
        commit('SHIFT_SESSION');
        sendNotification('info', 'Session ended!');
      }

      if (state.progress === 1) {
        commit('STOP_TIMER');
        sendNotification('warning', 'All sessions have been ended!');
      }
    }, second);

    commit('SET_TIMER', timer);
  },

  setTotalTime({ commit }) {
    commit('SET_TOTAL_TIME');
  },

  addSession({ commit }, time) {
    commit('ADD_SESSION', time);
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

  UPDATE_PROGRESS_BAR(state) {
    state.progress = state.timeSpent / state.totalTime;
  },

  UPDATE_TIMER(state) {
    let seconds = (state.totalTime - state.timeSpent) / second;
    // 3,600 seconds in 1 hour
    const hours = Math.floor(seconds / 3600);
    // Seconds remaining after extracting hours
    seconds %= 3600;
    // 60 seconds in 1 minute
    const minutes = Math.floor(seconds / 60);
    // Keep only seconds not extracted to minutes:
    seconds %= 60;

    if (state.sessions.length !== 0) {
      state.timerText = `${hours}:${minutes}:${seconds}`;
    }
  },

  SET_TOTAL_TIME(state) {
    state.totalTime = state.sessions.reduce((a, b) => a + b, 0);
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
