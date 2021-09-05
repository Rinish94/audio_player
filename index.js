const audioContext = new (window.AudioContext || window.webkitAudioContext)(); //AudioContext will give us the means to controll audio
const audioElement = document.querySelector("audio");

let count = 1; // count variable is helping to make changes from one canvasLines to next
let flag = true; // flag variable is used to check when  play/pause button is been clicked by the user

// CanvasClick function helps us  to access the id's of each canvasLines in the canvas tag
CanvasClick = (val) => {
  for (let i = 1; i <= 145; i++) {
    if (i <= val.id) {
      document.getElementById(i).style.backgroundColor = "pink";
    } else {
      document.getElementById(i).style.backgroundColor = "grey";
    }
  }
  count = val.id;
};

//audioPlayPause function helps in  toggling the button and handling play/pause for canvasLines to change the color and stop and start the audio
audioPlayPause = (x) => {
  x.classList.toggle("fa-pause");
  if (flag == false) {
    flag = true;
    audioElement.pause();
  } else {
    flag = false;
    audioElement.play();
  }
};

// setInterval is used to change color each canvasLines after 500 miliseconds if the play button is clicked
setInterval(() => {
  if (flag == false) {
    document.getElementById(count).style.backgroundColor = "pink";
    count++;
  }
}, 500);
