<template>
    <div class="main-content">
        <div class="position-absolute sticky-top mt-2 mybcrumb">
            <b-breadcrumb :items="items" />
		</div>
		<td class="d-flex flex-row-reverse mr-5">
            <nuxt-link
                v-show="admin === 'true' || this.id === this.userId"
                class="btn btn-info font-weight-normal ml-2"
                :to="'/editprofile/' + row.id"
                :class="{ 'd-none': check === false }"
            >
				<font-awesome-icon :icon="['fas', 'edit']" />
			</nuxt-link>
			<button
				v-show="admin === 'true' && row.active === true && row.admin !== true"
				class="btn btn-danger font-weight-normal"
				:class="{ 'd-none': row.active === false }"
				@click="showModal(row.id, row.name)"
			>
				Deactive
			</button>
			<button
				v-show="admin === 'true' && row.active === false"
				class="btn btn-info font-weight-normal"
				:class="{ 'd-none': row.active === true }"
				@click="active(row.id)"
			>
				Active
			</button>
		</td>
		<div id="id_profile" class="main-profile row p-3">
			<div class="col-md-6 mx-auto">
				<h5 class="card-header text-white bg-info text-left py-4">
					<strong>General profile</strong>
				</h5>
				<form id="profile" class="bg-white p-4 text-info">
					<div class="form-group row">
						<label for="input_name" class="col-sm-3 col-form-label">Name</label>
						<div class="col-sm-8 ml-2">
							<p class="mt-1">
								{{ row.name }}
							</p>
						</div>
					</div>
					<div class="form-group row">
						<label for="input_email" class="col-sm-3 col-form-label"
							>Email</label
						>
						<div class="col-sm-8 ml-2">
							<p class="mt-1">
								{{ row.email }}
							</p>
						</div>
					</div>
					<div class="form-group row" v-show="admin === 'true'">
						<label for="input_personal_email" class="col-sm-3 col-form-label"
							>Personal Email</label
						>
						<div class="col-sm-8 ml-2">
							<p class="mt-1">
								{{ row.personal_email }}
							</p>
						</div>
					</div>
					<div class="form-group row">
						<label for="input_phone" class="col-sm-3 col-form-label"
							>Phone</label
						>
						<div class="col-sm-8 ml-2">
							<p class="mt-1">
								{{ row.phone }}
							</p>
						</div>
					</div>
					<div class="form-group row" v-show="admin === 'true'">
						<label for="input_identity" class="col-sm-3 col-form-label"
							>Identity Number</label
						>
						<div class="col-sm-8 ml-2">
							<p class="mt-1">
								{{ row.identity_number }}
							</p>
						</div>
					</div>
					<div class="form-group row">
						<label for="input_birthday" class="col-sm-3 col-form-label"
							>Birth day</label
						>
						<div class="col-sm-8 ml-2" v-if="admin === 'true'">
							<p class="mt-1">
								<a v-if="row.birth_day">
									{{
										row.birth_day
											.split('-')
											.reverse()
											.join('-')
									}}
								</a>
								<a v-else> </a>
							</p>
						</div>
						<div class="col-sm-8 ml-2" v-else>
							<p class="mt-1">
								<a v-if="row.birth_day">
									{{
										row.birth_day
											.split('-')
											.reverse()
											.join('-')
											.slice(0, 5)
									}}
								</a>
								<a v-else> </a>
							</p>
						</div>
					</div>
					<div class="form-group row">
						<label for="input_ava" class="col-sm-3 col-form-label"
							>Avatar</label
						>
						<div class="col-sm-8 ml-2">
							<p class="mt-1">
								<img :src="row.image" alt="" />
							</p>
						</div>
					</div>
				</form>
			</div>
			<div class="col-md-6 mx-auto">
				<h5
					class="card-header text-white bg-info text-left py-4"
					v-show="admin === 'true'"
				>
					<strong>Bank Account</strong>
				</h5>
				<form class="bg-white p-4 text-info" v-show="admin === 'true'">
				<div class="form-group row">
				<label for="input_account_number" class="col-sm-3 col-form-label">Account number</label>
						<div class="col-sm-8 ml-2">
							<p class="mt-1">
								{{ row.account_number }}
							</p>
						</div>
					</div>
					<div class="form-group row">
						<label for="input_bank_name" class="col-sm-3 col-form-label">Bank name</label>
						<div class="col-sm-8 ml-2">
							<p class="mt-1">
								{{ row.bank }}
							</p>
						</div>
					</div>
				</form>
				<div class="col mx-0 p-0">
					<h5 class="card-header text-white bg-info text-left py-4">
						<strong>Photo</strong>
						<nuxt-link
							id="seeMore_button"
							class="text-white py-4"
							:to="'/photos/' + this.id"
						>
							See more
							<font-awesome-icon :icon="['fas', 'plus']" />
						</nuxt-link>
					</h5>
					<form class="bg-white p-4 text-info">
						<div
							class="d-inline-block mt-2 mx-2 bg-white"
							v-for="photo in row.photos"
							:key="photo.index"
						>
							<img
								class="form_image"
								:src="photo.photo"
								@click="showImageModal(photo.photo)"
							/>
						</div>
					</form>
				</div>
			</div>
		</div>
		<b-modal size="xl" ref="imagemodal" hide-footer hide-header="">
			<div class="d-block text-center mx-auto px-auto">
				<img
					class="modal_image"
					:src="this.photo"
					style="max-width: -webkit-fill-available"
				/>
			</div>
		</b-modal>
		<b-modal ref="mymodal" hide-footer hide-header="">
			<div class="d-block text-center text-danger">
				<h3>Deactivate</h3>
				<hr />
			</div>
			<div class="d-block text-center mb-4" v-if="admin === 'true'">
				Do you want to deactivate user
				<p class="text-danger d-inline">{{ this.currentname }}</p>
			</div>
			<div class="row">
				<b-button class="mt-3 mx-auto col-4" variant="danger" block @click="del"
					>Confirm</b-button
				>
				<b-button
					class="mt-3 mx-auto col-4"
					variant="outline-dark"
					block
					@click="hideModal"
					>Cancel</b-button
				>
			</div>
		</b-modal>
	</div>
</template>
<script>
export default {
  name: 'id_profile',
  middleware: 'authen',
  data: () => ({
    row: [
      {
        id: '1',
        name: 'phu',
        email: 'phu@paradox.ai',
        personal_email: 'phuheo100@gmail.com',
        phone: '1234567',
        identity_number: '123456789',
        birth_day: '1997-08-23',
        account_number: '678905432',
        bank: 'ACB',
        active: true
      }
    ],
    admin: localStorage.getItem('is_admin'),
    currentname: '',
    photo: '',
    userId: localStorage.getItem('user_id'),
    id: '',
    items: [
      {
        text: 'Homepage',
        to: { name: 'index' }
      },
      {
        text: 'Profile',
        active: true
      }
    ]
  }),
  head() {
    return {
      title: 'Profile'
    }
  },
  asyncData({ params, error, $axios }) {
    return $axios
      .get(`/user/${params.id}`)
      .then((res) => {
        return {
          row: res.data,
          id: params.id
        }
      })
      .catch((e) => {
        error({ statusCode: 404, message: 'Post not found' })
      })
  },
  computed: {
    check: function() {
      const id = localStorage.getItem('user_id')
      const paramId = localStorage.getItem('param_id')
      if (id === paramId || this.admin) {
        return true
      }
      return false
    }
  },
  methods: {
    showModal(id, name) {
      this.currentid = id
      this.currentname = name
      this.$refs.mymodal.show()
    },
    hideModal() {
      this.$refs.mymodal.hide()
    },
    showImageModal(photo) {
      this.photo = photo
      this.$refs.imagemodal.show()
    },
    hideImageModal() {
      this.$refs.imagemodal.hide()
    },
    active: function(id) {
      this.$axios
        .put(`user/${id}/activate/`, '')
        .then((res) => {
          this.row.active = true
        })
        .catch((e) => {})
    },
    del: function() {
      this.$axios
        .delete(`user/${this.currentid}`)
        .then((res) => {
          this.$refs.mymodal.hide()
          this.row.active = false
        })
        .catch((e) => {})
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
  img {
    max-width: 100px;
    border-radius: 100%;
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
  .form_image {
    border-radius: 5px;
    height: auto;
    max-width: 224px;
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
#seeMore_button {
  margin-left: 65%;
  font-size: 16px;
  text-decoration: none;
}
</style>
