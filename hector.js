var app = require('http').createServer(handler).listen(80)
var io = require('socket.io')(app);
var fs = require('fs');

// THE LOGIC STARTS HERE
var Leap = require('leapjs');
var startTime = Date.now();

var bpm = 60;
var tiltSwitch = false;
var musicInputNow = [{instrument:'acoustic_grand_piano',note:'59',volume:'127'},{instrument:'acoustic_grand_piano',note:'79',volume:'120'}]
const eightUnitSound = {instrument:'acoustic_grand_piano',note:'22',volume:'90'}
const unitSound = {instrument:'acoustic_grand_piano',note:'30',volume:'90'}
var newElements = []
var oldElements = []
var newProve = true
var oldProve = true
// TEMPOS (intentionally have 100 diferent divisions)
const minTempo = 60; // BPM
const maxTempo = 160; // BPM
const loopLength = 8*4; // How many units is there in a loop
notes = new Array(loopLength);
var currentUnit = 0;
var finalbpm = 0;

// Socket code starts HERE
io.on('connection', function (socket) {

});

var previousFrame = null;
// var paused = false;
//
//Leap Code Starts here
//
var controller = Leap.loop(function (frame) {
    if (frame.hands.length > 0) {
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
            if (typeof intervalTimeout !== 'undefined' && intervalTimeout !== null) {
                clearInterval(intervalTimeout)
            }
        }
        //If your hand is tilted to the right
        // if (getHandTilt(frame) < -0.5) {
        if (isPalmPull(frame,previousFrame)) {
            tiltSwitch = true;
            tiltHeight = normalizedHeight;
        }
        if (tiltSwitch) {
            if (typeof intervalTimeout !== 'undefined' && intervalTimeout !== null) {
                clearInterval(intervalTimeout)
            }
            finalbpm = 60 + normalizedHeight;
            tiltSwitch = false;
        }
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

function processUnit(){
  currentUnit = currentUnit + 1
  currentUnit = currentUnit == loopLength-1 ? 0 : currentUnit+1;
  return currentUnit-1
}

function newElement(old, neww){
  console.log(old, neww);
  var result = [];
  neww.forEach(function (a) {
    old.forEach(function(b,i){
      console.log(JSON.stringify(a))
      console.log(JSON.stringify(b));
      if(JSON.stringify(a) === JSON.stringify(b)){ newProve = false}
      if(i == old.length-1){
        if(newProve === true){
          console.log('Sha de comencar un nou to');
          result.push(a)}
        else{newProve = true; console.log('No sinicialitza');}
      }
    })
  });
  return result
}
function oldElement(old, neww){
  var result = []
  old.forEach(function (a) {
    neww.forEach(function(b,i){
      console.log(JSON.stringify(a))
      console.log(JSON.stringify(b));
      if(JSON.stringify(a) === JSON.stringify(b)){ oldProve = false}
      if(i == neww.length-1){
        if(oldProve === true){
          console.log('Sha de tancar el to');
          result.push(a)}
        else{oldProve = true; console.log('No sha de tancar');}
      }
  });
})
return result
}

(function repeat() {
  var beatPosition = processUnit();
  notes[beatPosition] = musicInputNow
  if(beatPosition === 0){
    oldElements = oldElement(notes[beatPosition-1], notes[loopLength-1])
    newElements = newElement(notes[beatPosition-1], notes[loopLength-1])
  }
  else{
    oldElements = oldElement(notes[beatPosition-1], notes[beatPosition])
    newElements = newElement(notes[beatPosition-1], notes[beatPosition])
  }
  if(beatPosition === 0 || beatPosition  === 7 || beatPosition === 15 || beatPosition ===23 || beatPosition === 31){
    newElements.push(eightUnitSound)
    oldElements.push(unitSound)
  }else{
    newElements.push(unitSound)
    oldElements.push(eightUnitSound)
  }
  bpm = finalbpm ? finalbpm : bpm;
  io.emit('remove_notes', oldElements)
  io.emit('add_notes', newElements)

  timer = setTimeout(repeat, (60*1000)/(bpm*4));
})();

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
