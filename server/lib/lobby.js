
const EventEmitter = require('events')
class Lobby extends EventEmitter{
    constructor({
        room
    }){
        super()
        this.peers = []
        this.room = room
    }

    addToLobby(peer){
        this.peers.push(peer)
        peer.socket.emit("READYONLOBBY",peer.peerId)
    }

    approveToRoom(peerId){
        let i = this.peers.findIndex(e=>e.peerId == peerId)
        // this.emit('TOROOM',this.peers[i])
        this.peers.splice(i,1)

    }
    aprovePeer(peerId){
        return new Promise((resolve,reject)=>{
            let i = this.peers.findIndex(e=>e.peerId == peerId)
            console.log(i)
            console.log(peerId)
            if(i>=0){
                resolve(this.peers[i])
                this.peers.splice(i,1)
            }else{
                reject("peerId not found!")
            }
        })
    }
    declineToRoom(peerId){
        let i = this.peers.findIndex(e=>e.peerId == peerId)
        this.peers.splice(i,1)
    }


}

module.exports = Lobby;