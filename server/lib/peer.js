
const {MediaStream} = require('wrtc');
const Connection= require('./connection');
const Stream= require('./streams');
const shortid = require('shortid');
const EventEmitter = require('events');
const Utils= require('./utils');
const {RTCIceCandidate,RTCSessionDescription} = require('wrtc');
class Peer extends EventEmitter{
    constructor(id,roomId,socket)
    {
        super();
        this.peerId = id;
        this.socket = socket;
        this.roomId = roomId;
        this.joined = false;
        this.onLobby = false;
        this.host = false;
        this.username = "";
        this.sdp = '';
        this.stream = new MediaStream();
        this.connections = {};
        this.channel = null;
        this.listStreams = [];
        this.DownloadConection = null;
        this.DownloadConections = [];
        this.MaxStream = 6;
        this.counter = 0;
        this.Utils = new Utils();
        this.currentIndex = 0;
        this.antrians = [];
    }
    pushAntrian(peer){
        this.antrians.push(peer);
    }
    getSignalingState(){
        return this.DownloadConection.signalingState;
    }
    changeName(newName){
        this.username = newName;
    }
    addStream(stream){
        this.stream.addTrack(stream,this.stream);
    }
    getStream(){
        return this.stream;
    }
    addConnection(id,connection){
        this.connections[id] = connection;
    }
    deleteConnection(id){
        delete this.connections[id];
    }
    setHost(host){
        this.host = host;
    }
    unsetHost(){
        this.host = false;
    }
    isHost(){
        return this.host;
    }
    remotedesc(payload){
            console.log("================================");
            console.log(payload);
            console.log("answers");
            console.log("================================");
            this.DownloadConections[payload.index].setRemoteDescription(new RTCSessionDescription(payload.sdp));
    }
    recrusiveForNewPeer(peers,total){
        if(total != 0){

                var id = shortid.generate();
                var stream = peers[total-1].getStream();
                this.listStreams.push(new Stream({id:id,dari:peers[total-1].dari,tujuan:this.peerId,stream:peers[total-1].getStream()}));

                if(this.DownloadConection == null){
                    this.DownloadConection = new Connection({
                        roomId:this.roomId,
                        tujuan:this.peerId,
                        dari:this.peerId
                    });
                    this.DownloadConections.push(this.DownloadConection);
                    this.counter == 0;
                    this.currentIndex += 1;
                }

                //if have new candidate
                this.DownloadConection.onicecandidate = function(event){
                    if(event.candidate){
                        this.channel.send(JSON.stringify({
                            type : 'CANDIDATE',
                            param : {
                                type : 'candidate',
                                label : event.candidate.sdpMLineIndex,
                                id : event.candidate.sdpMid,
                                candidate: event.candidate.candidate,
                                room : this.roomId,
                                tujuan : this.peerId,
                                dari : this.peerId,
                                index : this.currentIndex-1
                            }
                        }));
                    }
                }.bind(this);

                // added more track
                for (const track of stream.getTracks()) {
                    this.DownloadConection.addTrack(track, stream);
                }

                this.DownloadConection.createOffer()
                .then(sessionDescription=>{
                    sessionDescription.sdp = this.Utils.maybePreferCodec(sessionDescription.sdp,'audio','send','opus');
                    // sessionDescription.sdp = this.Utils.setMediaBitrates(sessionDescription.sdp);
                    this.DownloadConection.setLocalDescription(sessionDescription);
                    this.channel.send(JSON.stringify({
                        type : 'OFFER',
                        param : {
                            type : 'offer',
                            sdp  : sessionDescription,
                            room : this.roomId,
                            tujuan : this.peerId,
                            dari : this.peerId,
                            username : peers[total-1].username,
                            host : peers[total-1].host,
                            index : this.currentIndex-1
                        }
                    }));
                })
                .catch((err)=>{
                    console.log(err);
                    console.log(peers[total-1].username);
                });

                this.DownloadConection.onsignalingstatechange = function(event){
                    if(this.DownloadConection.signalingState == "stable"){
                        this.recrusiveForNewPeer(peers,total-1);
                    }
                }.bind(this);
        }
    }
}


module.exports = Peer;