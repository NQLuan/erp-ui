import Vue from 'vue';
import Vuex from 'vuex';
import user from './Modules/user';

const cookieparser = require('cookieparser');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    countNoti: 0,
  },
  mutations: {
    setToken(state, token) {
      state.token = token;
    },
    add(state) {
      state.countNoti += 1;
    },
    subtract(state) {
      state.countNoti -= 1;
    },
    set(state, n) {
      state.countNoti = n;
    },
  },
  actions: {
    nuxtServerInit({ commit }, { req }) {
      let token = null;
      if (req.headers.cookie) {
        const parsed = cookieparser.parse(req.headers.cookie);
        try {
          token = JSON.parse(parsed.token);
        } catch (err) {
          // No valid cookie found
        }
      }
      commit('setToken', token);
    },
  },
  getters: {
    showNoti(state) {
      return state.countNoti;
    },
  },
  modules: {
    user: user,
  },
});
