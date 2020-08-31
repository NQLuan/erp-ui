<template>
    <div>
        <div class="text-center ml-5 py-5 my-5">
        <h1 class="display-4 alert alert-success">Success</h1>
        <p class="lead">
            <button class="btn pl-2">
                <router-link to="/leavesday"><font-awesome-icon :icon="['fas', 'home']"/><b-badge variant="light">Continue To Homepage</b-badge></router-link>
            </button>
        </p>
        </div>
    </div>
</template>
<script>
export default {
    name: 'SuccessPage',
    middleware: 'authen',
}
</script>