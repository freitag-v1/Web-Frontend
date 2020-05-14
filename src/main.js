import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import { BootstrapVue, BootstrapVueIcons} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueSession from 'vue-session'
import VueCookies from 'vue-cookies'
import store from './store/login_module'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';


Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VueSession)
Vue.use(VueCookies);
Vue.config.productionTip = false
Vue.prototype.$Axios = axios;
Vue.component('vue-phone-number-input', VuePhoneNumberInput);

 // for all requests
new Vue({
  router,
  store,
  render: function (h) { return h(App) },
}).$mount('#app')