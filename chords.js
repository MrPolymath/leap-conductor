var chords = {
  'Cs' : [49, 52, 56],
  'B' : [51, 54, 59],
  'E' : [52, 56, 59],
  'A' : [52, 57, 61]
}

var chordToNotes = function (chord) {
  return chords[chord];
};

module.exports.chordToNotes = chordToNotes;
