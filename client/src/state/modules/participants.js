export const state = {
    lists : [],
}

export const mutations = {
    addParticipants(state,peer){
        state.lists.push(peer)
    },
    deleteParticipants(state,id){
        let i = state.lists.findIndex(e=>e.id == id)
        if(i>=0){
            state.lists.splice(i,1)
        }
    },
    changeHost(state,id){
        state.lists.forEach(list => {
            list.host = list.id == id
        });
    },
    mute(state,options){
        state.lists.forEach(list=>{
            if(options.peerId == list.id){
                if(options.type == 'audio'){
                    list.audio = !list.audio
                }else{
                    list.video = !list.video
                }
            }
        })
    },
    changeStream(state,{id,stream}){
        state.lists.forEach(list=>{
            if(list.id == id){
                list.stream = stream
            }
        })
    }

}

export const getters = {
    lists(state) {
        return state.lists
    }
}
