<template>
    <div class="background">
        <center>
            <img class="icon" src="../../static/images/logo-paradox-white-01.png" />
        </center>

        <div class="hero-content text-info">
            <div id="loginform" class="container" v-show="check_forgot_password === false">
                <!-- Outer Row -->
                <div class="row justify-content-center">
                    <div class="col-xl-4 col-lg-4 col-md-6 col-sm-8 col-12">
                        <div class="card o-hidden border-0 shadow-lg my-5">
                            <div class="card-body p-0">
                                <!-- Nested Row within Card Body -->
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="p-5">
                                            <div class="text-center">
                                                <h1 class="h4 text-info mb-4">
                                                    Welcome Back!
                                                </h1>
                                            </div>
                                            <form id="login" class="user text-danger" method="POST" @submit="checkForm" @keyup.enter="checkForm">
                                                <div v-if="error !== '' ">
                                                    {{ error }}
                                                </div>
                                                <br>
                                                <div class="form-group mb-4">
                                                    <input
                                                        id="email"
                                                        v-model="login.email"
                                                        aria-describedby="emailHelp"
                                                        type="email"
                                                        class="form-control form-control-user borderform"
                                                        placeholder="Email Address"
                                                    />
                                                </div>
                                                <div class="form-group my-4">
                                                    <input
                                                        id="password"
                                                        v-model="login.password"
                                                        type="password"
                                                        class="form-control form-control-user borderform"
                                                        placeholder="Password"
                                                    />
                                                </div>
                                                <hr class="my-4">
                                                <input class="btn btn-info btn-user btn-block borderform mt-4" type="submit" value="Login" />
                                            </form>
                                            <div class="text-center mt-3">
                                                <a class="no-underline pointer" title="Click to find your password" @click="display_forgotPass_box">Forgotten Account?</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container" v-show="check_forgot_password === true">
                <div class="d-block mt-5 pt-5">
                    <div class="col-sm-6 mx-auto bg-light p-5" v-if="!success">
                        <div class="border-bottom ml-0 text-dark font-weight-bold">
                            <h3>Find your account</h3>
                        </div>
                        <div class="border-bottom">
                            <div class="pt-2 pb-2">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td class="alert alert-danger mb-2" v-show="forgot_pass_error.title !== ''">
                                                <strong>{{forgot_pass_error.title}}</strong><br>
                                                {{forgot_pass_error.content}}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="col-sm-12 mx-auto text-dark font-weight-bold my-2">Please enter your email address to search for your account.</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="col-sm-12 mx-auto mb-2">
                                                    <input type="text" id="identify_email" class="w-100 p-1"  name="email" placeholder="Email address" autofocus="1" aria-label="email address" >
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="pt-2">
                            <div class="justify-content-end d-flex">
                                <button class="btn btn-success" @click="submit_forgotPass_box">
                                    Search
                                </button>
                                <button class="btn btn-danger ml-1" @click="display_forgotPass_box">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 mx-auto bg-light p-5" v-else>
                       <div class="border-bottom ml-0 text-success font-weight-bold">
                            <h3>Success</h3>
                        </div>
                        <div class="border-bottom">
                            <div class="pt-2 pb-2">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td class="alert alert-success mb-2">
                                                Reset password link had been sent to email {{email_to_get_password}}.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="pt-2">
                            <div class="justify-content-end d-flex">
                                <button class="btn btn-info ml-1" @click="display_forgotPass_box">
                                    Return to login
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const Cookie = require('js-cookie')
import axios from 'axios'
import { error } from 'util';

export default {
    name: 'login',
    layout: 'empty',
    middleware: 'afterlogin',
    data() {
        return {
            email_to_get_password: '',
            showbutton: true,
            error: '',
            login: {
                email: '',
                password: ''
            },
            check_forgot_password: false,
            forgot_pass_error: {
                'title': '',
                'content': ''
            },
            success: false
        }
    },
    head () {
        return {
            title: 'Login',
        }
    },
    methods: {
        submit_forgotPass_box() {
            if (this.email_to_get_password === '') {
                this.forgot_pass_error.title = 'Please fill in at least one field'
                this.forgot_pass_error.content = 'Fill in at least one field to search for your account'
            }else if (
                this.validEmail(this.email_to_get_password) !== true) {
                this.email_to_get_password = ''
                this.forgot_pass_error.title = 'Email not valid'
                this.forgot_pass_error.content = 'Fill in valid email to search for your account'
            } else {
                this.forgot_pass_error = {
                    'title': '',
                    'content': ''
                }
                const formdata = new FormData()
                formdata.append('email', this.email_to_get_password)
                axios.post(`/actions/forgot_password/`, formdata).then((res)=> {
                    this.display_forgotPass_box
                    this.forgot_pass_error = {
                        'title': '',
                        'content': ''
                    }
                    this.success = true
                }).catch((e) => {
                    this.forgot_pass_error.title = 'No search results'
                    this.forgot_pass_error.content = "Your search did not return any results. Please try again with other information"
                });
            }
        },
        display_forgotPass_box() {
            this.check_forgot_password = !this.check_forgot_password
            this.forgot_pass_error = {
                    'title': '',
                    'content': ''
            }
            this.email_to_get_password = ''
            this.success = false
        },
        checkForm: function(e) {
            this.error = ''
            if (!this.login.email) {
                this.error = 'Email required.'
            } else if (!this.validEmail(this.login.email)) {
                this.error = 'Valid email required.'
            } else if (!this.login.password || this.login.password.length < 6) {
                this.error = 'Password required more than 6 characters.'
            }
            if (this.error === '') {
                axios
                    .post('/login/', this.login)
                    .then((res) => {
                        const active = res.data.active
                        if (!active){
                            this.error = 'Users is Deactivated'
                            this.login.email = ''
                            this.login.password = ''
                        }
                        const token = res.data.token
                        Cookie.set('token', token)
                        const userId = res.data.user
                        const profileId = res.data.profile_id
                        const email = res.data.email
                        const admin = res.data.admin
                        const imageurl = res.data.image
                        const leader = res.data.leader
                        const team = res.data.team
                        const name = res.data.name
                        this.$store.commit('user/SET_CURRENT_USER', res.data)
                        localStorage.setItem('email', email)
                        localStorage.setItem('user_id', userId)
                        localStorage.setItem('profile_id', profileId)
                        localStorage.setItem('is_admin', admin)
                        localStorage.setItem('imageurl', imageurl)
                        localStorage.setItem('name', name)
                        this.$router.push('/')
                        this.$router.go(0)
                    })
                    .catch((e) => {
                        console.log(e)
                        this.error = 'Email or Password is not correct'
                        this.login.email = ''
                        this.login.password = ''
                    });
            }
            e.preventDefault()
        },
        validEmail: function(email) {
            const re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return re.test(email)
        },
    }
}
</script>

<style lang="scss" scoped>
html body {
    .background {
        background: #25c9d0;
        min-height: 100vh;
    }
    .borderform {
        border-radius: 50px;
    }
}
.icon {
    margin-top: 3%;
    width: 25%;
    min-width: 50px;
}

.no-underline {
    color: #17a2b8,
}

.no-underline:hover {
  text-decoration: none;
  color: black;
}
.pointer {
    cursor: pointer;
}

</style>
