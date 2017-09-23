var app = require('http').createServer(handler).listen(80)
var io = require('socket.io')(app);
var fs = require('fs');

// THE LOGIC STARTS HERE
var Leap = require('leapjs');
var startTime = Date.now();

var bpm = 60;
var tiltSwitch = false;
var notes = [];

// TEMPOS (intentionally have 100 diferent divisions)
const minTempo = 60; // BPM
const maxTempo = 160; // BPM
const loopLength = 8*4; // How many units is there in a loop
var currentUnit = 0;
var finalbpm = 0;

var previousFrame = null;
var active = null;
var timer = null;
// var paused = false;
//
//Leap Code Starts here
//
var controller = Leap.loop(function (frame) {
    if (frame.hands.length > 0) {
        active = true;
        var hand = frame.hands[0];
        var position = hand.palmPosition;
        var velocity = hand.palmVelocity;
        var direction = hand.direction;
        var normalizedHeight = Math.round((getHandHeight(position)));
        bpm = 60 + normalizedHeight;
        // console.log(normalizedHeight);
        // console.log(bpm);
        //If the user is making a fist stop playing music
        if (getFist(frame) == 1) {
            if (typeof timer !== 'undefined' && timer !== null) {
                clearTimeout(timer)
            }
        }
        //If your hand is tilted to the right
        // if (getHandTilt(frame) < -0.5) {
        if (isPalmPull(frame,previousFrame)) {
            tiltSwitch = true;
        }
        if (tiltSwitch) {
            finalbpm = 60 + normalizedHeight;
            tiltSwitch = false;
        }
    }
    else{
        active = false;
    }
    previousFrame = frame;
});

//Leap Helper Functions

function getHandHeight(palmPosition){
    //Range is 100-450
    // console.log(palmPosition);
    height = (palmPosition[1]/400)*100;
    if (height >100){
        height=100;
    }
    else if (height<11){
        height=0;
    }
    return height;
}

function getFist(frame){
    return(frame.hands[0].grabStrength);
}

function getHandTilt(frame){
    //>0.5 is right and <0.5 is left
    // console.log(frame.hands[0].arm.basis[0]);
    tilt = frame.hands[0].arm.basis[0][2];
    // console.log(tilt);
    return tilt;
}

function isPalmPull(currentFrame, previousFrame){
    translationVector = currentFrame.translation(previousFrame);
    // console.log(translationVector[2]);
    // console.log(translationVector[2] > 10);
    return(translationVector[2] > 10);
}

controller.connect();

io.on('connection', function (socket) {
  function processUnit(){
    if (currentUnit != 0) {
        console.log(currentUnit+1);
    } else {
        console.log(currentUnit+1);
    }
    socket.emit('send_tempo', currentUnit);
    currentUnit = currentUnit == loopLength-1 ? 0 : currentUnit+1;
  }
  (function repeat() {
    processUnit();
      if (active== false) {
          activebpm = finalbpm;
      }
      else
      {
          activebpm = bpm;
      }
    timer = setTimeout(repeat, (60*1000)/(activebpm*4));
  })();
});

function handler (req, res) {
  fs.readFile(__dirname + 'Basic.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
