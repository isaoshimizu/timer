const timerApp = {
  timer: null,
  totalTime: null,
  remainingTime: null,
  isRunning: false,
  timeLeft: 60,
  originalTitle: document.title,

  init() {
    this.setEventListeners();
    this.loadDefaultTime();
    this.updateStartButtonState();
  },

  setEventListeners() {
    document.getElementById('start-stop').addEventListener('click', this.toggleTimer.bind(this));
    document.getElementById('reset').addEventListener('click', this.resetTimer.bind(this));
    document.getElementById('add-minute').addEventListener('click', this.addMinute.bind(this));
    document.getElementById('subtract-minute').addEventListener('click', this.subtractMinute.bind(this));

    const displayInputs = ['display-hours', 'display-minutes', 'display-seconds'];
    displayInputs.forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('focus', () => {
        if (!this.isRunning) {
          input.readOnly = false;
          input.select();
        }
      });
      input.addEventListener('blur', () => {
        input.readOnly = true;
        this.updateStartButtonState();
        const hours = parseInt(document.getElementById('display-hours').value) || 0;
        const minutes = parseInt(document.getElementById('display-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('display-seconds').value) || 0;
        this.totalTime = (hours * 3600) + (minutes * 60) + seconds;
      });
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          input.blur();
        }
      });
    });
  },

  loadDefaultTime() {
    const params = this.getQueryParams();
    if (params.seconds) {
      const defaultTime = parseInt(params.seconds, 10);
      if (!isNaN(defaultTime) && defaultTime > 0) {
        this.timeLeft = defaultTime;
      }
      this.displayTime(this.timeLeft);
      this.totalTime = this.timeLeft;
    }
  },

  getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queries = queryString.split("&");
    queries.forEach(query => {
      const [key, value] = query.split("=");
      params[key] = decodeURIComponent(value);
    });
    return params;
  },

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  },

  startTimer() {
    const hours = parseInt(document.getElementById('display-hours').value) || 0;
    const minutes = parseInt(document.getElementById('display-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('display-seconds').value) || 0;

    const newTotalTime = (hours * 3600) + (minutes * 60) + seconds;

    if (newTotalTime === 0) {
      return;
    }

    if (!this.isRunning) {
      this.totalTime = newTotalTime;
      this.remainingTime = this.totalTime;
    }

    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(this.updateTimer.bind(this), 1000);
    this.isRunning = true;
    const startStopButton = document.getElementById('start-stop');
    startStopButton.textContent = '一時停止';
    startStopButton.classList.add('stop');
    this.updatePageTitle();
  },

  pauseTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.isRunning = false;
    const startStopButton = document.getElementById('start-stop');
    startStopButton.textContent = '開始';
    startStopButton.classList.remove('stop');
    document.title = this.originalTitle;
  },

  resetTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.totalTime === null) {
      const hours = parseInt(document.getElementById('display-hours').value) || 0;
      const minutes = parseInt(document.getElementById('display-minutes').value) || 0;
      const seconds = parseInt(document.getElementById('display-seconds').value) || 0;
      this.totalTime = (hours * 3600) + (minutes * 60) + seconds;
    }
    this.remainingTime = this.totalTime;
    this.displayTime(this.remainingTime);
    this.isRunning = false;
    const startStopButton = document.getElementById('start-stop');
    startStopButton.textContent = '開始';
    startStopButton.classList.remove('stop');
    document.title = this.originalTitle;
  },

  updateTimer() {
    if (this.remainingTime <= 0) {
      clearInterval(this.timer);
      this.isRunning = false;
      const startStopButton = document.getElementById('start-stop');
      startStopButton.textContent = '開始';
      startStopButton.classList.remove('stop');
      this.playAlarm();
      document.title = this.originalTitle;
      this.displayTime(this.totalTime);
      return;
    }
    this.remainingTime--;
    this.displayTime(this.remainingTime);
    this.updatePageTitle();
  },

  displayTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    document.getElementById('display-hours').value = String(hrs).padStart(2, '0');
    document.getElementById('display-minutes').value = String(mins).padStart(2, '0');
    document.getElementById('display-seconds').value = String(secs).padStart(2, '0');
  },

  playAlarm() {
    const alarmSound = document.getElementById('alarm-sound');
    alarmSound.play();
    setTimeout(() => {
      alarmSound.pause();
      alarmSound.currentTime = 0;
    }, 2000);
  },

  updateStartButtonState() {
    const hours = parseInt(document.getElementById('display-hours').value) || 0;
    const minutes = parseInt(document.getElementById('display-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('display-seconds').value) || 0;
    const totalTime = (hours * 3600) + (minutes * 60) + seconds;

    const startStopButton = document.getElementById('start-stop');
    startStopButton.disabled = totalTime === 0;
  },

  updatePageTitle() {
    const hrs = Math.floor(this.remainingTime / 3600);
    const mins = Math.floor((this.remainingTime % 3600) / 60);
    const secs = this.remainingTime % 60;
    const timeString = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.title = `Timer - ${timeString}`;
  },

  addMinute() {
    const hours = parseInt(document.getElementById('display-hours').value) || 0;
    const minutes = parseInt(document.getElementById('display-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('display-seconds').value) || 0;
    
    let totalSeconds = (hours * 3600) + (minutes * 60) + seconds + 60;
    
    if (this.isRunning) {
      this.remainingTime = Math.max(0, this.remainingTime + 60);
      this.totalTime = this.remainingTime;
    } else {
      this.totalTime = totalSeconds;
    }
    
    this.displayTime(this.isRunning ? this.remainingTime : totalSeconds);
    this.updateStartButtonState();
  },

  subtractMinute() {
    const hours = parseInt(document.getElementById('display-hours').value) || 0;
    const minutes = parseInt(document.getElementById('display-minutes').value) || 0;
    const seconds = parseInt(document.getElementById('display-seconds').value) || 0;
    
    let totalSeconds = Math.max(0, (hours * 3600) + (minutes * 60) + seconds - 60);
    
    if (this.isRunning) {
      this.remainingTime = Math.max(0, this.remainingTime - 60);
      this.totalTime = this.remainingTime;
    } else {
      this.totalTime = totalSeconds;
    }
    
    this.displayTime(this.isRunning ? this.remainingTime : totalSeconds);
    this.updateStartButtonState();
  }
};

document.addEventListener("DOMContentLoaded", () => timerApp.init());
