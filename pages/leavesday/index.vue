<template>
    <div class="main-content">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div id="id_leaves" class="main-leaves row p-3">
            <div class="col-sm-9 mx-auto">
                <h5 class="card-header text-white bg-info text-left py-4">
                    <strong>Leave day</strong>
                </h5>
                <form id="leaves" class="bg-white px-4 text-info" method="POST" @submit.prevent="handleClicktoModal('on')">
                    <div v-if="this.error !== ''" class="text-danger text-center my-2">
                        {{ this.error }}
                    </div>
                    <br>
                    <div class="form-group row my-3">
                        <label for="input_user_name" class="col-md-3 col-form-label">Name</label>
                        <div class="col-md-8 ml-2">
                            <input id="id_input_user_name" v-model="user_name" type="text" class="form-control" placeholder="user_name" disabled/>
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_endday" class="col-md-3 col-form-label">Leave days remaining</label>
                            <div class="col-md-8 ml-2">
                            <input id="id_input_endday" v-model="leave_day_left" type="text" class="form-control" placeholder="Leave days remaining" disabled/>
                        </div>
                    </div>
                    <div class="form-group row my-3 ">
                        <label for="input_startday" class="col-md-3 col-form-label">From<sup class="text-danger"> *</sup></label>
                        <div class="col-md-8 ml-2 row d-flex justify-content-between">
                            <div class="md-form col-md-6 row d-flex justify-content-between">
                                <flat-pickr
                                    v-model="startday"
                                    :config="{ 
                                        altInput: true, 
                                        altFormat: 'd-m-Y',
                                        dateFormat: 'Y-m-d',
                                        minDate: this.today,
                                        locale:{firstDayOfWeek: 1},
                                        disable:[datePicker],
                                    }"                                                          
                                    class="form-control bg-white"
                                    :class="checkbox_value ? 'col-md-12' : 'col-md-6'"
                                    placeholder="Select date"               
                                    name="date"
                                    @input="endday_mapping()"
                                    required
                                />
                                <select class="form-control col-md-5" :class="{'d-none':checkbox_value}" v-model="selectedTime">
                                    <option v-for="timeSlot in array" :key="timeSlot.index" :value="timeSlot">
                                        {{timeSlot.hour}}:{{timeSlot.min}}
                                    </option>
                                </select>
                            </div>
                            <span class="text-info mt-2">To<sup class="text-danger"> *</sup></span>
                            <div class="md-form col-md-6 row d-flex justify-content-between">   
                                <flat-pickr
                                    v-model="endday"
                                    :config="{ 
                                        altInput: true, 
                                        altFormat: 'd-m-Y',
                                        dateFormat: 'Y-m-d',
                                        minDate: endDate(),
                                        locale:{firstDayOfWeek: 1},
                                        disable:[datePicker],
                                    }"                                                          
                                    class="form-control bg-white"
                                    :class="{'col-md-12':checkbox_value===true,'col-md-6':checkbox_value===false}"
                                    placeholder="Select date"               
                                    name="date"
                                    required
                                />
                                <select class="form-control col-md-5" :class="{'d-none':checkbox_value}" v-model="selectedNextTime">
                                    <option v-for="timeSlot in array" :key="timeSlot.index" :value="timeSlot">
                                        {{timeSlot.hour}}:{{timeSlot.min}}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row my-3">
                        <label for="input_radio" class="col-md-3 col-form-label"></label>
                        <div class="col-md-8 ml-2">
                            <div label="Individual radios" class="px-2">
                                <input type="checkbox" name="lunch" v-model="checkbox_value" @change="mapping_to_no_eat()">
                                <label for="selected" class="ml-2 text-muted">All Day</label>
                            </div>
                        </div>
                    </div>
                        <div class="form-group row my-3">
                        <label for="input_title" class="col-md-3 col-form-label">Type of leave<sup class="text-danger"> *</sup></label>
                        <div class="col-md-8 ml-2">
                            <select id="id_selected_titles" v-model="title" type="text" class="form-control" required>
                                <option v-for="title in titles" :key="title.index" placeholder="title">
                                    {{ title }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group row my-3">
                        <label for="input_reason" class="col-md-3 col-form-label">Reason</label>
                        <div class="col-md-8 ml-2">
                            <textarea id="id_input_reason" v-model="reason" form="leaves" class="form-control" placeholder="Tell me your reasons"/>
                        </div>
                    </div>
                    <div class="row my-3">
                        <label for="input_radio" class="col-md-3 col-form-label">Lunch<sup class="text-danger"> *</sup></label>
                        <div class="col-md-8 ml-2">
                            <div label="Individual radios" class="px-2 mt-2">
                                <input type="radio" value="Yes" name="lunch" v-model="selected" required>
                                <label class="text-muted" for="selected">Yes</label>
                                <input class="ml-2" type="radio" value="No" name="lunch" v-model="selected">
                                <label class="text-muted" for="selected">No</label> 
                            </div>
                        </div>
                    </div>
                    <div class="row my-3" role="group">
                        <label class="col-md-3"></label>
                        <div class="col-md-8 ml-2 d-flex justify-content-end">
                            <input class="btn btn-info borderform mx-2" type="submit" value="Send" />
                        </div>  
                    </div>
                </form>
                <b-modal ref="certification_modal" hide-footer title="Leave" class="font-weight-bold">
                    <div class="d-block ml-5 pt-3">
                        <div>
                            <div><strong>User:</strong> {{this.user_name}}</div><br>
                            <div><strong>From:</strong> {{this.startday}} {{this.selectedTime.hour}}:{{this.selectedTime.min}}</div><br>
                            <div><strong>To:</strong> {{this.endday}} {{this.selectedNextTime.hour}}:{{this.selectedNextTime.min}}</div><br>
                            <div><strong>Type:</strong> {{this.title}}</div><br>
                            <div><strong>Reason:</strong> {{this.reason}}</div><br>
                            <div><strong>Lunch:</strong> {{this.selected}}</div><br>
                        </div>
                    </div>
                    <div id="user-lunch-modal-bottom">
                        <div id="modify-button" >
                            <div class="row">
                                <b-button class="mt-3 mx-auto col-4" variant="danger" @click="handleClicktoModal()">Cancel</b-button>
                                <b-button class="mt-3 mx-auto col-4" variant="info" @click="submit()">Send</b-button>
                            </div>
                        </div>
                    </div>
                </b-modal>
            </div>
        </div>
    </div>
</template>
<script>

import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import { mapMutations, mapGetters } from 'vuex'

export default {
    name: 'id_leaves',
    middleware: 'authen',
    components: {flatPickr},
    computed: mapGetters({
        showNoti: 'sidebar/showNoti'
    }),
    data() {
        return {
            checkbox_value: false,
            selected: 'none',
            user_name: '',
            today: new Date().toISOString().slice(0,10),
            startday: null,
            check: false,
            endday: null,
            type: 'Full day',
            types: [
                'Half day - Morning',
                'Half day - Afternoon',
                'Full day',
            ],
            title: 'Leave',
            titles: [
                'Leave',
                'Remote work',
            ],
            reason: '',
            leave_day_number: '',
            leave_day_left: '',
            error: '',
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'Leave Day',
                    active: true
                }
            ],
            array: this.timeDisplay(),
            selectedTime: {
                hour: '08',
                min : '00'
            },
            selectedNextTime: {
                hour: '17',
                min : '30'
            },
        }    
    },
    asyncData({ $axios }) {
        const profileid = localStorage.getItem('profile_id')
        return $axios
            .get(`/date/${profileid}/retrieve_date_statistic/`)
            .then((res) => {
                return {
                    leave_day_number: res.data.leave_day_number,
                    leave_day_left: res.data.leave_day_left,
                    user_name: res.data.name
                }
            })
            .catch((e) => {
                error({ statusCode: 404, message: 'Post not found' })
            })
    },
    head () {
        return {
            title: 'Leave Day',
        }
    },
    methods: {
        timeDisplay() {
            let array = [
                {
                    hour: '08',
                    min : '00'
                }
            ]
            let hour = 0
            let min = 0
            let hour_string = ''
            let min_string = ''
            for (let index = 8; index < 18; index++) {
                hour = index
                for (let index1 = 0; index1 < 2; index1++) {
                    min += 30
                    if (min === 0) {
                        min_string = '00'
                    } else if (min == 60) {                        
                        hour++
                        min = 0
                        min_string = '00'
                    } else {
                        min_string = min.toString()
                    }
                    if (hour < 10) {
                        hour_string = '0' + hour.toString()
                    } else {
                        hour_string = hour.toString()
                    }
                    if (!(hour === 18)) {
                        array.push({
                            "hour": hour_string,
                            "min": min_string
                        })
                    }
                }   
            }
            return array
        },
        submit: function(e) {
            const formdata = new FormData()
            const profile = localStorage.getItem('profile_id')
            this.check = true
            if (this.startday !== null && this.startday !== '') {
                formdata.append('profile', profile)
                formdata.append('start', this.startday)
            }
            if (this.endday !== null && this.endday !== '') {
                formdata.append('end', this.endday)
                this.check = false
            }
            if (this.reason !== null && this.reason !== "") {
                formdata.append('reason', this.reason)
            }
            if (this.selected !== null) {
                formdata.append('lunch', this.selected)
            }
            if (!this.checkbox_value) {
                formdata.append('start_hour', JSON.stringify(this.selectedTime))
                formdata.append('end_hour', JSON.stringify(this.selectedNextTime))
            }
            formdata.append('title', this.title)

            if (!this.check) {
                this.$axios.post(`/leave/`, formdata).then((res) => {
                    this.startday = ''
                    this.reason = ''
                    this.endday = ''
                    this.checkbox_value = false
                    this.selected = ''
                    this.$store.commit('sidebar/add')
                    this.$nextTick(() => {
                        this.$refs['certification_modal'].hide()
                        this.$nuxt.$loading.start()
                        setTimeout(() => this.$nuxt.$loading.finish(), 500) 
                    })
                    let title = 'Leave'
                    let content = 'Your leave day request was sent successfully'
                    this.makeToast(title,content)
                })
                .catch((e) => {
                    this.error = ''
                })
            }
        },
        makeToast(title,content) {
            this.$bvToast.toast(content, {
            title: title,
            variant: 'success',
            autoHideDelay: 5000,
            })
        },
        datePicker: function(date) {
            return (date.getDay() === 0 || date.getDay() === 6)
        },
        endDate: function() {
            if (this.startday === null) {
                return this.today
            }
            return this.startday
        },
        leave_left: function() {
            if (this.type === 'Full day') {
                return this.leave_day_left
            } else {
                return this.leave_day_left * 2
            }
        },
        mapping_to_no_eat() {
            if (this.checkbox_value) {
                this.selected = 'No'
            }
            else {
                return this.selected = 'none'
            }
        },
        endday_mapping() {
            let today = new Date().toISOString().slice(0,10)
            if (this.startday !== today) {
                this.endday = this.startday
            }
        },
        handleClicktoModal(key) {
            this.check = true
            this.error = ''
            if (key === 'on') {                
                if (this.startday !== null && this.endday !== null) {
                    this.check = false
                } else {
                    this.check = true
                    this.error = 'Days is not selected'
                }
            }
            if (this.startday === this.endday) {
                if (parseInt(this.selectedTime.hour) > parseInt(this.selectedNextTime.hour) || (parseInt(this.selectedTime.hour) === parseInt(this.selectedNextTime.hour) && parseInt(this.selectedTime.min) > parseInt(this.selectedNextTime.min))) {
                    this.check = true
                    this.error = 'Start hour is set before end hour.'
                }
            }
            if (!this.check) {
                this.$refs['certification_modal'].show()
            }
            this.$refs['certification_modal'].hide()
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
input[type=checkbox]
{
  /* Double-sized Checkboxes */
  -ms-transform: scale(1.5); /* IE */
  -moz-transform: scale(1.5); /* FF */
  -webkit-transform: scale(1.5); /* Safari and Chrome */
  -o-transform: scale(1.5); /* Opera */
  transform: scale(1.5);
  padding: 10px;
}
input[type=radio]
{
  /* Double-sized Checkboxes */
  -ms-transform: scale(1.5); /* IE */
  -moz-transform: scale(1.5); /* FF */
  -webkit-transform: scale(1.5); /* Safari and Chrome */
  -o-transform: scale(1.5); /* Opera */
  transform: scale(1.5);
  padding: 7px;
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
</style>