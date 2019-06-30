import Vue from "vue";
import Router from "vue-router";

import Home from '../components/HelloWorld.vue'
import ChildHome from '../components/HelloWorld.vue'


Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            component: Home,
            children: [
                {
                    path: "",
                    name: "home",
                    component: ChildHome
                }
            ]
        }
    ]
});