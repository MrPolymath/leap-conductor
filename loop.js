// THE LOGIC STARTS HERE
var Leap = require('leapjs');
var startTime = Date.now();

var bpm = 60;
var tiltSwitch = false;

//
//Leap Code Starts here
//
var controller = Leap.loop(function(frame){
    if(frame.hands.length > 0)
    {
        var hand = frame.hands[0];
        var position = hand.palmPosition;
        var velocity = hand.palmVelocity;
        var direction = hand.direction;
        var normalizedHeight = (getHandHeight(position));
        console.log(normalizedHeight);
        //If the user is making a fist stop playing music
        if (getFist(frame)==1){
            if (typeof intervalTimeout !== 'undefined' && intervalTimeout !== null){
                clearInterval(intervalTimeout)
            }
        }
        //If your hand is tilted to the right
        if (getHandTilt(frame)<-0.5){
            tiltSwitch=true;
            tiltHeight = normalizedHeight;
        }
        else{
            if (getHandTilt > 0.3)
            {
                console.log(normalizedHeight);
            }
            if (tiltSwitch)
            {
                if (typeof intervalTimeout !== 'undefined' && intervalTimeout !== null){
                    clearInterval(intervalTimeout)
                }
                bpm = 60+normalizedHeight;
                intervalTimeout = restartInterval();
                tiltSwitch=false;
            }
        }
    }
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
    tilt = frame.hands[0].arm.basis[0][1];
    // console.log(tilt);
    return tilt;
}

controller.connect();

function restartInterval(){
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
    // var bpm = 160;

        var durationOfTempo = (60*1000)/bpm;  // (60sec*1000ms)/BPM
        var durationOfLoop = durationOfTempo*loopLength;

        intervalTimeout = setInterval(function(){
            if (currentUnit != 0) {
                console.log(currentUnit+1);
            } else {
                console.log(currentUnit+1);
            }
            currentUnit = currentUnit == loopLength-1 ? 0 : currentUnit+1;
        }, durationOfTempo);
        return intervalTimeout;
}
