<template>
    <div id="id_wrapper">
        <div class="row mr-0">
            <siderbar :key="componentKey" />
            <div id="id_content" class="col-md-8 col-lg-9 col-xl-9 p-0 m-0">
                <navbar />
                <div>
                    <nuxt />
                </div>
                <chatbox v-if="openchat" class="col-3" />
            </div>
        </div>
        <div class="message-box">
            <button class="btn btn-info message-box-button" @click="chatBox" v-show="check()">
            </button>  
        </div>
    </div>
</template>
<script>
import navbar from '@/components/Navbar.vue'
import siderbar from '@/components/Siderbar.vue'
import chatbox from '@/components/Chatbox.vue'
export default {
    components: {
        navbar,
        siderbar,
        chatbox
    },
    mounted() {
    this.$nextTick(() => {
            this.$axios.get(`/leave/get_new_leave/`).then((res) => {
                this.componentKey = res.data.number
            })
            .catch((e) => {
                this.error = ''
            })
        })
    },
    data() {
        return {
            openchat: false,
            componentKey: 0
        }
    },
    methods: {
        chatBox() {
            if (this.openchat)
                this.openchat = false
            else
                this.openchat = true
        },
        check() {
            const Cookie = process.client ? require('js-cookie') : undefined
            if (Cookie.get('token') !== undefined) {
                return false
            }
            return true
        },
    }
}
</script>

<style>
html {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
}

*,
*:before,
*:after {
    box-sizing: border-box;
    margin: 0;
}

.message-box {
    position: absolute;
    height: 50px;
    right: 5%;
    bottom: 1%
}

.message-box-button {
    border-radius: 20px;
    margin-left: 60px;
}

.modal-content {
    margin-top: 15%;
}

.button--green {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #3b8070;
    color: #3b8070;
    text-decoration: none;
    padding: 10px 30px;
}

.button--green:hover {
    color: #fff;
    background-color: #3b8070;
}

.button--grey {
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #35495e;
    color: #35495e;
    text-decoration: none;
    padding: 10px 30px;
    margin-left: 15px;
}

.button--grey:hover {
    color: #fff;
    background-color: #35495e;
}
</style>
