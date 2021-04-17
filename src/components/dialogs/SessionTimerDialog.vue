<template>
  <div>
    <div
      v-if="isInputDisabled"
      @click="switchInputDisabling"
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
      :value="progress"
      ref="progressBar"
      class="progress-bar"
    />
    <q-btn-group
      spread
      unelevated
      class="timer-buttons"
    >
      <q-btn
        v-if="isTimerNotStarted"
        @click="startTimer"
        icon="mdi-play"
      />
      <q-btn
        v-else
        :icon="isTimerNotPaused ? 'mdi-pause' : 'mdi-play'"
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
import { mapState } from 'vuex';

export default {
  name: 'SessionTimerDialog',

  data() {
    return {
      inputTime: '',
      progress: 0,
      totalTime: 0,
      isInputDisabled: true,
    };
  },

  created() {
    this.second = 1000;
  },

  methods: {
    startTimer() {
      if (this.areSessionsExist) {
        this.switchInputDisabling();
        this.setTotalTime();
        this.attachBreakPointsToProgressBar();
        this.$store.dispatch('timerStore/startTimer');
      }
    },

    pauseTimer() {
      if (this.isTimerStarted) {
        this.$store.dispatch('timerStore/switchPausingTimer');
      }
    },

    stopTimer() {
      if (this.isTimerStarted) {
        this.$store.dispatch('timerStore/stopTimer');
        this.setTimerText('0:0:0');
        this.removeBreakPointsFromProgressBar();
        this.resetProgressBar();
      }
    },

    stopTimerWhenExpired() {
      if (this.isTimerExpired) {
        this.stopTimer();
        this.flashIcon();
      }
    },

    submitSession() {
      const time = this.parseStringTimeToMs();

      this.resetInput();
      this.$store.dispatch('timerStore/addSession', time);
    },

    attachBreakPointsToProgressBar() {
      const progressBar = this.$refs.progressBar.$el;

      for (let i = 0, l = this.sessions.length; i < l; ++i) {
        const breakPoint = document.createElement('div');
        const sessionTime = i !== 0 ? this.sessions[i - 1] + this.sessions[i] : this.sessions[i];

        breakPoint.classList.add('breakpoint');
        breakPoint.style.left = `${(sessionTime / this.totalTime) * progressBar.clientWidth}px`;

        progressBar.appendChild(breakPoint);
      }
    },

    flashIconWhenEnterBreakPoint() {
      const currentSession = this.sessions[0];

      if (currentSession === this.timeSpent) {
        this.$store.dispatch('timerStore/shiftSession');
        this.flashIcon();
      }
    },

    removeBreakPointsFromProgressBar() {
      const progressBar = this.$refs.progressBar.$el;
      const breakPoints = progressBar.getElementsByClassName('breakpoint');

      while (breakPoints.length > 0) {
        progressBar.removeChild(breakPoints[0]);
      }
    },

    updateProgressBar() {
      this.progress = this.timeSpent / this.totalTime;
    },

    updateTimer() {
      let seconds = (this.totalTime - this.timeSpent) / this.second;
      // 3,600 seconds in 1 hour
      const hours = Math.floor(seconds / 3600);
      // Seconds remaining after extracting hours
      seconds %= 3600;
      // 60 seconds in 1 minute
      const minutes = Math.floor(seconds / 60);
      // Keep only seconds not extracted to minutes:
      seconds %= 60;

      if (this.areSessionsExist) {
        this.setTimerText(`${hours}:${minutes}:${seconds}`);
      }
    },

    setTimerText(text) {
      const { timer } = this.$refs;

      timer.innerText = text;
    },

    setTotalTime() {
      this.totalTime = this.sessions.reduce((a, b) => a + b, 0);
    },

    flashIcon() {
      this.$q.electron.ipcRenderer.send('flash-icon');
    },

    parseStringTimeToMs() {
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

    switchInputDisabling() {
      if (this.isTimerNotStarted) {
        this.isInputDisabled = !this.isInputDisabled;
      }
    },

    resetInput() {
      this.inputTime = '';
    },

    resetProgressBar() {
      this.progress = 0;
    },
  },

  computed: {
    ...mapState('timerStore', {
      sessions: (state) => state.sessions,
      timeSpent: (state) => state.timeSpent,
      isTimerNotPaused: (state) => state.isTimerNotPaused,
    }),

    areSessionsExist() {
      return this.sessions.length !== 0;
    },

    isTimerNotStarted() {
      return this.progress === 0;
    },

    isTimerStarted() {
      return this.progress !== 0;
    },

    isTimerExpired() {
      return this.progress === 1;
    },
  },

  watch: {
    timeSpent() {
      this.flashIconWhenEnterBreakPoint();
      this.updateProgressBar();
      this.updateTimer();
      this.stopTimerWhenExpired();
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
  user-select: none;

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

  &:first-child {
    margin-left: 5px;
  }

  &:last-child {
    margin-right: 5px;
  }
}

.breakpoint {
  position: absolute;
  height: 100%;
  width: 3px;
  background-color: $primary;
}
</style>
