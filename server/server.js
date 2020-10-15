const express = require('express');
const app = express()
// const http = require('http').createServer(app);
const Room = require('./lib/rooms');
const Lobby = require('./lib/lobby');
const config = require('./config/config.json')
const Peer = require('./lib/peer');
const fs = require('fs');
const key = fs.readFileSync('./key.pem');
const cert = fs.readFileSync('./cert.pem');
const https = require('https');
var serverPort = 443;
const process = require('process');
const { AwaitQueue } = require('awaitqueue');
const server = https.createServer({key: key, cert: cert }, app);

//create socket protocol
const io = require('socket.io')(server,{
    pingInterval: 25000,
    pingTimeout: 6000000,
    upgradeTimeout: 3000000,
    allowUpgrades: true
});


const queue = new AwaitQueue();

const rooms = new Map();
const peers = new Map();


app.use(express.static("public"));


io.on('connection',socket => {
    console.log("Query: ", socket.handshake.query);
    let query = socket.handshake.query
    if(query.room){
        socket.join(query.room)
        queue.push(()=>{
            let room = rooms.get(query.room);
            if(!room){
                room = new Room({roomId:query.room,lobby:new Lobby(query.room)})
                rooms.set(query.room,room)
            }
            let peer = peers.get(socket.id);
            if(!peer){
                peer = new Peer(socket.id,query.room,socket)
                peers.set(socket.id,peer)
            }
            room.handlePeer(peer)
        })
    }
})


// http.listen(process.env.PORT || 6000, () => console.log('server is running on port 8013'));
process.on('warning', (warning) => {
    console.warn(warning.name);    // Print the warning name
    console.warn(warning.message); // Print the warning message
    console.warn(warning.stack);   // Print the stack trace
  });
server.listen(serverPort, () => { 
    console.log('listening on 443') 
});
