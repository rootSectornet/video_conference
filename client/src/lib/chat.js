class Chat {
    constructor(id,message,to,from,time,senderName){
        this.id = id
        this.message = message
        this.to = to
        this.from = from
        this.time = time
        this.senderName = senderName
    }

    getID(){
        return this.id
    }

    getMessage(){
        return this.message
    }

    getTo(){
        return this.to
    }
    
    getFrom(){
        return this.from
    }

    getTime(){
        return this.time
    }

    getSenderName(){
        return this.senderName
    }

}


module.exports = Chat;