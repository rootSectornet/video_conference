class Peer {
    constructor({id,name,host,stream}){
        this.id = id;
        this.host = host;
        this.username = name;
        this.stream = stream;
        this.audio = true;
        this.video = true;
    }

    toggleAudio(){
        this.audio = !this.audio;
    }

    toggleVideo(){
        this.video = !this.video;
    }

    getStream(){
        return this.stream
    }

    getUsername(){
        return this.username
    }

    getId(){
        return this.id
    }

    isHost(){
        this.host
    }

    changeUsername(username){
        this.username = username
    }

    changeHost(host){
        this.host = host
    }


}


module.exports = Peer;