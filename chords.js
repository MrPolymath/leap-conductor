var config = require('./config.js');

var volume = 127;
var instrument = config.instrument;

var chordToNotes = function (chord) {
    return chords[chord];
};

if (instrument==null)
{
  instrument = 'acoustic_grand_piano';
}

var chords = {
  'Cs' : [{
      'instrument': instrument,
      'note': 49,
      'volume': volume
    },
    {
      'instrument': instrument,
      'note': 52,
      'volume': volume
    },
    {
      'instrument': instrument,
      'note': 44,
      'volume': volume
  }],
  'B' : [{
      'instrument': instrument,
      'note': 51,
      'volume': volume
    },
    {
      'instrument': instrument,
      'note': 54,
      'volume': volume
    },
    {
      'instrument': instrument,
      'note': 59,
      'volume': volume
  }],
  'E' : [{
      'instrument': instrument,
      'note': 52,
      'volume': volume
    },
    {
      'instrument': instrument,
      'note': 56,
      'volume': volume
    },
    {
      'instrument': instrument,
      'note': 59,
      'volume': volume
  }],
  'A' : [{
      'instrument': instrument,
      'note': 52,
      'volume': volume
    },
    {
      'instrument': instrument,
      'note': 57,
      'volume': volume
    },
    {
      'instrument': instrument,
      'note': 61,
      'volume': volume
  }]
};


module.exports.chordToNotes = chordToNotes;
