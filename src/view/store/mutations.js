import Vue from 'vue';

export default {
    // 获取新闻详情
    FETCH_ITEM_REQUEST(state) {
        state.requesting = true;
    },
    FETCH_ITEM_SUCCESS(state, { id, res }) {
        Vue.set(state.requesting, false);
    },
    FETCH_ITEM_FAILURE(state, res) {
        state.requesting = false;
    }
};
