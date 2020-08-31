<template>
   <div class="my-5">
        <div class="table-responsive mx-auto p-auto col-md-4">
            <div class="text-center text-danger">{{error}}</div>
            <h2 class="card-header text-white bg-info text-left py-4">
                Verify account
            </h2>
            <form id="id_change_password" class="p-4 text-info text-center" method="POST" @submit.prevent="button">
                <div>
                    <h3>Welcome to our company!</h3>
                </div>
                <div class="row mt-3">
                    <label class="font-weight-bold col-md-3">Password: </label>
                    <input type="password" v-model="password" class="col-md-7">
                </div>
                <br>
                <button type="submit" class="btn btn-info font-weight-bold">
                    Verify
                    <font-awesome-icon :icon="['fas', 'user-check']" />
                </button>
            </form>
        </div>
   </div>
</template>
<script>
   const Cookie = process.client ? require('js-cookie') : undefined
   import axios from 'axios'
   export default {
       name: 'id_verify',
       layout: 'empty',
       data() {
           return {
               password: '',
               error: '',
               check: false
           }
       },
       head () {
           return {
               title: 'Verify',
           }
       },
       methods: {
           button: function(route) {
                const formdata = new FormData()
                formdata.append('token', this.$route.query.token)
                if (this.password) {
                    formdata.append('password', this.password)
                    this.check = true
                } else {
                    this.error = 'Please enter password'
                }
                if (this.check) {
                    this.$axios.post(`/login/verify/`, formdata).then((res) => {
                        this.$router.push('/')
                    })
                }
           }
       }
   }
</script>
<style lang="scss" scoped>
   .container-fluid {
       background: #f7f7f7;
       button {
           background-color: #25c9d0;
           color: white;
           font-weight: 800;
           width: 30%;
           height: 100px;
           line-height: 1;
           text-decoration: none;
           border: none;
           border-radius: 10px;
           position: relative;
           }
       }
</style>