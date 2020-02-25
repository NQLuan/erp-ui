<template>
    <div class="main-content">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <b-card class="mx-5 border-0" no-body>
            <b-tabs card align="center">
                <b-tab title="Active" title-link-class="text-info" active>
                    <table class="table table-bordered table-striped text-center">
                    <thead class>
                            <tr class>
                                <th class="firstrow" scope="col" @click="nameSort()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        User
                                    </button>
                                </th>
                                <th scope="col" @click="sortLeaveRemain()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        Leave left
                                    </button>
                                </th>
                                <th scope="col" @click="sortFrom()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        From
                                    </button>
                                </th>
                                <th scope="col" @click="sortTo()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        To
                                    </button>
                                </th>
                                <th scope="col" @click="sortTitle()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        Title
                                    </button>
                                </th>
                                <th scope="col" @click="sortStatus()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        Status
                                    </button>
                                </th>
                                <th scope="col">
                                    <span class="btn text-white text-uppercase font-weight-bold">
                                        Action
                                    </span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="act in sortFunction(acts)" :key="act.index">
                                <td scope="row" class="text-muted">
                                    {{act.name}}
                                </td>
                                <td scope="row" class="text-muted">
                                    {{act.leave_day_left}}
                                </td>
                                <td scope="row" class="font-weight-bold">
                                    {{act.start}}
                                    <br />
                                    {{act.start_hour}}
                                </td>
                                <td scope="row" class="font-weight-bold">
                                    {{act.end}}
                                    <br />
                                    {{act.end_hour}}
                                </td>
                                <td scope="row" class="font-weight-bold">
                                    {{act.title}}
                                </td>
                                <td scope="row">
                                    <a class="text-white font-weight-bold text-center d-block w-100 py-2 badge badge-pill badge-danger pointer" v-if="act.status === 'Rejected'" @click="rejected_reason(act.status,act.comments)">
                                        {{act.status}}
                                    </a>
                                    <a v-else class="text-white font-weight-bold text-center d-block w-100 py-2 badge badge-pill" :class="{
                                        'badge-success': act.status === 'Accepted',
                                        'badge-info': act.status === 'Pending'}">
                                            {{act.status}}
                                    </a>
                                </td>
                                <td scope="row">
                                    <button v-show="act.status === 'Pending' && is_admin === 'true'" class="btn btn-danger py-2  btn-sm" title="Reject" @click.prevent="Reject(act.name, act.profile, act.id, act.start_hour, act.start, act.end_hour, act.end, act.title, act.lunch)"> 
                                        <font-awesome-icon class="text-white fa-fw" :icon="['fas', 'times']"/>
                                    </button>
                                    <button v-show="act.status === 'Pending' && is_admin === 'true'" class="btn btn-success py-2  btn-sm" title="Approve" @click.prevent="Accept(act.name, act.profile, act.id, act.start_hour, act.start, act.end_hour, act.end, act.title, act.lunch)">
                                        <font-awesome-icon class="text-white fa-fw" :icon="['fas', 'check']"/>
                                    </button>
                                    <button v-show="act.profile.toString() === profileId && act.status !== 'Rejected'" class="btn btn-info py-2  btn-sm" title="Withdraw" @click.prevent="Withdraw(act.id)">
                                        <font-awesome-icon class="text-white fa-fw" :icon="['fas', 'undo']"/>
                                    </button>
                                </td>   
                                <!-- <td scope="row" v-show="act.status !== 'Pending' && is_admin === 'true'"></td> -->
                            </tr>
                        </tbody>
                    </table>
                </b-tab>
                <b-tab title="History" title-link-class="text-info">
                   <table class="mx-auto table table-bordered table-striped col-10 text-center">
                        <thead class>
                            <tr class>
                                <th class="firstrow" scope="col" @click="nameSort()">
                                    <button class="btn text-white text-uppercase font-weight-bold dropdown-toggle">
                                        User
                                    </button>
                                </th>
                                <th scope="col" @click="sortFrom()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        From
                                    </button>
                                </th>
                                <th scope="col" @click="sortTo()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        To
                                    </button>
                                </th>
                                <th scope="col" @click="sortTitle()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        Title
                                    </button>
                                </th>
                                <th scope="col" @click="sortStatus()">
                                    <button class="btn dropdown-toggle text-white text-uppercase font-weight-bold">
                                        Status
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="hist in sortFunction(hists)" :key="hist.index">
                                <td scope="row" class="text-muted">
                                    {{hist.name}}
                                </td>
                                <td scope="row" class="font-weight-bold">
                                    {{hist.start_hour}}
                                    <br />
                                    {{hist.start}}
                                </td>
                                <td scope="row" class="font-weight-bold">
                                    {{hist.end_hour}}
                                    <br />
                                    {{hist.end}}
                                </td>
                                <td scope="row" class="font-weight-bold">
                                    {{hist.title}}
                                </td>
                                <td scope="row">
                                    <span class="text-white font-weight-bold text-center d-block w-100 py-2 badge badge-pill" :class="{
                                        'badge-danger': hist.status === 'Rejected',
                                        'badge-success': hist.status === 'Accepted',
                                        'badge-secondary': hist.status === 'Passed'}">
                                            {{hist.status}}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </b-tab>
            </b-tabs>
        </b-card>
    </div>
</template>
<script>

import { mapMutations, mapGetters } from 'vuex'

export default {
    middleware: 'authen',
    async asyncData({ $axios,query, error }) {
        let active = await $axios.get('/leave/')
        let history = await $axios.get('/leave/',{
            params: {
                history: true
            }})
        return {
            acts: active.data,
            hists: history.data
        }
    },
    data() {
        return {
            leave_days: [],
            acts: [],
            lists: [],
            status: false,
            namesort: false,
            namecount: 0,
            leaveRemainBoolean: false,
            leaveRemainCount: 0,
            fromBoolean: false,
            fromCount: 0,
            toBoolean: false,
            toCount: 0,
            statusBoolean: false,
            statusCount: 0,
            titleBoolean: false,
            titleCount: 0,
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'index' }
                },
                {
                    text: 'Leave Management',
                    active: true
                }
            ],
            is_admin: localStorage.getItem('is_admin'),
            profileId: localStorage.getItem('profile_id')
        }
    },
    computed: mapGetters({
        showNoti: 'sidebar/showNoti'
    }),
    head () {
        return {
            title: 'Leave Management',
        }
    },
    methods: {
        sortFunction(arr) {
            if (this.namesort) {
                if (this.namecount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {                        
                        return a.name.localeCompare(b.name)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.name.localeCompare(a.name)
                    })
                }
            } else if (this.leaveRemainBoolean) {
                if (this.leaveRemainCount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.leave_day_left-b.leave_day_left
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.leave_day_left-a.leave_day_left
                    })
                }
            } else if (this.fromBoolean) {
                if (this.fromCount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.start.localeCompare(b.start) || a.start_hour.localeCompare(b.start_hour)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.start.localeCompare(a.start) || b.start_hour.localeCompare(a.start_hour)
                    })
                }
            } else if (this.toBoolean) {
                if (this.toCount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.end.localeCompare(b.end) || a.end_hour.localeCompare(b.end_hour)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.end.localeCompare(a.end) || b.end_hour.localeCompare(a.end_hour)
                    })
                }
            } else if (this.titleBoolean) {
                if (this.titleCount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.title.localeCompare(b.title)
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.title.localeCompare(a.title)
                    })
                }
            } else if (this.statusBoolean) {
                if (this.statusCount % 2 === 0) {
                    return arr.slice().sort(function(a, b) {
                        return a.status.length - b.status.length
                    })
                } else {
                    return arr.slice().sort(function(a, b) {
                        return b.status.length - a.status.length
                    })
                }
            } else {
                return arr.slice().sort(function(a, b) {
                    return a.status.length - b.status.length || a.start.localeCompare(b.start) || a.start_hour.localeCompare(b.start_hour)
                })
            }
        },
        nameSort: function() {
            this.leaveRemainBoolean = false
            this.fromBoolean = false
            this.toBoolean = false
            this.titleBoolean = false
            this.statusBoolean = false
            this.namecount ++
            return this.namesort = true
        },
        sortLeaveRemain: function() {
            this.namesort = false
            this.fromBoolean = false
            this.toBoolean = false
            this.titleBoolean = false
            this.statusBoolean = false
            this.leaveRemainCount ++
            return this.leaveRemainBoolean = true
        },
        sortFrom: function() {
            this.namesort = false
            this.leaveRemainBoolean = false
            this.titleBoolean = false
            this.toBoolean = false
            this.statusBoolean = false
            this.fromCount ++
            return this.fromBoolean = true
        },
        sortTo: function() {
            this.namesort = false
            this.leaveRemainBoolean = false
            this.fromBoolean = false
            this.titleBoolean = false
            this.statusBoolean = false
            this.toCount ++
            return this.toBoolean = true
        },
        sortTitle: function() {
            this.namesort = false
            this.leaveRemainBoolean = false
            this.fromBoolean = false
            this.toBoolean = false
            this.statusBoolean = false
            this.titleCount ++
            return this.titleBoolean = true
        },
        sortStatus: function() {
            this.namesort = false
            this.leaveRemainBoolean = false
            this.fromBoolean = false
            this.toBoolean = false
            this.titleBoolean = false
            this.statusCount ++
            return this.statusBoolean = true
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
        },
        showMsgBox(check_title, object_data) {
            const h = this.$createElement
            let string = ''
            let messageVNode = ''
            let reject_comment = ''
            if (check_title === 'Reject') {
                string = 'Do you want to reject?'
                messageVNode = h('div', { class: ['mr-auto'] },[
                    h('div', { class: ['text-center ']},[
                        h('div', { class: ['mr-auto'] }, [
                            h('table', { class: ['table table-bordered table-striped text-center mx-auto col-md-12'] }, [
                                h('thead',[
                                    h('tr',[
                                        h('th',['User']),
                                        h('th',['From']),
                                        h('th',['To'])
                                    ])
                                ]),
                                h('tbody',{class: ['font-weight-bold']},[
                                    h('tr',[
                                        h('td',[
                                            object_data.name 
                                        ]),
                                        h('td',[
                                            object_data.start_day+' '+ object_data.start_time
                                        ]),
                                        h('td',[
                                            object_data.end_day+' '+ object_data.end_time 
                                        ]),
                                    ])
                                ])
                            ]),
                            h('label',{class:['col-md-12']},[
                                h('p',[
                                    'Enter your comments:'
                                ])
                            ]),
                            h('textarea',{
                                class: 'col-md-10 mx-auto',
                                domProps: {
                                    value: this.value
                                },
                                on: {
                                    input: function (event) {
                                        reject_comment = event.target.value
                                    }
                                }
                            }),
                        ])
                    ])
                ])
            } else {
                string = 'Do you want to approve?'
                 messageVNode = h('table', { class: ['table table-bordered table-striped text-center mx-auto col-md-12'] }, [
                    h('thead',[
                        h('tr',[
                            h('th',['User']),
                            h('th',['From']),
                            h('th',['To'])
                        ])
                    ]),
                    h('tbody',{class: ['font-weight-bold']},[
                        h('tr',[
                            h('td',[
                                object_data.name 
                            ]),
                            h('td',[
                                object_data.start_day + ' ' + object_data.start_time
                            ]),
                            h('td',[
                                object_data.end_day + ' ' + object_data.end_time 
                            ])
                        ])
                    ])
                ])
            }
            this.$bvModal.msgBoxConfirm([messageVNode], {
                title: string,
                size: 'lg',
                buttonSize: 'lg',
                okVariant: 'success',
                okTitle: 'Confirm',
                cancelTitle: 'Cancel',
                footerClass: 'p-2',
                hideHeaderClose: false,
                centered: false
            })
            .then(value => {
                let id = object_data.id
                if (value && check_title === 'Reject') {
                    let form_data = new FormData()
                    form_data.append('comments', reject_comment)
                    this.$axios.put(`/leave/${id}/reject/`, form_data).then((res)=>{
                        this.$axios
                        .get(`/leave/`).then((res) => {
                            this.acts = res.data
                            this.$store.commit('sidebar/subtract')
                        })
                    })
                    this.$nextTick(() => {
                        this.makeToast('Leave', 'Reject successfully', 'success')
                        this.$nuxt.$loading.start()
                        setTimeout(() => this.$nuxt.$loading.finish(), 500)
                    }) 
                }
                if (value && check_title === 'Approve') {
                    const form_data = new FormData()
                    form_data.append('profile', object_data.profile)
                    form_data.append('id', object_data.id)
                    form_data.append('start_hour', object_data.start_time)
                    form_data.append('start', object_data.start_day)
                    form_data.append('end_hour', object_data.end_time)
                    form_data.append('end', object_data.end_day)
                    form_data.append('title', object_data.title)
                    form_data.append('lunch', object_data.lunch)
                    this.$axios.post(`/date/`, form_data).then((res) => {
                        this.$axios.get(`leave`).then((res)=>{
                            this.acts = res.data
                            this.$store.commit('sidebar/subtract')
                        })
                        this.$nextTick(() => {
                            this.$nuxt.$loading.start()
                            setTimeout(() => this.$nuxt.$loading.finish(), 500)
                            this.makeToast('Leave', 'Approve successfully','success')
                        })
                    })
                    .catch(function(error) {
                        alert(error)
                    })
                }
            })
            .catch(err => {
                // An error occurred
            })        
        },
        Reject(name, profileid, id, startime, startday, endtime, endday, title,lunch) {
            let leave_data = {
                'name': name,
                'profile': profileid,
                'id': id,
                'start_time': startime,
                'start_day': startday,
                'end_time': endtime,
                'end_day': endday,
                'title': title,
                'lunch': lunch
            }
            this.showMsgBox('Reject', leave_data)
        },
        Accept(name, profileid, id, startime, startday, endtime, endday, title, lunch) {
            let leave_data = {
                'name': name,
                'profile': profileid,
                'id': id,
                'start_time': startime,
                'start_day': startday,
                'end_time': endtime,
                'end_day': endday,
                'title': title,
                'lunch': lunch
            }
            this.showMsgBox('Approve', leave_data)
        },
        makeToast(title,content,variant) {
            this.$bvToast.toast(content, {
                title: title,
                variant: variant,
                autoHideDelay: 5000,
            })
        },
        rejected_reason(check,comment) {
            if (comment === '' || comment === null) {
                comment = 'No reason'
            }
            if (check === 'Rejected') {
                this.$bvModal.msgBoxOk(comment, {
                    title: 'Reject reason',
                    size: 'sm',
                    buttonSize: 'md',
                    okVariant: 'success',
                    headerClass: 'p-2 border-bottom-0',
                    footerClass: 'p-2 border-top-0',
                    centered: true
                })
            }
        },
        Withdraw(id){
            this.$axios.put(`/leave/${id}/withdraw/`).then((res)=> {
                this.$axios.get(`/leave/`).then((res)=> {
                    this.acts = res.data
                    this.$store.commit('sidebar/subtract')
                })
                this.$nextTick(() => {
                    this.makeToast('Leave', 'Withdraw leave day successfully', 'success')
                    this.$nuxt.$loading.start()
                    setTimeout(() => this.$nuxt.$loading.finish(), 500)
                }).catch((e)=> {
                    this.makeToast('Leave', 'Withdraw leave day unsuccessfully', 'danger')
                })
            })
        }
    },
}
</script>
<style lang="scss">
    .pointer {
        cursor: pointer;
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

    .table {
        thead {
            background-color: #25c9d0;
            color: white;
        }
        img {
            max-width: 80%;
        }
    }
    .card-header {
        background-color: white;
    }
</style>