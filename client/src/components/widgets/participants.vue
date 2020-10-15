<template>
  <div>

    <b-sidebar
      id="sidebar-backdrop"
      title="Paticipants"
      :lazy="true"
      backdrop-variant="dark"
      backdrop
      shadow
    >
      <div class="px-3 py-2">
          <b-list-group>
            <b-list-group-item class="d-flex justify-content-between align-items-center" v-for="list in lists" :key="list.id">
              <span>{{meID === list.id ? "You" : list.username}} <b v-if="list.host"><i>(Host)</i></b></span>
              <b-dropdown size="sm" right toggle-class="text-decoration-none" no-caret v-if="meID !== list.id & meHost">
                  <template v-slot:button-content>
                    <i class="fas fa-cogs bx-tada"></i>
                    <span class="badge badge-danger badge-pill"></span>
                  </template>
                  <b-dropdown-item-button  @click="SetHost(list.id)"><i class="bx bx-info-circle text-primary pr-2"></i> Set as HOST</b-dropdown-item-button>
                  <b-dropdown-divider ></b-dropdown-divider>
                  <b-dropdown-item-button  @click="muteMic(list.id)"><i class="bx bx-info-circle text-primary pr-2"></i> {{list.audio ? 'Mute Mic' : 'UnMute Mic'}}</b-dropdown-item-button>
                  <b-dropdown-divider ></b-dropdown-divider>
                  <b-dropdown-item-button  @click="muteVideo(list.id)"><i class="bx bx-copy text-primary pr-2"></i> {{list.video ? 'Mute Video' : 'UnMute Video'}}</b-dropdown-item-button>
              </b-dropdown>
            </b-list-group-item>
          </b-list-group>
      </div>
    </b-sidebar>
  </div>
</template>

<script>

import { Webrtc } from '@/lib/webrtc.js';
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
        meID(){
          return this.$store.getters['me/getMyID']
        },
        meHost(){
          return this.$store.getters['me/getMyHost']
        }
    },
    methods: {
      muteMic(id){
        Webrtc.hostMute(id,'audio','host');
      },
      muteVideo(id){
        Webrtc.hostMute(id,'video','host');
      },
      SetHost(id){
        Webrtc.setHost(id);
      }
    }
  }
</script>