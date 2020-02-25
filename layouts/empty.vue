<template>
    <div>
        <nuxt />
        <chatbox v-if="openchat" class="col-3 chatbox-field" />
        <div class="message-box">
            <button class="btn btn-info message-box-button" @click="chatBox" v-show="!check()">
                <font-awesome-icon :icon="['fab', 'facebook-messenger']"/>
            </button>  
        </div>
    </div>
</template>

<script>
import chatbox from '@/components/Chatbox.vue'
export default {
    components: {
        chatbox
    },
    data() {
        return {
            openchat: false
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
        }
    }
}
</script>

<style lang="scss" scoped>
.chatbox-field {
    margin-right: 10%;
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

</style>