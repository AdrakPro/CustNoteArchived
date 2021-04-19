<template>
  <div>
    <div
      v-if="isInputDisabled"
      @click="switchInputDisabling"
      ref="timer"
      class="timer"
    >{{ timerText }}</div>
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
      isInputDisabled: true,
    };
  },

  created() {
    this.second = 1000;
  },

  mounted() {
    this.attachBreakPointsOnMounted();
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
        this.removeBreakPointsFromProgressBar();
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

    attachBreakPointsOnMounted() {
      if (this.isTimerStarted) {
        this.attachBreakPointsToProgressBar();
      }
    },

    removeBreakPointsFromProgressBar() {
      const progressBar = this.$refs.progressBar.$el;
      const breakPoints = progressBar.getElementsByClassName('breakpoint');

      while (breakPoints.length > 0) {
        progressBar.removeChild(breakPoints[0]);
      }
    },

    removeBreakPointsFromProgressBarWhenTimerExpires() {
      if (this.timeSpent === this.totalTime) {
        this.removeBreakPointsFromProgressBar();
      }
    },

    setTotalTime() {
      this.$store.dispatch('timerStore/setTotalTime');
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
  },

  computed: {
    ...mapState('timerStore', {
      sessions: (state) => state.sessions,
      timerText: (state) => state.timerText,
      totalTime: (state) => state.totalTime,
      timeSpent: (state) => state.timeSpent,
      progress: (state) => state.progress,
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
  },

  watch: {
    timerText() {
      this.removeBreakPointsFromProgressBarWhenTimerExpires();
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
