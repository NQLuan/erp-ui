<template>
    <nav class="navbar navbar-expand-lg navbar-dark top-nav row mr-0">
        <a class="navbar-brand col-8" href="/">
            Paradox Management
            <img class="px-auto mx-auto" src="images/symbol.png" />
        </a>
        <ul class="nav navbar-nav justify-content-end col-1 btnl" :class="{ 'd-none': this.token === undefined }">
            <button class="nav-item text-white btn btn-primary-outline" @click="logout">
                Logout
            </button>
        </ul>
    </nav>
</template>
<script>
const Cookie = process.client ? require('js-cookie') : undefined
export default {
    data() {
        return {
            token: Cookie.get('token')
        }
    },
    methods: {
        logout() {
            Cookie.remove('token')
            localStorage.removeItem("user_id");
            localStorage.removeItem("is_admin");
            localStorage.removeItem("currentid");
            localStorage.removeItem("profile_id");
            localStorage.removeItem("imageurl");
            localStorage.removeItem("email");
            localStorage.removeItem("param_id");
            this.$router.push('/login')
        },
    }
}
</script>
<style lang="scss" scoped>
.top-nav {
    background-color: #25c9d0;
    position: sticky;
    top: 0;
    z-index: 1000;

    img {
        max-width: 4%;
    }
}
a {
    color: white;
    &:hover {
        text-decoration: none;
        color: white;
    }
}
.btnl {
    margin-left: 380px;
}
@media (max-width: 768px) {
        
    .top-nav {
        img {
            max-width: 10%;
        }
    }
    .btnl {
        margin-left: 0;
        margin-right: 1.5rem;
    }
}
</style>