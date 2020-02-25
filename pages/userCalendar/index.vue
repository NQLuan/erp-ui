<template>
    <div class="my-2 ma-auto calendar-main-content">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <vue-cal
            ref="vuecal"
            class="vuecal--blue-theme mt-5 col-9 mx-auto p-0 h-600"
            id="userCalendar"
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
        <b-modal ref="mymodal" hide-footer hide-header="" v-model="showDialog">
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
</template>
<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
export default {
    middleware: 'authen',
    components: {
        VueCal
    },
    asyncData({ $axios, params, error }) {
        const id = localStorage.getItem('user_id')
        return $axios
            .get(`/date/${id}`)
            .then((res) => {                
                return {
                    events: res.data
                }
            })
            .catch((e) => {})
    },
    data() {
        return {
            selectedEvent: {},
            title: '',
            content: '',
            showDialog: false,
            events: [],
            items: [
            {
                text: 'Homepage',
                to: { name: 'index' }
            },
            {
                text: 'User Calendar',
                active: true
            }
            ]
        }
    },
    head () {
        return {
            title: 'User Calendar',
        }
    },
    methods:{
        onEventClick (event, e) {
            this.selectedEvent = event                        
            this.showDialog = true
            e.stopPropagation()
        },
        del(){
            const id = localStorage.getItem('user_id')
            this.$axios
                .delete(`/date/${this.selectedEvent.id}`)
                .then((res) => {
                    // this.$refs.mymodal.hide() 
                    this.$axios
                        .get(`/date/${id}`)
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
    #userCalendar {
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
    .bg-full {
            background-color: rgba(71, 147, 255, 0.8)
    }
    .bg-morning {
            background-color: rgba(253, 179, 71, 0.9); 
    }
    .bg-afternoon {
        background-color: rgba(99, 216, 99, 0.9)
    }
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
        .h-600 {
            height: 600px;
        }
    }
</style>
