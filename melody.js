var config = require('./config.js');
var instrument = config.instrument;
var volume = 127;
if (instrument==null)
{
  instrument = 'acoustic_grand_piano';
}

var melody = {
  'E' :
    [{
      'instrument': instrument,
      'note': 64,
      'volume': volume
    }],
  'Gs' : [{
      'instrument': instrument,
      'note': 68,
      'volume': volume
    }],
  'B' : [{
      'instrument': instrument,
      'note': 71,
      'volume': volume
    }],
  'Cs' : [{
      'instrument': instrument,
      'note': 73,
      'volume': volume
    }]
}

var melodyToNotes = function (note) {
  return melody[note];
};

module.exports.melodyToNotes = melodyToNotes;
