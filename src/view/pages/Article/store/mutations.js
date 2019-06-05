export default {
    GET_NEWS_CONTENT_REQUEST(state) {
        state.requesting = true;
    },
    GET_NEWS_CONTENT_SUCCESS(state, res) {
        state.newscontent = res || {};
        state.requesting = false;
    },
    GET_NEWS_CONTENT_FAILURE(state, res) {
        state.requesting = false;
    }
};
