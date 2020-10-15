<script>
import { Webrtc } from '@/lib/webrtc.js';
export default {
  data() {
    return {
      room: "123456789",
      username : "Guest",
      loading : false,
      i : 0,
    };
  },
    computed: {
        akses() {
            return this.$browserDetect.isChrome 
        },
        canversi(){
            return this.$browserDetect.meta.version >= 84;
        },
        browser(){
           return  this.$browserDetect.meta.name 
        },
        versi(){
            return this.$browserDetect.meta.version
        }
    },
  methods : {
      join(){
          if(this.i == 0){
            this.loading = true;
            Webrtc.join({room:this.room,username:this.username})   
          }
          this.i++
      }
  }
};
</script>

<template>
    <div>
        <div class="d-flex flex-column p-2 justify-content-center align-items-center">
            <h4 class="text-dark font-size-18">Room ID : {{room}}</h4>
            <p>Set your name for participation, and choose how you want to join:</p>
        </div>
        <div class="form p-2"  v-if="akses && canversi">
            <div class="form-group">
                <label class="control-label">Room ID : </label>
                <input type="text" class="form-control" :placeholder="room" v-model="room">
            </div>
            <div class="form-group">
                <label class="control-label">Your Name : </label>
                <input type="text" class="form-control" placeholder="guest" v-model="username">
            </div>
            <div class="form-group float-right">
                <button class="btn btn-success btn-lg" v-if="!loading" @click="join()">
                    <span v-if="!loading">Start</span> 
                    <span v-else>loading</span>
                </button>
            </div>
        </div>
        <div class="form p-2" v-else>
            <p>Please Use Chrome Latest Version </p>
            <p>Your Browser  : {{browser}}</p>
            <p>Version  : {{versi}}</p>
        </div>
    </div>
</template>
