import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './mixin'
import './plugins/axios'
// import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons'

const Cookie = require('js-cookie')

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

library.add(fas)
Vue.component('font-awesome-icon', FontAwesomeIcon);


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
