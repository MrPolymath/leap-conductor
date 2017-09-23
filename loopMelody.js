var app = require('http').createServer(handler).listen(80)
var io = require('socket.io')(app);
var fs = require('fs');
var melody = require('./melody.js')

//Config Variables
const notesList = ['E','A','B'];


// THE LOGIC STARTS HERE
var Leap = require('leapjs');
var startTime = Date.now();
var noteArray = [];
var bpm = 60;
var tiltSwitch = false;
var notes = [];

// TEMPOS (intentionally have 100 diferent divisions)
const minTempo = 60; // BPM
const maxTempo = 160; // BPM
const loopLength = 8*4; // How many units is there in a loop
var currentUnit = 0;
var finalbpm = 0;
previousNote = null;
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
        noteArray = melody.melodyToNotes(heightToNote(normalizedHeight));
        bpm = 60 + normalizedHeight;
        // console.log(normalizedHeight);
        // console.log(bpm);
        //If the user is making a fist stop playing music
        // if (getFist(frame) == 1) {
        //     if (typeof timer !== 'undefined' && timer !== null) {
        //         clearTimeout(timer)
        //     }
        // }
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

controller.connect();


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
    return tilt;
}

function isPalmPull(currentFrame, previousFrame){
    translationVector = currentFrame.translation(previousFrame);
    // console.log(translationVector[2]);
    // console.log(translationVector[2] > 10);
    return(translationVector[2] > 10);
}

function heightToNote(height){
    var char;
    if (height>=0 && height<30){
        char = notesList[0]
    }
    else if (height>=36 && height<63){
        char = notesList[1]
    }
    else if (height>=69 && height<100){
        char = notesList[2]
    }
    return char;
}

io.on('connection', function (socket) {
  function processUnit(){
    if (currentUnit != 0) {
    } else {
    }
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
    if ((previousNote != noteArray) && (noteArray != null)) {
      if (previousNote) {
        socket.emit('remove_notes', previousNote)
      }
      socket.emit('add_notes', noteArray);
      previousNote = noteArray;
    }
  })();
});

function handler (req, res) {
  fs.readFile(__dirname + 'Melody.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
