<template>
    <div class="main-content mt-2">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div id="id_profile" class="main-profile row p-3">
            <div class="col-md-6 mx-auto">
                <h5 class="card-header text-white bg-info text-left py-4">
                    <strong>General profile</strong>
                </h5>
                <form id="profile" class="bg-white p-4 text-info">
                    <div class="text-danger">{{error}}</div>
                    <div class="form-group row my-3">
                        <label for="input_email" class="col-sm-3 col-form-label">Email</label>
                        <div class="col-sm-8 ml-2">
                            <!-- <input id="id_input_email" v-model="email" type="text" class="form-control" placeholder="Email" disabled/> -->
                            <input id="id_input_email" v-model="email" type="text" class="form-control" placeholder="Email" v-if="admin === 'true'">
                            <input id="id_input_email" v-model="email" type="text" class="form-control" placeholder="Email" v-else disabled/>
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_name" class="col-sm-3 col-form-label">Name</label>
                        <div class="col-sm-8 ml-2">
                            <input id="id_input_name" v-model="name" type="text" class="form-control" placeholder="Name" v-if="admin === 'true'">
                            <input id="id_input_name" v-model="name" type="text" class="form-control" placeholder="Name" v-else disabled/>
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_personal_email" class="col-sm-3 col-form-label">Personal Email</label>
                        <div class="col-sm-8 ml-2">
                            <input id="id_input_email" v-model="p_email" type="email" class="form-control" placeholder="Personal email" />
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_phone" class="col-sm-3 col-form-label">Phone</label>
                        <div class="col-sm-8 ml-2">
                            <input id="id_input_email" v-model="phone" type="tel"  required class="form-control" placeholder="Phone number" />
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_identity" class="col-sm-3 col-form-label">Identity Number</label>
                        <div class="col-sm-8 ml-2">
                            <input id="id_input_identity" v-model="idnumber" type="tel" class="form-control" placeholder="Identity number" />
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_birthday" class="col-sm-3 col-form-label">Birth day</label>
                        <div class="col-sm-8 ml-2">
                            <div class="md-form">
                                <flat-pickr
                                    v-model="birthday"
                                    :config="{
                                        altInput: true,
                                        altFormat: 'd-m-Y',
                                        dateFormat: 'Y-m-d',
                                        minDate: today,
                                        locale:{firstDayOfWeek: 1},
                                    }"
                                    class="form-control bg-white"
                                    placeholder="Select date"
                                    name="date"
                                    min="2019-01-01"
                                    max="2222-12-31"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_account_number" class="col-sm-3 col-form-label">Account number</label>
                        <div class="col-sm-8 ml-2">
                            <input v-model="account" type="text" class="form-control" placeholder="Account number" />
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_bank_name" class="col-sm-3 col-form-label">Bank name</label>
                        <div class="col-sm-8 ml-2">
                            <select id="id_selected_bank_name" v-model="bank_name" type="text" class="form-control">
                                <option v-for="bank in banks" :key="bank.id" placeholder="bank_name">
                                    {{ bank.value }}
                                </option>
                            </select>
                        </div>
                    </div>
                </form>
                <div class="text-center">
                    <button class="btn btn-info" @click="submit()">Save</button>
                </div>
            </div>
            <b-modal ref="my-modal" hide-footer title="Create profile picture!">
                <div>
                    <vue-croppie
                        ref="croppieRef"
                        :enableOrientation="true"
                        :enableExif="false"
                        :mouseWheelZoom="true"
                        :showZoomer="true"
                        :boundary="{ width: 300, height: 300 }"
                        :enableResize="true"
                        :viewport="{ width: 150, height: 150, type: 'circle'}"
                        @update="update"
                        @result="result">
                    </vue-croppie>
                    <div class="d-flex justify-content-between mb-3 mt-3">
                        <b-button variant="outline-success" @click="rotate(-90)">Rotate Left</b-button>
                        <b-button variant="outline-success" @click="rotate(90)">Rotate Right</b-button>
                    </div>
                </div>
                <b-button class="mt-3"  variant="outline-danger" block @click="crop()">Save</b-button>
            </b-modal>
            <div class="col-md-3 mx-auto">
                <h5 class="card-header text-white bg-info text-left py-4">
                    <strong>Profile Picture</strong>
                </h5>
                <div class="d-flex justify-content-center mt-2 bg-white">
                    <img alt="" aria-hidden="true" class="p-edit_profile__photo" :src="avatarurl">
                </div>
                <div class="d-flex justify-content-center mt-4">
                    <button  class="btn btn-info" variant="outline-danger" @click.prevent="onPickFile()">
                        Upload Photo
                    </button>
                    <input type="file" accept="image/*" @change="onFilePicked" style="display:none;" ref="fileInput">
                </div>
                <b-modal ref="my-modal" hide-footer title="Create profile picture!">
                    <div>
                        <vue-croppie
                            ref="croppieRef"
                            :enableOrientation="true"
                            :enableExif="false"
                            :mouseWheelZoom="true"
                            :showZoomer="true"
                            :boundary="{ width: 300, height: 300 }"
                            :enableResize="true"
                            :viewport="{ width: 150, height: 150, type: 'circle'}"
                            @update="update"
                            @result="result">
                        </vue-croppie>
                        <div class="d-flex justify-content-between mb-3 mt-3">
                            <b-button variant="outline-success" @click="rotate(-90)">Rotate Left</b-button>
                            <b-button variant="outline-success" @click="rotate(90)">Rotate Right</b-button>
                        </div>
                    </div>
                <b-button class="mt-3"  variant="outline-danger" block @click="crop()">Save</b-button>
            </b-modal>
            </div>
        </div>
    </div>
</template>
<script>

import 'croppie/croppie.css' // import the croppie css manually
import { log } from 'util';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';

export default {
    name: 'ListTable',
    middleware: 'authen',
    components: {flatPickr},
    data: () => ({
        avatarurl: null,
        userid: '',
        uploadfile: '',
        files: '',
        file_name: '',
        bank_value: '',
        bank_name: '',
        banks: [],
        name: '',
        email: '',
        p_email: '',
        phone: '',
        idnumber: '',
        account: '',
        birthday: '',
        id: '',
        profileid: '',
        items: [],
        error: '',
        admin: localStorage.getItem('is_admin')
    }),
    head () {
        return {
            title: 'Edit Profile',
        }
    },
    async asyncData({ query, error, $axios, params }) {
        localStorage.setItem('currentid', params.id)
        const profile = await $axios.get(`/user/${params.id}/`)
        const bankres = await $axios.options('/profile/')
        return {
            email: profile.data.email,
            name: profile.data.name,
            userid: profile.data.id,
            profileid: profile.data.profile,
            p_email: profile.data.personal_email,
            idnumber: profile.data.identity_number,
            phone: profile.data.phone,
            birthday: profile.data.birth_day,
            account: profile.data.account_number,
            bank_name: profile.data.bank,
            banks: bankres.data.actions.POST.bank.choices,
            avatarurl: profile.data.image,
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'Index' }
                },
                {
                    text: 'Profile'  ,
                    to: `/profile/${profile.data.id}`
                },
                {
                    text: 'Edit Profile',
                    active: true
                }
            ]
        }
    },
    methods: {
        showModal() {
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        onPickFile() {
            this.$refs.fileInput.click()
        },
        onFilePicked(event) {
            this.selectedFile = event.target.files[0]
            const fileReader = new FileReader()
            fileReader.readAsDataURL(this.selectedFile)
            fileReader.addEventListener('load', () =>{
                this.$refs.croppieRef.bind({
                    url: fileReader.result
                })
            })
            this.showModal()
        },
        result(output) {
            return output;
        },
        update(val) {
        },
        crop() {
            // Here we are getting the result via callback function
            // and set the result to this.cropped which is being
            // used to display the result above.
            let options = {
                type: 'blob',
                format: 'png',
                size: {width:100, height:100},
                circle: true,
            }
            this.$refs.croppieRef.result(options).then(output => {
                var newfile = new File([output], "myfile.jpg")
                this.uploadfile = newfile
                const profileId = this.profileid
                const userId = this.userid
                const formdata = new FormData()
                formdata.append('image', this.uploadfile)
                this.$axios
                    .put(`/profile/${userId}/`, formdata)
                    .then((res) => {
                        this.avatarurl = res.data.image
                        localStorage.setItem('imageurl', this.avatarurl)
                        this.$router.push(`/profile/${userId}/`)
                    })
                    .catch(function(error) {
                        this.error = "Input data is invalid."
                    })
                this.hideModal()
            })
        },
        rotate(rotationAngle) {
            this.$refs.croppieRef.rotate(rotationAngle);
        },
        handleFileUpload: function(event) {
            this.files = event.target.files[0]
            if (event.target.files[0] !== undefined){
                this.file_name = event.target.files[0].name
            } else {
                this.file_name = ''
            }
            const fName = this.$refs.fName
            fName.textContent = this.file_name
        },
        submit: function() {
            const formdata = new FormData()
            const profileId = this.profileid
            const userId = this.userid
            const re = /^\d+$/
            if(this.email !== null) {
                formdata.append('email', this.email)
            }
            if(this.name !== null) {
                formdata.append('name', this.name)
            }
            if(this.p_email !== null) {
                formdata.append('personal_email', this.p_email)
            }
            if(this.idnumber !== null) {
                formdata.append('identity_number', this.idnumber)
                if (!re.test(this.idnumber)) {
                    this.error = 'ID number need valid integer.'
                }
            }
            if(this.phone !== null) {
                formdata.append('phone', this.phone)
                if (!re.test(this.phone)) {
                    this.error = 'Phone number need valid integer.'
                }
            }
            if(this.birthday !== null) {
                formdata.append('birth_day', this.birthday)
            }
            if(this.account !== null) {
                formdata.append('account_number', this.account)
            }
            if(this.bank_name !== null) {
                formdata.append('bank', this.bank_name)
            }
            this.$axios.put(`/profile/${profileId}/`, formdata).then((res) => {
                this.$router.push(`/profile/${userId}/`)
            }).catch((e) => {
                this.error = "Input data is invalid."
            })
        }
    },
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
.main-profile {
    width: 100%;
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
.wrap {
    position: relative;
}
.description {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(29, 106, 154, 0.72);
    color: #fff;
    visibility: hidden;
    opacity: 0;
    /* transition effect. not necessary */
    transition: opacity .2s, visibility .2s;
}
.wrap:hover .description {
    visibility: visible;
    opacity: 1;
}
.avatarimage {
    height: 50px;
    width: 50px;
}
.paragraph {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
}
</style>
