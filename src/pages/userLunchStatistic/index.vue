<template>
    <div class="main-content">
        <div class="col-9 mx-auto m-1">
            <div class="my-2 btn-group p-1 d-flex justify-content-between" role="group">
                <button
                    @click="Edit_Day_1()"
                    type="button"
                    class="btn btn-info py-2 text-uppercase font-weight-bold btn-sm text-truncate rounded"
                    title="Edit specific days"
                >
                    <font-awesome-icon :icon="['fas', 'calendar-alt']" class="fa-fw" />
                    Schedule
                </button>
                <button
                    @click="Edit_Day"
                    type="button"
                    class="btn btn-info py-2 text-uppercase font-weight-bold btn-sm text-truncate rounded ml-2"
                    title="Edit specific days"
                >
                    <font-awesome-icon :icon="['fas', 'calendar-day']" class="fa-fw" />
                    Edit specific days
                </button>
                <button
                    @click="Edit_Month"
                    type="button"
                    class="btn btn-success  py-2 text-uppercase font-weight-bold border btn-sm text-truncate ml-2 rounded"
                    title="Add whole month"
                >
                    <font-awesome-icon :icon="['fas', 'calendar-plus']" class="fa-fw" />
                    Add whole month
                </button>
                <button
                    @click="Remove_Month"
                    type="button"
                    class="btn btn-danger py-2 text-uppercase font-weight-bold border btn-sm text-truncate ml-2 rounded"
                    title="Remove whole month"
                >
                    <font-awesome-icon :icon="['fas', 'calendar-minus']" class="fa-fw" />
                    Remove whole month
                </button>
            </div>
        </div>
        <div class="calendar-main">
            <div class="position-absolute sticky-top mt-2 mybcrumb">
                <b-breadcrumb :items="items" />
            </div>
        </div>
        <vue-cal
            id="userLunchStatistic"
            ref="vuecal"
            :disable-views="['year', 'years', 'day', 'week']"
            :time="false"
            :events="events"
            :selected-date="selectedDate"
            @cell-click="newEventCreation"
            class="vuecal--blue-theme col-9 mx-auto p-0 h-600 rounded"
            default-view="month"
            hide-weekends
            resize-x
        >
            <template v-slot:cell-content="" />
        </vue-cal>
        <b-modal ref="update_lunch_modal_by_days" @ok="Request_Lunch_Day" ok-title="Confirm" ok-variant="info">
            <slot>
                <h5 class="text-center">
                    <b-badge class="p-3 w-100">
                        Please select the number of days you wanna choose
                    </b-badge>
                </h5>
                <div class="col-sm-12 mx-auto row my-4">
                    <div class="col-md-6 d-flex justify-content-between py-2">
                        <strong class="pt-2">
                            From:
                        </strong>
                        <div class="md-form col-9">
                            <flat-pickr
                                v-model="startday"
                                :config="{
                                    altInput: true,
                                    altFormat: 'd-m-Y',
                                    dateFormat: 'Y-m-d',
                                    minDate: today,
                                    locale: { firstDayOfWeek: 1 },
                                    disable: [datePicker]
                                }"
                                class="form-control bg-white"
                                placeholder="Select date"
                                name="date"
                                required
                            />
                        </div>
                    </div>
                    <div class="col-md-6 d-flex justify-content-between py-2">
                        <strong class="pt-2">
                            To:
                        </strong>
                        <div class="md-form col-9">
                            <flat-pickr
                                v-model="endday"
                                :config="{
                                    altInput: true,
                                    altFormat: 'd-m-Y',
                                    dateFormat: 'Y-m-d',
                                    minDate: endDate(),
                                    locale: { firstDayOfWeek: 1 },
                                    disable: [datePicker]
                                }"
                                class="form-control bg-white"
                                placeholder="Select date"
                                name="date"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div class="col-sm-12">
                    <div class="mx-3 p-2 text-center" label="Individual radios">
                        <input v-model="selected" class="m-2" type="radio" value="Add" name="lunch" required />
                        <label class="text-muted" for="selected">Add</label>
                        <input v-model="selected" class="mx-2" type="radio" value="Remove" name="lunch" />
                        <label class="text-muted" for="selected">Remove</label>
                    </div>
                </div>
            </slot>
        </b-modal>
        <b-modal ref="lunchdaymodal" hide-footer hide-header>
            <div class="main-content text-center">
                <h3 class="my-auto text-info font-weight-bold">
                    Lunch
                </h3>
                <label class="switch my-2">
                    <input v-model="checkedActive" @change="change_status(checkedActive)" type="checkbox" />
                    <span class="slider round" />
                </label>
            </div>
            <div class="d-grid form-check header main-content mt-2 ml-4">
                <span v-for="day in days" :key="day.id" v-show="checkedActive" class="mt-3">
                    <label class="container col-2 row">
                        {{ day.name }}
                        <input :id="day.id" v-model="selected_lunch_day" :value="day.id" type="checkbox" class="form-check-input" />
                        <span class="checkmark" />
                    </label>
                </span>
                <span else class="text-danger text-center">{{ error }}</span>
            </div>
            <hr />
            <div class="d-grid form-check header main-content ml-4">
                <span v-show="checkedActive" class="mt-3">
                    <label class="container row font-weight-bold col-5 pr-0 justify-content-between">
                        <font-awesome-icon :icon="['fas', 'leaf']" class="text-success fa-fw" />
                        Veggie
                        <input v-model="vegetarian" type="checkbox" class="form-check-input" />
                        <span id="veggiecheckmark" class="checkmark" />
                    </label>
                </span>
                <span else class="text-danger text-center">{{ error }}</span>
            </div>
            <div class="footer text-center">
                <button @click="sendDate()" class="btn btn-info text-center mt-3">
                    Save
                </button>
            </div>
        </b-modal>
    </div>
</template>
<script>
import VueCal from 'vue-cal'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import 'vue-cal/dist/vuecal.css'
const id = localStorage.getItem('profile_id')
export default {
    middleware: 'authen',
    components: { VueCal, flatPickr },
    data() {
        return {
            get_profile_lunch: {
                id: '',
                lunch: false,
                lunch_weekly: []
            },
            checkedActive: true,
            selected_lunch_day: [],
            endday: new Date().toISOString().slice(0, 10),
            startday: new Date().toISOString().slice(0, 10),
            today: new Date().toISOString().slice(0, 10),
            selectedDate: '',
            selectedEvent: {},
            showDialog: false,
            events: [],
            selected: 'Add',
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'User Lunch Statistic',
                    active: true
                }
            ],
            days: [
                { id: '0', name: 'Monday' },
                { id: '1', name: 'Tuesday' },
                { id: '2', name: 'Wednesday' },
                { id: '3', name: 'Thursday' },
                { id: '4', name: 'Friday' }
            ],
            error: '',
            vegetarian:false
        }
    },
    asyncData({ $axios, params, error }) {
        return $axios
            .get(`/lunch/${id}`)
            .then((res) => {
                return {
                    events: res.data
                }
            })
            .catch((e) => {})
    },
    head() {
        return {
            title: 'User Lunch'
        }
    },
    methods: {
        Edit_Day_1() {
            // eslint-disable-next-line camelcase
            this.$refs.lunchdaymodal.show()
            return this.$axios.get(`/profile/${id}/get_profile_lunch/`).then((res) => {
                this.vegetarian = res.data.veggie
                this.checkedActive = res.data.lunch
                this.selected_lunch_day = []
                this.get_profile_lunch.lunch_weekly = res.data.lunch_weekly
                if (this.get_profile_lunch.lunch_weekly !== null) {
                    this.get_profile_lunch.lunch_weekly = this.get_profile_lunch.lunch_weekly.split(',')
                } else {
                    this.get_profile_lunch.lunch_weekly = [this.get_profile_lunch.lunch_weekly]
                    if (this.get_profile_lunch.lunch_weekly[0] === null) {
                        this.checkedActive = false
                    }
                }
                this.selected_lunch_day = this.get_profile_lunch.lunch_weekly
            })
        },
        endDate: function() {
            if (this.startday === null) {
                return this.today
            }
            return this.startday
        },
        datePicker: function(date) {
            return date.getDay() === 0 || date.getDay() === 6
        },
        getdata(response) {
            return this.$axios
                .get(`/lunch/${id}`)
                .then((res) => {
                    this.events = res.data
                    this.$nextTick(() => {
                        this.makeToast('Lunch', response, 'success')
                    })
                })
                .catch((e) => {})
        },
        Edit_Day() {
            this.$refs.update_lunch_modal_by_days.show()
        },
        newEventCreation(event) {
            const arr = event.toLocaleDateString().split('/')
            const date = arr[2] + '-' + arr[0] + '-' + arr[1]
            const formdata = new FormData()
            formdata.append('profile', id)
            formdata.append('date', date)
            this.$axios
                .post(`/lunch/${id}/update_lunch_user/`, formdata)
                .then((res) => {
                    let response = res.data.response
                    if (response === undefined) {
                        response = 'Removed successfully'
                    }
                    this.getdata(response)
                })
                .catch((e) => {
                    this.makeToast('Failed', 'Lunch order time is over', 'danger')
                })
        },
        makeToast(title, content, variant) {
            this.$bvToast.toast(content, {
                title: title,
                variant: variant,
                autoHideDelay: 1000
            })
        },
        Edit_Month() {
            const formdata = new FormData()
            formdata.append('date', this.startday)
            return this.$axios
                .post(`/lunch/${id}/create_user_lunch_month/`, formdata)
                .then((res) => {
                    this.getdata('Add month successfully')
                    this.$nuxt.$loading.start()
                    setTimeout(() => this.$nuxt.$loading.finish(), 500)
                })
                .catch((e) => {
                    this.makeToast('Lunch time order is over', 'Lunch', 'danger')
                })
        },
        Remove_Month() {
            return this.$axios
                .delete(`/lunch/${id}/remove_user_lunch_month/`, {
                    data: {
                        date: this.startday
                    }
                })
                .then((res) => {
                    this.getdata('Remove month successfully')
                    this.$nuxt.$loading.start()
                    setTimeout(() => this.$nuxt.$loading.finish(), 500)
                })
        },
        Request_Lunch_Day() {
            const formdata = new FormData()
            formdata.append('start_date', this.startday)
            formdata.append('end_date', this.endday)
            formdata.append('type', this.selected)
            return this.$axios
                .post(`/lunch/${id}/update_user_lunch_by_days/`, formdata)
                .then((res) => {
                    this.getdata('Update successfully')
                    this.$nuxt.$loading.start()
                    setTimeout(() => this.$nuxt.$loading.finish(), 500)
                })
                .catch((e) => {
                    this.makeToast('Error', 'danger', 'Lunch')
                })
        },
        change_status(check) {
            if (check === false) {
                this.selected = null
                this.disable_status = true
            } else {
                this.error = ''
                this.selected = []
                for (let index = 0; index < this.days.length; index++) {
                    this.selected.push(this.days[index].id)
                }
            }
        },
        sendDate() {
            if (this.checkError()) {
                const formdata = new FormData()
                formdata.append('check', this.checkedActive)
                formdata.append('lunch_weekly', this.selected_lunch_day)
                formdata.append('veggie', this.vegetarian)
                return this.$axios.put(`/profile/${id}/update_lunch/`, formdata).then((res) => {
                    this.makeToast('Lunch', 'Success', 'success')
                    this.getdata()
                    this.$refs.lunchdaymodal.hide()
                })
            }
        },
        checkError() {
            this.error = ''
            if (this.checkedActive === true && this.selected_lunch_day.length === 0) {
                this.error = 'No lunch has been found'
                return false
            } else {
                return true
            }
        },
    }
}
</script>
<style lang="scss">
#userLunchStatistic {
    .today {
        .vuecal__cell-content {
            .vuecal__no-event {
                color: white;
            }
            background-color: #d5ebeb;
        }
    }
    .vuecal__event {
        cursor: pointer;
        margin-top: 10px;
        margin-left: 2.5%;
        padding: 7px;
        width: 95%;
        font-size: 14px;
    }
    .vuecal__body {
        overflow: auto;
        overflow-x: hidden;
    }
    .vuecal__event-time {
        display: none;
    }
    .vuecal__event-content {
        font-style: italic;
    }
    .vuecal__cell-events-count {
        width: 18px;
        height: 2px;
        color: transparent;
    }
    .vuecal__cell--has-events {
        -webkit-box-shadow: inset 0px 0px 20px -5px rgba(37, 201, 208, 0.5);
        -moz-box-shadow: inset 0px 0px 20px -5px rgba(37, 201, 208, 0.5);
        box-shadow: inset 0px 0px 20px -5px rgba(37, 201, 208, 0.5);
    }
    
}
</style>
<style lang="scss" scoped>
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
            .breadcrumb-item:first-child::before {
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
    .h-600 {
        height: 600px;
    }
    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 34px;
    }

    /* Hide default HTML checkbox */
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    /* The slider */
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }

    .slider:before {
        position: absolute;
        content: '';
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: 0.4s;
        transition: 0.4s;
    }
    .slider.round {
        border-radius: 34px;
    }

    .slider.round:before {
        border-radius: 50%;
    }
    input:checked + .slider {
        background-color: #25c9d0;
    }

    input:focus + .slider {
        box-shadow: 0 0 1px #25c9d0;
    }

    input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
    }
    input[type='checkbox'] {
        /* Double-sized Checkboxes */
        -ms-transform: scale(2); /* IE */
        -moz-transform: scale(2); /* FF */
        -webkit-transform: scale(2); /* Safari and Chrome */
        -o-transform: scale(2); /* Opera */
        transform: scale(2);
        padding: 10px;
    }
    .checkboxtext {
        /* Checkbox text */
        font-size: 110%;
        display: inline;
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
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.1s ease-in-out;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
    .form-check {
        display: grid;
    }
    .main-content {
        width: 100%;
        margin-left: 0.01%;
        // padding:5px 0px;
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        /* Hide default HTML checkbox */
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* The slider */
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: 0.4s;
            transition: 0.4s;
        }

        .slider:before {
            position: absolute;
            content: '';
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: 0.4s;
            transition: 0.4s;
        }

        input:checked + .slider {
            background-color: #25c9d0;
        }

        input:focus + .slider {
            box-shadow: 0 0 1px #25c9d0;
        }

        input:checked + .slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }

        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }
    }
    .container {
        display: block;
        position: relative;
        padding-left: 35px;
        margin-bottom: 12px;
        cursor: pointer;
        font-size: 22px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

    /* Hide the browser's default checkbox */
    .container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }
    /* When the checkbox is checked, add a blue background */
    .container input:checked ~ #veggiecheckmark {
        background-color: #51aa1d;
    }
    /* Show the checkmark when checked */
    .checkmark {
        position: absolute;
        top: 0;
        left: 0;
        height: 25px;
        width: 25px;
        background-color: #eee;
    }

    /* On mouse-over, add a grey background color */
    .container:hover input ~ .checkmark {
        background-color: #ccc;
    }

    /* When the checkbox is checked, add a blue background */
    .container input:checked ~ .checkmark {
        background-color: #2196f3;
    }

    /* Create the checkmark/indicator (hidden when not checked) */
    .checkmark:after {
        content: '';
        position: absolute;
        display: none;
    }

    /* Show the checkmark when checked */
    .container input:checked ~ .checkmark:after {
        display: block;
    }

    /* Style the checkmark/indicator */
    .container .checkmark:after {
        left: 9px;
        top: 5px;
        width: 5px;
        height: 10px;
        border: solid white;
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
}
</style>
