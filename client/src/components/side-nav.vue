<script>
import MetisMenu from "metismenujs/dist/metismenujs";
import { utilsStorage } from '@/state/modules/utilsStorage.js';
export default {
  data(){
    return {
      mode : "apps"
    }
  },
  components: {},
  mounted: function() {
    this.mode = utilsStorage.getTc('MODE')
    // eslint-disable-next-line no-unused-vars
    var menuRef = new MetisMenu("#side-menu");
    var links = document.getElementsByClassName("side-nav-link-ref");
    var matchingMenuItem = null;
    for (var i = 0; i < links.length; i++) {
      if (window.location.pathname === links[i].pathname) {
        matchingMenuItem = links[i];
        break;
      }
    }

    if (matchingMenuItem) {
      matchingMenuItem.classList.add("active");
      var parent = matchingMenuItem.parentElement;

      /**
       * TODO: This is hard coded way of expading/activating parent menu dropdown and working till level 3.
       * We should come up with non hard coded approach
       */
      if (parent) {
        parent.classList.add("mm-active");
        const parent2 = parent.parentElement.closest("ul");
        if (parent2 && parent2.id !== "side-menu") {
          parent2.classList.add("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.add("mm-active");
            var childAnchor = parent3.querySelector(".has-arrow");
            var childDropdown = parent3.querySelector(".has-dropdown");
            if (childAnchor) childAnchor.classList.add("mm-active");
            if (childDropdown) childDropdown.classList.add("mm-active");

            const parent4 = parent3.parentElement;
            if (parent4) parent4.classList.add("mm-show");
            const parent5 = parent4.parentElement;
            if (parent5) parent5.classList.add("mm-active");
          }
        }
      }
    }
  },
  methods: {
    lightSidebar() {
      document.body.setAttribute("data-topbar", "dark");
      document.body.removeAttribute("data-sidebar");
      document.body.removeAttribute("data-layout-size", "boxed");
      document.body.removeAttribute("data-sidebar-size", "small");
      document.body.classList.remove("vertical-collpsed");
    },
    compactSidebar() {
      document.body.setAttribute("data-sidebar-size", "small");
      document.body.setAttribute("data-sidebar", "dark");
      document.body.removeAttribute("data-layout-size", "boxed");
      document.body.classList.remove("vertical-collpsed");
      document.body.removeAttribute("data-topbar", "dark");
    },
    iconSidebar() {
      document.body.setAttribute("data-keep-enlarged", "true");
      document.body.classList.add("vertical-collpsed");
      document.body.setAttribute("data-sidebar", "dark");
      document.body.removeAttribute("data-topbar", "dark");
      document.body.removeAttribute("data-layout-size", "boxed");
    },
    boxedLayout() {
      document.body.setAttribute("data-keep-enlarged", "true");
      document.body.classList.add("vertical-collpsed");
      document.body.setAttribute("data-layout-size", "boxed");
      document.body.removeAttribute("data-sidebar", "colored");
      document.body.setAttribute("data-sidebar", "dark");
      document.body.removeAttribute("data-topbar", "dark");
    },
    coloredSidebar() {
      document.body.setAttribute("data-sidebar", "colored");
      document.body.removeAttribute("data-layout-size", "boxed");
      document.body.removeAttribute("data-sidebar-size", "small");
      document.body.classList.remove("vertical-collpsed");
    }
  },
    beforeCreate: function() {
        document.body.removeAttribute("style");
    },
};
</script>

<template>
  <!-- ========== Left Sidebar Start ========== -->

  <!--- Sidemenu -->
  <div id="sidebar-menu">
    <!-- Left Menu Start -->
    <ul id="side-menu" class="metismenu list-unstyled">

      <li>
        <router-link tag="a" to="/" class="side-nav-link-ref">
          <i class="bx bx-home-circle"></i>
          <span>Home</span>
        </router-link>
      </li>


      <li v-if="mode != 'storage'">
        <router-link tag="a" to="/apps" class="side-nav-link-ref">
          <i class="bx bx-layout"></i>
          <span>Apps</span>
        </router-link>
      </li>

      <li v-if="mode != 'storage'">
        <router-link tag="a" to="/explorer" class="side-nav-link-ref">
          <i class="bx bx-folder"></i>
          <span>Storage</span>
        </router-link>
      </li>
      <li>
        <router-link tag="a" to="/shares" class="side-nav-link-ref">
          <i class="bx bxs-share-alt"></i>
          <span>Share</span>
        </router-link>
      </li>
      <li>
        <router-link tag="a" to="/meeting" class="side-nav-link-ref">
          <i class="bx bx-video"></i>
          <span>Meeting</span>
        </router-link>
      </li>

    </ul>
  </div>
  <!-- Sidebar -->
</template>
