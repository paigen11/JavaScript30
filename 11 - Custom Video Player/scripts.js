/* get the elements */

const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('.fullscreen__button');

/* build the functions */

function togglePlay() {
    const method = video.paused ? 'play' : 'pause';
    // access the method inside of video of either play or pause and call it that way
    video[method]();
}

function updateButton() {
    // the this is scoped to refer to the video, as defined by its eventListener
    const icon = this.paused ? '►' : '❚ ❚';
    toggle.textContent = icon;
}

function skip() {
    /* to see what the skip values are, check the DOM and you'll see data-skip has either the value -10 or 25,
    which refers to the seconds to move forward or back, and this data-skip attribute could be applied to anything else as well
     */
    video.currentTime += parseInt(this.dataset.skip); // you could also use parseFloat for this to the same effect
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100; // calculate the percentage of the video and convert to a number instead of a decimal
    progressBar.style.flexBasis = `${percent}%`; // interpolate the percentage into the progressBar's flexBasis which shows the percentage of the video complete
    console.log(percent);
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration; // taking the offsetX of the event listener and the offsetWidth of the whole bar to get the percentage to move the bar location to
    video.currentTime = scrubTime;
    console.log(e);
}


/* hook up the event listeners */

// this is for the playing the video / the play button
video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

toggle.addEventListener('click', togglePlay);

// this is for the skip buttons to move the video forward and back
skipButtons.forEach(button => button.addEventListener('click', skip)); // the change event is fired for elements like input, select or text area

// this is for the volume and playback buttons
ranges.forEach(range => range.addEventListener('change', handleRangeUpdate));

let rangeButtonClicked = false;
ranges.forEach(range => range.addEventListener('mousedown', () => rangeButtonClicked = true));
ranges.forEach(range => range.addEventListener('mousemove', () => mousedown && handleRangeUpdate));
ranges.forEach(range => range.addEventListener('mouseup', () => rangeButtonClicked = false));

//progress bar
video.addEventListener('timeupdate', handleProgress); // this will emit an event as the video is updating its time code and won't when the video is paused

let mousedown = false;
progress.addEventListener('click', scrub);
progress.addEventListener('mousmeove', (e) => mousedown && scrub(e)); // checks if mousedown is true and if it is, it moves on to scrub and passes in the event listener e
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

//TODO: challenge add a full screen button that takes the video full screen when clicked
// fullscreen.addEventListener('click', changeVideoSize);