<template>
    <div class="main-content d-flex justify-content-center">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div class="table-responsive p-3 col-md-7">
            <h2 class="card-header text-white bg-info text-left py-4">
                Create New Team
            </h2>
            <div class="text-danger pb-2 pl-4 pt-2 text-center" v-show="error.length > 0">
                    <span>{{error}}</span>
            </div>
            <form id="id_create_form" class="bg-white p-4 text-info" method="POST">
                <div class="form-group row">
                    <label for="inputemailteam" class="col-sm-2 col-form-label">Team Email<sup class="text-danger"> *</sup></label>
                    <div class="col-sm-9">
                        <input id="id_input_email" v-model="team_email" @change="clearError(team_email)" type="email" class="form-control" placeholder="Email" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="inputnameteam" class="col-sm-2 col-form-label">Team Name<sup class="text-danger"> *</sup></label>
                    <div class="col-sm-9">
                        <input id="id_input_team_name" v-model="team_name" @change="clearError(team_name)" type="text" class="form-control" placeholder="Team Name" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="input_password" class="col-sm-2 col-form-label">Team Leader<sup class="text-danger"> *</sup></label>
                    <div class="col-sm-9">
                        <div class="custom-file">
                            <select v-model="team_leader" class="form-control">
                                <option v-for="leader in sortFunction(team_leader_emails)" :key="leader.index" :value="leader.id">
                                    {{ leader.name + ' - ' + '( ' + leader.email + ' )' }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <br />
                <div class="form-group row">
                    <div class="col-sm-10">
                        <button class="btn btn-info" @click.prevent="submit">Create</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'CreateTeam',
    middleware: 'authen',
    data() {
        return {
            error: '',
            team_email: '',
            team_name: '',
            team_leader: '',
            team_leader_emails: [],
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'Index' }
                },
                {
                    text: 'Team',
                    to: { name: 'team'}
                },
                {
                    text: 'Create',
                    active: true
                }
            ]
        }
    },
    asyncData({ $axios }) {
        return $axios.get('/team/send_leader/').then((res) => {
            return { team_leader_emails: res.data }
        })
    },
    head () {
        return {
            title: 'Create new teams',
        }
    },
    methods: {
        sortFunction(arr) {
            return arr.slice().sort(function(a, b) {
                return (a.name.split(" ")[a.name.split(" ").length - 1]).localeCompare(b.name.split(" ")[b.name.split(" ").length - 1])
            })
        },
        submit: function() {
            if(this.checkForm() === true) {
                const formdata = new FormData()
                formdata.append('team_name', this.team_name)
                formdata.append('team_email', this.team_email)
                formdata.append('team_leader', this.team_leader)
                this.$axios
                    .post('/team/', formdata)
                    .then(res => {
                        this.$router.push('/team')
                    })
                    .catch(function(error) {
                        this.error = 'Input is not valid'
                })
            }
        },
        validEmail: function(email) {
            const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        },
        checkForm() {
            this.error= ''
            if(this.team_email === ''){
                this.error = 'Email is required'
                return false
            }
            if (!this.validEmail(this.team_email)){
                this.error = 'Email is not valid'
                return false
            }
            if (this.team_name === ''){
                this.error = 'Team name is required'
                return false
            }
            if (this.team_leader === '' ) {
                this.error = 'Team leader is required'
                return false
            }
            return true
        },
        clearError(input_data) {
            if(input_data.length !==0) {
                this.error = []
                return this.error
            }
            else {
                return true
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.col-sm-2 {
    padding-left: 0px;
    padding-right: 0px;
}
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
                content: '»';
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
}
select {
    width: 100%;
    padding: 0.375rem 0.75rem;
}
</style>
