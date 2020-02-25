<template>
    <div class="main-content d-flex justify-content-center">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div class="table-responsive p-3 col-md-6 col-lg-7">
            <h2 class="card-header text-white bg-info text-left py-4">
                Invite user
            </h2>
            <form id="id_invite_form" class="bg-white p-4 text-info" method="POST" @submit.prevent="Invite" @keyup.enter.prevent="Invite">
                <div v-if="errors.length">
                    <ul>
                        <li class="text-danger">
                            {{ this.errors }}
                        </li>
                    </ul>
                </div> 
                <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-3 col-form-label">Full Name<sup class="text-danger"> *</sup></label>
                    <div class="col-sm-9 pt-2">
                        <input id="id_input_name" v-model="invite.name" type="text" class="form-control row" placeholder="Name" />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="inputEmail3" class="col-sm-3 col-form-label">Company Email<sup class="text-danger"> *</sup></label>
                    <div class="col-sm-9 pt-2 inner-addon right-addon row">
                        <input id="id_input_email" class="form-control" type="text" v-model="invite.email" placeholder="Company Mail"/>
                        <i class="glyphicon mr-3 text-muted bg-grey"><p class="font-weight-bold">@para.ai</p></i>
                    </div>
                </div>
                <br />
                <div class="form-group row">
                    <div class="col-sm-3"></div>
                    <div class="col-sm-9">
                        <input v-show="this.showbutton" type="submit" class="btn btn-info" value="Send Invite"/>
                    </div>
                    <div class="col-sm-4 ml-3">
                        <input v-show="!this.showbutton" type="submit" class="btn btn-success" value="Waitting.." disabled/>
                    </div>
                </div>
            </form>
            <b-modal ref="mymodal" hide-footer hide-header>
                <div class="d-block text-center text-success">
                    <h3>Success</h3>
                    <hr />
                </div>
                <div class="d-block text-center mb-4">
                    Do you want to invite another user?
                </div>
                <div class="row">
                    <b-button class="mt-3 mx-auto col-4" variant="success" block @click="hideModal">Yes</b-button>
                    <b-button class="mt-3 mx-auto col-4" variant="outline-dark" block @click="moveTo">To employee list</b-button>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import { log } from 'util';
export default {
    name: 'id_invite_form',
    middleware: 'authen',
    data() {
        return {
            errors: '',
            invite: {
                personal_email: '',
                name: '',
                email: ''
            },
            check: null,
            showbutton: true,
            character: '',
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'Employee List',
                    to: { name: 'employeelist' }
                },
                {
                    text: 'Invite',
                    active: true
                }
            ]
        }
    },
    methods: {
        showModal: function() {
            this.$refs.mymodal.show()
        },
        hideModal: function(){
            this.$refs.mymodal.hide()   
        },
        moveTo: function() {
            this.$router.push('/employeelist')
        },
        Invite: function(e) {
            this.errors = ''
            if (this.invite.name==='') {
                this.errors = 'Name is not null'
            }
            else if (this.invite.name.length < 4) {
                this.errors = 'Name required more than 4 characters.'
            }
            else if(!this.invite.email) {    
                this.errors = 'Email required.'
            }
            else if (this.validCompanyEmail(this.invite.email) === false) {
                this.errors='Valid email required'
            }
            else {
                const formdata = new FormData()
                formdata.append('name',this.invite.name)
                formdata.append('email',this.invite.email+'@paradox.ai')
                this.showbutton = false
                this.$axios
                    .post('/admin/invite/', formdata)
                    .then((res) => {
                        this.showbutton = true
                        this.check = res.data.success
                        if(!this.check) {
                            this.errors.push(res.data.error)
                            this.invite.email = ''
                            this.invite.name = ''
                        } else {
                            this.showbutton = true
                            this.showModal()
                            this.invite.email = ''
                            this.invite.personal_email = ''
                            this.invite.name = ''
                        }
                    })
                    .catch((e) => {
                        this.showbutton = true
                        this.errors.push('This email is already exist')
                    })
            }
            e.preventDefault()
        },
        validEmail: function(email) {
            const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        }, 
        validCompanyEmail: function(email) {
            const re = /([a-zA-Z0-9_.])/
            return re.test(email)   
        }
    }
}
</script>
<style lang="scss" scoped>
.inner-addon {
    position: relative;
}
.inner-addon .glyphicon {
    position: absolute;
    padding: 5px;
    pointer-events: none;
}
.right-addon .glyphicon { right: 0px;}
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
.company_gmail_display {
   display: block;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box    
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
.table {
    thead {
        background-color: #25c9d0;
        color: white;
    }

    img {
        max-width: 80%;
    }
}
</style>