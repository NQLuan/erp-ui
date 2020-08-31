<template>
    <div class="main-content ml-0">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>

        <div v-if="!checked" class="mt-5 col-6 mx-auto">
            <div class="card-header bg-info">
                <h2 class="text-white text-center">There's no team yet</h2>
            </div>
            <div class="d-flex justify-content-center card-body my-auto py-5">
                <router-link v-show="admin==='true'" class="btn btn-info float-right px-4 py-2 mr-4 text-uppercase font-weight-bold" to="/createteam/">
                    <font-awesome-icon :icon="['fas', 'user-friends']"/>
                    Create Team
                </router-link>
            </div>
        </div>
        <div v-if="checked" id="id_team_table" class="table-responsive p-3">
            <div class="row">
                <router-link v-show="admin==='true'" class="btn btn-info ml-auto float-right px-4 py-2 mr-3 my-2 text-uppercase font-weight-bold" to="/createteam/">
                    <font-awesome-icon :icon="['fas', 'user-friends']"/>
                    Create Team
                </router-link>
            </div>
            <table class=" table table-bordered table-striped table-rounded table-fixed">
                <thead>
                    <tr>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="nameSort()">
                                Team Name
                            </button>
                        </th>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="emailSort()">
                                Team Email
                            </button>
                        </th>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="leaderSort()">
                                Team Leader
                            </button>
                        </th>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="quantitySort()">
                                Quantity
                            </button>
                        </th>
                        <th v-show="admin === 'true'" scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Action
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in sortTermFunction(rows)" :key="row.index">
                        <td>
                            <router-link
                                :to="'/team/' + row.id"
                                class="font-weight-bold text-center d-block w-100 py-2 badge my-2 badge-pill"
                                style="font-size:1em"
                                :class="{
                                    'badge-light text-dark': row.id % 9 === 0,
                                    'badge-primary text-white': row.id % 9 === 1,
                                    'badge-danger text-white': row.id % 9 === 2,
                                    'badge-secondary text-white': row.id % 9 === 3,
                                    'badge-success text-white': row.id % 9 === 4,
                                    'badge-dark text-white': row.id % 9 === 5,
                                    'badge-info text-white': row.id % 9 === 6,
                                    'badge-warning text-dark': row.id % 9 === 7,
                                    'badge-success text-dark': row.id % 9 === 8
                                }"
                            >
                                {{ row.team_name }}
                            </router-link>
                        </td>
                        <td>
                            <a class="btn" :href="'mailto:'+row.team_email" title="Click to send mail">{{ row.team_email }}</a>
                        </td>
                        <td>
                            <router-link :to="'/team/' + row.id" :class="{ 'text-danger': row.leader_name === 'No leader' }" title="Click to move to another page">
                                {{ row.leader_name }}
                            </router-link>
                        </td>
                        <td>
                            <router-link :to="'/team/' + row.id" title="Click to move to another page">
                                {{ row.employee_number }}
                            </router-link>
                        </td>
                        <td v-show="admin==='true'" scope="row">
                            <button class="btn btn-danger btn-sm" @click="showModal(row.id, row.team_name)" title="Click to show remove box">Remove</button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <b-modal ref="mymodal" hide-footer hide-header="">
                <div class="d-block text-center text-danger">
                    <h3>Remove team</h3>
                    <hr />
                </div>
                <div class="d-block text-center mb-4">
                    Do you want to remove team <p class="text-danger d-inline">{{currentteamname}}</p>
                </div>
                <div class="row">
                    <b-button class="mt-3 mx-auto col-4" variant="danger" block @click="del">Move</b-button>
                    <b-button class="mt-3 mx-auto col-4" variant="outline-dark" block @click="hideModal">Cancel</b-button>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
export default {
    name: 'team_table',
    middleware: 'authen',
    data() {
        return {
            rows: [],
            leadersort: false,
            namesort: false,
            emailsort: false,
            quantitysort: false,
            leadercount : 0,
            namecount: 0,
            emailcount: 0,
            quantitycount: 0,
            admin: localStorage.getItem('is_admin'),
            profile_id: localStorage.getItem('profile_id'),
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'Index' }
                },
                {
                    text: 'Team',
                    active: true
                }
            ],
            currentid: '',
            currentteamname: '',
            reciever: null,
            borderradius: {
                borderRadius: '1.25rem',
                textAlign: 'center'
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
            content: ''
        }
    },
    head () {
        return {
        title: 'Team',
        }
    },
    asyncData({ $axios }) {
        return $axios.get('/team/').then((res) => {
            return {
                rows: res.data,
            }
        })
    },
    created: function () {
            this.sortTermFunction(this.rows);
    },
    computed: {
        splitedList() {
            const newarr = [...this.list]
            newarr.map((el) => {
                return el.codes === el.codes.split('+')
            })
            return newarr
        },
        checked: function () {
            if (this.rows !== null & this.rows !== undefined & this.rows.length !== 0) {
                return true
            } else {
                return false
            }
        }
    },
    methods: {
        showModal(id, name) {
            this.currentid = id
            this.currentteamname = name
            this.$refs.mymodal.show()
        },
        hideModal() {
            this.$refs.mymodal.hide()
        },
        del: function({ $axios}) {
                return this.$axios
                    .delete(`/team/${this.currentid}`).then((res)=>{
                        this.$refs.mymodal.hide()
                        return this.$axios
                            .get('team')
                            .then((res) => {
                                this.rows = res.data
                            })
                            .catch((e) => {})
                    })
                    .catch((e) => { alert(e)} )
        },
        sortTermFunction: function(arr) {
            if (this.leadersort) {
                if (this.leadercount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return  a.leader_name.localeCompare(b.leader_name)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return  b.leader_name.localeCompare(a.leader_name)
                    })
                }
            }else if (this.emailsort) {
                if (this.emailcount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return  a.team_email.localeCompare(b.team_email)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return  b.team_email.localeCompare(a.team_email)
                    })
                }
            }else if (this.quantitysort) {
                if (this.quantitycount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.employee_number - b.employee_number
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.employee_number - a.employee_number
                    })
                }
            } else if (this.namesort){
                if (this.namecount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.team_name.localeCompare(b.team_name)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.team_name.localeCompare(a.team_name)
                    })
                }
            } else {
                return arr.slice().sort(function(a, b) {
                    return b.active - a.active
                })
            }
        },
        leaderSort: function() {
            this.namesort = false
            this.emailsort = false
            this.quantitysort = false
            this.leadercount ++
            return this.leadersort = true
        },
        nameSort: function() {
            this.leadersort = false
            this.emailsort = false
            this.quantitysort = false
            this.namecount ++
            return this.namesort = true
        },
        emailSort: function() {
            this.namesort = false
            this.leadersort = false
            this.quantitysort = false
            this.emailcount ++
            return this.emailsort = true
        },
        quantitySort: function() {
            this.namesort = false
            this.leadersort = false
            this.emailsort = false
            this.quantitycount ++
            return this.quantitysort = true
        }
    },
}
</script>

<style lang="scss" scoped>
body {
    font-family: 'Poppins', sans-serif;
    background: #ffffff;
    .main-content {
        width: 100%;
        margin-left: 0.01%;
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
                max-width: 50%;
            }

            .firstrow {
                width: 1%;
            }
        }
    }
}
</style>
