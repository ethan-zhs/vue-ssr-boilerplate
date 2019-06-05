import * as Api from '../../../services';

export const getNewsContent = async ({ dispatch, commit }, id) => {
    // `store.dispatch()` 会返回 Promise，
    // 以便我们能够知道数据在何时更新
    try {
        const res = await Api.getNewsContent({ sid: id });
        commit('GET_NEWS_CONTENT_SUCCESS', res);
    } catch (err) {
        commit('GET_NEWS_CONTENT_FAILURE', err);
    }
};

export const testAction = async ({ dispatch, commit }) => {
    // `store.dispatch()` 会返回 Promise，
    // 以便我们能够知道数据在何时更新
    try {
        console.log('test Action success');
    } catch (err) {
        console.log('test Action fail');
    }
};
