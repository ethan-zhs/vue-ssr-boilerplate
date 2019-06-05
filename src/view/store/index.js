import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import mutations from './mutations';
import modulesList from './modules';

Vue.use(Vuex);

const state = {
    requesting: false
};

export function createStore() {
    return new Vuex.Store({
        actions,
        getters,
        state,
        mutations,
        modules: {
            ...modulesList
        }
    });
} 
