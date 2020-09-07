<template>
  <div class="main-content">
    <div class="position-absolute sticky-top mt-2 mybcrumb">
      <b-breadcrumb :items="items"></b-breadcrumb>
    </div>
    <b-card class="mx-5 border-0" no-body>
      <b-tabs card align="center">
        <b-tab title="Active" title-link-class="text-info" active>
          <table class="table table-bordered table-striped text-center">
            <thead class>
              <tr class>
                <th class="firstrow" scope="col" @click="nameSort()">
                  <button
                    class="btn dropdown-toggle text-white text-uppercase font-weight-bold"
                  >
                    User
                  </button>
                </th>
                <th scope="col" @click="sortLeaveRemain()">
                  <button
                    class="btn dropdown-toggle text-white text-uppercase font-weight-bold"
                  >
                    Leave left
                  </button>
                </th>
                <th scope="col" @click="sortFrom()">
                  <button
                    class="btn dropdown-toggle text-white text-uppercase font-weight-bold"
                  >
                    Date
                  </button>
                  <br />
                </th>
                <th scope="col" @click="sortTitle()">
                  <button
                    class="btn dropdown-toggle text-white text-uppercase font-weight-bold"
                  >
                    Reason
                  </button>
                </th>
                <th scope="col" @click="sortStatus()">
                  <button
                    class="btn dropdown-toggle text-white text-uppercase font-weight-bold"
                  >
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
              <tr v-for="(act, index) in acts" :key="index">
                <td scope="row" class="text-muted">
                  {{ act.request_off_id.profile.name }}
                </td>
                <td scope="row" class="text-muted">
                  {{ act.leave_day_left }}
                </td>
                <td>
                  <div class="container-fluid">
                    <div v-for="item in act.request_off_id.date_off">
                      <div class="row">
                        <div class="col border-bottom border-right border-top">
                          {{ item.date }}
                        </div>
                        <div class="col border-bottom border-top">
                          {{ item.type }}
                        </div>
                        <hr />
                      </div>
                    </div>
                  </div>
                </td>
                <td scope="row" class="font-weight-bold">
                  {{ act.request_off_id.reason }}
                </td>
                <td scope="row">
                  <a
                    class="text-white font-weight-bold text-center d-block w-100 py-2 badge badge-pill badge-danger pointer"
                    v-if="act.request_off_id.status === 'Rejected' || act.request_off_id.status === 'Cancel'"
                    @click="rejected_reason(act.request_off_id.status, act.request_off_id.request_detail)"
                  >
                    {{ act.request_off_id.status }}
                  </a>
                  <a
                    v-else
                    class="text-white font-weight-bold text-center d-block w-100 py-2 badge badge-pill"
                    :class="{
                      'badge-success': act.request_off_id.status === 'Approved',
                      'badge-info':
                        act.request_off_id.status === 'Pending'
                          ? true
                          : act.request_off_id.status === 'Forwarded'
                          ? true
                          : false
                    }"
                  >
                    {{ act.request_off_id.status }}
                  </a>
                </td>
                <td scope="row">
                  <button
                    v-show="!act.status"
                    class="btn btn-danger py-2  btn-sm"
                    title="Reject"
                    @click.prevent="
                      Reject(
                        act.request_off_id.profile.name,
                        act.request_off_id.profile.id,
                        act.request_off_id.id,
                        act.request_off_id.reason,
                        act.request_off_id.date_off,
                        index
                      )
                    "
                  >
                    <font-awesome-icon
                      class="text-white fa-fw"
                      :icon="['fas', 'times']"
                    />
                  </button>
                  <button
                    v-show="!act.status"
                    class="btn btn-success py-2  btn-sm"
                    title="Approve"
                    @click.prevent="
                      Accept(
                        act.request_off_id.profile.name,
                        act.request_off_id.profile.id,
                        act.request_off_id.id,
                        act.request_off_id.reason,
                        act.request_off_id.date_off,
                        index
                      )
                    "
                  >
                    <font-awesome-icon
                      class="text-white fa-fw"
                      :icon="['fas', 'check']"
                    />
                  </button>

                  <div v-if="act.status">
                    <a
                      class="text-white font-weight-bold text-center d-block w-100 py-2 badge badge-pill badge-danger pointer"
                      v-if="act.status === 'Rejected'"
                      @click="rejected_reason(act.status, act.comment)"
                    >
                      You have {{ act.status }}
                    </a>
                    <a
                      v-else
                      class="text-white font-weight-bold text-center d-block w-100 py-2 badge badge-pill"
                      :class="{
                        'badge-success': act.status === 'Approved'
                      }"
                    >
                      You have {{ act.status }}
                    </a>
                  </div>
                </td>
                <!-- <td scope="row" v-show="act.status !== 'Pending' && is_admin === 'true'"></td> -->
              </tr>
            </tbody>
          </table>
          <nav
            aria-label="Page navigation example"
            v-show="pageNumber > 1"
            class="mt-3"
          >
            <ul class="pagination justify-content-center">
              <li
                v-for="page in pageNumber"
                :key="page.index"
                class="page-item"
                :class="{ active: page === pageCurrent }"
              >
                <a @click="getData(page)" class="page-link btn">{{ page }}</a>
              </li>
            </ul>
          </nav>
        </b-tab>
        <b-tab title="My" title-link-class="text-info">
          <table
            class="mx-auto table table-bordered table-striped col-10 text-center"
          >
            <thead class>
              <tr class>
                <th class="firstrow" scope="col" @click="nameSort()">
                  <button
                    class="btn text-white text-uppercase font-weight-bold dropdown-toggle"
                  >
                    User
                  </button>
                </th>
                <th scope="col" @click="sortFrom()">
                  <button
                    class="btn dropdown-toggle text-white text-uppercase font-weight-bold"
                  >
                    Date
                  </button>
                </th>
                <th scope="col" @click="sortTitle()">
                  <button
                    class="btn dropdown-toggle text-white text-uppercase font-weight-bold"
                  >
                    Reason
                  </button>
                </th>
                <th scope="col" @click="sortStatus()">
                  <button
                    class="btn dropdown-toggle text-white text-uppercase font-weight-bold"
                  >
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
              <tr v-for="(myRequest, index) in myRequests" :key="index">
                <td scope="row" class="text-muted">
                  {{ myRequest.profile.name }}
                </td>
                <td>
                  <div class="container-fluid">
                    <div v-for="item in myRequest.date_off">
                      <div class="row">
                        <div class="col border-bottom border-right border-top">
                          {{ item.date }}
                        </div>
                        <div class="col border-bottom border-top">
                          {{ item.type }}
                        </div>
                        <hr />
                      </div>
                    </div>
                  </div>
                </td>
                <td scope="row" class="font-weight-bold">
                  {{ myRequest.reason }}
                </td>
                <td scope="row">
                  <a
                  @click="rejected_reason(myRequest.status, myRequest.request_detail)"
                    class="text-white font-weight-bold text-center d-block w-100 py-2 badge badge-pill"
                    :class="{
                      'badge-danger':
                        myRequest.status === 'Rejected'
                          ? true
                          : myRequest.status === 'Cancel'
                          ? true
                          : false,
                      'badge-success': myRequest.status === 'Approved',
                      'badge-secondary': myRequest.status === 'Passed',
                      'badge-info':
                        myRequest.status === 'Pending'
                          ? true
                          : myRequest.status === 'Forwarded'
                          ? true
                          : false
                    }"
                  >
                    {{ myRequest.status }}
                  </a>
                </td>
                <td scope="row">
                  <button
                    v-show="
                      myRequest.status !== 'Cancel' &&
                      myRequest.status !== 'Rejected'
                    "
                    class="btn btn-info py-2  btn-sm"
                    title="Withdraw"
                    @click.prevent="Withdraw(myRequest.id, index)"
                  >
                    <font-awesome-icon
                      class="text-white fa-fw"
                      :icon="['fas', 'undo']"
                    />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <nav
            aria-label="Page navigation example"
            v-show="pageNumberRequest > 1"
            class="mt-3"
          >
            <ul class="pagination justify-content-center">
              <li
                v-for="page in pageNumberRequest"
                :key="page.index"
                class="page-item"
                :class="{ active: page === pageCurrentRequest }"
              >
                <a @click="getDataMyRequest(page)" class="page-link btn">{{
                  page
                }}</a>
              </li>
            </ul>
          </nav>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import { mapMutations, mapGetters } from 'vuex'
import axios from 'axios'
import {
  getManagementRequestOff,
  getMyRequest,
  actionRequest
} from '../../services/managementLeave.service'
export default {
  name: 'LeaveManage',
  middleware: 'authen',
  async created() {
    await this.asyncDataActive()
    await this.asyncDataMyRequest()
  },
  data() {
    return {
      leave_days: [],
      acts: [],
      myRequests: [],
      pageNumber: 1,
      pageCurrent: 1,
      pageNumberRequest: 1,
      pageCurrentRequest: 1,
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
          to: { name: 'Index' }
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
  computed: {
    ...mapGetters({ showNoti: 'showNoti' })
  },
  head() {
    return {
      title: 'Leave Management'
    }
  },
  async created() {
    await this.asyncDataActive()
    await this.asyncDataMyRequest()
  },
  methods: {
    sortFunction(arr) {
      // if (this.namesort) {
      //     if (this.namecount % 2 === 0) {
      //         return arr.slice().sort(function(a, b) {
      //             return a.name.localeCompare(b.name)
      //         })
      //     } else {
      //         return arr.slice().sort(function(a, b) {
      //             return b.name.localeCompare(a.name)
      //         })
      //     }
      // } else if (this.leaveRemainBoolean) {
      //     if (this.leaveRemainCount % 2 === 0) {
      //         return arr.slice().sort(function(a, b) {
      //             return a.leave_day_left-b.leave_day_left
      //         })
      //     } else {
      //         return arr.slice().sort(function(a, b) {
      //             return b.leave_day_left-a.leave_day_left
      //         })
      //     }
      // } else if (this.fromBoolean) {
      //     if (this.fromCount % 2 === 0) {
      //         return arr.slice().sort(function(a, b) {
      //             return a.start.localeCompare(b.start) || a.start_hour.localeCompare(b.start_hour)
      //         })
      //     } else {
      //         return arr.slice().sort(function(a, b) {
      //             return b.start.localeCompare(a.start) || b.start_hour.localeCompare(a.start_hour)
      //         })
      //     }
      // } else if (this.toBoolean) {
      //     if (this.toCount % 2 === 0) {
      //         return arr.slice().sort(function(a, b) {
      //             return a.end.localeCompare(b.end) || a.end_hour.localeCompare(b.end_hour)
      //         })
      //     } else {
      //         return arr.slice().sort(function(a, b) {
      //             return b.end.localeCompare(a.end) || b.end_hour.localeCompare(a.end_hour)
      //         })
      //     }
      // } else if (this.titleBoolean) {
      //     if (this.titleCount % 2 === 0) {
      //         return arr.slice().sort(function(a, b) {
      //             return a.title.localeCompare(b.title)
      //         })
      //     } else {
      //         return arr.slice().sort(function(a, b) {
      //             return b.title.localeCompare(a.title)
      //         })
      //     }
      // } else if (this.statusBoolean) {
      //     if (this.statusCount % 2 === 0) {
      //         return arr.slice().sort(function(a, b) {
      //             return a.status.length - b.status.length
      //         })
      //     } else {
      //         return arr.slice().sort(function(a, b) {
      //             return b.status.length - a.status.length
      //         })
      //     }
      // } else {
      //     return arr.slice().sort(function(a, b) {
      //         return a.status.length - b.status.length || a.start.localeCompare(b.start) || a.start_hour.localeCompare(b.start_hour)
      //     })
      // }
    },
    async asyncDataActive(page) {
      let active = await getManagementRequestOff(page)
      // if(active.status === 201 && active.data.results) {
        this.acts = active.data.results
        this.pageCurrent = active.data.current
        this.pageNumber = active.data.page_number
      // }
    },
    async asyncDataMyRequest(page) {
      let myRequest = await getMyRequest(page)
      // if(myRequest.status && myRequest.data.results) {
        this.pageCurrentRequest = myRequest.data.current
        this.pageNumberRequest = myRequest.data.page_number
        this.myRequests = myRequest.data.results
      // }
    },
    nameSort: function() {
      this.leaveRemainBoolean = false
      this.fromBoolean = false
      this.toBoolean = false
      this.titleBoolean = false
      this.statusBoolean = false
      this.namecount++
      return (this.namesort = true)
    },
    sortLeaveRemain: function() {
      this.namesort = false
      this.fromBoolean = false
      this.toBoolean = false
      this.titleBoolean = false
      this.statusBoolean = false
      this.leaveRemainCount++
      return (this.leaveRemainBoolean = true)
    },
    sortFrom: function() {
      this.namesort = false
      this.leaveRemainBoolean = false
      this.titleBoolean = false
      this.toBoolean = false
      this.statusBoolean = false
      this.fromCount++
      return (this.fromBoolean = true)
    },
    sortTo: function() {
      this.namesort = false
      this.leaveRemainBoolean = false
      this.fromBoolean = false
      this.titleBoolean = false
      this.statusBoolean = false
      this.toCount++
      return (this.toBoolean = true)
    },
    sortTitle: function() {
      this.namesort = false
      this.leaveRemainBoolean = false
      this.fromBoolean = false
      this.toBoolean = false
      this.statusBoolean = false
      this.titleCount++
      return (this.titleBoolean = true)
    },
    sortStatus: function() {
      this.namesort = false
      this.leaveRemainBoolean = false
      this.fromBoolean = false
      this.toBoolean = false
      this.titleBoolean = false
      this.statusCount++
      return (this.statusBoolean = true)
    },
    showLeaveday(id) {
      this.$refs.leavedaymodal.show()
      this.getData(id)
    },
    async getData(id) {
      await this.asyncDataActive(id)
    },
    async getDataMyRequest(id) {
      await this.asyncDataMyRequest(id)
    },
    showMsgBox(check_title, object_data) {
      const h = this.$createElement
      let string = ''
      let messageVNode = ''
      let reject_comment = ''
      if (check_title === 'Reject') {
        string = 'Do you want to reject?'
        messageVNode = h('div', { class: ['mr-auto'] }, [
          h('div', { class: ['text-center '] }, [
            h('div', { class: ['mr-auto'] }, [
              h(
                'table',
                {
                  class: [
                    'table table-bordered table-striped text-center mx-auto col-md-12'
                  ]
                },
                [
                  h('thead', [
                    h('tr', [
                      h('th', ['User']),
                      h('th', ['Reason'])
                    ])
                  ]),
                  h('tbody', { class: ['font-weight-bold'] }, [
                    h('tr', [
                      h('td', [object_data.name]),
                      h('td', [object_data.reason])
                    ])
                  ])
                ]
              ),
              h('label', { class: ['col-md-12'] }, [
                h('p', ['Enter your comments:'])
              ]),
              h('textarea', {
                class: 'col-md-10 mx-auto',
                domProps: {
                  value: this.value
                },
                on: {
                  input: function(event) {
                    reject_comment = event.target.value
                  }
                }
              })
            ])
          ])
        ])
      } else {
        string = 'Do you want to approve?'
        messageVNode = h(
          'table',
          {
            class: [
              'table table-bordered table-striped text-center mx-auto col-md-12'
            ]
          },
          [
            h('thead', [
              h('tr', [
                h('th', ['User']),
                h('th', ['Reason'])
              ])
            ]),
            h('tbody', { class: ['font-weight-bold'] }, [
              h('tr', [
                h('td', [object_data.name]),
                h('td', [object_data.reason])
              ])
            ])
          ]
        )
      }
      this.$bvModal
        .msgBoxConfirm([messageVNode], {
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
        .then((value) => {
          let id = object_data.id
          if (value && check_title === 'Reject') {
            let form_data = new FormData()

            form_data.append('comment', reject_comment)
            form_data.append('request_off_id', object_data.request_off_id)
            form_data.append('action', 'Rejected')
            actionRequest(form_data)
            this.$router.go(0)
            this.$nextTick(() => {
              this.makeToast('Leave', 'Reject successfully', 'success')
            })
          }
          if (value && check_title === 'Approve') {
            const form_data = new FormData()
            form_data.append('request_off_id', object_data.request_off_id)
            form_data.append('action', 'Approved')
            actionRequest(form_data)
            this.$router.go(0)
          }
        })
        .catch((err) => {
          // An error occurred
        })
    },
    Reject(name, profile_id, request_off_id, reason, date_off, index) {
      let leave_data = {
        name: name,
        profile_id: profile_id,
        request_off_id: request_off_id,
        reason: reason,
        date_off: date_off,
        index: index
      }
      this.showMsgBox('Reject', leave_data)
    },
    Accept(name, profile_id, request_off_id, reason, date_off, index) {
      let leave_data = {
        name: name,
        profile_id: profile_id,
        request_off_id: request_off_id,
        reason: reason,
        date_off: date_off,
        index: index
      }
      this.showMsgBox('Approve', leave_data)
    },
    async makeToast(title, content, variant) {
      try {
        await this.$root.$bvToast.toast(`This is toast number`, {
          title: 'BootstrapVue Toast',
          toaster: "b-toaster-top-center",
          autoHideDelay: 5000,
          appendToast: true
        })
      } catch(e) {
        console.log(e)
      }
    },
    rejected_reason(check, comment) {
      
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
    async Withdraw(id, index) {

      let formData = new FormData()
      formData.append('request_off_id', id)
      formData.append('action', 'Cancel')
      let respone = await actionRequest(formData)
      if(respone.status === 201 && respone.data) {
        this.$set(this.myRequests, index, respone.data)
        await this.makeToast('Leave', 'Approve successfully', 'success')
      }
    }
  }
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

.table {
  thead {
    background-color: #25c9d0;
    color: white;
  }
  img {
    max-width: 80%;
  }
  td {
    vertical-align: middle;
  }
}
.card-header {
  background-color: white;
}
.verticalMiddle {
  vertical-align: middle;
}
</style>
