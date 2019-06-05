export default {
    GET_HOME_DATA_REQUEST(state) {
        state.requesting = true;
    },
    GET_HOME_DATA_SUCCESS(state, res) {
        state.friendLink = res || [];
        state.requesting = false;
    },
    GET_HOME_DATA_FAILURE(state, res) {
        state.requesting = false;
    }
};
