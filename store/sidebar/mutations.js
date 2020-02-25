export default {
    add(state) {
        state.countNoti += 1
    },
    subtract(state) {
        state.countNoti -= 1
    },
    set(state, n) {
        state.countNoti = n
    }
}
