<script>
import Layout from "../layouts/main";
import Participants from "@/components/widgets/participants";
import Chats from "@/components/widgets/chats";
export default {
  page: {
    title: "Meeting Room",
  },
  components: {
    Layout,
    Participants,
    Chats
  },
  data() {
    return {
      title: "Home",
      mode : ""
    };
  },
  computed: {
    listVideo() {
      return this.$store.getters['participants/lists']
    },
  },
};
</script>

<template>
    <Layout>
        <div class="row mb-3">
          <div class="col-md-1 d-flex flex-row justify-content-center align-items-center">
            <i class="bx bx-caret-left font-size-24"></i>
          </div>
          <div class="col-md-10">
            <div class="row d-flex justify-content-around align-items-center">
              <div v-for="list in listVideo" :key="list.id" :id="list.id" class=" mt-2 d-flex flex-column  justify-content-center align-items-center video-gird">
                  <video thumbnail fluid class="video-tag" :id="list.id" :srcObject.prop="list.stream"  autoplay></video>
                  <div class="name-div">
                    <i>{{list.username}}</i>  
                  </div>
              </div>
            </div>
          </div>
          <div class=" col-md-1 d-flex flex-row justify-content-center align-items-center">
            <i class="bx bx-caret-right font-size-24"></i>
          </div>
        </div>
        <div class="row">
          <Participants ref="participants"/>
          <Chats ref="chats"/>
        </div>
    </Layout>
</template>
