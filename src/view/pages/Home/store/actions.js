import * as Api from '../../../services';

export const getHomeData = async ({ dispatch, commit }) => {
    commit('GET_HOME_DATA_REQUEST');
    // `store.dispatch()` 会返回 Promise，
    // 以便我们能够知道数据在何时更新
    try {
        const res = await Api.getFriendLinks();
        commit('GET_HOME_DATA_SUCCESS', res);
    } catch (err) {
        commit('GET_HOME_DATA_FAILURE', err);
    }
};
