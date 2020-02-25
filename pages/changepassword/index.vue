<template>
    <div class="main-content row">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div class="my-3 ml-5 col-12" v-if="this.sent">
            <ul>
                <li class="text-info ml-5"> Your password is changed successfully</li>
            </ul>
        </div>
        <div class="my-3 ml-5 col-12" v-show="this.errors">
            <ul>
                <li class="text-danger ml-5">{{this.errors}}</li>
            </ul>
        </div>
        <div class="table-responsive mx-auto p-auto col-md-8">
            <h2 class="card-header text-white bg-info text-left py-4">
                Change password
            </h2>
            <form id="id_change_password" class="bg-white p-4 text-info" method="PUT" @submit.prevent="submit">
                <div class="form-group row">
                    <label for="input_password" class="col-md-3 col-form-label">Current Password<sup class="text-danger"> *</sup></label>
                    <div class="col-md-8">
                        <input
                            id="id_input_password"
                            v-model="currentPassword"
                            class="custom-password-input"
                            ref="file"
                            type="password"
                            name="current_password"
                        />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="input_new_password" class="col-md-3 col-form-label">New Password<sup class="text-danger"> *</sup></label>
                    <div class="col-md-8">
                        <input
                            id="id_input_new_password"
                            v-model="newPassword"
                            class="custom-password-input"
                            ref="file"
                            type="password"
                            name="current_password"
                        />
                    </div>
                </div>
                <div class="form-group row">
                    <label for="input_confirm_password" class="col-md-3 col-form-label">Confirm Password<sup class="text-danger"> *</sup></label>
                    <div class="col-md-8">
                        <input
                            id="id_input_confirm_password"
                            v-model="repeatedNewPassword"
                            class="custom-password-input"
                            ref="file"
                            type="password"
                            name="current_password"
                        />
                    </div>
                </div>
                <button type="submit" class="btn btn-info">
                    Save
                </button>
            </form>
        </div>
    </div>
</template>
<script>
const Cookie = process.client ? require('js-cookie') : undefined
import axios from 'axios'
export default {
    name: 'id_change_password',
    middleware: 'authen',
    data() {
        return {
            currentPassword: '',
            sent: false,
            newPassword: '',
            repeatedNewPassword: '',
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'Change password',
                    active: true
                }
            ],
            errors: '',
        }
    },
    head () {
        return {
            title: 'Change password',
        }
    },
    methods: {
        submit: function() {
            if(this.check_form()){
                const formdata = new FormData()
                const id = localStorage.getItem('user_id')
                formdata.append('current_password', this.currentPassword)
                formdata.append('new_password', this.newPassword)
                this.$axios.put(`/user/${id}/change_password/`, formdata).then((res) => {
                    this.sent = true
                    this.errors = ''
                })
                .catch((e) => {
                    this.errors = 'Your current password is not correct'
                    this.sent = false
                })
            } 
        },
        check_form() {
            if (this.currentPassword.length < 6) {
                this.errors = 'Current password need more than 6 characters'
                return false
            }
            if (this.newPassword.length < 6) {
                this.errors = 'New Password need more than 6 characters'
                return false
            }
            if (this.repeatedNewPassword < 6) {
                this.errors = 'Repeated New Password need more than 6 characters'
                return false
            }
            if (this.newPassword !== this.repeatedNewPassword) {
                this.errors = "New Password and Repeated New Password don't match"
                return false
            }
            return true
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
    }
    img {
        max-width: 80%;
    }
}
.custom-password-input {
    position: relative;
    z-index: 2;
    width: 100%;
    height: calc(1.5em + 0.75rem + 2px);
    margin: 0;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
}
</style>