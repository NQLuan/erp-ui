<template>
    <div>
        <div class="p-2">
            <div class="d-flex justify-content-between">
                <p class="text-success m-2">
                    The number of person having lunch today:
                    <strong>{{ eat }}</strong>
                </p>
                <p class="text-danger m-2">
                    The number of person not having lunch today:
                    <strong>{{ data.length - eat }}</strong>
                </p>
                <router-link class="btn btn-info px-4 py-2 font-weight-bold" to="/lunchStatistic">
                    <font-awesome-icon :icon="['fas', 'pizza-slice']" class="fa-fw" />
                    Lunch Calendar
                </router-link>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        eat() {
            let count = 0
            for (let index = 0; index < this.data.length; index++) {
                if (this.data[index].status === 'Lunch') {
                    count++
                }
            }
            return count
        }
    },
    data() {
        return {
            // count: 0
        }
    },
    props: {
        data: Array
    }
}
</script>
