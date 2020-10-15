<template>
  <div>

    <b-sidebar
      id="sidebar-chats"
      title="Chats"
      :lazy="true"
      backdrop-variant="dark"
      backdrop
      shadow
      right
    >
      <div class="px-3 py-2">
          <div class="participant-chat">
            <div class="form-group">
                <label class="control-label">Participants</label>
                <select class="form-control" v-model="To">
                    <option value="ALL" selected>ALL</option>
                    <option v-for="item in lists" :value="item.id" :key="item.id">{{item.username}}</option>
                </select>
            </div>
          </div>
          <div class="scroll-chat">
                <div class="chat-box right" v-for="chat in chats" :key="chat.id">
                    <h4 class="chat-name">{{chat.senderName}}</h4>
                    <p class="chat-message"> {{chat.message}}</p>
                    <p class="chat-time">
                        <i class="bx bx-time-five align-middle mr-1"></i> {{chat.time}}
                    </p>
                </div>
          </div>
          <div class="input-chats d-flex flex-row mr-2">
              <textarea rows="2" v-model="Message">chats here ...</textarea>
              <button variant="success" class="btn btn-success" @click="send()">Send</button>
          </div>
      </div>
    </b-sidebar>
  </div>
</template>

<script>

// import { Webrtc } from '@/lib/webrtc.js';
  export default {
    data() {
      return {
        variant: 'dark',
        variants: [
          'transparent',
          'white',
          'light',
          'dark',
          'primary',
          'secondary',
          'success',
          'danger',
          'warning',
          'info',
        ]
      }
    },
    computed: {
        lists() {
            return this.$store.getters['participants/lists']
        },
        chats(){
            return this.$store.getters['chats/getChats']
        },
        meId(){
            return this.$store.getters['me/getMyID']
        },
        meUsername(){
            return this.$store.getters['me/getMyUsername']
        },
        To:{
          get(){
            return this.$store.getters['chats/getTo']
          },
          set(value){
            this.$store.commit('chats/setTo', value)
          }
        },
        Message:{
          get(){
            return this.$store.getters['chats/getMessage']
          },
          set(value){
            this.$store.commit('chats/setMessage', value)
          }
        }
    },
    methods: {
      send(){
          this.$store.commit('chats/setFrom', this.meId)
          this.$store.commit('chats/setSenderName', this.meUsername)
          this.$store.dispatch('chats/sendChat')
      }
    }
  }
</script>