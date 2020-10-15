<script>

import simplebar from "simplebar-vue";
import { Webrtc } from '@/lib/webrtc.js';
export default {
  components: {
    simplebar
  },
  data(){
    return {
      user : "localStorage.path",
      image : "utilsStorage.image",
      placeholders : 'Search ...',
    }
  },
  computed: {
    lists() {
        return this.$store.getters['participants/lists']
    },
    lobby() {
      return this.$store.getters['lobby/lists']
    },
    meID(){
      return this.$store.getters['me/getMyID']
    },
    host(){
      return this.$store.getters['me/getMyHost']
    }
  },
  methods: {
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    toggleMenu() {
      let element = document.getElementById("topnav-menu-content");
      element.classList.toggle("show");
    },
    aprove(id){
      Webrtc.aprove(id)
    },
    reject(id){
      Webrtc.reject(id)
    }
  }
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <router-link to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/dipmeeting.png" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/dipmeeting.png" alt height="17" />
            </span>
          </router-link>

          <router-link to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/dipmeeting.png" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/dipmeeting.png" alt height="19" />
            </span>
          </router-link>
        </div>






      </div>
      <div class="d-flex">

        <b-dropdown
          toggle-class="header-item noti-icon"
          right
          menu-class="dropdown-menu-lg p-0"
          variant="black"
          v-if="lobby.length > 0 && host"
        >
          <template v-slot:button-content>
            <i class="bx bx-bell bx-tada"></i>
            <span class="badge badge-danger badge-pill">{{lobby.length}}</span>
          </template>

          <div class="p-3">
            <div class="row align-items-center">
              <div class="col">
                <h6 class="m-0">Lobby</h6>
              </div>
            </div>
          </div>
          <simplebar data-simplebar style="max-height: 230px;">
            <div class="text-reset notification-item" v-for="user in lobby" :key="user.id">
              <div class="media">
                <div class="avatar-xs mr-3">
                  <span class="avatar-title bg-white rounded-circle font-size-16">
                    <i class="bx bx-happy-alt text-dark"></i>
                  </span>
                </div>
                <div class="media-body">
                  <h6 class="mt-0 mb-1">{{user.username}}</h6>
                  <div class="font-size-12 text-muted">
                    <p class="mb-0">
                      <button @click="aprove(user.id)" class="btn btn-xs btn-success">Aprove</button>
                      <button @click="reject(user.id)" class="btn btn-xs btn-success">Reject</button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </simplebar>
          <div class="p-2 border-top">
            <a class="btn btn-sm btn-light btn-block text-center" href="javascript:void(0)">
              <i class="mdi mdi-arrow-down-circle mr-1"></i> Aprrove All
            </a>
          </div>
        </b-dropdown>
          <b-button variant="outline-dark" v-b-toggle.sidebar-backdrop>
            <span class="text-white">Participants</span> <b-badge variant="light">{{lists.length}}</b-badge>
          </b-button>
      </div>
    </div>
  </header>
</template>