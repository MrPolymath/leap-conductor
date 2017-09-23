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
var finalbpm = 0;

// Socket code starts HERE
io.on('connection', function (socket) {

  var previousFrame = null;
  // var paused = false;
  //
  //Leap Code Starts here
  // Leap motion bpm was here


  //Leap Helper Functions



  function processUnit(){
    currentUnit = currentUnit == loopLength ? 1 : currentUnit+1;
    return currentUnit-1
  }



  (function repeat() {
    var beatPosition = processUnit();
    console.log(beatPosition);
    notes[beatPosition] = musicInputNow
    newElements = []
    oldElements =[]
    if(beatPosition === 0){
      console.log('first-one');
      console.log(notes);
      oldElements = oldElement(notes[loopLength-1], notes[beatPosition])
      newElements = newElement(notes[loopLength-1], notes[beatPosition])
    }
    else{
      console.log('second-one');
      oldElements = oldElement(notes[beatPosition-1], notes[beatPosition])
      newElements = newElement(notes[beatPosition-1], notes[beatPosition])
    }
    if(beatPosition === 0){
      newElements.push(eightUnitSound)
      oldElements.push(unitSound)
    }else if(beatPosition === 4 || beatPosition===8 || beatPosition === 12 || beatPosition === 16 || beatPosition === 20 || beatPosition === 24 || beatPosition === 28){
      newElements.push(unitSound)
      oldElements.push(eightUnitSound)
    }
    // bpm = finalbpm ? finalbpm : bpm;
    io.emit('remove_notes', oldElements)
    io.emit('add_notes', newElements)
    musicInputNow = [{instrument:'acoustic_grand_piano',note:'69',volume:'127'},{instrument:'acoustic_grand_piano',note:'87',volume:'120'}]
    timer = setTimeout(repeat, (60*1000)/(bpm*4));
  })();

});

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
  console.log(old, neww);
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
