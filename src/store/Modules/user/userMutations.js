export default {
    SET_CURRENT_USER (state, currentUserData) {
        state.currentUser.id = currentUserData.user;
        state.currentUser.email = currentUserData.email;
        state.currentUser.name = currentUserData.name;
        state.currentUser.profile_id = currentUserData.profile_id
    }
}