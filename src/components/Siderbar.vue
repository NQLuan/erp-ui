<template>
    <div>
        <div class="sidebar-brand">
            <div id="close-sidebar">
                <button ref="brand" class="btn btn-info btn-sm" @click="toggle()">=</button>
            </div>
        </div>
        <nav ref="dropdown" id="id_sidebar" class="pl-3 col-md-2">
            <ul class="list-unstyled components p-0">
                <li id="siderbar_header">
                    <router-link to="/">
                        <h4 class="text-center">Company Management</h4>
                    </router-link>
                </li>
                <div id="button_container" class="ml-2 font-weight-bold">
                    <li>
                        <router-link to="/">
                            <!-- <font-awesome-icon class="fa-fw" :icon="['fas', 'fa-home']"/> -->
                            <font-awesome-icon :icon="['fas', 'home']" />
                            Homepage
                        </router-link>
                    </li>
                    <li @click="highlightButtons(0)" :class="{clicked:buttonIsHighlighted[0]}">
                        <router-link to="/employeelist">
                            <font-awesome-icon class="fa-fw" :icon="['fas', 'list']"/>
                            Employee List
                        </router-link>
                    </li>
                    <li @click="highlightButtons(1)" :class="{clicked:buttonIsHighlighted[1]}">
                        <router-link to="/team">
                            <font-awesome-icon class="fa-fw" :icon="['fas', 'users']"/>
                            Team List
                        </router-link>
                    </li>
                    <li class="dropdown_list_container">
                        <div class="dropdown">
                            <div class="dropdown_header mx-auto dropdown-toggle" @click="show_leave_dropdown()">
                                <font-awesome-icon class="fa-fw" :icon="['fas', 'calendar']"/>
                                <span>Leave Management</span>
                                <span class="count ml-1" v-show="showNoti > 0">{{showNoti}} </span>
                            </div>
                        </div>
                    </li>
                    <div class="dropdown_content" :class="{active:checkedLeave}">
                        <ul class="list-unstyled components p-0">
                            <li @click="highlightButtons(2)" :class="{clicked:buttonIsHighlighted[2]}">
                                <router-link to="/leavesday">
                                    <font-awesome-icon class="fa-fw" :icon="['fas', 'calendar-day']"/>
                                    Add Leave
                                </router-link>
                            </li>
                            <li @click="highlightButtons(3)" :class="{clicked:buttonIsHighlighted[3]}"  >
                                <router-link to="/calendar">
                                    <font-awesome-icon class="fa-fw" :icon="['fas', 'calendar-week']"/>
                                    Company Calendar
                                </router-link>
                            </li>
                            <li @click="highlightButtons(4)" :class="{clicked:buttonIsHighlighted[4]}" >
                                <router-link to="/userCalendar">
                                    <font-awesome-icon class="fa-fw" :icon="['fas', 'calendar-week']"/>
                                    My Calendar
                                </router-link>
                            </li>
                            <li @click="highlightButtons(5)" :class="{clicked:buttonIsHighlighted[5]}">
                                <router-link to="/leavemanage">
                                    <font-awesome-icon class="fa-fw" :icon="['fas', 'calendar-alt']"/>
                                    Management
                                    <span class="count ml-34px" v-show="showNoti > 0 && admin==='true'">{{showNoti}} </span>
                                </router-link>
                            </li>
                        </ul>
                    </div>
                    <li class="dropdown_list_container">
                        <div class="dropdown">
                            <div class="dropdown_header mx-auto dropdown-toggle" @click="show()">
                                <font-awesome-icon class="fa-fw" :icon="['fas', 'hamburger']"/>
                                <span>Lunch Management</span>
                            </div>
                        </div>
                    </li>
                     <div class="dropdown_content" :class="{active:checked}">
                        <ul class="list-unstyled components p-0">
                            <li @click="highlightButtons(7)" :class="{clicked:buttonIsHighlighted[7]}">
                                <router-link to="/userLunchStatistic">
                                    <font-awesome-icon class="fa-fw" :icon="['fas', 'calendar-week']"/>
                                    My Lunch
                                </router-link>
                            </li>
                            <li v-show="admin==='true'" @click="highlightButtons(8)" :class="{clicked:buttonIsHighlighted[8]}">
                                <router-link to="/editlunch">
                                    <font-awesome-icon class="fa-fw" :icon="['fas', 'utensils']"/>
                                    Management
                                </router-link>
                            </li>
                        </ul>
                    </div>
                </div>
            </ul>
        </nav>
    </div>
</template>

<script>

import { mapMutations, mapGetters } from 'vuex'
import axios from 'axios'

export default {
    name: 'id_sidebar',
    mounted() {
        this.$nextTick(() => {
            axios.get(`/leave/get_new_leave/`).then((res) => {
                this.$store.commit('set', res.data.number)
            })
            .catch((e) => {
                this.error = ''
            })
        })
    },
    data() {
        return {
            object: {
                'color':'#25c9d0',
                'background': 'white'
            },
            checked:false,
            checkedLeave: false,
            admin: localStorage.getItem('is_admin'),
            check: true,
            buttonIsHighlighted: []
        }
    },
    computed: {
       ...mapGetters({showNoti: 'showNoti'})
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData() {
            axios.get(`/leave/get_new_leave/`)
                .then((res) => {
                    this.$store.commit('set', res.data.number)
                })
                .catch((e) => {
                    this.error = ''
                })
        },
        highlightButtons(n) {
            this.buttonIsHighlighted = []
            this.buttonIsHighlighted[n] = true
        },
        toggle: function() {
            const myvar = this.$refs.dropdown
            const brand = this.$refs.brand
            if (myvar.style.display === 'none' ) {
                myvar.style.display = 'grid'
            } else {
                myvar.style.display = 'none'
            }
        },
        show() {
            this.checked = !this.checked
        },
        show_leave_dropdown() {
            this.checkedLeave = !this.checkedLeave
        },
    }
}
</script>

<style lang="scss" scoped>
body {
    background: #ffffff;
}

a {
    color: inherit;
    text-decoration: none;
    transition: all 0.3s;
    display: block;
    padding: 5px;
    // margin-left:10px;
    &:hover,
    &:focus {
        color: inherit;
        text-decoration: none;
        transition: all 0.3s;
    }
}

#id_sidebar {
    background: #25c9d0;
    color: #fff;
    transition: all 0.3s;
    min-width: 200px;
    max-width: 250px;
    min-height: 100vh;
    height: 100%;
    &.active {
        margin-left: -250px;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    p {
        color: #fff;
        padding: 10px;
    }
    li {
        &:hover {
            color: #25c9d0;
            background: #fff;
        }
        &:nth-child(4) {
            .dropdown-toggle::after {
                margin-left: 7px
            }
        }
    }
    #siderbar_header {
        background: none;
        color: white;
        margin-bottom: 20px;
    }
    #button_container {
        li {
            margin: 2%;
        }
    }
}

.wrapper {
    display: flex;
    width: 100%;
    align-items: stretch;
}

a[aria-expanded='true'] {
    color: #fff;
    background: #25c9d0;
}

a[data-toggle='collapse'] {
    position: relative;
}

#id_content {
    width: 100%;
}

.main-content {
    background-color: #f7f5f5;
    width: 100%;
    margin-left: 0.01%;
}

.table {
    thead {
        background-color: #25c9d0;
        color: white;
    }
    img {
        max-width: 80%;
    }
}
.sidebar-brand {
    display: none
}
#id_sidebar {
    display: grid;
    padding-right: 5px;
}
@media (max-width: 768px) {
    #id_sidebar {
        display: none;
    }
    .sidebar-brand {
        display: block;
        position: fixed;
        z-index: 2500;
        margin-top: 40px;
        width: 200px;
        top: 120px;
    }
}
.dropdown {
    cursor: pointer;
    // margin-left:10px;
    // padding:10px 0px 0px 10px;
    &_header {
        padding: 5px
    }
    .dropdown-toggle::after {
        margin-left: 10px;
    }
    &_content {
        background: #25c9d0;
        display: none;
        &.active {
            display: block;
        }
        ul {
            padding-left: 25px !important;
        }
    }
}
.dropdown_list_container {
    &.dropdown {
        padding: 0px;
        &_content {
            ul {
                margin-left: 30px;
            }
        }
    }
}
#button_container{
    li {
        padding:0px 0px 0px 0px;
        margin-left: 0;
    }
}
.clicked {
    color:#25c9d0;
    background-color: white;
}
.ml-34px {
    margin-left: 34px
}
.count {
	position: absolute;
	min-width: 20px;
	color: #fff;
	font-size: 13px;
	background: rgb(255, 44, 37);
	text-align: center;
	border-radius: 30px;
	padding: 0 2px;
    margin-top: 0.15rem
}
</style>
