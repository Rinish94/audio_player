// Create Visualizer //

// Extract data from the audio=> web audio api

const audioContext = new (window.AudioContext || window.webkitAudioContext)(); //AudioContext will give us the means to controll audio
const audioElement = document.querySelector("audio"); // sourcing the data from audioElement
const canvasElement = document.querySelector("canvas"); //canvas HTML element
const canvasContext = canvasElement.getContext("2d"); //Helps us to draw canvas
const playPauseButton = document.querySelector(".play-pause"); //getting reference for playPauseButton
const seekbar = document.querySelector(".seekbar"); //getting reference for seekbar
const volumeBar = document.querySelector(".volume"); //getting reference for volumeBar

const pauseIcon = `<span class="material-icons">
pause
</span>`;
const playIcon = `<span class="material-icons">
play_arrow
</span>`;
const replayIcon = `<span class="material-icons">
replay
</span>`;

//width and height of the canvas element
const Canvawidth = canvasElement.clientWidth;
const CanvaHeight = canvasElement.clientHeight;
// Setting default value
seekbar.value = 0;
volumeBar.value = 100;

let audioState = {
  ///Wil tell th status of the audio
  isReplay: false,
  isPaused: true,
};

playPauseButton.addEventListener("click", togglePlayPause); ///eventlistener for playPausebutton

audioElement.addEventListener("timeupdate", setProgress);
audioElement.addEventListener("ended", onEnd);
audioElement.addEventListener("canplay", setDuration);
seekbar.addEventListener("input", onSeek);
volumeBar.addEventListener("input", onVolumeSeek);

const source = audioContext.createMediaElementSource(audioElement); // creating a media element source
const analyser = audioContext.createAnalyser(); //analyzer node will give us the frequency data
//It samples the audio and creates sum frequency bis and we will plot those frequency bins.

analyser.fftSize = 256; // The FFT size defines the number of bins used for dividing the window into equal strips, or bins

//Now we have to connect the graph
source.connect(analyser); //connecting source to the analyser
analyser.connect(audioContext.destination); //connect analyser to the destination "Speakers"

const bufferLength = analyser.frequencyBinCount; //no. of frequency bins that we have//analyser will sample the audio and will create each sample frequency bins

const dataArray = new Uint8Array(bufferLength); // to get the data form analyser,Uint8Array is js typed array which is 8 bitlonged unsigned array

function draw() {
  analyser.getByteFrequencyData(dataArray); //puts all the data into the data array that we are passing
  // canvasCtx.fillStyle = 'orange';
  canvasContext.fillStyle = "rgb(2, 2, 2)";
  canvasContext.fillRect(0, 0, Canvawidth, CanvaHeight);
  // canvasContext.fillRect(count,0,WIDTH,HEIGHT);

  const barWidth = (Canvawidth / bufferLength) * 2.5; //bar area
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    // iterting through the data array
    barHeight = dataArray[i] / 2.8; //bars should fit in canvas
    canvasContext.fillStyle = `rgb(50,50, 200)`;
    canvasContext.fillRect(x, CanvaHeight - barHeight, barWidth, barHeight); //topleft =x,y=CanvaHeight - barHeight,

    x += barWidth + 1;
  }
  // if(count > 100/1){
  //     return;
  // }

  requestAnimationFrame(draw); //requestAnimationFrame calls the function every time 6otimes a second so bars will move
}
draw();

function togglePlayPause() {
  audioContext.resume().then(() => {
    // On first interaction resume needs to be called
    if (audioState.isPaused) {
      //Playing
      playPauseButton.innerHTML = pauseIcon;
      audioElement.play();
    } else {
      if (audioState.isReplay) {
        // Replay will come when audio is finished playing
        playPauseButton.innerHTML = pauseIcon;
        audioElement.play();
        audioState.isReplay = false;
        return; // returning because we will not touch the isPause state
      }
      playPauseButton.innerHTML = playIcon;
      audioElement.pause();
    }

    audioState.isPaused = !audioState.isPaused; //toggling the audiostate
  });
}

function setProgress() {
  seekbar.value = audioElement.currentTime; //setting seekbar value  from the audioelements current time
}
function setDuration() {
  seekbar.max = audioElement.duration; //duration will hold the size of seekbar
}

function onEnd() {
  playPauseButton.innerHTML = replayIcon; /// changing the stateof button to replayicon
  audioElement.currentTime = 0;
  seekbar.value = 0;
  audioState.isReplay = true;
}
function onSeek(evt) {
  // this functions help the user to seek the seekbar //cathcing the event //reversal of setprogress function
  audioElement.currentTime = evt.target.value;
}

function onVolumeSeek(evt) {
  audioElement.volume = evt.target.value / 100; //volume should be in the range form 0-1thats why dividing from 100
}
