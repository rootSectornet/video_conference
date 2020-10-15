export const state = {
    errors : "",
    notifs : []
}

export const mutations = {
    addError(state,v){
        state.errors = v
    },
    addNotif(state,notif){
        state.notifs.push(notif)
    },
    removeNotif(state,notif){
        let i = state.lists.findIndex(e=>e == notif)
        state.lists.splice(i,1)
    }
}

export const getters = {
    getErrors(state){
        return state.errors
    },
    getNotifs(state){
        return state.notifs
    }
}


export const actions = {
}