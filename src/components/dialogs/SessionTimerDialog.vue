<template>
  <div>
    <div
      v-if="inputTime === null"
      @click="resetInput"
      ref="timer"
      class="timer"
    >0:0:0</div>
    <q-input
      v-else
      v-model="inputTime"
      @keydown.enter="submitSession"
      style="margin: 15px; height: 72px;"
      input-style="font-size: 48px; color: #52D273; height: 100%"
      borderless
      mask="fulltime"
      :rules="['fulltime']"
      no-error-icon
      hide-bottom-space
      autofocus
    />
    <q-linear-progress
      :value="progressBar"
      ref="progressBar"
      class="progress-bar"
    />
    <q-btn-group
      spread
      unelevated
      class="timer-buttons"
    >
      <q-btn
        v-if="progressBar === 0"
        @click="startTimer"
        icon="mdi-play"
      />
      <q-btn
        icon="mdi-pause"
        @click="pauseTimer"
      />
      <q-btn
        @click="stopTimer"
        icon="mdi-stop"
      />
    </q-btn-group>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

export default {
  name: 'SessionTimerDialog',

  data() {
    return {
      inputTime: null,
    };
  },

  created() {
    this.second = 1000;
  },

  methods: {
    startTimer() {
      if (this.isSessionNotSubmitted()) {
        return;
      }

      this.disableInput();
      this.$store.dispatch('timerStore/startTimer');
    },

    stopTimer() {
      this.$store.dispatch('timerStore/stopTimer');
      this.removeBreakPointsFromProgressBar();
    },

    pauseTimer() {
      this.$store.dispatch('timerStore/switchPausingTimer');
    },

    submitSession() {
      const time = this.parseInputTimeToMs();

      this.resetInput();
      this.$store.dispatch('timerStore/addSession', time);
      this.attachBreakPointsToProgressBar();
    },

    stopTimerWhenExpired() {
      if (this.timeSpent === this.totalTime) {
        this.stopTimer();
      }
    },

    updateTimerText() {
      let seconds = (this.totalTime - this.timeSpent) / this.second;
      // 3,600 seconds in 1 hour
      const hours = Math.floor(seconds / 3600);
      // Seconds remaining after extracting hours
      seconds %= 3600;
      // 60 seconds in 1 minute
      const minutes = Math.floor(seconds / 60);
      // Keep only seconds not extracted to minutes:
      seconds %= 60;

      const timerText = this.$refs.timer;

      if (timerText !== undefined) {
        timerText.innerText = `${hours}:${minutes}:${seconds}`;
      }
    },

    attachBreakPointsToProgressBar() {
      const progressBar = this.$refs.progressBar.$el;
      const breakPoint = document.createElement('div');
      const lastSessionIndex = this.sessions.length - 1;

      breakPoint.classList.add('breakpoint');
      breakPoint.style.left = `${(this.sessions[lastSessionIndex] / this.totalTime) * progressBar.clientWidth}px`;

      progressBar.appendChild(breakPoint);
    },

    alertWhenEnterBreakpoint() {
      const lastSessionIndex = this.sessions.length - 1;

      if (this.sessions[lastSessionIndex] === this.timeSpent) {
        this.$q.electron.ipcRenderer.send('flash-icon');
        this.$store.dispatch('timerStore/popSession');
      }
    },

    removeBreakPointsFromProgressBar() {
      const progressBar = this.$refs.progressBar.$el;
      const breakpoints = progressBar.getElementsByClassName('breakpoint');

      while (breakpoints.length > 0) {
        progressBar.removeChild(breakpoints[0]);
      }
    },

    isSessionNotSubmitted() {
      return this.totalTime === 0 || this.inputTime === null;
    },

    parseInputTimeToMs() {
      const time = this.inputTime.split(':');
      const convertingTable = [
        3600 * this.second, // hours
        60 * this.second, // minutes
        this.second, // seconds
      ];
      let summedMs = 0;

      for (let i = 0, l = time.length; i < l; ++i) {
        summedMs += Number(time[i]) * convertingTable[i];
      }

      return summedMs;
    },

    resetInput() {
      this.inputTime = '';
    },

    disableInput() {
      this.inputTime = null;
    },
  },

  computed: {
    ...mapState('timerStore', {
      progressBar: (state) => state.progressBar,
      timeSpent: (state) => state.timeSpent,
      sessions: (state) => state.sessions,
    }),

    ...mapGetters('timerStore', {
      totalTime: 'totalTime',
    }),
  },

  watch: {
    timeSpent() {
      this.stopTimerWhenExpired();
      this.alertWhenEnterBreakpoint();
      this.updateTimerText();
    },
  },
};
</script>
<style lang="scss">
.timer {
  display: flex;
  justify-content: center;
  flex-wrap: nowrap;

  margin: 15px;
  font-size: 48px;
  cursor: pointer;

  &:hover {
    opacity: 0.76;
    transition: opacity 0.3s ease-out;
  }
}

.progress-bar {
  width: calc(100% - 20px);
  height: 10px;
  margin: 10px;
  border-radius: 20px;
  color: $positive;
}

.timer-buttons > button[type="button"] {
  color: $positive;
}

.breakpoint {
  position: absolute;
  height: 100%;
  width: 3px;
  background-color: $primary;
}
</style>
