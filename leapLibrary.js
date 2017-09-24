function getFist(frame){
    return(frame.hands[0].grabStrength==1 && frame.hands[0].pinchStrength>0.8
    && frame.hands[0].thumb.extended  ==false && frame.hands[0].indexFinger.extended ==false && frame.hands[0].middleFinger.extended==false && frame.hands[0].ringFinger.extended == false && frame.hands[0].pinky.extended == false);
}

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

function isPalmPull(currentFrame, previousFrame){
    translationVector = currentFrame.translation(previousFrame);
    // console.log(translationVector[2]);
    // console.log(translationVector[2] > 10);
    return(translationVector[2] > 10);
}

function isPoint(frame){
    var hand = frame.hands[0];
    var thumb = hand.thumb;
    var indexFinger = hand.indexFinger;
    var middleFinger = hand.middleFinger;
    return(thumb.extended && indexFinger.extended && middleFinger.extended==false && hand.ringFinger.extended == false && hand.pinky.extended == false);
}

function isLeftHand(frame){
    return (frame.hands[0].type=='left');
}

module.exports.getFist = getFist;
module.exports.getHandHeight = getHandHeight;
module.exports.isPalmPull = isPalmPull;
module.exports.isPoint = isPoint;
module.exports.isLeftHand = isLeftHand();
