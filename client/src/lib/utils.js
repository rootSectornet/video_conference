class Utils {
    constructor(){
    
    }

    /* eslint-disable no-unused-vars */
    maybePreferCodec(sdp, type, dir, codec) {

        /* eslint-disable no-unused-vars */
        const str = `${type} ${dir} codec`;
        if (codec === '') {
            return sdp;
        }

        const sdpLines = sdp.split('\r\n');

        // Search for m line.
        const mLineIndex = this.findLine(sdpLines, 'm=', type);
        if (mLineIndex === null) {
            return sdp;
        }

        // If the codec is available, set it as the default in m line.
        const codecIndex = this.findLine(sdpLines, 'a=rtpmap', codec);

        var payload = 0;
        if (codecIndex) {
            payload = this.getCodecPayloadType(sdpLines[codecIndex]);
            if (payload) {
                sdpLines[mLineIndex] = this.setDefaultCodec(sdpLines[mLineIndex], payload);
            }
        }


        var line1 = sdpLines.slice(0, (codecIndex+1));
        var line2 = sdpLines.slice((codecIndex+3), (sdpLines.length));

        // var line3 = line2.splice(1,1,"a=fmtp:101 maxplaybackrate=16000; sprop-maxcapturerate=16000;maxaveragebitrate=20000; stereo=1; useinbandfec=1; usedtx=0");

        // console.log(line3);


        var extra = [];
        extra.push("a=fmtp:"+payload+" maxplaybackrate=16000; sprop-maxcapturerate=16000;maxaveragebitrate=8000; stereo=1; sprop-stereo=1; useinbandfec=1; usedtx=0");
        // extra.push("maxaveragebitrate=20000; stereo=1; useinbandfec=1; usedtx=0");
        extra.push("a=ptime:20");
        extra.push("a=maxptime:20");

        // var line3 = [];
        // line3.push("a=framerate:1");
        // line3.push("a=quality:1");


        var custom = [...line1, ...extra, ...line2];

        // sdp = sdpLines.join('\r\n');
        sdp = custom.join('\r\n');

        return sdp;
    }

    findLine(sdpLines, prefix, substr) {
        return this.findLineInRange(sdpLines, 0, -1, prefix, substr);
    }

    // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
    // and, if specified, contains |substr| (case-insensitive search).
    findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
        const realEndLine = endLine !== -1 ? endLine : sdpLines.length;
        for (let i = startLine; i < realEndLine; ++i) {
            if (sdpLines[i].indexOf(prefix) === 0) {
                if (!substr ||
                    sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
                    return i;
                }
            }
        }
        return null;
    }

    getCodecPayloadType(sdpLine) {
        const pattern = new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');
        const result = sdpLine.match(pattern);
        var rs = (result && result.length === 2) ? result[1] : null;
        return rs;
    }

    // Returns a new m= line with the specified codec as the first one.
    setDefaultCodec(mLine, payload) {

        const elements = mLine.split(' ');

        // Just copy the first three parameters; codec order starts on fourth.
        const newLine = elements.slice(0, 3);

        // Put target payload first and copy in the rest.
        newLine.push(payload);
        for (let i = 3; i < elements.length; i++) {
            if (elements[i] !== payload) {
                newLine.push(elements[i]);
            }
        }
        return newLine.join(' ');
    }



    setMediaBitrates(sdp) {
        return this.setMediaBitrate(this.setMediaBitrate(sdp, "video", 60), "audio", 50);
    }
       
    setMediaBitrate(sdp, media, bitrate) {
        var lines = sdp.split("\n");
        var line = -1;
        for (var i = 0; i < lines.length; i++) {
          if (lines[i].indexOf("m="+media) === 0) {
            line = i;
            break;
          }
        }
        if (line === -1) {
          console.debug("Could not find the m line for", media);
          return sdp;
        }
        console.debug("Found the m line for", media, "at line", line);
       
        // Pass the m line
        line++;
       
        // Skip i and c lines
        while(lines[line].indexOf("i=") === 0 || lines[line].indexOf("c=") === 0) {
          line++;
        }
       
        // If we're on a b line, replace it
        if (lines[line].indexOf("b") === 0 ){
          console.debug("Replaced b line at line", line);
          lines[line] = "b=AS:"+bitrate;
          return lines.join("\n");
        }
        
        // Add a new b line
        console.debug("Adding new b line before line", line);
        var newLines = lines.slice(0, line)
        newLines.push("b=AS:"+bitrate)
        newLines = newLines.concat(lines.slice(line, lines.length))
        return newLines.join("\n");
    }

    setUsernameOnSdp(sdp,username){
        var sdpLines = sdp.split('\r\n');
        var newSdpLines = sdpLines;
        var originIndex = -1;
        var origin = "";
        sdpLines.forEach((item,index)=>{
            if(item.includes('o=')){
                originIndex = index;
                origin = item;
                var originArr = item.split(" ");
                var originNameArr = originArr[0].split("=");
                originNameArr[originNameArr.length-1] = username;
                originArr[0] = originNameArr.join("=");
                origin = originArr.join(" ");
                newSdpLines.splice(index,1,origin);
            }
        });
        return newSdpLines.join("\n");
    }

    setVideoBitrate(sdp){
        var sdpLines = sdp.split('\r\n');
        var indexOfSendrecv = -1;
        var indexVideo = [];
        sdpLines.forEach((item,i)=>{
            if(item.includes("m=video")){
                indexVideo.push(i);
                sdpLines.splice(i+5,0,"b=AS:100");
            }
        });
        return sdpLines.join("\n");
    }

    /* eslint-disable no-unused-vars */

}



module.exports = Utils;