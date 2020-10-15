export const state = {
    lists : [],
    iamOnLobby : false
}

export const mutations = {
    addToLobby(state,peer){
        state.lists.push(peer)
    },
    deleteonLobby(state,id){
        let i = state.lists.findIndex(e=>e.id == id)
        if(i>=0){
            state.lists.splice(i,1)
        }
    },
    iamToLobby(state){
        state.iamOnLobby = true
    },
    iamOutFromLobby(state){
        state.iamOnLobby = false
    }

}

export const getters = {
    lists(state) {
        return state.lists
    },
    iamOnLobby(state){
        return state.iamOnLobby
    }
}
