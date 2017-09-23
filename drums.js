var app = require('http').createServer(handler).listen(80)
var io = require('socket.io')(app);
var fs = require('fs');

// THE LOGIC STARTS HERE
var Leap = require('leapjs');
var startTime = Date.now();
var bpm = 100;
var tiltSwitch = false;
var musicInputNow = [{instrument:'acoustic_grand_piano',note:'59',volume:'127'},{instrument:'acoustic_grand_piano',note:'79',volume:'120'}]
const eightUnitSound = {instrument:'acoustic_grand_piano',note:'61',volume:'90'}
const unitSound = {instrument:'acoustic_grand_piano',note:'44',volume:'90'}
var newElements = []
var oldElements = []
var newProve = true
var oldProve = true
// TEMPOS (intentionally have 100 diferent divisions)
const minTempo = 60; // BPM
const maxTempo = 160; // BPM
const loopLength = 8*4; // How many units is there in a loop
notes = new Array(loopLength+1);
notes.fill([1])
var currentUnit = 0;
var finalbpm = 60;

var active = null;

// Socket code starts HERE
io.on('connection', function (socket) {

  var previousFrame = null;
  var controller = Leap.loop(function (frame) {
      if (frame.hands.length > 0) {
          active = true;
          var hand = frame.hands[0];
          var position = hand.palmPosition;
          var velocity = hand.palmVelocity;
          var direction = hand.direction;
          var normalizedHeight = Math.round((getHandHeight(position)));

          bpm = 60 + normalizedHeight;

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

  function getHandHeight(palmPosition){

      height = (palmPosition[1]/400)*100;
      if (height >100){
          height=100;
      }
      else if (height<11){
          height=0;
      }
      return height;
  }

  function isPalmPull(currentFrame, previousFrame){
      translationVector = currentFrame.translation(previousFrame);
      return(translationVector[2] > 10);
  }

  function processUnit(){
    currentUnit = currentUnit == loopLength ? 1 : currentUnit+1;
    return currentUnit-1
  }



  (function repeat() {
    var beatPosition = processUnit();
    if (active== false) {
        activebpm = finalbpm;
    }
    else
    {
        activebpm = bpm;
    }
    console.log(beatPosition);
    newElements = []
    oldElements =[]

    if(beatPosition === 0){
      newElements.push(eightUnitSound)
      oldElements.push(unitSound)
    }else if(beatPosition === 4 || beatPosition===8 || beatPosition === 12 || beatPosition === 16 || beatPosition === 20 || beatPosition === 24 || beatPosition === 28){
      newElements.push(unitSound)
      oldElements.push(eightUnitSound)
    }
    console.log(oldElements, newElements);
    io.emit('remove_notes', oldElements)
    io.emit('add_notes', newElements)
    musicInputNow = [{instrument:'acoustic_grand_piano',note:'69',volume:'127'},{instrument:'acoustic_grand_piano',note:'87',volume:'120'}]
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
