<template>
    <div class="main-content">
        <div id="datepicker" class="mx-auto calendar-main-content row">
            <div class="mt-4 col-9 p-0 mx-auto" v-show="admin === 'true'">
                <nuxt-link to="/leavedaystatistic" class="btn btn-info float-right pt-2 text-uppercase font-weight-bold">
                    <font-awesome-icon :icon="['fas', 'chart-bar']"/>
                    Statistic
                </nuxt-link>
            </div>
            <div class="text-center col-sm-9 row mx-auto p-0">
                <!-- <label class="col-sm-6 col-form-label alert alert-danger">The number of person not working today: <strong>{{count.leave}}</strong></label>
                <label class="col-sm-6 col-form-label alert alert-warning">The number of person working remote today: <strong>{{count.remote}}</strong></label> -->
            </div>
            <vue-cal
                ref="vuecal"
                id="calendar"
                class="vuecal--blue-theme mt-3 col-9 mx-auto p-0 h-600"
                :time="false"
                :disable-views="['day', 'year', 'years']"
                default-view="month"
                :events="events"
                :on-event-click="onEventClick"
                :cell-click-hold="true"
                hide-weekends
                resize-x
            >
            </vue-cal>
            <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
            <b-modal ref="mymodal" hide-footer hide-header v-model="showDialog">
                <div
                class="d-block text-center text-white pt-3"
                :class ="{
                    'bg-morning': selectedEvent.class === 'Morning',
                    'bg-afternoon': selectedEvent.class === 'Afternoon',
                    'bg-full': selectedEvent.class === 'Full',
                }">
                    <h3>{{ selectedEvent.title }}</h3>
                    <h5>{{ (selectedEvent.name || '').substr(0, 10) }}</h5>
                    <h5 v-html="selectedEvent.class"/>
                    <strong>{{ (selectedEvent.start || '').substr(0, 10) }}</strong>
                    <hr />
                </div>
                <div>
                    <h5>Reason:</h5>
                    <ul>
                        <li v-show="selectedEvent.reason !== null && selectedEvent.reason !== undefined"><p class="text-dark" v-html="selectedEvent.reason"/></li>
                        <li v-show="selectedEvent.reason === null || selectedEvent.reason === undefined"><p class="text-muted">No reason</p></li>
                    </ul>
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
export default {
    name: 'datepicker',
    components: { VueCal },
    middleware: 'authen',
    data: () => ({
        selectedEvent: {},
        title: '',
        content: '',
        items: [
            {
                text: 'Homepage',
                to: { name: 'index' }
            },
            {
                text: 'Company Calendar',
                active: true
            }
        ],
        showDialog: false,
        events: [],
        admin: localStorage.getItem('is_admin'),
    }),
    head () {
        return {
            title: 'Company Calendar',
        }
    },
    async asyncData({ $axios,query, error }) {
        let today_leaves = await $axios.get('/date/get_today/')
        let all_leaves = await $axios.get('/date/')
        return {
            count: today_leaves.data,
            events: all_leaves.data
        }
    },
    methods: {
        onEventClick (event, e) {
            this.selectedEvent = event
            this.showDialog = true
            e.stopPropagation()
        },
        del(){
            this.$axios
                .delete(`/date/${this.selectedEvent.id}`)
                .then((res) => { 
                    this.$axios
                        .get(`/date/`)
                        .then((res) => {
                            this.events=res.data;
                            this.$refs.mymodal.hide() 
                        })
                        .catch((e) => {})
                    })
                .catch((e) => {})
        },
        hideModal() {
            this.$refs.mymodal.hide()   
        },
    }
}
</script>

<style lang="scss"> 
#calendar {
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
        overflow:auto;
        overflow-x:hidden;
    }
    .vuecal__event-title {  
        font-size: 1.1em;
        font-weight: bold;
    }
    .vuecal__event-time {
        display: none;
    }
    .vuecal__event.Morning {background-color: rgba(255, 179, 71, 0.9);border: 1px solid rgb(255, 179, 71);color: #fff;}
    .vuecal__event.Afternoon {background-color: rgba(99, 216, 99, 0.9);border: 1px solid rgb(119, 221, 119);color: #fff;}
    .vuecal__event.Full {background-color: rgba(71, 147, 255, 0.8);border: 1px solid #50B4EB;color: #fff;}

}
</style>

<style lang="scss" scoped>
    .calendar-main-content {
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
    .h-600 {
        height: 600px;
    }
    .bg-morning {
    background-color: rgba(253, 179, 71, 0.9); 
    }
    .bg-afternoon {
        background-color: rgba(99, 216, 99, 0.9)
    }
    .bg-full {
        background-color: rgba(71, 147, 255, 0.8)
    }
</style>