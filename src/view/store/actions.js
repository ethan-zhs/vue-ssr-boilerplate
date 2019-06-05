import * as Api from '../services';

export const fetchItem1 = async ({ dispatch, commit }, id) => {
    // `store.dispatch()` 会返回 Promise，
    // 以便我们能够知道数据在何时更新
    try {
        const res = await Api.getNewsContent({
            sid: id
        });
        commit('FETCH_ITEM_SUCCESS', { id, res });
    } catch (err) {
        commit('FETCH_ITEM_FAILURE', err);
    }
};
