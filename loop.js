// THE LOGIC STARTS HERE
var startTime = Date.now();
// notes = [
//   {
//     instrument: 'piano',
//     note: '47',
//     volume: value from 0 to 127,
//     channel: each new note in a new channel?
//   },
//   ...
// ]

var notes = [];

// TEMPOS (intentionally have 100 diferent divisions)
const minTempo = 60; // BPM
const maxTempo = 160; // BPM
const loopLength = 8; // How many units is there in a loop
var currentUnit = 0;

// The Beats Per Minute come from the leap
// We can calculate it by interpolating a value between 0 and 100 between minTempo and maxTempo
// var bpm = (leapBpm/100)*(maxTempo-minTempo)+minTempo;
var bpm = 160;

var durationOfTempo = (60*1000)/bpm;  // (60sec*1000ms)/BPM
var durationOfLoop = durationOfTempo*loopLength;

setInterval(function(){
  if (currentUnit != 0) {
    console.log(currentUnit+1);
  } else {
    console.log(currentUnit+1);
  }
  currentUnit = currentUnit == loopLength-1 ? 0 : currentUnit+1;
}, durationOfTempo);
