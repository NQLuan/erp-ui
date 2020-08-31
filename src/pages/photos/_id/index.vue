<template>
    <div class="main-content">
        <div class="position-absolute sticky-top mt-2 mybcrumb"><b-breadcrumb :items="items"></b-breadcrumb></div>
        <div id="id_profile" class="main-profile row p-3">
            <div class="col-md-6 mx-auto">
                <h5 class="card-header text-white bg-info text-left py-4">
                    <strong>Photo</strong>
                </h5>
                <div class=" d-flex justify-content-between py-4">
                    <div class="photos-title">
                        <font-awesome-icon :icon="['fas', 'images']"/>
                        <span>Photos</span>
                    </div>
                    <span v-if="userId === currentId" @click="showModal()" class="photos-button" data-toggle="tooltip" data-placement="top" title="choose file to upload">
                        <font-awesome-icon :icon="['fas', 'plus']"/>
                        Upload Photos
                    </span>
                </div>
                <div class="row">
                    <div class="col-4" v-for="photo in photos" :key="photo.index">
                        <div class="gallery">
                            <img class="pt-2" :src="photo.photo" alt="" @click="showImageModal(photo.photo)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <b-modal size="xl" ref="imagemodal" hide-footer hide-header="">
            <div class="d-block text-center mx-auto px-auto">
                <img class="modal_image" :src="photo" style="max-width: -webkit-fill-available">
            </div>
        </b-modal>
        <b-modal  ref="my-modal" title="Upload images">
            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"  @vdropzone-thumbnail="vgetUrl" v-on:vdropzone-thumbnail="thumbnail">
            </vue-dropzone>
            <template v-slot:modal-footer="">
                <!-- Emulate built in modal footer ok and cancel button actions -->
                <b-button size="sm" variant="success" @click="send()">
                    OK
                </b-button>
                <b-button size="sm" variant="danger" @click="hideModal()">
                    Cancel
                </b-button>
                <!-- Button with custom close trigger value -->
                </template>
        </b-modal>
    </div>
</template>
<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import 'croppie/croppie.css' // import the croppie css manually
export default {
    name: 'id_profile',
    components:{
        vueDropzone: vue2Dropzone
    },
    asyncData({$axios, params}) {
        const id = localStorage.getItem("profile_id")
        return $axios.get(`/photo/${params.id}`).then((res) => {
            return {
                photos : res.data,
                currentId: params.id
            }
        })
    },
    data() {
        const id = localStorage.getItem("profile_id")
        return {
            UploadedUrlFiles: '/images/f.png',
            photos: [],
            photo: '',
            currentId: '',
            userId: localStorage.getItem('user_id'),
            admin: localStorage.getItem('is_admin'),
            items: [
                    {
                        text: 'Homepage',
                        to: { name: 'Index' }
                    },
                    {
                        text: 'Photos',
                        active: true
                    }
                ],
            dropzoneOptions: {
                url: 'https://httpbin.org/post',
                thumbnailWidth: 100.05,
                thumbnailHeight: 120,
                maxFilesize: 0.5,
                headers: { "My-Awesome-Header": "header value" },
                addRemoveLinks: true,
            }
        }
    },
    head () {
        return {
            title: 'Photos',
        }
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
        showModal() {
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        showImageModal(photo) {
            this.photo = photo
            this.$refs.imagemodal.show()
        },
        hideImageModal() {
            this.$refs.imagemodal.hide()
        },
        vgetUrl(file) {
            for(let i =0; i<this.$refs.myVueDropzone.dropzone.files.length;i++) {
                this.UploadedUrlFiles = this.$refs.myVueDropzone.dropzone.files[i].dataURL
            }
        },
        template: function () {
            return `<div class="dz-preview dz-file-preview">
                    <div class="dz-image">
                        <div data-dz-thumbnail-bg></div>
                    </div>
                    <div class="dz-details">
                        <div class="dz-size"><span data-dz-size></span></div>
                        <div class="dz-filename"><span data-dz-name></span></div>
                    </div>
                    <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                    <div class="dz-error-message"><span data-dz-errormessage></span></div>
                    <div class="dz-success-mark"><i class="fa fa-check"></i></div>
                    <div class="dz-error-mark"><i class="fa fa-close"></i></div>
                </div>
            `;
        },
        send() {
            this.UploadedFiles = this.$refs.myVueDropzone.dropzone.files
            var newfile = []
            var x
            
            const formdata = new FormData()
            const id = localStorage.getItem("profile_id")

            for (x in this.$refs.myVueDropzone.dropzone.files) {
                newfile[x] = new File([this.$refs.myVueDropzone.dropzone.files[x]], this.$refs.myVueDropzone.dropzone.files[x].name);
                formdata.append('image', newfile[x])
                formdata.append('profile',id)
            }
            this.$axios
                .post(`/photo/`, formdata)
                .then((res) => {
                    this.hideModal();
                    this.$axios
                        .get(`/photo/${id}/`)
                        .then((res) => {
                            this.photos = res.data;
                        })
                        .catch((e) => {})
                }).catch((e) => {})
        },
        thumbnail: function(file, dataUrl) {
            var j, len, ref, thumbnailElement;
            if (file.previewElement) {
                file.previewElement.classList.remove("dz-file-preview");
                ref = file.previewElement.querySelectorAll("[data-dz-thumbnail-bg]");
                for (j = 0, len = ref.length; j < len; j++) {
                    thumbnailElement = ref[j];
                    thumbnailElement.alt = file.name;
                    thumbnailElement.style.backgroundImage = 'url("' + dataUrl + '")';
                }
                return setTimeout(((function(_this) {
                    return function() {
                        return file.previewElement.classList.add("dz-image-preview");
                    };
                })(this)), 1);
            }
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
.photos-title {
    font-size:20px;
    font-weight: bold;
    height: 24px;
    line-height: 1;
    margin: 0 12px 5px;
    cursor: pointer;
}
.photos-button {
    font-size:15px;
    font-weight: bold;
    height: 24px;
    line-height: 1;
    margin: 0 12px 5px;
    cursor: pointer;
}
.photos-button:hover {
    color: #777;
}
.gallery {
    max-width: 100%;
    max-height: 100%;
    bottom: 0;
    content: '';
    left: 0;
    right: 0;
    top: 0;
}
.p-edit_profile__photo {
    overflow: hidden;
    width: 192px;
    height: 120px;
}

.main-content {
    width: 100%;
    margin-left: 0.01%;
    img {
        max-width: 130px;
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
#customdropzone {
    background-color: orange;
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.2px;
    color: #777;
    transition: background-color .2s linear;
    height: 200px;
    padding: 40px;
  }

  #customdropzone .dz-preview {
    width: 160px;
    display: inline-block
  }
 #customdropzone .dz-preview .dz-image {
    width: 80px;
    height: 80px;
    margin-left: 40px;
    margin-bottom: 10px;
  }
  #customdropzone .dz-preview .dz-image > div {
    width: inherit;
    height: inherit;
    border-radius: 50%;
    background-size: contain;
  }
  #customdropzone .dz-preview .dz-image > img {
    width: 100%;
  }

   #customdropzone .dz-preview .dz-details {
    color: white;
    transition: opacity .2s linear;
    text-align: center;
  }
  #customdropzone .dz-success-mark, .dz-error-mark, .dz-remove {
    display: none;
  }
</style>