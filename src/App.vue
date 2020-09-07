<template>
    <div class="container-fluid col-12 p-0 m-0">
       
        <div class="row">
            <aside v-if="hidden">
                <Siderbar />
            </aside>
            <main class="col-xl">
                <div v-if="hidden"> 
                    <Navbar />
                </div>
                <router-view> </router-view>
            </main>
        </div>
        
    </div>
</template>
<script>
const Cookie = require('js-cookie')


import Siderbar from '@/components/Siderbar.vue'
import Navbar from '@/components/Navbar.vue'
export default {
    layout: 'empty',
    head () {
        return {
        title: 'Homepage',
        }
    },
    components: {
        Siderbar,
        Navbar
    },
    data() {
        return {
            token: "Cookie.get('token')",
            admin : localStorage.getItem('is_admin'),
            profileid: localStorage.getItem('profile_id')
        }
    },
    computed: {
        hidden() {
            if(this.$route.name ==="Login" || this.$route.name ==="Index") {
                return false;
            }
            return true;
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./assets/scss/define.scss";
@import "./assets/vendor/css/custom-responsive-style.css";
@import "./assets/vendor/css/main.css";
@import "./assets/vendor/css/sb-admin-2.min.css";
@import 'node_modules/bootstrap/scss/bootstrap';
@import 'node_modules/bootstrap-vue/src/index.scss';
// @import '~bootstrap';
// @import '~bootstrap-vue';
// @import '~bootstrap/scss/bootstrap';
// @import '~bootstrap-vue/src/index.scss';

.container-fluid {
    background: #f7f7fd;
    button {
        background-color: #25c9d0;
        color: white;
        font-weight: 800;
        width: 40%;
        height: 100px;
        line-height: 1;
        text-decoration: none;
        border: none;
        border-radius: 10px;
        position: relative;

        &:hover:before {
            text-decoration: none;
            color: white;
        }

        &:active {
            outline: 0;
        }
        &:focus {
            outline: 0;
        }
    }
    main {
        img {
            max-width: 100%;
            opacity: 0.7;
        }
    }
}

.welcome {
    position: absolute;
    z-index: 2000;
    top: 10%;
    left: 30%;
    right: 30%;
    color: #25c9d0;
    font-weight: 500;
    font-size: 35px;
}

a {
    color: white;
    &:hover {
        text-decoration: none;
        color: white;
    }
}

footer {
    nav {
        background-color: #25c9d0;
        height: 60px;
    }
}

@media (max-width: 768px) {
    // .welcome {
    //     position: absolute;
    //     z-index: 2000;
    //     top: 15%;
    //     left: 0;
    //     right: 30%;
    //     color: #25c9d0;
    //     font-size: 22px;
    // }
    .container-fluid {
        button {
            margin-top: 30px;
            padding: 5px;
            width: 105px;
            height: 50px;
            position: absolute;
            z-index: 3000;
        }
        .ubuton {
            top: 0;
        }
        .lbuton {
            left: 5px;
        }
        .rbuton {
            left: 125px;
        }
        .dbuton {
            bottom: 50px;
        }
    }
}
</style>
