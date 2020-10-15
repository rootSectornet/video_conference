<script>

import JoinForm from "@/components/widgets/join";
import tokenForm from "@/components/widgets/tokenForm";
export default {
  page: {
    title: "Join Meeting Video",
  },
  components: {
    JoinForm,
    tokenForm
  },
  data() {
    return {
      title: "Home",
      mode : ""
    };
  },
  computed: {
    onlobby() {
      return this.$store.getters['lobby/iamOnLobby']
    },
  },
};
</script>

<template>
  <div>
    <div class="account-pages my-5 pt-5">
      <div class="container">
        <div class="row justify-content-center align-items-center">
          <div class="col-md-6 col-lg-6 col-xl-6">
            <div class="card overflow-hidden">
              <div class="d-flex justify-content-center p-4 bg-black  align-items-center">
                  <img src="@/assets/images/dipmeeting.png"  alt class="center" />
              </div>
              <div class="card-body pt-4">
                <JoinForm ref="joinForm" v-if="!onlobby"/>
                <tokenForm ref="tokenForm" v-else/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
