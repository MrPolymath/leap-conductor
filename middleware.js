/**
 * Created by nick-dev on 9/23/17.
 */
var server = require('http').createServer();
var io = require('socket.io')(server);
io.on('connection', function(client){
    client.on('melody', function(data){

    });
    client.on('beats', function(data){
        console.log(data)
    });
    client.on('disconnect', function(){});
});
server.listen(3000);