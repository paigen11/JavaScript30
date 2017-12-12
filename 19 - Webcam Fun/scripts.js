const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    // this gets the video for all browsers regardless of how new they might be
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            // set the video's source as local media stream - be aware of the capitalization
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.log("OH NO!", err);
        });
}

function paintToCanvas(){
    const width = video.videoWidth;
    const height = video.videoHeight;

    canvas.width = width;
    canvas.height = height;

    /* this will update the image being projected onto the canvas every 16 ms, and it will start in the top
    left hand corner of the screen (0,0) and make it the height and width of the canvas
     */
    // return it if you ever need to stop it from painting
     return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // this gets every pixel in the image and assigns it a red, green, blue, and alpha value
        let pixels = ctx.getImageData(0, 0, width, height);
        // mess with the pixels and manipulate them

        // pixels = redEffect(pixels);
        //  pixels = rgbSplit(pixels);
        pixels = greenScreen(pixels);

        // put back the new ones
        ctx.putImageData(pixels, 0, 0);
     }, 16);
}

function takePhoto(){
    // play the photo snap sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    // create a link to the image that users can open in a browser
    link.href = data;
    // this makes it downloadable and download's the name as 'handsome.jpeg'
    link.setAttribute('download', 'handsome');
    // this populates snap shots of the images at the bottom in the strip of the image, which users can then click on and download
    link.innerHTML = `<img src="${data}" alt="Handsome Woman" />`;

    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i + 0] = pixels.data[i + 0]+ 100; // red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // blue
    }
    return pixels;
}

// this moves the red, green and blue hues apart from one another in the video
function rgbSplit(pixels){
    for(let i = 0; i < pixels.data.length; i+=4){
        pixels.data[i - 450] = pixels.data[i + 0]+ 100; // red
        pixels.data[i + 300] = pixels.data[i + 1] - 50; // green
        pixels.data[i - 200] = pixels.data[i + 2] * 0.5; // blue
    }
    return pixels;
}

function greenScreen(pixels){
    // holds the min and max green
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });

    console.log(levels);

    for (i = 0; i < pixels.data.length; i = i + 4) {
        red = pixels.data[i + 0];
        green = pixels.data[i + 1];
        blue = pixels.data[i + 2];
        let alpha = pixels.data[i + 3];

        if (red >= levels.rmin
            && green >= levels.gmin
            && blue >= levels.bmin
            && red <= levels.rmax
            && green <= levels.gmax
            && blue <= levels.bmax) {
            // take it out!
            pixels.data[i + 3] = 0;
        }
    }
}

getVideo();

// once the video is playing, it will emit the event 'canplay' and then we can paint to canvas from it
video.addEventListener('canplay', paintToCanvas);