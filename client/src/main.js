import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'
import VueRouter from 'vue-router'
import vco from "v-click-outside"
import router from './router/index'
import "@/design/index.scss";
import VueSweetalert2 from 'vue-sweetalert2';
import store from '@/state/store'
import VueResource from 'vue-resource';
import App from './App.vue'
import Toasted from 'vue-toasted';
import vClickOutside from 'v-click-outside'
import VueCookies from 'vue-cookies'
import device from "vue-device-detector"
import VueOffline from 'vue-offline'
import browserDetect from "vue-browser-detect-plugin";
Vue.use(browserDetect);
Vue.use(device)
Vue.use(VueCookies)
Vue.use(VueRouter)
Vue.use(vco)
Vue.use(VueOffline, {
  mixin: false
})
Vue.use(Toasted)
Vue.use(vClickOutside)
Vue.config.productionTip = false
Vue.use(VueResource)
Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(VueMask)
Vue.use(require('vue-chartist'))
Vue.use(VueSweetalert2);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
