<template>
    <div class="main-content ml-0">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div class="text-danger">
            {{ errors }}
        </div>
         <div class="p-3">
            <div class="row" v-if="show" @dblclick="showEdit()">
                <h2 :style="color">
                    {{ team_name }}
                </h2>
                <!-- <button class="btn btn-info ml-auto float-right px-4 py-2 mr-3 my-2 text-uppercase font-weight-bold" @click="SendAll(team_name)">
                    Send Email All
                    <font-awesome-icon class="ml-2" :icon="['fas', 'envelope']"/>
                </button> -->
                <router-link v-show="admin === 'true' || team_leader_id.toString() === profile_id" :to="'/editteam/' + team_id" class="btn btn-info ml-auto float-right px-4 py-2 mr-3 my-2 text-uppercase font-weight-bold">
                    <font-awesome-icon :icon="['fas', 'edit']"/>
                    Edit Team
                </router-link>
                <router-link v-show="admin === 'true' || team_leader_id.toString() === profile_id" :to="'/addMember/' + team_id" class="btn btn-info float-right px-4 py-2 mr-3 my-2 text-uppercase font-weight-bold">
                    <font-awesome-icon :icon="['fas', 'user-plus']"/>
                    Add Member
                </router-link>
            </div>
            <div v-else>
                <h2 class="row" :style="color">
                    <input class="form-control text-info font-weight-bold col-8" type="text" :style="[borderradius, text]" v-model="team_name_update" @keyup.enter="updateTeamName()" @keyup.esc="cancel()" />
                    <font-awesome-icon class="text-info col" @click="updateTeamName()" :icon="['fas', 'check-square']"/>
                    <font-awesome-icon class="text-danger col" @click="cancel()" :icon="['fas', 'times']"/>
                </h2>
            </div>
        </div>
        <div class="text-center col-sm-12" v-show="team_leader === 'No leader' && rows.length !== 0">
                <label for="input_endday" class="col-sm-12 col-form-label alert alert-danger" >This team has no leader</label>
        </div>
        <div id="id_team_table" class="table-responsive p-3">
            <table class="table table-bordered table-striped table-rounded table-fixed">
                <thead class>
                    <tr class>
                        <th class="firstrow" scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Avatar
                            </span>
                        </th>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="nameSort()">
                                Member Name
                            </button>
                        </th>
                        <th scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold" @click="emailSort()">
                                Member Email
                            </button>
                        </th>
                        <th scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Phone
                            </span>
                        </th>
                        <th scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Team Role
                            </span>
                        </th>
                        <th v-show="admin === 'true'" scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Action
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in sortFunction(rows)" :key="row.index">
                        <td scope="row">
                            <img v-if="row.image !== null" class="img-fluid" :src="row.image" />
                            <img v-if="row.image === null" class="img-fluid" src="../../../static/images/icon.png" />
                        </td>
                        <td scope="row">
                            <router-link :to="'/profile/' + row.id" title="Click to move to Profile page">
                                <strong class="text-dark">
                                    {{ row.name }}
                                </strong>
                            </router-link>
                        </td>
                        <td><a class="btn" :href="'mailto:'+row.email" :title="'Click to send a mail to : ' + row.email">{{ row.email }}</a></td>
                        <td><a class="text-dark" :href ="'tel:' + row.phone" :title="'Click to make a call to : ' + row.phone">{{ row.phone }}</a></td>
                        <td class= "text-center">
                            <div :class="{'text-white font-weight-bold bg-success my-4 py-2 badge px-5 badge-pill h4': row.role === 'Leader'}" style="font-size: 1em">
                                {{ row.role }}
                            </div>
                        </td>
                        <td v-show="admin === 'true'" scope="row">
                            <div class="m-2 p-0">
                                <button class="btn btn-success" :class="{ 'd-none': row.role === 'Leader' }" @click="lead(row.email)">
                                    <font-awesome-icon class="fa-fw" :icon="['fas', 'crown']"/>
                                    Assign Leader
                                </button>
                                <div class='mt-2'>
                                    <button class="btn btn-info" @click="showMoveTeamModal(row.id)">
                                        <font-awesome-icon class="fa-fw" :icon="['fas', 'exchange-alt']"/>
                                        Move
                                    </button>
                                    <button class="btn btn-danger" @click="showModal(row.email, row.name)">
                                        <font-awesome-icon class="fa-fw" :icon="['fas', 'user-times']"/>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="text-center col-sm-12" v-show="rows.length === 0">
                <label for="input_endday" class="col-sm-12 col-form-label alert alert-danger" >This team has no member</label>
        </div>
        <b-modal id="mymodal" ref="mymodal" hide-footer hide-header>
            <div class="d-block text-center text-danger">
                <h3>Removing member</h3>
                <hr />
            </div>
            <div class="d-block text-center mb-4">
                Do you want to remove <p class="text-danger d-inline">{{ currentname }}</p> from team?
            </div>
            <div class="row">
                <b-button class="mt-3 mx-auto col-4" variant="danger" block @click="del">Confirm</b-button>
                <b-button class="mt-3 mx-auto col-4" variant="outline-dark" block @click="hideModal">Cancel</b-button>
            </div>
        </b-modal>
        <b-modal id="move_team_modal" ref="my_move_team_modal" hide-footer hide-header>
            <div class="d-block text-center text-info">
                <h3>Moving member</h3>
                <hr />
            </div>
            <div class="col-sm-12 ml-2">
                <div class="text-center m-2">Please choose new team:</div>
                <select id="id_selected_bank_name" v-model="new_team" type="text" class="form-control mb-2 mt-2">
                    <option v-for="team in new_teams" :key="team.id" placeholder="Teams" :value="team.id">
                        {{ team.team_name }}
                    </option>
                </select>
            </div>
            <div class="row">
                <b-button class="mt-3 mx-auto col-4" variant="info" block @click="move()">Confirm</b-button>
                <b-button class="mt-3 mx-auto col-4" variant="outline-dark" block @click="hide_move_team_modal()">Cancel</b-button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'id_team_table',
    middleware: 'authen',
    data() {
        return {
            show: true ,
            namesort: false,
            namecount: 0,
            emailsort: false,
            emailcount: 0,
            subject: '' ,
            content: '' ,
            member_email: '',
            member_rows: [],
            team_id: '',
            rows: [],
            team_name: '',
            team_name_update: '',
            currentemail: '',
            currentname: '',
            admin: localStorage.getItem('is_admin'),
            profile_id: localStorage.getItem('profile_id'),
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'Team',
                    to: { name: 'team' }
                },
                {
                    text: 'Team Info',
                    active: true
                }
            ],
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
            team_leader: '',
            // team_leader: 0,
            new_teams: [],
            new_team: '',
            move_user_id: ''
        }
    },
    asyncData({ req, params, error, $axios }) {
        const formdata = new FormData()
        formdata.append('id', params.id)
        return $axios
            .get(`/team/${params.id}/`, formdata)
            .then((res) => {
                return {
                    team_name: res.data.team.team_name,
                    rows: res.data.team.employee_list,
                    member_rows: res.data.non_members,
                    team_id: params.id,
                    team_leader: res.data.team.leader_name,
                    team_leader_id: res.data.team.team_leader,
                    is_leader: res.data.team.employee_list.role
                }
            })
            .catch((e) => {
                error({ statusCode: 404, message: 'Post not found' })
            })
    },
    methods: {
        sortFunction(arr) {
            if (this.emailsort) {
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
                        return a.name.localeCompare(b.name)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.name.localeCompare(a.name)
                    })
                }
            } else {
                return arr.slice().sort(function(a, b) {
                    return a.role.localeCompare(b.role)
                })
            }
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
        updateTeamName: function(){
            if(this.team_name_update.length !== 0) {
                const formdata = new FormData()
                formdata.append('team_name', this.team_name_update)
                return this.$axios
                    .put(`/team/${this.team_id}/`, formdata)
                    .then((res) => {
                        this.show = !this.show
                        this.errors = ''
                        return this.$axios
                            .get(`/team/${this.team_id}/`)
                            .then((res) => {
                                this.team_name = res.data.team.team_name
                                this.rows = res.data.team.employee_list
                                this.member_rows = res.data.non_members
                                this.team_id = params.id
                            })
                            .catch((e) => {})
                    })
                .catch(function(error) {})
            } else {
                this.team_name_update = this.team_name
                this.errors = 'please enter your team name'
            }
        },
        showEdit: function() {
            this.team_name_update = this.team_name
            this.show = !this.show
            this.errors = ''
        },
        cancel : function () {
            this.errors = ''
            this.show = !this.show
        },
        showModal(email, name) {
            this.currentemail = email
            this.currentname = name
            this.$refs.mymodal.show()
            this.show = true
            this.errors = ''
        },
        showMoveTeamModal(id) {
            this.$axios.get(`/team/${id}/get_new_teams/`).then((res)=> {
                this.new_teams = res.data
            })
            this.$refs.my_move_team_modal.show()
            this.show = true
            this.errors = ''
            this.move_user_id = id
        },
        hideModal() {
            this.$refs.mymodal.hide()
        },
        hide_move_team_modal() {
            this.$refs.my_move_team_modal.hide()
        },
        submit: function() {
            const formdata = new FormData()
            const teamid = this.team_id
            formdata.append('email', this.member_email)
            this.$axios
                .put(`/team/${teamid}/add_member/`, formdata)
                .then((res) => {
                    return this.$axios
                        .get(`/team/${teamid}/`)
                        .then((res) => {
                            this.rows = res.data.team.employee_list
                        })
                    .catch((e) => {})
                })
                .catch(function(error) {
                    alert(error)
                })
        },
        lead: function(email) {
            const formdata = new FormData()
            const teamid = this.team_id
            this.show = true
            this.errors = ''
            formdata.append('email', email)
            return this.$axios
                .put(`/team/${teamid}/set_leader/`, formdata)
                .then((res) => {
                    return this.$axios
                        .get(`/team/${teamid}/`)
                        .then((res) => {
                            this.rows = res.data.team.employee_list,
                            this.team_leader = res.data.team.leader_name,
                            this.team_leader_id = res.data.team.team_leader
                        })
                    .catch((e) => {})
                })
                .catch((e) => {})
        },
        del: function() {
            const formdata = new FormData()
            const teamid = this.team_id
            this.errors = ''
            formdata.append('email', this.currentemail)
            return this.$axios
                .put(`/team/${teamid}/remove_member/`, formdata)
                .then((res) => {
                    this.$refs.mymodal.hide()
                    this.$axios
                        .get(`/team/${teamid}/`)
                        .then((res) => {
                            this.rows = res.data.team.employee_list,
                            this.team_leader= res.data.team.leader_name,
                            this.team_leader_id = res.data.team.team_leader
                        })
                    .catch((e) => {})
                })
                .catch((e) => {})
        },
        move() {
            const formdata = new FormData()
            formdata.append('current_team_id',this.team_id)
            formdata.append('user_id',this.move_user_id)
            formdata.append('new_team_id',this.new_team)
            this.$axios.put(`/team/move_team/`, formdata).then((res) => {
                this.$refs.my_move_team_modal.hide()
                this.$axios
                .get(`/team/${this.team_id}/`)
                    .then((res) => {
                        this.team_name = res.data.team.team_name
                        this.rows = res.data.team.employee_list
                        this.member_rows = res.data.non_members
                        this.team_id = params.id
                    })
            }).catch((e) => {})
        }
    },
    computed: {
        filter: function() {
                return this.rows.filter((row) => {
                    return row.email.match(this.mailTo)
                })
        }
    }
}
</script>
<style lang="scss" scoped>
    body {
        font-family: 'Poppins', sans-serif;
        background: #ffffff;
    }
    p {
        font-family: 'Poppins', sans-serif;
        font-size: 1.1em;
        font-weight: 300;
        line-height: 1.7em;
        color: #999;
    }
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
                    content: '\BB';
                    margin-left: 5px;
                    margin-right: 5px;
                    padding-left: 5px;
                    padding-right: 5px;
                }
            }
        }
    }
    /* table */
    .table {
        thead {
            background-color: #25c9d0;
            color: white;
            .firstrow {
                width: 1%;
            }
        }
        img {
            max-width: 80%;
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
    }
</style>