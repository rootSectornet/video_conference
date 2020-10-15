const {MediaStream} = require('wrtc');

class Stream extends MediaStream{
    constructor({id,dari,tujuan,stream}){
        super(stream);
        this.uid = id;
        this.dari = dari;
        this.tujuan = tujuan;
    }
    
}

module.exports = Stream;