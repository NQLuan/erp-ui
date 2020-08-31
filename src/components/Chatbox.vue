<template>
    <main id="id_chatbox" class="main-content">
        <section ref="chatArea" class="chat-area mx-auto">
            <p v-for="message in messages" :key="message.index"
                :class="{ 'message-out': message.author === 'you', 'message-in': message.author !== 'you', 'short-mess': message.body.length <= 8 ,  'message': message.body.length > 8 }">
                {{ message.body }}</p>
        </section>

        <section class="chat-inputs mx-auto mb-auto">
            <!-- <form @submit.prevent="sendMessage('in')" id="person1-form">
            <label for="person1-input">Bot</label>
            <input v-model="bobMessage" id="person1-input" type="text" placeholder="Type your message">
            <button type="submit">Send</button>
        </form>
            <button @click="clearAllMessages">Clear All</button> -->
            <form @submit.prevent="sendMessage('out')" id="person2-form" class="form-inline">
                <div class="mx-auto pl-4 py-2 ">
                    <input v-model="youMessage" id="person2-input" class="form-control" type="text" autocomplete="off" placeholder="Type your message" />
                    <button type="submit" class="btn btn-primary">Send</button>
                </div>
            </form>
        </section>
    </main>
</template>

<script>
import Vue from 'vue'
import { Chat } from 'vue-quick-chat'
export default {
    name: 'id_chatbox',
    components: {
        Chat
    },
    data() {
        return {
            bobMessage: '',
            youMessage: '',
            messages: [
                {
                    body: "Welcome to the chat, I'm Bot! How can I help?",
                    author: 'bot'
                }
            ]
        }
    },
    methods: {
        sendMessage(direction) {
            if (!this.youMessage && !this.bobMessage) {
                return
            }
            if (direction === 'out') {
                this.messages.push({ body: this.youMessage, author: 'you' })
                const formdata = new FormData()
                formdata.append('text', this.youMessage)
                formdata.append('id', localStorage.getItem('profile_id'))
                this.$axios
                        .post('/actions/chatbot/', formdata)
                        .then((res) => {
                            this.messages.push({ body: res.data.text, author: 'bot' })
                            this.bobMessage = ''
                        })
                        .catch(function(error) {
                        })
                this.youMessage = ''
            } else {
                alert('something went wrong')
            }
            Vue.nextTick(() => {
                let messageDisplay = this.$refs.chatArea
                messageDisplay.scrollTop = messageDisplay.scrollHeight
            })
        },
        clearAllMessages() {
            this.messages = []
        }
    }
}
</script>

<style lang="scss" scoped>
.main-content {
    z-index: 200;
    position: absolute;
    right: 0%;
    bottom: 5%;
}
.headline {
    text-align: center;
    font-weight: 100;
    color: white;
}

.chat-area {
    /*   border: 1px solid #ccc; */
    border: 0.5px solid #f1f0f0;
    background: white;
    height: 50vh;
    padding: 1em;
    overflow: auto;
    max-width: 333px;
    margin: 0 auto 0 auto;
}

.short-mess {
    width: 20%;
    border-radius: 10px;
    padding: 0.5em;
    /*   margin-bottom: .5em; */
    font-size: 0.8em;
}

.message {
    width: 45%;
    border-radius: 10px;
    padding: 0.5em;
    /*   margin-bottom: .5em; */
    font-size: 0.8em;
    
}

.message-out {
    background: #407fff;
    color: white;
    margin-left: auto;
}

.message-in {
    background: #f1f0f0;
    color: black;
}

.chat-inputs {
    width: 333px;

    form {
        div {
            background: #f1f0f0;

            button {
                border-radius: 10px;
                margin-left: 25px;
                margin-right: 30px;
            }
        }
    }
}

#person1-input {
    padding: 0.5em;
}

#person2-input {
    padding: 0.2em;
    border-radius: 10px;
}
</style>