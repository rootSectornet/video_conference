
const RTCPeerConnection = require('wrtc').RTCPeerConnection;
const {RTCIceCandidate,RTCSessionDescription} = require('wrtc');
const config = require('./../config/config.json');
const shortid = require('shortid');
const iceConfiguration = {
    iceServers: [
        {
            urls: "turn:turn.desktopip.com:3478",
            username: "dexip",
            credential: "p@55w0rd"
        }
    ]
}
class Connection extends RTCPeerConnection{
    constructor({
        roomId,tujuan,dari
    }){
        super(iceConfiguration);
        this.roomId = roomId;
        this.tujuan = tujuan;
        this.dari = dari;
        this.status = "connecting";
        this.sdpOffer = "";
        this.sdpAnswer = "";
    }
    getTujuan(){
        return this.tujuan;
    }
    getDari(){
        return this.dari;
    }
    getRoomId(){
        return this.roomId;
    }
    setOfferSdp(sdp){
        return this.sdpOffer = sdp;
    }
    setAnswerSdp(sdp){
        return this.sdpAnswer = sdp;
    }
    getVideosdpOnOffer(sdp){

    }
}

module.exports = Connection;