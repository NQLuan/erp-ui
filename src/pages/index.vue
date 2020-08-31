<template>
    <div class="container col-12 p-0 m-0">
        <div class="container-fluid">
            <div class="row flex-xl-nowrap">
                <main class="col-12 col-md-12 col-xl-12 bd-content">
                    <div class="row">
                        <div class="col col-md-4 pt-5 mt-5 d-inline-block">
                            <center class="mt-5" :class="{ 'd-none': token === null }">
                                <div class="mt-5">
                                    <router-link to="/employeelist">
                                        <button class="ml-3 ubuton lbuton text-sm" v-show="token">
                                            <font-awesome-icon :icon="['fas', 'list']"/>
                                            Employee List
                                        </button>
                                    </router-link>
                                    <router-link to="/login">
                                        <button class="ml-3 ubuton lbuton text-sm" v-show="!token">
                                            <font-awesome-icon :icon="['fas', 'sign-in-alt']"/>
                                            Login
                                        </button>
                                    </router-link>
                                    <router-link :to="{ name: 'profile', params: { id: 4 }}" v-show="token">
                                        <button class="ml-3 ubuton rbuton text-sm">
                                            <font-awesome-icon :icon="['fas', 'user']"/>
                                            My profile
                                        </button>
                                    </router-link>
                                    <router-link to="/leavesday">
                                        <button class="mt-3 ml-3 dbuton lbuton text-sm" v-show="token">
                                            <font-awesome-icon :icon="['fas', 'calendar-alt']"/>
                                            Leave day
                                        </button>
                                    </router-link>
                                    <router-link to="/team">
                                        <button class="mt-3 ml-3 dbuton rbuton text-sm" v-show="token">
                                            <font-awesome-icon :icon="['fas', 'users']"/>
                                            Team List
                                        </button>
                                    </router-link>
                                </div>
                            </center>
                        </div>
                        <div class="col-11 col-md-8 d-inline-block">
                            <img class="ml-3 mt-0 py-0" src="../static/images/background.png" />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    </div>
</template>
<script>
const Cookie = require('js-cookie')
export default {
    name: "Index",
    head () {
        return {
        title: 'Homepage',
        }
    },
    data() {
        return {
            token: Cookie.get('token'),
            admin : localStorage.getItem('is_admin'),
            profileid: localStorage.getItem('profile_id')
        }
    },
}
</script>
<style lang="scss" scoped>
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
