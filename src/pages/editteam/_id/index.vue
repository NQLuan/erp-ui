<template>
    <div class="main-content mt-2">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div class="col-md-6 mx-auto">
            <h5 class="card-header text-white bg-info text-left py-4">
                <strong>Team profile</strong>
            </h5>
            <form id="profile" class="bg-white p-4 text-info">
                <div v-if="errors.length" class="text-danger">
                    <div v-for="error in errors" :key="error">
                        {{error}}
                    </div>
                </div>
                <div class="form-group row my-3">
                    <label for="input_name" class="col-sm-3 col-form-label">Team Name</label>
                    <div class="col-sm-8 ml-2">
                        <input id="id_input_teamname" v-model="team_name" type="text" class="form-control" :placeholder="team_name" required />
                    </div>
                </div>
                <div class="form-group row my-3">
                    <label for="input_name" class="col-sm-3 col-form-label">Team Email</label>
                    <div class="col-sm-8 ml-2">
                        <input id="id_input_teamname" v-model="team_email" type="text" class="form-control" :placeholder="team_email" required/>
                    </div>
                </div>
            </form>
            <br>
            <!-- <div v-if="!this.team_email || !this.team_name">
                email or name not null
            </div>
            <div v-else> -->
                 <button class="btn btn-info" @click="submit">Save</button>
            <!-- </div> -->
        </div>
    </div>
</template>
<script>
export default {
    name: 'EditTeam',
    data() {
        return {
             team_id: '',
             items: [],
             errors: []
        }
    },
    head () {
        return {
            title: 'Edit Team',
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
                    team_email: res.data.team.team_email,
                    team_id: params.id,
                    items:[
                        {
                            text: 'Homepage',
                            to: { name: 'Index' }
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
                            text: 'Edit Team',
                            active: true
                        }
                    ]
                }
            })
            .catch((e) => {
                error({ statusCode: 404, message: 'Post not found' })
            })
    },
    methods: {
        submit: function(e) {
            this.errors = [];
            if (!this.team_name) {
                this.errors.push("Team name is not null.");
            } else if (this.team_name.length < 3) {
                this.errors.push("Team name required more than 3 characters");
            }
            if (!this.team_email) {
                this.errors.push("Team email is not null");
            }
            else if(!this.validEmail(this.team_email)) {
                this.errors.push("Valid team email required.");
            }
            if (this.errors.length === 0) {
                const formdata = new FormData()
                const teamid = this.team_id
                formdata.append('team_name', this.team_name)
                formdata.append('team_email', this.team_email)
                this.$axios
                    .put(`/team/${teamid}/`, formdata)
                    .then((res) => {
                        return this.$axios
                            .get(`/team/${teamid}/`)
                            .then((res) => {
                                this.$router.push("/team")
                            })
                        .catch((e) => {})
                    })
                    .catch(function(error) {
                        alert(error)
                    })
                }
        },
        validEmail: function(email) {
            const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        }
    },
}
</script>

<style lang="scss">
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
</style>