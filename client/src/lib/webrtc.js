const io = require('socket.io-client');
import router from '@/router/index'
import store from '@/state/store'
const Peer = require('./peer');
const Utils= require('./utils')

const iceConfiguration = {
    iceServers: [
        {
            /**
             * 'turn:myIp:3478?transport=udp', ( not public ip )
             * 'turn:myIp:3478?transport=tcp' ( not public ip )
             */
            urls: ["turn:turn.desktopip.com:3478?transport=udp","turn:turn.desktopip.com:3478?transport=tcp"],
            username: "dexip",
            credential: "p@55w0rd"
        }
    ]
}

export const Webrtc = {
    room : "",
    socketId : "",
    host : false,
    util : new Utils(),
    constraint : {
        audio: true,
        video: {
          width       : { ideal: 320 },
          frameRate	: 10,
          aspectRatio : 1.334
        }
    },
    urlSocket : 'https://192.168.60.77',
    socket : null,
    participants : {},
    DataChannel : null,
    localStream : null,
    localShareStream : null,
    localConectionViewer : null,
    maxStream : 6,
    counter : 0,
    localConectionViewers : [],
    curentIndex : 0,

    /* eslint-disable no-unused-vars */
    createVideo(id,stream,username,host){
        let peer = new Peer({
            id:id,
            name:username,
            host : host,
            stream:stream
        })

        // let container = document.getElementById('app')
        // let vidremote = document.createElement('video')
        // vidremote.setAttribute('id',id)
        // vidremote.srcObject = stream
        // vidremote.autoplay = true
        // container.appendChild(vidremote)
        console.log(peer)
        console.log("peer pwpwpwp")
        store.commit('participants/addParticipants',peer)
    },

    /* eslint-disable no-unused-vars */
    hasUserMedia(){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        return !!navigator.getUserMedia;
    },
    /* eslint-disable no-unused-vars */
    join({room,username}){
        this.room = room
        store.commit('me/setMyUsername',username);
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        navigator.mediaDevices.getUserMedia(this.constraint)
        .then((stream)=>{
            this.localStream = stream
            this.socket = io({ query: `room=${room}` });

            this.socket.on('connect', () => {
                this.socket.emit('JOINROOM', {roomId : room,username:username});
            });

            this.socket.on('READYONLOBBY',param=>{
                store.commit('lobby/iamToLobby')
            })

            this.socket.on('APPROVED',param=>{
                store.commit('error/addNotif',param)
            })

            this.socket.on('HAVEONLOBBY',param=>{
                console.log("asas")
                store.commit('lobby/addToLobby',param)
            })

            this.socket.on('GEDE',param=>{
                console.log(param)
            })

            this.socket.on('REJECTED',param=>{
                store.commit('error/addNotif',param)
            })
            

            this.socket.on('disconnect', (reason) => {
                // window.location.href = '/'
            });


            this.socket.on('HOSTCHANGED',(param) => {
                store.commit('participants/changeHost',param.id)
                var id = store.getters['me/getMyID'];
                // if(param.id === id){
                    store.commit('me/setMyHost',param.id);
                // }
            });

            this.socket.on('ROOMREADY',param=>{
                router.push('/room')
                this.createVideo(this.socketId,stream,username,this.host);
                var peer = this.ConnectionUpload(stream,username)
                this.participants[this.socketId] = peer;
            });
            this.socket.on('MyID',param=>{
                this.socketId = param;
                store.commit('me/setMyID',param);
            })
            this.socket.on('ANSWER',param=>{
                let sd = this.participants[param.tujuan].remoteDescription
                if(sd){
                    console.log("rd already")
                }else{
                    this.participants[param.tujuan].setRemoteDescription(new RTCSessionDescription(param.sdp));
                }
            })

            // this.socket.on('CONTACTS',payload=>{
            //     console.log(payload)
            // })


            this.socket.on('OFFER',param=>{
                console.log("offer")
                console.log(param)
                if(param.dari != this.socketId){
                    let peer = this.ConnectionDownload(
                        param.dari,
                        param.tujuan,
                        param.sdp,
                        param.username,
                        param.host
                    )
                    this.participants[param.dari] = peer
                }
            })

            this.socket.on('LOBBY',param=>{
                console.log("lobby")
            })

            this.socket.on('CANDIDATE',payload=>{
                var candidate = new RTCIceCandidate({
                    sdpMid : payload.id,
                    sdpMLineIndex: payload.label,
                    candidate: payload.candidate
                });
                this.participants[payload.dari].addIceCandidate(candidate).catch(e => {
                  console.log("Failure during addIceCandidate(): " + e.name);
                });
            })
            this.socket.on('dc',param=>{
                delete this.participants[param]
                // alert(param+"leave")
                if(param != store.getters['me/getMyID']){
                    store.commit('participants/deleteParticipants',param)
                    store.commit('lobby/deleteonLobby',param)
                }
            })


            this.socket.on('ADAMUTED',param=>{
                if(this.socketId == param.peerId){
                    this.MymuteUnmute({peerId:param.peerId,type:param.type,end:true})
                }else{
                    this.changeState({peerId:param.peerId,type:param.type})
                }
            })


            // event on get chat from server
            this.socket.on("HAVECHAT",payload=>{
                console.log(payload)
                store.commit('chats/addChat',payload.chat)
            })

            
        })
        .catch((err)=>{
            console.log(store.commit('error/addError',err))
        })
    },
    /* eslint-disable no-unused-vars */
    ConnectionUpload(stream,username){
        const peerConnection = new RTCPeerConnection(iceConfiguration)

        this.connectionDataChannel(peerConnection)



        peerConnection.onicecandidate = function(event){
            if(event.candidate){
                this.socket.emit('CANDIDATE',{
                    type: 'candidate',
                    label: event.candidate.sdpMLineIndex,
                    id: event.candidate.sdpMid,
                    candidate: event.candidate.candidate,
                    room: this.room,
                    tujuan:this.socketId,
                    dari:this.socketId
                })
            }
        }.bind(this)
        
        peerConnection.onconnectionstatechange = (event)=>{
            switch(peerConnection.connectionState){
              case "disconnected":
                peerConnection.restartIce();
                // store.commit('participants/deleteParticipants',this.socketId)
                // document.querySelector('#containerVideo').removeChild(document.getElementById(this.socketId))
                break;
                case "connected":
                    console.log(peerConnection.getReceivers())
                break;
                case "failed":
                    // window.location.href = '/'
                break;
            }
        }
        // peerConnection.ontrack = function(event){
            
        // };
        for (const track of stream.getTracks()) {
            peerConnection.addTrack(track, stream);
        }
        peerConnection.createOffer()
            .then(offer => {
                offer.sdp = this.util.maybePreferCodec(offer.sdp, 'audio', 'send', 'opus');
                offer.sdp = this.util.setUsernameOnSdp(offer.sdp,'tedi');
                peerConnection.setLocalDescription(offer);
                this.socket.emit('OFFER', {
                    type: 'offer',
                    sdp: offer,
                    room: this.room,
                    tujuan:this.socketId,
                    dari:this.socketId,
                });
            })
            .catch(error => {
                console.log(error)
        })


        return peerConnection;
    },
    ConnectionDownload(from,to,sdp,username,host,index=0,dataChannel){
        console.log("datachanel");
        console.log(dataChannel);
        
        if(this.localConectionViewer == null){
            this.localConectionViewer = new RTCPeerConnection(iceConfiguration)
            this.localConectionViewers.push(this.localConectionViewer);
            this.counter = 0;
            this.curentIndex +=1;
        }
        this.counter += 0;
        console.log("this.localConectionViewers")
        console.log(this.localConectionViewers)
        console.log("this.localConectionViewers")
        this.localConectionViewers[this.curentIndex-1].onicecandidate = function(event){
            if(event.candidate){
                dataChannel.send(JSON.stringify({
                    type    : 'CANDIDATE',
                    param   :   {
                            type: 'candidate',
                            label: event.candidate.sdpMLineIndex,
                            id: event.candidate.sdpMid,
                            candidate: event.candidate.candidate,
                            room: this.room,
                            tujuan:from,
                            dari:to,
                            index:index
                        }
                }))
            }
        }.bind(this)
        
        this.localConectionViewers[this.curentIndex-1].onconnectionstatechange = (event)=>{
            switch(this.localConectionViewers[this.curentIndex-1].connectionState){
              case "disconnected":
                    // store.commit('participants/deleteParticipants',from)
                break;
                case "connected":
                    console.log(this.localConectionViewers[this.curentIndex-1].getReceivers())
                break;
                case "failed":
                    // alert('dc peerconection stream '+username)
                    delete this.participants[from]
                    // alert(param+"leave")
                    if(from != store.getters['me/getMyID']){
                        store.commit('participants/deleteParticipants',from)
                        store.commit('lobby/deleteonLobby',from)
                    }
                break;
            }
        }
        
        // this.createVideo(dari,new MediaStream(peerConnection.getReceivers().map(receiver => { console.log(receiver); return receiver.track })))
        let remoteStream = new MediaStream();
        var i= 0;
        this.localConectionViewers[this.curentIndex-1].ontrack = function({transceiver}) {

            remoteStream.addTrack(transceiver.receiver.track,remoteStream)
            i++
            if(i%2==0){
                console.log(remoteStream)
                console.log("remoteStream")
                console.log(transceiver.receiver.track)
                console.log("transceiver.receiver.track")
                this.createVideo(from,remoteStream,username,host);
                remoteStream = new MediaStream();
            }
        }.bind(this)

        console.log("ksini gk?")
        this.localConectionViewers[this.curentIndex-1].setRemoteDescription(new RTCSessionDescription(sdp));
        this.localConectionViewers[this.curentIndex-1].createAnswer()
            .then(sessionDescription => {
                sessionDescription.sdp = this.util.maybePreferCodec(sessionDescription.sdp, 'audio', 'send', 'opus');
                // sessionDescription.sdp = this.util.setMediaBitrates(sessionDescription.sdp);
                this.localConectionViewers[this.curentIndex-1].setLocalDescription(sessionDescription);
                dataChannel.send(JSON.stringify({
                    type    : 'ANSWER',
                    param   : {
                        type: 'answer',
                        sdp: sessionDescription,
                        room: this.room,
                        tujuan:from,
                        dari:to,
                        ff:"lollol",
                        index:index
                    }
                }))
                console.log(sessionDescription)
            })
            .catch(error => {
                console.log(error)
        })
        return this.localConectionViewers[this.curentIndex-1];
    },
    iamHost(){
        store.commit('lobby/iamOutFromLobby')
        
        this.socket.emit('IAMHOST',{peerId:this.socketId,room:this.room})
        store.commit('me/setMyHost',this.socketId);
        this.host = true;
        store.commit('participants/changeHost',this.socketId)
    },
    aprove(peerId){
        store.commit('lobby/deleteonLobby',peerId)
        // if(this.DataChannel){
        //     this.DataChannel.send(JSON.stringify({
        //         type : 'APPROVEJOIN',
        //         param : {peerId:peerId,room:this.room}
        //     }))
        // }
        this.socket.emit('APPROVEJOIN',{peerId:peerId,room:this.room})
    },
    reject(peerId){
        store.commit('lobby/deleteonLobby',peerId)
        this.socket.emit('REJECTJOIN',{peerId:peerId,room:this.room})
    },
     /* eslint-disable no-unused-vars */
    MymuteUnmute({peerId,type,end = false}){
        var id = store.getters['me/getMyID'];
        var myStat = type == "audio" ?   store.getters['me/getMyAudio']  :  store.getters['me/getMyVideo'];
        if(peerId == id){
            store.commit(type == 'audio' ? 'me/setMyAudio' : 'me/setMyVideo',!myStat)
        }

        var lists = store.getters['participants/lists'];
        let i = lists.findIndex(e=>e.id == peerId)
        var stream = lists[i].stream
        var tracks =  type == 'audio' ? stream.getAudioTracks() : stream.getVideoTracks();
        // if MediaStream has reference to microphone
        if (tracks[0]) {
            tracks[0].enabled = !myStat;
            store.commit('participants/mute',{type:type,peerId:peerId})
        }

        if(!end){
            this.socket.emit("MUTEACTION",{
                peerId : peerId,
                type : type,
                room : this.room
            })
        }
    },
    changeState({peerId,type}){
        store.commit('participants/mute',{type:type,peerId:peerId})
    },
    hostMute(peerId,type,host){
        this.socket.emit("MUTEACTION",{
            peerId : peerId,
            type : type,
            room : this.room
        })
        store.commit('participants/mute',{type:type,peerId:peerId})
    },
    connectionDataChannel(connection){
        const dataChannel = connection.createDataChannel('DIPMEETING',{id:1});
        this.DataChannel = dataChannel;
        var onMessage = function ({ data }) {
            this.handleDataChannel(data,dataChannel)
            if (data === 'ping') {
              dataChannel.send('pong');
            }
        }.bind(this);
        dataChannel.addEventListener('message', onMessage);
        const { close } = connection;
        connection.close = function() {
          dataChannel.removeEventListener('message', onMessage);
          return close.apply(this, arguments);
        };
    },
    handleDataChannel(data,dataChannel){
        data = JSON.parse(data);
        switch (data.type) {
            case 'OFFER':
                var param = data.param
                console.log(data.param)
                // if(param.dari != this.socketId){
                    var peer = this.ConnectionDownload(
                        param.dari,
                        param.tujuan,
                        param.sdp,
                        param.username,
                        param.host,
                        param.index,
                        dataChannel
                    )
                    this.participants[param.dari] = peer
                // }
                break;
            case 'CANDIDATE':
                    var payload = data.param
                    var candidate = new RTCIceCandidate({
                        sdpMid : payload.id,
                        sdpMLineIndex: payload.label,
                        candidate: payload.candidate
                    });
                    this.localConectionViewers[this.curentIndex-1].addIceCandidate(candidate).catch(e => {
                    console.log("Failure during addIceCandidate(): " + e.name);
                    });
                break;
            case 'ONLOBBY':
                param = data.param
                if(param){
                    param.forEach(item => {
                        store.commit('lobby/addToLobby',{id:item.peerId,username:item.username})
                    });
                }
                break;

            case 'CHAT':
                    console.log(data.param)
                    store.commit('chats /addChat',data.param) 
                break;
            default:
                break;
        }
    },
    chats(chat){
        console.log(chat)
        this.socket.emit("CHAT",{chat:chat})
    },
    // function for set some participant for host on room
    setHost(peerId){
        this.socket.emit('SETHOST',{peerId:peerId})
    },
    // function for share screen
    shareScreen(){
        var videoTrack = this.localStream.getVideoTracks()[0]

        // start open screen
        navigator.mediaDevices.getDisplayMedia({
            video: {
              aspectRatio : 1
            }
        })
        .then((stream)=>{
            this.localShareStream = stream
            var sender = this.participants[this.socketId].getSenders().find(function(s) {
                return s.track.kind == 'video';
            });
            console.log('found sender:', sender);
            sender.replaceTrack(stream.getVideoTracks()[0])
            // console.log(this.participants[this.socketId].getSenders())
            store.commit('participants/changeStream',{id:this.socketId,stream:stream})
        })
        .catch(err=>{console.log(err)})
    },
    // this function for leave from meeting room
    leave(){
        // window.location.href = '/'
    }
}
