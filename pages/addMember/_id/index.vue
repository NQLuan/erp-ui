<template>
    <div class="main-content mt-2">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div class="col-md-6 inner-addon right-addon mt-2">
            <i class="glyphicon mr-3 text-muted"><font-awesome-icon :icon="['fas', 'search']"/></i>
            <input class="form-control" type="text" v-model="search" placeholder="Search"/>
        </div>
        <div id="id_edit_team" class="main-profile row p-3">
            <div class="mx-auto col-md-6">
                <h5 class="card-header text-white bg-info text-center py-4">
                    <strong class="text-center">Employees</strong>
                </h5>
                <div class="border d-flex justify-content-between px-1 pointer" v-for="member_row in sortFunction(filteredList)" :key="member_row.id" @click="add(member_row)">
                    {{ member_row.name + ' - ' + '( ' + member_row.email + ' )' }}
                    <font-awesome-icon class="text-success" :icon="['fas', 'plus']"/>
                </div>
            </div>
            <div class="col-md-6 mx-auto" > 
                <h5 class="card-header text-white bg-info py-4 text-center">
                    <strong>Team Members</strong>
                </h5>
                <div class="border text-muted px-1 font-weight-bold" v-for="row in rows" :key="row.id">
                    {{ row.name + ' - ' + '( ' + row.email + ' )' }}
                </div>
                <div class="border d-flex justify-content-between px-1 pointer" v-for="receive in receives" :key="receive.id" @click="remove(receive)">
                    {{ receive.name + ' - ' + '( ' + receive.email + ' )' }}
                    <font-awesome-icon class="text-danger" :icon="['fas', 'minus']"/>
                </div>
                <div class="text-center mt-3">
                    <button class="btn btn-info" @click="send()">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'id_edit_team',
    middleware: 'authen',
    asyncData({ req, params, error, $axios }) {
        const formdata = new FormData()
        formdata.append('id', params.id)
        return $axios
            .get(`/team/${params.id}/`, formdata)
            .then((res) => {
                return {
                    rows: res.data.team.employee_list,
                    member_rows: res.data.non_members,
                    team_id: params.id,
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
                            text: `Team Info`,
                            to: `/team/${params.id}`
                        },
                        {
                            text: 'Add member',
                            active: true
                        }
                    ]
                }
            })
            .catch((e) => {
                error({ statusCode: 404, message: 'Post not found' })
            })
    },
    data() {
        return {
            rows: [],
            member_rows: [],
            receives: [],
            team_id: '',
            items: [],
            search: ''
        }
    },
    head () {
        return {
            title: 'Add Member',
        }
    },
    computed: {
        filteredList() {
            if (this.search === '') {
                let arr = this.member_rows
                return arr
            } 
            const newArray = this.member_rows.filter(name => this.isEmployee(name))
            return newArray
        },
    },
    methods: {
        add(member) {
            this.receives.push(member)
            let position = this.member_rows.indexOf(member)
            this.member_rows.splice(position,1)
        },
        remove(member) {
            this.member_rows.push(member)
            let position = this.receives.indexOf(member)
            this.receives.splice(position,1)
        },
        send(){
            const formdata = new FormData()
            const teamid = this.team_id
            let arr = []
            for (let i in this.receives) {
                arr.push(this.receives[i].email)
            }
            formdata.append('emails', arr.join(','))
            this.$axios
                .put(`/team/${teamid}/add_member/`, formdata)
                .then((res) => {
                    return this.$axios
                        .get(`/team/${teamid}/`)
                        .then((res) => {
                            this.receives = []
                            this.rows = res.data.team.employee_list
                            this.member_rows = res.data.non_members
                        })
                    .catch((e) => {})
                })
                .catch(function(error) {
                    alert(error)
                })
        },
        sortFunction(arr) {
            return arr.slice().sort(function(a, b) {
                return (a.name.split(" ")[a.name.split(" ").length - 1]).localeCompare(b.name.split(" ")[b.name.split(" ").length - 1])
            })
        },
        isEmployee(value) {
            return value.name.toLowerCase().includes(this.search.toLowerCase())
        },
        
    }
}
</script>
<style lang="scss" scoped>
.main-content {
    width: 100%;
    margin-left: 0.01%;
    // padding:5px 0px;
    .main-profile {
        .pointer {
            cursor: pointer; 
        }
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
}
.border {
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
}
</style>