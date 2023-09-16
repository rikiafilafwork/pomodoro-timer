import notifier from 'node-notifier'
import moment from 'moment'

//Mengambil data argument node
//arg di slice array karena index 0 adalah path node, dan index 1 adalah path js yang di run
//disini kita hanya membutuhkan argv yang kita set
const argTime = process.argv.slice(2);

//waktu kerja, jika tidak set argv, maka otomatis 25 menit
const POMODORO_DURATION = argTime[0] ?? 25;
//waktu istirahat, jika tidak set argv, maka otomatis 5 menit
const BREAK_DURATION = argTime[1] ?? 5;

let isWorking = false;
let remainingTime = 0;

function formattingTime(totalSecond) {
  const duration = moment.duration(totalSecond, "seconds");
  const hours = duration.hours().toString().padStart(2, "0");
  const minutes = duration.minutes().toString().padStart(2, "0");
  const seconds = duration.seconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function startTimer(duration) {
  isWorking = !isWorking;
  remainingTime = duration * 60;

  const timer = setInterval(() => {
    remainingTime--;

    const formattedTime = formattingTime(remainingTime);

    console.log(`${isWorking ? "Work" : "Break"}: ${formattedTime}`);

    if (remainingTime === 0) {
      clearInterval(timer);
      notifier.notify({
        title: isWorking ? "Istirahat dulu!" : "Ayo kerja lagi!",
        message: isWorking ? "Alhamdulillah, istirahat" : "Alhamdulillah, semangat kerjanya",
        sound: true,
        wait: true,
      });
      startTimer(isWorking ? BREAK_DURATION : POMODORO_DURATION);
    }
  }, 1000);
}

startTimer(POMODORO_DURATION);
