<template>
    <div class="main-content">
        <div class="my-2 mx-auto calendar-main row">
            <div class="position-absolute sticky-top mt-2 mybcrumb">
                <b-breadcrumb :items="items" />
            </div>
            <vue-cal
                id="lunchStatistic"
                ref="vuecal"
                :events="events"
                :on-event-click="onEventClick"
                :selected-date="this.selectedDate"
                :disable-views="['year', 'years', 'month', 'day']"
                :time="false"
                class="vuecal--blue-theme mt-3 col-9 mx-auto p-0 h-600"
                default-view="week"
                hide-weekends
                resize-x
            />
            <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items" /></div>
            <b-modal ref="mymodal" v-model="showDialog" size="lg" hide-footer hide-header>
                <div
                    :class="{
                        'bg-eat': selectedEvent.title === 'Eat',
                        'bg-no-eat': selectedEvent.title === 'No eat'
                    }"
                    class="d-block text-center text-grey pt-3"
                >
                    <h3>{{ selectedEvent.title }}</h3>
                    <h3>{{ selectedEvent.content }}</h3>
                    <h5>{{ (selectedEvent.name || '').substr(0, 10) }}</h5>
                    <strong>{{ (selectedEvent.start || '').substr(0, 10) }}</strong>
                    <hr />
                </div>
                <div class="row" v-if="selectedEvent.reason !== null && selectedEvent.reason !== undefined">
                    <div class="col-6">
                        <ul v-for="reason in displayedPosts" :key="reason.index">
                            <li>{{ reason.name }}</li>
                        </ul>
                    </div>
                    <div class="col-6">
                        <ul v-for="reason in displayedPost" :key="reason.index">
                            <li>{{ reason.name }}</li>
                        </ul>
                    </div>
                </div>
            </b-modal>
        </div>
    </div>
</template>
<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
export default {
    middleware: 'authen',
    components: { VueCal },
    asyncData({ $axios, params, error }) {
        return $axios
            .get('/lunch/')
            .then((res) => {
                return {
                    events: res.data
                }
            })
            .catch((e) => {})
    },
    data() {
        return {
            selectedDate: '',
            selectedEvent: {},
            showDialog: false,
            events: [],
            pages: [],
            perPage: 9,
            page: 1,
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'Lunch Management',
                    to: { name: 'editLunch' }
                },
                {
                    text: 'Lunch Calendar',
                    active: true
                }
            ]
        }
    },
    head() {
        return {
            title: 'Lunch Calendar',
        }
    },
    computed: {
        displayedPost() {
            return this.selectedEvent.reason.slice(Math.ceil(this.selectedEvent.reason.length/2),this.selectedEvent.reason.length)
        },
        displayedPosts() {
            return this.selectedEvent.reason.slice(0,Math.ceil(this.selectedEvent.reason.length/2))
        }
    },
    methods: {
        onEventClick(event, e) {
            this.selectedEvent = event
            this.showDialog = true
            // Prevent navigating to narrower view (default vue-cal behavior).
            e.stopPropagation()
        }
    }
}
</script>
<style lang="scss">
#lunchStatistic {
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
    .vuecal__event-title {
        font-size: 1.1em;
        font-weight: bold;
    }
    .vuecal__event-time {
        display: none;
    }
    .vuecal__event.eat {
        background-color: rgba(99, 216, 99, 0.9);
        border: 1px solid rgb(99, 216, 99);
        color: #fff;
    }
    .vuecal__event.no {
        background-color: rgba(255, 105, 97, 0.8);
        border: 1px solid rgb(255, 105, 97);
        color: #fff;
    }
    .vuecal__event-content {
        font-style: italic;
    }
}
</style>
<style lang="scss" scoped>
.calendar-main {
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
}
.bg-eat {
    background-color: rgba(99, 216, 99, 0.9);
}
.bg-no-eat {
    background-color: rgba(255, 105, 97, 0.8);
}
</style>
