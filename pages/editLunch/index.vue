<template>
    <div class="main-content">
        <div class="position-absolute sticky-top mt-2 mybcrumb">
            <b-breadcrumb :items="items" />
        </div>
        <div class="px-4">
            <div class="row">
                <div class="md-form col-6 mb-2">
                    <flat-pickr
                        v-model="startday"
                        :config="{
                            altInput: true,
                            altFormat: 'd-m-Y',
                            dateFormat: 'Y-m-d',
                            disable: [datePicker],
                            locale: { firstDayOfWeek: 1 }
                        }"
                        @input="send"
                        @click="checkWeekend"
                        class="form-control bg-white"
                        placeholder="Select date"
                        name="date"
                        required
                    />
                </div>
                <div class="col-6 inner-addon right-addon">
                    <i class="glyphicon mr-3 text-muted"><font-awesome-icon :icon="['fas', 'search']" /></i>
                    <input v-model="search" class="form-control" type="text" placeholder="Search" />
                </div>
            </div>
            <div>
                <todaylunch :data="this.array" />
            </div>
            <table class="mx-auto table table-bordered table-rounded table-fixed ml-2 col-12 text-center">
                <thead>
                    <tr>
                        <th @click="nameSort()" scope="col">
                            <button class="btn center dropdown-toggle text-white text-uppercase font-weight-bold">
                                User Name
                            </button>
                        </th>
                        <th @click="statusSort()" scope="col">
                            <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                Status
                            </button>
                        </th>
                        <th scope="col">
                            <button class="btn text-center text-white text-uppercase font-weight-bold">
                                Action
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="info in sortFunction(filteredList)" :key="info.index">
                        <td class="text-muted text-center">
                            {{ info.name }}
                        </td>
                        <td class="text-muted text-center">
                            {{ info.status }}
                        </td>
                        <td>
                            <div class="d-flex justify-content-center">
                                <b-button v-if="info.status === 'Lunch'" @click="del(info.lunch_id)" class="btn btn-danger btn-sm" key="on">
                                    <font-awesome-icon :icon="['fas', 'minus']" class="text-white fa-fw" />
                                </b-button>
                                <b-button key="off" @click="add(info.id)" v-else class="btn btn-success btn-sm">
                                    <font-awesome-icon :icon="['fas', 'plus']" class="text-white fa-fw" />
                                </b-button>
                                <b-button @click="Edit_day(info.status, info.id, info.lunch_id)" class="btn btn-info btn-sm ml-2">
                                    <font-awesome-icon :icon="['fas', 'calendar-plus']" class="text-white fa-fw" />
                                </b-button>
                                <b-button @click.prevent="mass_edit(info.id)" class="btn btn-info btn-sm ml-2">
                                    <font-awesome-icon :icon="['fas', 'edit']" class="text-white fa-fw" />
                                </b-button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <b-modal ref="editlunchmodal" hide-footer hide-header>
                <div class="d-flex justify-content-between row mx-auto my-auto">
                    <b-button @click.prevent="Edit_Week()" class="btn btn-success col-md-5 mt-1">
                        Add whole week
                    </b-button>
                    <b-button @click.prevent="Edit_Month()" class="btn btn-success col-md-5 mt-1">
                        Add whole month
                    </b-button>
                    <b-button @click.prevent="Remove_Week()" class="btn btn-danger mt-2 col-md-5 mt-1">
                        Remove whole week
                    </b-button>
                    <b-button @click.prevent="Remove_Month()" class="btn btn-danger mt-2 col-md-5 mt-1">
                        Remove whole month
                    </b-button>
                </div>
            </b-modal>
            <b-modal ref="lunchdaymodal" hide-footer hide-header>
                <div class="main-content text-center">
                    <h3 class="my-2 text-info font-weight-bold">
                        Lunch
                    </h3>
                    <label class="switch my-auto">
                        <input v-model="checkedActive" @change="change_status(checkedActive)" type="checkbox" />
                        <span class="slider round" />
                    </label>
                </div>
                <div class="d-grid form-check header main-content mt-2 ml-4">
                    <span v-for="day in days" :key="day.id" v-show="checkedActive" class="mt-3">
                        <label class="container col-2 row">
                            {{ day.name }}
                            <input :id="day.id" v-model="selected" :value="day.id" type="checkbox" class="form-check-input" />
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
    </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import todaylunch from '@/components/TodayBehavior.vue'
export default {
    middleware: 'authen',
    components: {
        flatPickr,
        todaylunch
    },
    data() {
        return {
            name_sort: false,
            name_count: 0,
            status_sort: false,
            status_count: 0,
            days: [
                { id: '0', name: 'Monday' },
                { id: '1', name: 'Tuesday' },
                { id: '2', name: 'Wednesday' },
                { id: '3', name: 'Thursday' },
                { id: '4', name: 'Friday' }
            ],
            array: [],
            startday: this.checkWeekend()
                .toISOString()
                .slice(0, 10),
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'Lunch Management',
                    active: true
                }
            ],
            status: '',
            info_id: '',
            selected: [],
            get_profile_lunch: {
                id: '',
                lunch: false,
                lunch_weekly: []
            },
            checkedActive: true,
            error: '',
            mass_edit_modal_id: '',
            search: '',
            vegetarian: false
        }
    },
    computed: {
        filteredList() {
            if (this.search === '') {
                const arr = this.array
                return arr
            }
            const newArray = this.array.filter((name) => {
                return this.isEmployee(name)
            })
            return newArray
        }
    },
    asyncData({ $axios }) {
        const date = new Date()
        if (date.getDay() === 6) {
            date.setDate(date.getDate() + 1)
        }
        if (date.getDay() === 0) {
            date.setDate(date.getDate() + 1)
        }
        return $axios
            .get('/lunch/get_lunch_status/', {
                params: {
                    date: date.toISOString().slice(0, 10)
                }
            })
            .then((res) => {
                return {
                    array: res.data
                }
            })
    },
    head() {
        return {
            title: 'Lunch Management'
        }
    },
    methods: {
        getdata() {
            return this.$axios
                .get('/lunch/get_lunch_status/', {
                    params: {
                        date: this.startday
                    }
                })
                .then((res) => {
                    this.array = res.data
                })
                .catch((e) => {})
        },
        del(lunchId) {
            return this.$axios
                .delete(`/lunch/${lunchId}/`)
                .then((res) => {
                    // this.$refs.editlunchmodal.hide()
                    this.getdata()
                })
                .catch((e) => {
                    const content = 'Lunch time order is over'
                    const title = 'lunch'
                    const variant = 'danger'
                    this.makeToast(title, content, variant)
                })
        },
        add(userId) {
            const formdata = new FormData()
            formdata.append('profile', userId)
            formdata.append('date', this.startday)
            return this.$axios
                .post('/lunch/', formdata)
                .then((res) => {
                    this.getdata()
                })
                .catch((e) => {
                    const content = 'Lunch time order is over'
                    const title = 'lunch'
                    const variant = 'danger'
                    this.makeToast(title, content, variant)
                })
        },
        send() {
            return this.$axios
                .get('/lunch/get_lunch_status/', {
                    params: {
                        date: this.startday
                    }
                })
                .then((res) => {
                    this.array = res.data
                })
        },
        datePicker: function(date) {
            return date.getDay() === 0 || date.getDay() === 6
        },
        // eslint-disable-next-line camelcase
        Edit_day(lunchStatus, user_id, lunch_id) {
            // eslint-disable-next-line camelcase
            this.info_id = user_id
            this.status = lunchStatus
            this.$refs.editlunchmodal.hide()
            this.$refs.lunchdaymodal.show()
            return this.$axios.get(`/profile/${this.info_id}/get_profile_lunch/`).then((res) => {
                this.vegetarian = res.data.veggie
                this.checkedActive = res.data.lunch
                this.selected = []
                this.get_profile_lunch.lunch_weekly = res.data.lunch_weekly
                if (this.get_profile_lunch.lunch_weekly !== null) {
                    this.get_profile_lunch.lunch_weekly = this.get_profile_lunch.lunch_weekly.split(',')
                } else {
                    this.get_profile_lunch.lunch_weekly = [this.get_profile_lunch.lunch_weekly]
                    if (this.get_profile_lunch.lunch_weekly[0] === null) {
                        this.checkedActive = false
                    }
                }
                this.selected = this.get_profile_lunch.lunch_weekly
            })
        },
        sendDate() {
            if (this.checkError()) {
                const formdata = new FormData()
                formdata.append('check', this.checkedActive)
                formdata.append('lunch_weekly', this.selected)
                formdata.append('veggie', this.vegetarian)
                return this.$axios.put(`/profile/${this.info_id}/update_lunch/`, formdata).then((res) => {
                    this.makeToast('Lunch', 'Success', 'success')
                    this.getdata()
                    this.$refs.lunchdaymodal.hide()
                })
            }
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
        checkError() {
            this.error = ''
            if (this.checkedActive === true && this.selected.length === 0) {
                this.error = 'No lunch has been found'
                return false
            } else {
                return true
            }
        },
        sortFunction(arr) {
            if (this.status_sort) {
                if (this.status_count % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.status.localeCompare(b.status)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.status.localeCompare(a.status)
                    })
                }
            } else if (this.name_sort) {
                if (this.name_count % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.name.split(' ')[a.name.split(' ').length - 1].localeCompare(b.name.split(' ')[b.name.split(' ').length - 1])
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.name.split(' ')[b.name.split(' ').length - 1].localeCompare(a.name.split(' ')[a.name.split(' ').length - 1])
                    })
                }
            } else {
                return arr.slice().sort(function(a, b) {
                    return a.name.split(' ')[a.name.split(' ').length - 1].localeCompare(b.name.split(' ')[b.name.split(' ').length - 1])
                })
            }
        },
        nameSort: function() {
            this.name_count++
            this.status_sort = false
            return (this.name_sort = true)
        },
        statusSort: function() {
            this.status_count++
            this.name_count = false
            return (this.status_sort = true)
        },
        checkWeekend() {
            const date = new Date()
            if (date.getDay() === 6) {
                date.setDate(date.getDate() + 1)
            }
            if (date.getDay() === 0) {
                date.setDate(date.getDate() + 1)
            }
            return date
        },
        mass_edit(id) {
            this.mass_edit_modal_id = id
            this.$refs.editlunchmodal.show()
        },
        Edit_Week() {
            let content = 'Add week successfully'
            const title = 'Lunch'
            let variant = 'success'
            // eslint-disable-next-line camelcase
            const form_data = new FormData()
            form_data.append('date', this.startday)
            return this.$axios
                .post(`/lunch/${this.mass_edit_modal_id}/create_user_lunch_week/`, form_data)
                .then((res) => {
                    this.getdata()
                    this.$nuxt.$loading.start()
                    setTimeout(() => this.$nuxt.$loading.finish(), 500)
                    this.makeToast(title, content, variant)
                    this.$refs.editlunchmodal.hide()
                })
                .catch((e) => {
                    content = 'Lunch time order is over'
                    variant = 'danger'
                    this.makeToast(title, content, variant)
                })
        },
        Edit_Month() {
            let content = 'Add month successfully'
            const title = 'Lunch'
            const variant = 'success'
            // eslint-disable-next-line camelcase
            const form_data = new FormData()
            form_data.append('date', this.startday)
            return this.$axios
                .post(`/lunch/${this.mass_edit_modal_id}/create_user_lunch_month/`, form_data)
                .then((res) => {
                    this.getdata()
                    this.$nuxt.$loading.start()
                    setTimeout(() => this.$nuxt.$loading.finish(), 500)
                    this.makeToast(title, content, variant)
                    this.$refs.editlunchmodal.hide()
                })
                .catch((e) => {
                    content = 'Lunch time order is over'
                    // eslint-disable-next-line no-const-assign
                    variant = 'danger'
                    this.makeToast(title, content, variant)
                })
        },
        Remove_Week() {
            return this.$axios
                .delete(`/lunch/${this.mass_edit_modal_id}/remove_user_lunch_week/`, {
                    data: {
                        date: this.startday
                    }
                })
                .then((res) => {
                    this.getdata()
                    this.$nextTick(() => {
                        this.$nuxt.$loading.start()
                        setTimeout(() => this.$nuxt.$loading.finish(), 500)
                        const content = 'Remove week successfully'
                        const title = 'Leave'
                        const variant = 'success'
                        this.makeToast(title, content, variant)
                        this.$refs.editlunchmodal.hide()
                    })
                })
        },
        Remove_Month() {
            return this.$axios
                .delete(`/lunch/${this.mass_edit_modal_id}/remove_user_lunch_month/`, {
                    data: {
                        date: this.startday
                    }
                })
                .then((res) => {
                    this.getdata()
                    const content = 'Remove month successfully'
                    const title = 'Lunch'
                    const variant = 'success'
                    this.$nuxt.$loading.start()
                    setTimeout(() => this.$nuxt.$loading.finish(), 500)
                    this.makeToast(title, content, variant)
                    this.$refs.editlunchmodal.hide()
                })
        },
        makeToast(title, content, variant) {
            this.$bvToast.toast(content, {
                title: title,
                variant: variant,
                autoHideDelay: 5000
            })
        },
        isEmployee(value) {
            return value.name.toLowerCase().includes(this.search.toLowerCase())
        }
    }
}
</script>
<style lang="scss" scoped>
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
}
.day_today {
    background: grey;
    color: white;
    margin-left: 10px;
}
.inner-addon {
    position: relative;
}

.inner-addon .glyphicon {
    position: absolute;
    padding: 10px;
    pointer-events: none;
}

.right-addon .glyphicon {
    right: 0px;
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
</style>
