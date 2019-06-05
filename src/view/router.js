import Vue from 'vue';
import Router from 'vue-router';


Vue.use(Router);

export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            { path: '/home', component: () => import('./pages/Home/index.vue') },
            { path: '/article/:id', component: () => import('./pages/Article/index.vue') }
        ]
    });
}
