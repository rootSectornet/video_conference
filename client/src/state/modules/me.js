
import { Webrtc } from '@/lib/webrtc.js';
export const state = {
    id : "",
    host : false,
    username : "",
    stream : "",
    audio : true,
    video : true
}

export const mutations = {
    setMyID(state,v){
        state.id = v
    },
    setMyHost(state,v){
        state.host = state.id == v
    },
    setMyUsername(state,v){
        state.username = v
    },
    setMyAudio(state,v){
        state.audio = v
    },
    setMyVideo(state,v){
        state.video = v
    }
}

export const getters = {
    getMyID(state){
        return state.id
    },
    getMyHost(state){
        return state.host
    },
    getMyUsername(state){
        return state.username
    },
    getMyAudio(state){
        return state.audio
    },
    getMyVideo(state){
        return state.video
    }
}


export const actions = {
    muteAudio(context){
        let peerId = context.getters.getMyID
        Webrtc.MymuteUnmute({peerId:peerId,type:'audio'})
    },
    muteVideo(context){
        let peerId = context.getters.getMyID
        Webrtc.MymuteUnmute({peerId:peerId,type:'video'})
    }
}