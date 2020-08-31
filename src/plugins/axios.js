import Vue from 'vue'

import axios from 'axios';
import { API_URL } from '../.env.js';

const Cookie = require('js-cookie')

axios.defaults.baseURL =  API_URL?`${API_URL}`:'http://localhost:8001';
axios.defaults.headers.common = {
   Authorization: Cookie.get('token')
  }
Vue.use(axios)
