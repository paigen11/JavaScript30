let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
    // figure out when the timer started
    const now = Date.now();

    // create how long you want the timer to run for (then multiply by 1000 to account for now is ms)
    const then = now + seconds * 1000;
    // console.log({now, then});

    // run the function once as soon as its called to know what seconds value you're starting from
    displayTimeLeft(seconds);
    displayEndTime(then);

    // create countdown interval
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop interval from running
        if(secondsLeft <= 0) {
            clearInterval(countdown);
            return;
        }

        // display countdown interval through displayTimeLeft function
        console.log(displayTimeLeft(secondsLeft));

    }, 1000);
}

function displayTimeLeft(seconds){
    // get the remaining minutes and seconds
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;

    // set the timer with the correct countdown display time
    const displayTime = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = displayTime;

    // just nice to display countdown on tab too
    document.title = displayTime;

    // console.log({  minutes, remainderSeconds});
}

function displayEndTime(timestamp){
    // convert timestamp into proper date you can extract values from
    const end = new Date(timestamp);

    const hours = end.getHours();
    const minutes = end.getMinutes();

    endTime.textContent = `Be Back At ${hours > 12 ? hours - 12 : hours }:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer(){
    console.log(this.dataset.time);
}

buttons.forEach(button => button.addEventListener('click', startTimer));