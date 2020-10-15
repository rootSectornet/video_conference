
const Chat = require('@/lib/chat.js');
import { Webrtc } from '@/lib/webrtc.js';

export const state = {
    loading : false,
    chats : [],
    id : "",
    to : "ALL",
    from : "",
    message : "",
    time : "",
    senderName : "",
}

export const mutations = {
    addChat(state,chat){
        state.chats.push(chat)
    },
    removeChat(state,id){
        let i = state.chats.findIndex(e=>e.id == id)
        state.chats.splice(i,1)
    },
    setId(state,id){
        state.id = id
    },
    setTo(state,to){
        state.to = to
    },
    setFrom(state,from){
        state.from = from
    },
    setMessage(state,message){
        state.message = message
    },
    setTime(state,time){
        state.time = time
    },
    setSenderName(state,senderName){
        state.senderName = senderName
    },
    reset(state,empty){
        state.id = empty
        state.to = "ALL"
        state.from = empty
        state.message = empty
        state.time = empty
        state.senderName = empty
    }
}

export const getters = {
    getChats(state){
        return state.chats
    },
    getId(state){
        return state.id
    },
    getTo(state){
        return state.to
    },
    getFrom(state){
        return state.from
    },
    getMessage(state){
        return state.message
    },
    getTime(state){
        return state.time
    },
    getSenderName(state){
        return state.senderName
    }
}


export const actions = {
    sendChat(context){
        var today = new Date();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        context.commit('setTime', time);
        context.commit('setId', Math.floor(Math.random() * 10000) + 1000);
        let chat = new Chat(
            context.getters.getId,
            context.getters.getMessage,
            context.getters.getTo,
            context.getters.getFrom,
            context.getters.getTime,
            context.getters.getSenderName,
            );
        
        context.commit('addChat', chat);
        Webrtc.chats(chat)
        context.commit('reset', "");
    }
}