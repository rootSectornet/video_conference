
<script>
// import simplebar from "simplebar-vue";

/**
 * Nav-bar Component
 */

import router from "@/router";
import { vueTopprogress } from 'vue-top-progress';
import Switches from "vue-switches";
import { helperRequest } from '@/state/modules/requesthandler.js';
import { utilsStorage } from '@/state/modules/utilsStorage.js';
import SearchBox from "@/components/widgets/search";
export default {
  data(){
    return {
      user : localStorage.path,
      small : false,
      image : utilsStorage.image,
      resolution : "",
      mode : "",
      placeholders : 'Search ...',
      query : "",
      showpicker : false,
      restmp : ""
    }
  },
  mounted(){
    this.mode = utilsStorage.getTc('MODE');
    this.small = localStorage.getItem('ISDARK') ? true : false;
    helperRequest.getProfile((res)=>{
        if(res.status == 0){
            utilsStorage.image = require(`@/assets/images/user.png`)
            this.image = require(`@/assets/images/user.png`)
        }else{
          utilsStorage.imageExists(utilsStorage.host + res.data.user_image,(exists)=>{
            utilsStorage.image = exists ? utilsStorage.host + res.data.user_image : require(`@/assets/images/user.png`)
            this.image = exists ? utilsStorage.host + res.data.user_image : require(`@/assets/images/user.png`)
          })
        }
    })
    helperRequest.getResolution((res)=>{
      if(res.data.apps_resolution){
        if(res.data.apps_resolution != ""){
          this.resolution = res.data.apps_resolution
        }
      }
      if(localStorage.getItem('RES')){
        this.resolution = localStorage.getItem('RES').replace(/"/gi, "")
      }
      if(localStorage.getItem('ISDARK')){
        document.body.setAttribute("data-sidebar", "dark");
      }
    })
    this.user = localStorage.getItem('path').replace(/"/gi, "")
  },
  watch: {
    small: function (val) {
      if(val){
        this.small = val;
        window.localStorage.setItem("ISDARK", 'ISDARK');
        document.body.setAttribute("data-sidebar", "dark");
      }else{
        this.small = val;
        window.localStorage.removeItem("ISDARK");
        document.body.removeAttribute("data-sidebar", "dark");
      }
    }
  },
  components: { vueTopprogress,Switches,SearchBox },
  methods: {
    toggleMenu() {
      this.$parent.toggleMenu();
    },
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    logout(){
      router.push('/logout')
    },
    saveResolution(){
      window.localStorage.setItem("RES", this.resolution)
      helperRequest.saveResolution(this.resolution,(res)=>{
          this.restmp = res
          this.$toasted.show("Saved",{
              position : 'bottom-right',
              duration : 2000
          })
      })
    },
    showDefault(b){
      if(!this.$device.mobile){
        this.$refs.widgetSearch.reset()
        this.showpicker = b
        if(this.query.length >= 3){
          this.$refs.widgetSearch.showrecent()
          this.$refs.widgetSearch.showPicker = true
        }else{
          this.placeholders =  b ? "Type min 3 character for search" : "Search ..."
          this.$refs.widgetSearch.defaultlist = true
          this.$refs.widgetSearch.showPicker = true
        }
      }else{
        this.$refs.widgetSearchMobile.reset()
        this.showpicker = b
        if(this.query.length >= 3){
          this.$refs.widgetSearchMobile.showrecent()
          this.$refs.widgetSearchMobile.showPicker = true
        }else{
          this.placeholders =  b ? "Type min 3 character for search" : "Search ..."
          this.$refs.widgetSearchMobile.defaultlist = true
          this.$refs.widgetSearchMobile.showPicker = true
        }
      }
    },
    procesSearching(){
      if(this.$device.mobile){
        if(this.query.length >= 3){
          this.$refs.widgetSearchMobile.query = this.query
          this.$refs.widgetSearchMobile.Seacrhing()
        }else{
          this.$refs.widgetSearchMobile.reset()
          this.$refs.widgetSearchMobile.defaultlist = true
        }
      }else{
        if(this.query.length >= 3){
          this.$refs.widgetSearch.query = this.query
          this.$refs.widgetSearch.Seacrhing()
        }else{
          this.$refs.widgetSearch.reset()
          this.$refs.widgetSearch.defaultlist = true
        }
      }
    },
    onClickOutside(){
      if(!this.showpicker){
        this.$refs.widgetSearch.reset()
        this.$refs.widgetSearch.defaultlist = false
        this.$refs.widgetSearch.showPicker = false
      }
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
          <router-link tag="a" to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/logo.png" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-dark.png" alt height="17" />
            </span>
          </router-link>

          <router-link tag="a" to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/logo.png" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-light.png" alt height="19" />
            </span>
          </router-link>
        </div>

        <button
          id="vertical-menu-btn"
          type="button"
          class="btn btn-sm px-3 font-size-16 header-item green-color"
          @click="toggleMenu"
        >
          <i class="fa fa-fw fa-bars"></i>
        </button>

        <!-- App Search-->
        <form class="app-search d-none d-lg-block" ref="input_search">
          <div class="position-relative">
            <input type="text" class="form-control" 
            :placeholder="placeholders" 
            v-model="query" 
            @focus="showDefault(true)" 
            @blur="showDefault(false)"
            @keyup="procesSearching()"/>
            <span class="bx bx-search-alt"></span>
          </div>
        </form>
      </div>
      <div class="d-flex">
        <b-dropdown
          class="d-inline-block d-lg-none ml-2"
          variant="black"
          menu-class="dropdown-menu-lg p-0"
          toggle-class="header-item noti-icon"
          right
        >
          <template v-slot:button-content>
            <i class="mdi mdi-magnify"></i>
          </template>

          <form class="p-3"  ref="input_search_mobile">
            <div class="form-group m-0">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control"
                  :placeholder="placeholders" 
                  v-model="query" 
                @focus="showDefault(true)" 
                @blur="showDefault(false)"
                @keyup="procesSearching()"
                  aria-label="Recipient's username"
                />
                <div class="input-group-append">
                  <button class="btn btn-primary" type="button" >
                    <i class="mdi mdi-magnify"></i>
                  </button>
                </div>
              </div>
            </div>
            <SearchBox ref="widgetSearchMobile"  v-click-outside="onClickOutside"/>
          </form>
        </b-dropdown>
       
       <b-dropdown
          menu-class="dropdown-menu-lg p-0"
          right
          toggle-class="header-item noti-icon"
          variant="black"
        >
          <template v-slot:button-content>
            <i class="bx bx-cog"></i>
          </template>

          <div class="px-lg-2 px-3 d-flex flex-column">
            <div class="row no-gutters py-2 d-flex flex-row justify-content-around">
              <div class="d-flex align-items-center justify-content-between" style="width: 100%">
                <span class="px-2 font-size-16 text-dark">Dark Mode  </span>
                <span class="px-2 font-size-14 "> <switches v-model="small"></switches> </span>
              </div>
            </div>
            <div class="row no-gutters py-2 d-flex flex-row justify-content-around" v-if="mode == 'apps'">
              <div class="d-flex align-items-center justify-content-between" style="width: 100%">
                <span class="px-2 font-size-16 text-dark">Desktop Resolutions </span>
                <span class="px-2">
                  <div class="form-group">
                    <select class="form-control" v-model="resolution" @change="saveResolution()">
                      <option value="">Fit to Screen</option>
                      <option value="1024x768">1024x768</option>
                      <option value="1280x960">1280x960</option>
                      <option value="1280x1024">1280x1024</option>
                      <option value="1366x768">1366x768</option>
                      <option value="1600x900">1600x900</option>
                    </select>
                  </div> 
                </span>
              </div>
            </div>
          </div>
        </b-dropdown>
        <div class="dropdown d-none d-lg-inline-block ml-1 noti-icon">
          <button type="button" class="btn header-item noti-icon" @click="initFullScreen">
            <i class="bx bx-fullscreen"></i>
          </button>
        </div>
        <b-dropdown right variant="black" toggle-class="header-item">
          <template v-slot:button-content>
            <img
              class="rounded-circle header-profile-user"
              :src="image"
              alt="Header Avatar"
            />
            <span class="d-none d-xl-inline-block ml-1">{{user}}</span>
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
          </template>
          <!-- item-->
          <a class="dropdown-item" href="/profile">
            <i class="bx bx-user font-size-16 align-middle mr-1"></i> Profile
          </a>
          <!-- <a class="dropdown-item" href="javascript: void(0);">
            <i class="bx bx-wallet font-size-16 align-middle mr-1"></i> My Wallet
          </a> -->
          <!-- <a class="dropdown-item d-block" href="javascript: void(0);">
            <i class="bx bx-wrench font-size-16 align-middle mr-1"></i> Settings
          </a>
          <a class="dropdown-item" href="javascript: void(0);">
            <i class="bx bx-lock-open font-size-16 align-middle mr-1"></i> Lock screen
          </a> -->
          <!-- <div class="dropdown-divider"></div> -->
          <a href="/logout" class="dropdown-item text-danger">
            <i class="bx bx-power-off font-size-16 align-middle mr-1 text-danger"></i> Logout
          </a>
        </b-dropdown>
      </div>
        <SearchBox ref="widgetSearch"  v-click-outside="onClickOutside"/>
    </div>
    <template>
      <vue-topprogress ref="topProgress" color="#89c301ca"></vue-topprogress>
    </template>
  </header>
</template>
