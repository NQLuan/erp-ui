<template>
    <div class="main-content">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <table class="mx-auto table table-bordered table-striped col-10">
            <thead class>
                <tr class>
                    <th class="firstrow" scope="col" @click="nameSort()">
                        <button class="btn text-white text-uppercase font-weight-bold dropdown-toggle">
                            User
                        </button>
                    </th>
                    <th scope="col" @click="sortRemainingdays()">
                        <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                            Leave days remaining
                        </button>
                    </th>
                    <th scope="col" @click="sortLeavedays()">
                        <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold ">
                            Current leave days
                        </button>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in sortFunction(rows)" :key="row.index">
                    <td scope="row">
                        {{row.name}}
                    </td>
                    <td scope="row">
                        {{row.leave_day_left}}
                    </td>
                    <td class="d-flex justify-content-between" scope="row">
                        {{row.leave_day_number}}
                        <button class="btn text-info" @click="showLeaveday(row.id)"><font-awesome-icon :icon="['fas', 'info-circle']"/> </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <b-modal id="modal-lg" size="lg" title="Large Modal" ref="leavedaymodal" hide-footer hide-header>
            <label class="col-sm-12 col-form-label alert alert-success text-center" v-show="leave_days.length === 0">This user has not leave any day this year</label>
            <table class="mx-auto table table-bordered table-striped col-10" v-show="leave_days.length > 0">
                    <thead class>
                        <tr class>
                            <th class="firstrow" scope="col" @click="sortDay()">
                                <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                   Date
                                </button>
                            </th>
                            <th scope="col" @click="sortTypes()">
                                <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold ">
                                    Type
                                </button>
                            </th>
                            <th scope="col">
                                <span class="btn text-white text-uppercase font-weight-bold">
                                    Reason
                                </span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="leave_day in sortFunctionDetails(leave_days)" :key="leave_day.index">
                            <td scope="row">
                                {{leave_day.date}}
                               
                            </td>
                            <td scope="row">
                                {{leave_day.title}}
                            </td>
                            <td scope="row" v-show="leave_day.reason !== null">
                                {{leave_day.reason}}
                            </td>
                            <td scope="row" class="text-muted" v-show="leave_day.reason === null">
                                No reason
                            </td>
                        </tr>
                    </tbody>
            </table>
        </b-modal>
    </div>
</template>
<script>
export default {
    name: 'LeaveDayStatistic',
    middleware: 'authen',
    asyncData({ $axios, params, error }) {
        return $axios
            .get(`/date/list_date_statistic/`)
            .then((res) => {
                return {
                    rows: res.data
                }
            })
    },
    data() {
        return {
            leave_days: [],
            rows: [],
            lists: [],
            status: false,
            sortRemainingday:false,
            sortremainingdaycount:0,
            sortLeaveday: false,
            leavedaycount: 0,
            namesort: false,
            namecount: 0,
            sortDate: false,
            sortDateCount: 0,
            sortType: false,
            sortTypeCount: 0,
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'Index' }
                },
                {
                    text: 'Calendar',
                    to: { name: "calendar" }
                },
                {
                    text: 'Leave Day Statistic',
                    active: true
                }
            ],
        }
    },
    head () {
        return {
            title: 'Leave Day Statistic',
        }
    },
    methods: {
        sortFunction(arr) {
            if (this.sortRemainingday) {
                if (this.sortremainingdaycount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return parseFloat(a.leave_day_left.split(" ")[0]) - parseFloat(b.leave_day_left.split(" ")[0])
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return parseFloat(b.leave_day_left.split(" ")[0]) - parseFloat(a.leave_day_left.split(" ")[0])
                    })
                }
            } else if (this.sortLeaveday) {
                if (this.leavedaycount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.leave_day_number.localeCompare(b.leave_day_number)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.leave_day_number.localeCompare(a.leave_day_number)
                    })
                }
            } else if (this.namesort) {
                if (this.namecount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return (a.name.split(" ")[a.name.split(" ").length - 1]).localeCompare(b.name.split(" ")[b.name.split(" ").length - 1])
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return (b.name.split(" ")[b.name.split(" ").length - 1]).localeCompare(a.name.split(" ")[a.name.split(" ").length - 1])
                    })
                }
            } else {
                return arr.slice().sort(function(a, b) {
                    return (a.name.split(" ")[a.name.split(" ").length - 1]).localeCompare(b.name.split(" ")[b.name.split(" ").length - 1])
                })
            }
        },
        sortRemainingdays: function() {
            this.namesort = false
            this.sortLeaveday = false
            this.sortremainingdaycount ++
            return this.sortRemainingday = true
        },
        nameSort: function() {
            this.sortRemainingday = false
            this.sortLeaveday = false
            this.namecount ++
            return this.namesort = true
        },
        sortLeavedays: function() {
            this.namesort = false
            this.sortRemainingday = false
            this.leavedaycount ++
            return this.sortLeaveday = true
        },
        sortFunctionDetails(arr) {
            if (this.sortDate) {
                if (this.sortDateCount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.date.localeCompare(b.date)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.date.localeCompare(a.date)
                    })
                }
            } else if (this.sortType) {
                if (this.sortTypeCount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.title.localeCompare(b.title) || a.date.localeCompare(b.date)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.title.localeCompare(a.title) || a.date.localeCompare(b.date)
                    })
                }
            } else {
                return arr.slice().sort(function(a, b) {
                    return a.date.localeCompare(b.date)
                })
            }
        },
        sortDay: function() {
            this.sortType = false
            this.sortDateCount ++
            return this.sortDate = true
        },
        sortTypes: function() {
            this.sortDate = false
            this.sortTypeCount ++
            return this.sortType = true
        },
        showLeaveday(id) {
            this.$refs.leavedaymodal.show()
            this.getData(id)
        },
        getData(id) {
            this.$axios
                .get(`/date/${id}/`)
                .then((res) => {
                    this.leave_days = res.data
                })
                .catch(function(error) {
                    alert(error)
                })
        }
        
    },
}
</script>
<style lang="scss">
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