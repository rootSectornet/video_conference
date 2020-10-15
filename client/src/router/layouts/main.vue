

<script>
import router from "@/router";
import { VueOfflineMixin } from 'vue-offline'
import NavBar from "@/components/horizontal-topbar";
import Footer from "@/components/footer";
import { vueTopprogress } from 'vue-top-progress'

export default {
  mixins: [VueOfflineMixin],
  components: { NavBar, Footer,vueTopprogress },
  data() {
    return {
      layerror : false
    };
  },
  created: () => {
    document.body.removeAttribute("data-topbar", "dark");
    document.body.removeAttribute("style", "dark");
    document.body.setAttribute("data-layout", "horizontal");
  },
  mounted () {
    this.$refs.topProgress.start()
    this.$on('offline',()=>{
        this.$toasted.clear()
          this.$toasted.error("You are Offline",{
              position : 'bottom-right',
          })
    })
    this.$on('online',()=>{
        this.$toasted.clear()
          this.$toasted.info("You are Online",{
              position : 'bottom-right',
          })
    })
    // Use setTimeout for demo
    setTimeout(() => {
      this.$refs.topProgress.done()
    }, 2000)
  },
  methods: {
    toggleMenu() {
      document.body.classList.toggle("sidebar-enable");

      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
          document.body.classList.remove("vertical-collpsed");
        });
        document.body.classList.toggle("vertical-collpsed");
      } else {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
        document.body.classList.remove("vertical-collpsed");
      }
      this.isMenuCondensed = !this.isMenuCondensed;
    },
    toggleRightSidebar() {
      document.body.classList.toggle("right-bar-enabled");
    },
    hideRightSidebar() {
      document.body.classList.remove("right-bar-enabled");
    }
  }
};
</script>

<template>
  <div id="layout-wrapper">    
    <vue-topprogress ref="topProgress" color="#89c301"></vue-topprogress>
    <NavBar ref="nav"/>
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="main-content">
      <div class="page-content">
        <!-- Start Content-->
          <slot />
      </div>
    </div>

      <Footer/>
  </div>
</template>
