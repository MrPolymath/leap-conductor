var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var keypress = require('keypress');

app.listen(80);

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);


io.on('connection', function (socket) {
  // listen for the "keypress" event
  process.stdin.on('keypress', function (ch, key) {
    // Allow use of ctr+c to quit the program
    if (key && key.ctrl && key.name == 'c') {
      process.stdin.pause();
      process.exit()
    } else {
      console.log('pressed ', ch);
      // Send info through the socket
      socket.emit('update_sound', [
        {
          instrument: '',
          note: '40',
          volume: '127',
          channel: '0'
        }
      ]);

      // socket.on('my other event', function (data) {
      //   console.log(data);
      // });
    }
  });
});

process.stdin.setRawMode(true);
process.stdin.resume();

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
