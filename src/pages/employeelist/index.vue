<template>
    <div class="main-content">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div v-if="!checked" class="mt-5 col-6 mx-auto">
            <div class="card-header bg-info">
                <h2 class="text-white text-center">Welcome to Company App Management</h2>
                <h3 class="text-white text-center">Please add employee</h3>
            </div>
            <div v-show="admin === 'true'" class="d-flex justify-content-center card-body bg-light my-auto py-5">
                <router-link to="/invite" class="btn btn-info float-right px-4 py-2 mr-4 text-uppercase font-weight-bold">
                    <font-awesome-icon :icon="['fas', 'user-plus']"/>
                    INVITE
                </router-link>
                <router-link to="/import" class="btn btn-info float-right px-4 py-2 mr-4 text-uppercase font-weight-bold">
                    <font-awesome-icon :icon="['fas', 'file-import']"/>
                    IMPORT FILE
                </router-link>
            </div>
        </div>
        <div v-if="checked" id="id_list_table" class="table-responsive p-3">
            <div class="row mb-2">
                <div class="col-md-5 inner-addon right-addon mt-2">
                    <i class="glyphicon mr-3 text-muted"><font-awesome-icon :icon="['fas', 'search']"/></i>
                    <input class="form-control" type="text" v-model="search" placeholder="Search"/>
                </div>
                <span class="mr-3 ml-auto float-right my-auto text-info font-weight-bold">Active User</span>
                <label class="switch my-auto mr-3">
                    <input type="checkbox" v-model="checkedActive" @change="filtersUnactive">
                    <span class="slider round" />
                </label>
                <router-link v-show="admin === 'true'" to="/invite" class="btn btn-info float-right px-4 py-2 mr-3 text-uppercase font-weight-bold">
                    <font-awesome-icon :icon="['fas', 'user-plus']"/>
                    INVITE
                </router-link>
                <router-link v-show="admin === 'true'" to="/import" class="btn btn-info float-right px-4 py-2 mr-3 text-uppercase font-weight-bold">
                    <font-awesome-icon :icon="['fas', 'file-import']"/>
                    IMPORT FILE
                </router-link>
            </div>
            <table class="table table-bordered table-striped table-rounded table-fixed table-responsive">
                <thead>
                    <tr>
                        <th class="firstrow" scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Avatar
                            </span>
                        </th>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="nameSort()">
                                Name
                            </button>
                        </th>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="emailSort()">
                                Email
                            </button>
                        </th>
                        <th scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Phone
                            </span>
                        </th>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="teamSort()">
                                Team
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-show="search === ''" v-for="row in  sortFunction(rows)" :key="row.index">
                        <td scope="row" class="text-center">
                            <router-link :to="'/profile/' + row.id">
                                <img class="img-fluid" :src="row.image" v-if="row.image !== null"/>
                                <img class="img-fluid" src="../../static/images/icon.png" v-if="row.image === null"/>
                            </router-link>
                        </td>
                        <td scope="row" :style="tablewidth">
                            <router-link :to="'/profile/' + row.id" title="Click to move to Profile page">
                                <strong>{{ row.name }}</strong>
                            </router-link>
                        </td>
                        <td scope="row">
                            <a class="btn text-muted" :href="'mailto:'+row.email" title="Click to send mail"> {{ row.email }}</a>
                        </td>
                        <td scope="row" class="text-center text-muted" :style="tableteamwidth">
                            <a :href="'tel:' + row.phone" :title="'Click to make a call to :'+ row.phone ">
                                {{ row.phone }}
                            </a>
                        </td>
                        <td scope="row" :style="tableteamwidth" class="px-4" v-show="!row.team_name.includes('No team')">
                            <router-link
                                :to="'/team/' + team.id"
                                v-for="team in row.team_name"
                                class="font-weight-bold text-center d-block w-100 py-2 badge my-2 badge-pill"
                                style="font-size:0.9em"
                                :key="team.index"
                                :class="{
                                    'badge-light text-dark ': parseInt(team.id) % 9 === 0,
                                    'badge-primary text-white ': parseInt(team.id) % 9 === 1,
                                    'badge-danger text-white ': parseInt(team.id) % 9 === 2,
                                    'badge-secondary text-white ': parseInt(team.id) % 9 === 3,
                                    'badge-success text-white ': parseInt(team.id) % 9 === 4,
                                    'badge-dark text-white ': parseInt(team.id) % 9 === 5,
                                    'badge-info text-white ': parseInt(team.id) % 9 === 6,
                                    'badge-warning text-dark ': parseInt(team.id) % 9 === 7,
                                    'badge-success text-dark ': parseInt(team.id) % 9 === 8
                                }"
                            >
                                {{ team.name }}
                            </router-link>
                        </td>
                        <td scope="row" :style="tableteamwidth" class="px-4" v-show="row.team_name.includes('No team')">
                            <div></div>
                        </td>
                    </tr>
                    <tr v-show="search !== ''" v-for="row in sortFunction(filteredList)" :key="row.index">
                        <td scope="row" class="text-center">
                            <router-link :to="'/profile/' + row.id" >
                                <img class="img-fluid" :src="row.image" v-if="row.image !== null"/>
                                <img class="img-fluid" src="../../static/images/icon.png" v-if="row.image === null"/>
                            </router-link>
                        </td>
                        <td scope="row" :style="tablewidth">
                            <router-link :to="'/profile/' + row.id">
                                <strong>{{ row.name }}</strong>
                            </router-link>
                        </td>
                        <td scope="row">
                            <button class="btn text-muted" @click="Send(row.email)"> {{ row.email }}</button>
                        </td>
                        <td scope="row" class="text-center text-muted" :style="tableteamwidth">
                            <a :href = "'tel:' + row.phone">
                                {{ row.phone }}
                            </a>
                        </td>
                        <td scope="row" :style="tableteamwidth" class="px-4" v-show="!row.team_name.includes('No team')">
                            <router-link
                                :to="'/team/' + team.id"
                                v-for="team in row.team_name"
                                :title="'Click to move to team '+team.id+' page'"
                                class="font-weight-bold text-center d-block w-100 py-2 badge my-2 badge-pill"
                                style="font-size:0.9em"
                                :key="team.index"
                                :class="{
                                    'badge-light text-dark ': parseInt(team.id) % 9 === 0,
                                    'badge-primary text-white ': parseInt(team.id) % 9 === 1,
                                    'badge-danger text-white ': parseInt(team.id) % 9 === 2,
                                    'badge-secondary text-white ': parseInt(team.id) % 9 === 3,
                                    'badge-success text-white ': parseInt(team.id) % 9 === 4,
                                    'badge-dark text-white ': parseInt(team.id) % 9 === 5,
                                    'badge-info text-white ': parseInt(team.id) % 9 === 6,
                                    'badge-warning text-dark ': parseInt(team.id) % 9 === 7,
                                    'badge-success text-dark ': parseInt(team.id) % 9 === 8
                                }"
                            >
                                {{ team.name }}
                            </router-link>
                        </td>
                        <td scope="row" :style="tableteamwidth" class="px-4" v-show="row.team_name.includes('No team')">
                            <div></div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <nav aria-label="Page navigation example" v-show="search === ''" class="mt-3">
                <ul class="pagination justify-content-center">
                    <li v-for="page in pagenumber" :key="page.index" class="page-item" :class="{ 'active': page === pagecurrent }">
                        <a @click="getData(page)" class="page-link btn">{{ page }}</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
const Cookie = process.client ? require('js-cookie') : undefined
import axios from 'axios'
export default {
    name: 'id_list_table',
    middleware: 'authen',
    data() {
        return {
            search: '',
            show: true,
            checkedActive: true,
            pagenumber: '',
            teamsort: false,
            teamcount : 0,
            namesort: false,
            namecount: 0,
            emailsort: false,
            emailcount: 0,
            currentid: '',
            currentname: '',
            pagecurrent: '',
            admin: localStorage.getItem('is_admin'),
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'Index' }
                },
                {
                    text: 'Employee List',
                    active: true
                }
            ],
            reciever: null,
            borderradius: {
                borderRadius: '1.25rem',
                textAlign: 'center'
            },
            tablewidth: {
                width: '250px'
            },
            tableteamwidth: {
                width: '220px'
            },
            color: {
                color: '#25c9d0',
                fontSize: '40px',
                marginLeft: '16px'
            },
            text: {
                fontSize: "20px"
            },
            errors: '',
            subject: '' ,
            content: '' ,
            filterActive: true,
            filterUnactive: false,
            activecount: 0,
            uncactivecount: 0,
            search_rows: [],
            rows: [],
        }
    },
    head () {
        return {
            title: 'Employee List',
        }
    },
    created: function () {
        this.asyncData()
        this.sortFunction(this.rows);
    },
    checkedActiveComputed: function () {
        if (checkedActive) {
            filtersActive()
        } else {
            filterUnactive()
        }
    },
    computed: {
        filteredList() {
            if (this.search === '') {
                let arr = this.rows
                return arr
            }
            let newArray = this.search_rows.filter(name => this.isEmployee(name))
            return newArray
        },
        splitedList() {
            const newarr = [...this.list]
            newarr.map((el) => {
                return el.codes === el.codes.split('+')
            })
            return newarr
        },
        checked: function () {
            if (this.rows === null | this.rows === undefined | this.rows.length === 0 & this.filterActive === true) {
                return false
            } else {
                return true
            }
        }
    },
    methods: {
        async filtersUnactive () {
            this.filterUnactive = !this.filterUnactive
            let page = 1
            if (this.filterUnactive) {
                await axios
                    .get(`user?page=${page}`,{
                    params: {
                        active: '0'
                    }})
                    .then((res) => {
                        this.rows = res.data.results
                        this.pagenumber = res.data.page_number
                        this.pagecurrent = res.data.current
                        this.filterActive = !this.filterActive
                    })
                    .catch((e) => {})
            } else {
                await axios
                    .get(`user?page=${page}`,{
                    params: {
                        active: '1'
                    }})
                    .then((res) => {
                        this.rows = res.data.results
                        this.pagenumber = res.data.page_number
                        this.pagecurrent = res.data.current
                        this.filterActive = !this.filterActive
                    })
                    .catch((e) => {})
            }
        },
        async asyncData() {
            let data = await axios.get(`user?page=${1}`,{params: {active: '1'}})
            let search_data = await axios.get('/user/get_non_paginate/')
                this.rows = data.data.results,
                this.search_rows= search_data.data,
                this.pagenumber= data.data.page_number,
                this.pagecurrent= data.data.current
        },
        getData(page){
            localStorage.setItem('page', page)
            if (this.filterActive) {
                axios
                .get(`user?page=${page}`,{
                    params:{
                        active: '1'
                }})
                .then((res) => {
                    this.$data.rows = res.data.results
                    this.$data.pagenumber = res.data.page_number
                    this.$data.pagecurrent = res.data.current
                })
                .catch((e) => {})
            } else if (this.filterUnactive) {
               axios
                    .get(`user?page=${page}`, {
                        params:{
                            active: '0'
                    }})
                    .then((res) => {
                        this.$data.rows = res.data.results
                        this.$data.pagenumber = res.data.page_number
                        this.$data.pagecurrent = res.data.current
                    })
                    .catch((e) => {})
            } else {
                axios
                    .get(`user?page=${page}`)
                    .then((res) => {
                        this.$data.rows = res.data.results
                        this.$data.pagenumber = res.data.page_number
                        this.$data.pagecurrent = res.data.current
                    })
                    .catch((e) => {})
            }
        },
        sortFunction(arr) {
            if (this.teamsort) {
                if (this.teamcount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.teams.split(',')[0] - b.teams.split(',')[0]
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.teams.split(',')[0] - a.teams.split(',')[0]
                    })
                }
            } else if (this.emailsort) {
                if (this.emailcount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return  a.email.localeCompare(b.email)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return  b.email.localeCompare(a.email)
                    })
                }
            } else if (this.namesort) {
                if (this.namecount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return (a.name.split(" ")[a.name.split(" ").length - 1]).localeCompare(b.name.split(" ")[b.name.split(" ").length - 1])
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return (b.name.split(" ")[b.name.split(" ").length - 1]).localeCompare(a.name.split(" ")[a.name.split(" ").length - 1])
                    })
                }
            } else {
                return arr.slice().sort(function(a, b) {
                    return (a.name.split(" ")[a.name.split(" ").length - 1]).localeCompare(b.name.split(" ")[b.name.split(" ").length - 1])
                })
            }
        },
        teamSort: function() {
            this.namesort = false
            this.emailsort = false
            this.teamcount ++
            return this.teamsort = true
        },
        nameSort: function() {
            this.teamsort = false
            this.emailsort = false
            this.namecount ++
            return this.namesort = true
        },
        emailSort: function() {
            this.namesort = false
            this.teamsort = false
            this.emailcount ++
            return this.emailsort = true
        },
        nameSplit: function(string) {
            arr = string.split(" ")
            return arr[arr.length - 1]
        },
        active: function(id) {
            let page = 0
            if (localStorage.getItem('page') !== null) {
                page = localStorage.getItem('page')
            } else {
                page = 1
            }
            axios
                .put(`user/${id}/activate/`, '')
                .then((res) => {
                    axios
                        .get(`user?page=${page}`)
                        .then((res) => {
                            this.rows = res.data.results
                        })
                        .catch((e) => {})
                })
                .catch((e) => {})
        },
        del: function() {
            let page = 0
            if (localStorage.getItem('page') !== null) {
                page = localStorage.getItem('page')
            } else {
                page = 1
            }
            axios
                .delete(`user/${this.currentid}`)
                .then((res) => {
                    this.$refs.mymodal.hide()
                    axios
                        .get(`user?page=${page}`)
                        .then((res) => {
                            this.rows = res.data.results
                        })
                        .catch((e) => {})
                    })
                .catch((e) => {})
        },
        showModal(id, name) {
            this.currentid = id
            this.currentname = name
            this.$refs.mymodal.show()
        },
        hideModal() {
            this.$refs.mymodal.hide()
        },
        isEmployee(value) {
            return value.name.toLowerCase().includes(this.search.toLowerCase())
        }
    }
}
</script>
<style lang="scss" scoped>
body {
    font-family: 'Poppins', sans-serif;
    background: #ffffff;
    .main-content {
        width: 100%;
        margin-left: 0.01%;
        input {
            padding: 4px 12px;
            color: rgba(0,0,0,.70);
            border: 1px solid rgba(0,0,0,.12);
            background: white;
            &:focus {
                outline: none;
                & + label  {
                font-size: 10px;
                }
            }
            &::-webkit-input-placeholder {
                font-size: 12px;
                color: rgba(0,0,0,.50);
                font-weight: 100;
            }
        }
        .inner-addon {
            position: relative;
        }
        .inner-addon .glyphicon {
            position: absolute;
            padding: 10px;
            pointer-events: none;
        }
        .right-addon .glyphicon { right: 0px;}
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        /* Hide default HTML checkbox */
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* The slider */
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked + .slider {
            background-color: #25c9d0;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #25c9d0;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }

        /* Rounded sliders */
        .slider.round {
        border-radius: 34px;
        }

        .slider.round:before {
        border-radius: 50%;
        }
        .page-item.active .page-link {
            background-color: #25c9d0;
            border-color: #25c9d0;
            color: white;
            text-decoration: none;
            outline: none;
            border: none;
            :active {
                text-decoration: none;
                outline: none;
            }
        }
        .page-link {
            color: #25c9d0;
            cursor: pointer;
        }
        .mybcrumb {
            left: 10px;
            .breadcrumb {
                background-color: transparent;
                .breadcrumb-item {
                    a {
                        color: #25c9d0;
                        text-decoration: none;
                    }
                    
                }
                .breadcrumb-item:first-child::before{
                    content: none;
                    margin-left: 5px;
                    margin-right: 5px;
                    padding-left: 5px;
                    padding-right: 5px;
                }
                .breadcrumb-item::before {
                    content: '»';
                    margin-left: 5px;
                    margin-right: 5px;
                    padding-left: 5px;
                    padding-right: 5px;
                }
            }
        }
        .text-decor {
            text-decoration: line-through;
        }
        p {
            font-size: 1.1em;
            font-weight: 300;
            line-height: 1.7em;
            color: #999;
        }
        .table {
            thead {
                background-color: #25c9d0;
                color: white;
            }

            tbody {
                td {
                    vertical-align: middle;
                    a {
                        text-decoration: none;
                        color: #4e5e5f;
                    }
                }
            }

            img {
                max-width: 60px;
                border-radius: 100%;
            }

            .firstrow {
                width: 1%;
            }
            .lastrow {
                width: 0.5%;
            }
        }
    }
}
</style>