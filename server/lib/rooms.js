
const EventEmitter = require('events');
const WebrtcConnection= require('./webrtcconnection');
const {RTCIceCandidate,RTCSessionDescription} = require('wrtc');
const Connection= require('./connection');
const Utils= require('./utils');
const {beforeOffer}= require('./record');
const {MediaStream} = require('wrtc');
const { AwaitQueue } = require('awaitqueue');
const Peer = require('./peer');
const util = require('util');


const queue = new AwaitQueue();

//for recording

const { PassThrough } = require('stream');
const fs = require('fs');

const { RTCAudioSink, RTCVideoSink } = require('wrtc').nonstandard;

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const { StreamInput } = require('fluent-ffmpeg-multistream');

const VIDEO_OUTPUT_SIZE = '320x240'
const VIDEO_OUTPUT_FILE = './recording.mp4'

let UID = 0;

// end for recording




class Room extends EventEmitter{
    constructor({roomId,lobby}){
        super()
        this.lobby = lobby
        this.roomId = roomId
        this.peers = {}
        this.arrayPeers = []
        this.util = new Utils()
    }
    peerJoinLoby(peer){
        this.lobby.addToLobby(peer)
        this.arrayPeers.forEach((v)=>{
            if(this.peers[v].host){
                this.peers[v].socket.emit('HAVEONLOBBY',{id:peer.peerId,username:peer.username})
            }else{
                console.log("tidak ada host")
            }
        })

    }
    AproveFromLobby(peerId){
        this.lobby.aprovePeer(peerId)
        .then((peer)=>{
            console.log("aprove kah?")
            this.peerJoin(peer);
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    iamAHost(peerId){
        this.lobby.aprovePeer(peerId)
        .then((peer)=>{
            peer.setHost(true);
            this.arrayPeers.forEach((v)=>{
                if(v!=peerId){
                    if(this.peers[v]){
                        this.peers[v].setHost(false)
                    }else{
                        console.log("this.peers[v] not found on method iamAhost")
                    }
                }
                this.peers[v].socket.emit('HOSTCHANGED',{id:peerId})

            })

            
            this.peerJoin(peer);

        })
        .catch((err)=>{
            console.log(err)
        })


    }
    declineToRoom(peerId){
        this.lobby.declineToRoom(peerId)
    }
    peerJoin(peer){
        this.peers[peer.peerId] = peer
        this.arrayPeers.push(peer.peerId)
        peer.socket.join(this.roomId)
        peer.socket.emit('ROOMREADY',peer.peerId)
        if(peer.host){
            let key = Object.keys(this.lobby.peers)
            key.forEach(function(v){
                peer.socket.emit('HAVEONLOBBY',{id:this.lobby.peers[v].peerId,username:this.lobby.peers[v].username})
            }.bind(this))
        }
    }
    random(mn, mx) {  
        return Math.random() * (mx - mn) + mn;  
    }
    hostChanged(peerId){
        try{
            this.peers[peerId].host = true
            this.arrayPeers.forEach((v)=>{
                if(v!=peerId){
                    if(this.peers[v]){
                        this.peers[v].setHost(false)
                    }else{
                        console.log("this.peers[v] not found on method iamAhost")
                    }
                }
                this.peers[v].socket.emit('HOSTCHANGED',{id:peerId})
                
            })
        }catch(e){
            console.log(`Exception on Host Change`);
        }
    }
    peerLeave(id){
        // check if peer already on room or lobby
        if(this.peers[id]){
            let isHost = this.peers[id].host  //get status host from outgoing participants
            
            //delete participant from list on Object Room()
            delete this.peers[id]
            let index = this.arrayPeers.indexOf(id) 
            this.arrayPeers.splice(index,1)
            
            // cek if outgoing participants is host or not
            if(isHost){
                // set new host from random on list participants
                let NewHost = this.peers[this.arrayPeers[Math.floor(Math.random()*this.arrayPeers.length)]];
                if(NewHost){
                    NewHost.host = true
                    this.hostChanged(NewHost.peerId)
                }
            }
        }else{
            // remove participant on lobby
            this.lobby.declineToRoom(id)
        }
    }
    handleConection(payload){
        let connection = new Connection({
            roomId : this.roomId,
            tujuan : payload.tujuan,
            dari : payload.dari
        })

        var onMessage = function ({ data }) {
            this.handelDataChannelEvent(data,this.peers[payload.dari].channel);
            if (data === 'pong') {
                console.log('received pong');
            }
        }.bind(this)

        var onDataChannel = function ({ channel }) {
            if (channel.label !== 'DIPMEETING') {
                return;
            }
            this.peers[payload.dari].channel = channel;
            // a = true;
            try{
                this.peers[payload.dari].channel.send(JSON.stringify({
                    type : 'ONLOBBY',
                    param : []
                }))
            }catch(e){
                console.log(`Exception on DataChannel ${e}`);
            }

            this.peers[payload.dari].channel.addEventListener('message', onMessage);

            // ini untuk create dan get stream
                    var i = 0;
                    connection.getTransceivers().forEach(transceiver => {
                        this.peers[payload.dari].addStream(transceiver.receiver.track)
                        i++
                        if(i % 2 == 0){
                            // var interval = 1000; // 10 seconds;

                            // proses create array from object list participants
                            var pers = this.arrayPeers.map(function(item){
                                return this.peers[item];
                            }.bind(this));
                            
                            // proses filter if item is new participant
                            pers = pers.filter(p=>p.peerId!=payload.dari);

                            // proses loop each participants on list
                            this.arrayPeers.forEach((v,i)=>{

                                // checking if on list is new participant
                                if(payload.dari != v){
                                    // untuk yang ada di room
                                    this.peers[v].recrusiveForNewPeer([this.peers[payload.dari]],1);
                                    // setTimeout( function (i) {
                                    //     // untuk yang ada di room
                                    //     queue.push(()=>{
                                    //         if(this.peers[v]){
                                    //             this.peers[v].handleForDownload(
                                    //                 this.peers[payload.dari].getStream(),
                                    //                 payload.dari,
                                    //                 v,
                                    //                 this.peers[payload.dari].username,
                                    //                 this.peers[payload.dari].host
                                    //             );
                                    //         }
                                    //     })
                                    // }.bind(this), interval * i, i);
                                }else{

                                    // this broadcast stream from each participants for new participants
                                    this.peers[payload.dari].recrusiveForNewPeer(pers,pers.length);
                                }
                            })
                        }
                    });
            // end 

        }.bind(this)

        connection.addEventListener('datachannel', onDataChannel);

        const { close } = connection;

        connection.close = function() {
            if (this.peers[payload.dari].channel) {
                this.peers[payload.dari].channel.removeEventListener('message', onMessage);
            }else{
                console.log("this.peers[payload.dari].channel not found")
            }
            return close.apply(this, arguments);
        };

        connection.setRemoteDescription(new RTCSessionDescription(payload.sdp));

        connection.createAnswer()
        .then(answer => {
            connection.setLocalDescription(answer);
            // answer.sdp = this.util.setMediaBitrates(answer.sdp);
            answer.sdp = this.util.setUsernameOnSdp(answer.sdp,"server")
            this.peers[payload.dari].socket.emit("ANSWER",{
                roomId : this.roomId,
                dari : payload.dari,
                tujuan : payload.tujuan,
                type : 'answer',
                sdp : answer
            })
        })
        .catch(error => {
            console.log(error+"error pas create answer")
        })

        connection.onicecandidate = function(event){
            if (event.candidate) {
                this.peers[payload.dari].socket.emit('CANDIDATE',{
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                    room : this.roomId,
                    tujuan : payload.tujuan,
                    dari : payload.dari
                })
            }
        }.bind(this);
        
        this.peers[payload.dari].addConnection(payload.tujuan,connection)

        connection.onconnectionstatechange = function(event){
            switch(connection.connectionState){
              case "disconnected":
                  connection.restartIce();
                  if(this.peers[payload.dari]){
                    this.peers[payload.dari].deleteConnection(payload.tujuan)
                  }else{
                      console.log("this.peers[payload.dari] on switch case")
                  }
                break;
                case "connected":
                    if(connection.status != "connected"){
                        connection.status = "connected";

                    }
                break;
            }
        }.bind(this);
    }

    addCandidate(payload){
        try{
            var candidate = new RTCIceCandidate({
                sdpMid : payload.id,
                sdpMLineIndex: payload.label,
                candidate: payload.candidate
            }) 
            this.peers[payload.dari].connections[payload.tujuan].addIceCandidate(candidate).catch(e => {
                console.log("Failure during addIceCandidate(): " + e);
            });
        }catch(e){
            console.log(`exception on addIcecandidate Connection Upload stream ${e}`);
            
        }
    }
    addViewerCandidate(payload){
            var candidate = new RTCIceCandidate({
                sdpMid : payload.id,
                sdpMLineIndex: payload.label,
                candidate: payload.candidate
            })  
            this.peers[payload.dari].DownloadConections[payload.index].addIceCandidate(candidate).catch(e => {
                console.log("Failure during addIceCandidate(): " + e);
            });
    }
    


    handelDataChannelEvent(data,datachannel){
        data = JSON.parse(data);
        switch (data.type) {
            case 'ANSWER':
                this.peers[data.param.dari].remotedesc(data.param);
                break;
            case 'CANDIDATE':
                this.addViewerCandidate(data.param)
                break;
            case 'APPROVEJOIN':
                this.AproveFromLobby(data.param.peerId)
                datachannel.send(JSON.stringify({
                    type : 'APPROVED',
                    param : 'You Aproved By host'
                }))
                break;
            case 'CHAT' :
                this.handleChatEvent(data.param)
                break;
            default:
                break;
        }
    }


    handleChatEvent(param){
        if(param.to == "ALL"){
            this.arrayPeers.forEach((v,i)=>{
                console.log("kirim")
                if(v != param.from){
                    this.peers[v].channel.send(JSON.stringify({
                        type    : 'CHAT',
                        param   : param
                    }))
                    console.log("kirim beneran")
                }else{
                    console.log("Tidak kirim ke diri sendiri");
                }
            })
        }else{
            if(this.peers[param.to]){
                this.peers[param.to].channel.send(JSON.stringify({
                    type    : 'CHAT',
                    param   : param
                }))
            }else{
                console.log("gk peer di list!");
            }
        }
    }
    // handle peer yang baru conect ke socket
    handlePeer(peer){
        //define event socket per object peer

            // event peer join if after conected socket
            peer.socket.on("JOINROOM",payload=>{
                peer.socket.emit('MyID',peer.peerId)
                peer.username = payload.username
                this.peerJoinLoby(peer)
            // console.log(peer)
            console.log(":on join")
            })

            // event peer send if him is host
            peer.socket.on("IAMHOST",payload=>{
                this.iamAHost(payload.peerId)
            })

            // event if host aprove participants for join
            peer.socket.on("APPROVEJOIN",payload=>{
                this.AproveFromLobby(payload.peerId)
                peer.socket.emit('APPROVED',"Aproved by host")
            })

            // event peer get candidate from client
            peer.socket.on("CANDIDATE",payload=>{
                this.addCandidate(payload)
            })

            // event peer get offer from client
            peer.socket.on("OFFER",payload=>{
                // console.log(payload)
                // console.log("offer")
                this.handleConection(payload)
            })

            // event mute & unmute this peer or another peer
            peer.socket.on("MUTEACTION",payload=>{
                peer.socket.to(this.roomId).emit('ADAMUTED', payload);
            })

            // event on client / participants send chat
            peer.socket.on('CHAT',payload=>{    
                if(payload.chat.to == "ALL"){
                    this.arrayPeers.forEach((v,i)=>{
                        if(v != peer.peerId){
                            this.peers[v].socket.emit("HAVECHAT",payload)
                        }else{
                            console.log("Tidak kirim ke diri sendiri");
                        }
                    })
                }else{
                    if(this.peers[payload.chat.to]){
                        this.peers[payload.chat.to].socket.emit("HAVECHAT",payload)
                    }else{
                        console.log("gk peer di list!");
                    }
                }
            })

            // event when any participant set it to host
            peer.socket.on('SETHOST',payload=>{
                this.hostChanged(payload.peerId)
            })

            //event if peer diconnect from socket
            peer.socket.on("disconnect",(reason)=>{
                console.log(peer.username)
                console.log("Disconnect")
                console.log(reason)
                peer.socket.to(this.roomId).emit('dc', peer.peerId)
                this.peerLeave(peer.peerId)
                let i = this.lobby.peers.map((v)=>v.peerId == peer.peerId)
                if(i>=0){
                    if(this.lobby){
                        if(this.lobby.peers){
                            this.lobby.peers.splice(i,1)
                        }
                    }
                }
                peer.socket.disconnect(true);
            })
    }




    





}

module.exports = Room;