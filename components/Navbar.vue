<template>
<div class="navbar-container" v-focus="handleFocusOut">
    <nav class="navbar navbar-expand-lg navbar-light" >
        <div class="container-fluid">
            <ul id="mydrop" class="nav justify-content-end navbar-nav ml-auto">
                <li class="nav-item" @click="toggle">
                    <button class="btn dropdown-toggle pr-4">
                        <img v-if="this.imageurl !== 'null' & this.imageurl !== 'undefined'" class="img-fluid" :src="imageurl" />
                        <img v-if="this.imageurl === 'null' || this.imageurl === 'undefined'" class="img-fluid" src="/images/icon.png"/>
                    </button>
                </li>
                <ul ref="dropdown" class="collapse list-unstyled ml-auto rounded my-drop-content">
                    <div>
                        <li class="ml-auto mr-2 pl-2 mt-2 text-muted">
                            <nuxt-link class="my-2 button" :to="'/profile/'+this.profileId" >
                                {{ email }}
                            </nuxt-link>
                        </li>
                        <hr />
                        <li class="ml-auto pl-2 mr-2">
                            <nuxt-link class="my-2 button" to="/changepassword"  @click="toggle()">
                                Change password
                            </nuxt-link>
                        </li>
                        <li class="ml-auto pl-2 mr-2">
                            <nuxt-link class="my-2 button" :to="'/profile/'+this.profileId" @click="toggle()">
                                My profile
                            </nuxt-link>
                        </li>
                         <li class="ml-auto pl-2 mr-2">
                            <nuxt-link class="my-2 button" :to="'/photos/'+this.profileId">
                                My Photos
                            </nuxt-link>
                        </li>
                        <hr />
                        <li class="ml-auto pl-2">
                            <a class="button" @click="logout" >
                                Log out
                            </a>
                        </li>
                    </div>
                </ul>
            </ul>
        </div>
    </nav>
</div>    
</template>
<script>
const Cookie = process.client ? require('js-cookie') : undefined
import Vue from 'vue'
export default {
    name: 'mydrop',

    directives: {
        focus: {
            // directive definition
            bind(el, binding, vnode) {
                const event1 = function (event) {
                    if (!(el == event.target || el.contains(event.target))) {
                        vnode.context[binding.expression](event);
                    }
                };
                document.body.addEventListener('click', event1)
            },
        }
    }, 
    data() {
        return {
            formError: '',
            profileId: localStorage.getItem('profile_id'),
            email: localStorage.getItem('email'),
            imageurl: localStorage.getItem('imageurl'),
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'Invite',
                    active: true
                }
            ]
        }
    },
    created () {
        // fetch the data when the view is created and the data is
        // already being observed
        this.fetchData()
    },
    watch: {
        // call again the method if the route changes
        '$route': 'fetchData',
        '$route': 'hide'
    },
    methods: {
        handleFocusOut() {
            const myvar = this.$refs.dropdown
                if (myvar.style.display !== '' && myvar) {
                    myvar.style.display = ''
                }
            }
        },
        toggle: function() {
            const myvar = this.$refs.dropdown
            if (myvar.style.display === '') {
                myvar.style.display = 'grid'
                myvar.style.position = 'absolute'
                myvar.style.backgroundColor = '#ffffff'
                myvar.style.minWidth = '200px'
                myvar.style.zIndex = '10000'
                myvar.style.border = '0.5px solid #dee2e6'
                myvar.style.boxShadow = '5px 5px 5px 0px rgba(0,0,0,0.11)'
            } else {
                myvar.style.display = ''
            }
        },
        hide: function() {
            const myvar = this.$refs.dropdown
            myvar.style.display = ''
        },
        logout() {
            Cookie.remove('token')
            localStorage.removeItem("user_id");
            localStorage.removeItem("is_admin");
            localStorage.removeItem("currentid");
            localStorage.removeItem("profile_id");
            localStorage.removeItem("imageurl");
            localStorage.removeItem("email");
            localStorage.removeItem("param_id");
            this.$router.push('/login')
        },
        fetchData () {
            this.imageurl = localStorage.getItem('imageurl')
        },
    }
}
</script>
<style lang="scss" scoped>

li,a {
    color: gray;
    text-decoration: none;

    &:hover {
        background: #6de7ed;
        text-decoration: none;
    }
}

li {
    list-style-type: none;     
}
img {
    max-width: 30px;
    border-radius: 100%;
}
.dropdown-toggle {
    color: #000;
    background: #fff;
    width: 70px;
    border : 1px solid #dee2e6;
    box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.11);
}
.my-drop-content {
    .button {
        cursor: pointer;
        width: 100%;
        display: block;
        padding:6px 12px;
    }
}
@media (max-width: 768px) {
    #mydrop {
        .my-drop-content {
            margin-top: 165px;
            right: 15px;
        }
    }
}
@media (min-width: 768px) {
    #mydrop {
        .my-drop-content {
            margin-top: 165px;
            right: 15px;
        }
    }
}
@media (min-width: 990px) {
    #mydrop {
        .my-drop-content {
            margin-top: 50px;
            right: 30px;
        }
    }
}

</style>