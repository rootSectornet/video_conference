<template>
  <footer class="footer" style="position:fixed;height:70px">
    <div class="container-fluid" v-show="!mobile">
      <div class="row">
        <div class="col-md-2">
          <div class="d-flex justify-content-center align-items-center">
              <i @click="MuteAudio()" v-show="!audio" class="fas fa-microphone-slash icon-menu mb-1 px-4 font-size-18 text-black"></i>
              <i @click="MuteAudio()" v-show="audio" class="fas fa-microphone icon-menu mb-1 px-4 font-size-18 text-black"></i>
              <i @click="MuteVideo()" v-show="video" class="fas fa-video icon-menu mb-1  px-4 font-size-18 text-black"></i>
              <i @click="MuteVideo()" v-show="!video" class="fas fa-video-slash icon-menu mb-1  px-4 font-size-18 text-black"></i>
          </div>
        </div>
        <div class="col-md-8">
          <div class="row icon-demo-content">
            <div class="col-md-3">
              <i v-b-toggle.sidebar-backdrop class="fas fa-users mb-1 text-black icon-menu"></i>
              <span class="text-black">Participants</span>
            </div>
            <div class="col-md-3">
              <i v-b-toggle.sidebar-chats class="fas fa-comments mb-1 text-black icon-menu"></i>
              <span class="text-black">Chat</span>
            </div>
            <div class="col-md-3">
              <i @click="startShareScreen()" class="fas fa-desktop mb-1 text-black icon-menu"></i>
              <span class="text-black">Share Screen</span>
            </div>
            <div class="col-md-3">
              <i v-b-toggle.sidebar-backdrop class="fas fa-compact-disc mb-1 text-black icon-menu"></i>
              <span class="text-black">Record</span>
            </div>
          </div>
        </div>
        <div class="col-md-2">
          <div class="d-flex justify-content-end align-items-center">
            <b-button variant="danger" @click="leave()">Leave</b-button>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid" v-show="mobile">
      <div class="row d-flex justify-content-between align-items-center">
        <div class="d-flex justify-content-center align-items-center">
            <i @click="MuteAudio()" v-show="!audio" class="fas fa-microphone-slash icon-menu mb-1 px-4 font-size-18 text-black"></i>
            <i @click="MuteAudio()" v-show="audio" class="fas fa-microphone icon-menu mb-1 px-4 font-size-18 text-black"></i>
            <i @click="MuteVideo()" v-show="video" class="fas fa-video icon-menu mb-1  px-4 font-size-18 text-black"></i>
            <i @click="MuteVideo()" v-show="!video" class="fas fa-video-slash icon-menu mb-1  px-4 font-size-18 text-black"></i>
        </div>
        <div class="d-flex justify-content-end align-items-center">
          <b-button variant="danger" @click="leave()">Leave</b-button>
        </div>
      </div>
    </div>
  </footer>
  <!-- end footer -->
</template>

<script>

import { Webrtc } from '@/lib/webrtc.js';
export default {
  data(){
    return {
      mute : false
    }
  },
  methods : {
    MuteAudio(){
      this.$store.dispatch('me/muteAudio')
    },
    MuteVideo(){
      this.$store.dispatch('me/muteVideo')
    },
    startShareScreen(){
      Webrtc.shareScreen()
    },
    leave(){
      this.$swal({
        title : "Are You Sure ?",
        text : "you want leave from this room?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Leave!'
      }).then((r)=>{
        if(r.isConfirmed){
          Webrtc.leave();
        }
      })
    }
  },
  computed: {
    audio() {
      return this.$store.getters['me/getMyAudio']
    },
    video() {
      return this.$store.getters['me/getMyVideo']
    },
    mobile(){
      return this.$device.mobile;
    }
  },
}
</script>