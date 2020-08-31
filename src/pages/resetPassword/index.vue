<template>
    <div class="background">
        <center>
            <h2 class="text-white text-justify mt-5" style=" display: inline-block">
                Company name
            </h2>
            <img class="icon" src="../../static/images/logo-paradox-white-01.png" />
        </center>
        <div v-show="password.new === password.confirm">

        </div>
        <div class="hero-content text-info">
            <div id="loginform" class="container">
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
                                                    Reset Password
                                                </h1>
                                            </div>
                                            <form id="resetPassword" class="user text-danger" method="POST" @submit.prevent="checkForm" @keyup.enter="checkForm">
                                                <div v-if="error !== '' ">
                                                    {{ error }}
                                                </div>
                                                <br>
                                                <div class="form-group mb-4">
                                                    <input
                                                        id="new_pass"
                                                        v-model="password.new"
                                                        aria-describedby="emailHelp"
                                                        type="password"
                                                        class="form-control form-control-user borderform"
                                                        placeholder="New Password"
                                                    />
                                                </div>
                                                <div class="form-group my-4">
                                                    <input
                                                        id="confirm_pass"
                                                        v-model="password.confirm"
                                                        type="password"
                                                        class="form-control form-control-user borderform"
                                                        placeholder="Confirm Password"
                                                    />
                                                </div>
                                                <hr class="my-4">
                                                <input class="btn btn-info btn-user btn-block borderform mt-4" type="submit" value="Reset" />
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    // name: 'login',
    layout: 'empty',
    middleware: 'afterlogin',
    data() {
        return {
            password: {
                new: '',
                confirm: ''
            },
            error: ''
        }
    },
    head () {
        return {
            title: 'Reset Password',
        }
    },
    methods: {
        checkForm(route) {
            if (this.password.new === '') {
                this.error = 'New password required'
            } else if (this.password.confirm === ''){
                this.error = 'Confirm password required'
            } else if (this.password.new !== this.password.confirm) {
                this.error = 'New password and confirm password does not match'
            }
            else {
                this.error = ''
                const formdata  = new FormData()
                formdata.append('token', this.$route.query.token)
                formdata.append('password', this.password.new)
                this.password = {
                    'new' : '',
                    'confirm': ''
                }
                this.$axios.put(`/actions/change_password/`, formdata).then((res) => {
                    this.$router.push('/login')
                }).catch((e) => {
                    this.error = 'Token is not valid'
                })
                // alert('success')
            }
        }
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
    width: 5%;
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


