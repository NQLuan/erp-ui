<template>
    <div class="main-content d-flex justify-content-center">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div class="table-responsive p-3 col-md-6 col-lg-9">
            <h2 class="card-header text-white bg-info text-left py-4">
                Import File
            </h2>
            <form id="id_import" class="p-4 text-info " method="POST" @submit.prevent="checkfile" @keyup.enter="checkfile">
                <div v-if="error_form.length" class="text-danger">
                    <ul>
                        <li v-for="error in error_form" :key="error.index">
                            {{ error }}
                        </li>
                    </ul>
                </div>
                <div class="form-group row">
                    <label class="ml-2 col-sm-2 col-form-label">File</label>
                    <div class="col-sm-9">
                        <div class="custom-file">
                            <input id="id_file" ref="file" type="file" accept=".xlsx" class="custom-file-input" @change="handleFileUpload" />
                            <label ref="fName" class="custom-file-label" for="custom_file">Choose file</label>
                        </div>
                    </div>
                </div>
                    <div class="form-group row my-3 text-center" v-show="this.files === ''">
                        <label for="input_endday" class="col-sm-12 mx-auto col-form-label alert alert-success">Please input excel file (.xlsx, .xls)</label>
                    </div>
                <div v-show="files !== ''" class="form-group row">
                    <label class="ml-2 col-sm-2 col-form-label">Email</label>
                    <div class="col-sm-9">
                        <div class="custom-file">
                            <select v-model="email" class="form-control">
                                <option v-for="value in columns" :key="value.id">
                                    {{ value }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-show="files !== ''" class="form-group row">
                    <label class="ml-2 col-sm-2 col-form-label">Name</label>
                    <div class="col-sm-9">
                        <div class="custom-file">
                            <select v-model="name" class="form-control">
                                <option v-for="value in columns" :key="value.id">
                                    {{ value }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-show="files !== ''" class="form-group row">
                    <label class="ml-2 col-sm-2 col-form-label">Phone</label>
                    <div class="col-sm-9">
                        <div class="custom-file">
                            <select v-model="phone" class="form-control">
                                <option v-for="value in columns" :key="value.id">
                                    {{ value }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
                <div v-show="files !== ''" class="form-group row">
                    <div class="col-md-2">
                        <button v-show="showbutton" type="submit" class="btn btn-info">
                            Import
                        </button>
                        <button v-show="!showbutton" type="submit" class="btn btn-warning" disabled>
                            Waiting...
                        </button>
                    </div>
                </div>
            </form>
            <p>{{ error_msg }}</p>
            <div v-if="!success && sent">
                <p class="text-success">Success: {{ valid.length }}</p>
                <p class="text-danger">Failure : {{ invalid.length }}</p>
                <table class="table table-bordered table-striped table-rounded table-fixed">
                <thead class>
                    <tr class>
                        <th class="firstrow" scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Row
                            </span>
                        </th>
                        <th scope="col">
                            <button class="btn text-white text-uppercase font-weight-bold">
                                Name
                            </button>
                        </th>
                        <th class="px-5" scope="col">
                            <button class="btn text-white text-uppercase font-weight-bold">
                                Email
                            </button>
                        </th>
                        <th  scope="col">
                            <button class="btn text-white text-uppercase font-weight-bold">
                                Personal Email
                            </button>
                        </th>
                        <th class="px-4" scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Phone
                            </span>
                        </th>
                        <th scope="col">
                            <span class="btn text-white text-uppercase font-weight-bold">
                                Status
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="row in rows" :key="row.index" :class="{'text-danger': !row.success, 'text-info': row.success}">
                        <td class="text-center" scope="row">
                            {{ row.row }}
                        </td>
                        <td scope="row">
                            {{ row.name }}
                        </td>
                        <td scope="row">
                            {{ row.email }}
                        </td>
                        <td scope="row">
                            {{ row.personal_email }}
                        </td>
                        <td scope="row">
                            {{ row.phone }}
                        </td>
                        <td scope="row" :class="{'bg-danger text-white': !row.success, 'bg-success text-white': row.success}">
                            {{ row.status }}
                        </td>
                    </tr>
                </tbody>
            </table>
            </div>
            <div v-if="sent">
                <button v-show="showbutton && valid.length !== 0" @click="submitfile()" class="btn btn-success">
                    Confirm
                </button>
                <button v-show="showbutton" @click="cancelfile()" type="submit" class="btn btn-danger">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
export default {
    name: 'id_import',
    middleware: 'authen',
    data() {
        return {
            data: '',
            files: '',
            file_name: '',
            email: '',
            personal_email: '',
            name: '',
            phone: '',
            rows: [],
            columns: [],
            accept: false,
            success: '',
            success_emails: '',
            failure_emails: '',
            error_msg: '',
            valid: '',
            invalid: '',
            sent: false,
            error_form: [],
            showbutton: true,
            items: [
                {
                    text: 'Homepage',
                    to: { name: 'Index' }
                },
                {
                    text: 'Employee List',
                    to: { name: 'employeelist' }
                },
                {
                    text: 'Import',
                    active: true
                }
            ]
        }
    },
    head () {
        return {
            title: 'Import File',
        }
    },
    methods: {
        handleFileUpload: function(event) {
            this.files = event.target.files[0]
            if (event.target.files[0] !== undefined){
                this.file_name = event.target.files[0].name
            } else {
                this.file_name = ''
            }
            this.email = ''
            this.phone = ''
            this.name = ''
            const fName = this.$refs.fName
            const re = /^.+\.xlsx$/
            if (!re.test(this.file_name)) {
                event.target.classList.add('was-validated')
                // test again becuz i can not see anything for validation if is was not excel format
            } else {
                const formdata = new FormData()
                fName.textContent = this.file_name
                // fName for what ?
                formdata.append('files', this.files)
                this.$axios.post('/admin/send_first_row/', formdata).then((res) => {
                    this.columns = res.data.columns
                    let currentemail = ''
                    let currentphone = ''
                    let currentname = ''
                    this.columns.forEach(function (column) {
                        if (column === 'email') {
                            currentemail = column
                        }
                        if (column === 'name') {
                            currentname = column
                        }
                        if (column === 'phone') {
                            currentphone = column
                        }
                    })
                    this.email = currentemail
                    this.phone = currentphone
                    this.name = currentname
                })
                this.accept = true
            }
        },
        checkfile: function() {
            if (this.accept === true) {
                if (this.email.length === 0 || this.name.length === 0) {
                    this.error_form.push('Please input fields and name')
                } else {
                    const formdata = new FormData()
                    formdata.append('files', this.files)
                    formdata.append('email', this.email)
                    formdata.append('personal_email', this.personal_email)
                    formdata.append('name', this.name)
                    formdata.append('phone', this.phone)
                    this.showbutton = false
                    this.$axios
                        .post('/admin/check_import/', formdata)
                        .then((res) => {
                            this.data = res.data
                            this.rows = res.data.rows
                            this.valid = res.data.valid
                            this.invalid = res.data.invalid
                            this.sent = true
                            this.showbutton = true
                        })
                        .catch(function(error) {
                            this.showbutton = true
                            alert(error)
                        })
                }
            }
        },
        submitfile: function() {
            this.showbutton = false
            this.$axios
                .post('/admin/import_file/', this.data)
                .then((res) => {
                    this.sent = false
                    this.showbutton = true
                    this.$router.push('/employeelist')
                })
                .catch(function(error) {
                    this.showbutton = true
                    alert(error)
                })
        },
        cancelfile: function() {
            this.sent = false
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
/* table */
.table {
    thead {
        background-color: #25c9d0;
        color: white;
    }
}
select {
    width: 100%;
}
</style>
