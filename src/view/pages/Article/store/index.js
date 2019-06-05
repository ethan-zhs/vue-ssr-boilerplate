import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';

const state = {
    requesting: false,
    newscontent: {}
};

export default {
    namespaced: true,
    actions,
    getters,
    state,
    mutations
};
