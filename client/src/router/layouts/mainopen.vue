<script>

import router from "@/router";
export default {
    props: {
        title: {
            type: String,
            default: "Word Office"
        }
    },
  components: {
  },
  methods: {
      back(){
          router.go(-1)
      }
  }
};
</script>

<template>
  <header id="page-topbar">
      <div class="d-flex justify-content-between align-items-center head-open-apps">
          <div class="flex-start">
            <router-link tag="a" to="/storage">
              <span class="font-size-40 green-color">
                  <i class="dripicons-arrow-thin-left"></i>
              </span>
            </router-link>
          </div>
          <div class="flex-center green-color mx-4" style="overflow:hidden;">
              <h2 class="green-color">{{title}}</h2>
          </div>
          <div class="flex-end">
            <router-link tag="a" to="/storage" class="logo">
                <span class="logo-lg">
                <img src="@/assets/images/logo-light.png" alt height="19" />
                </span>
            </router-link>
          </div>
      </div>
  </header>
</template>