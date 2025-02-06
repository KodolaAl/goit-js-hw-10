import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  inputDate: document.querySelector('#datetime-picker'),
  startButton: document.querySelector('[data-start]'),
  timerDays: document.querySelector('[data-days]'),
  timerHours: document.querySelector('[data-hours]'),
  timerMinutes: document.querySelector('[data-minutes]'),
  timerSeconds: document.querySelector('[data-seconds]'),
};

const windowMessage = {
  message: 'Please choose a date in the future',
  position: 'topRight',
  backgroundColor: '#ef4040',
  messageColor: 'white',
  progressBar: false,
  displayMode: 'replace',
};

let userSelectedDate = null;
refs.startButton.disabled = true;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= Date.now()) {
      iziToast.show(windowMessage);
      refs.startButton.disabled = true;
    } else {
      userSelectedDate = selectedDates[0];
      refs.startButton.disabled = false;
    }
  },
};

function timerStart() {
  let intervalId = null;
  intervalId = setInterval(() => {
    const timeNow = Date.now();
    const ms = userSelectedDate - timeNow;
    const time = convertMs(ms);
    const str = timeToString(time);

    refs.timerDays.textContent = str.daysStr;
    refs.timerHours.textContent = str.hoursStr;
    refs.timerMinutes.textContent = str.minutesStr;
    refs.timerSeconds.textContent = str.secondsStr;

    refs.startButton.disabled = true;
    refs.inputDate.disabled = true;

    if (ms <= 0) {
      clearInterval(intervalId);

      refs.timerDays.textContent = '00';
      refs.timerHours.textContent = '00';
      refs.timerMinutes.textContent = '00';
      refs.timerSeconds.textContent = '00';

      refs.inputDate.disabled = false;
    }
  }, 1000);
}

refs.startButton.addEventListener('click', () => {
  timerStart();
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  const date = { days, hours, minutes, seconds };
  return date;
}

function timeToString({ days, hours, minutes, seconds }) {
  const daysStr = days.toString().padStart(2, '0');
  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = seconds.toString().padStart(2, '0');
  const timeStr = { daysStr, hoursStr, minutesStr, secondsStr };
  return timeStr;
}

flatpickr(refs.inputDate, options);
