import Vue from 'vue';
import { createApp } from '../view/app';

// 客户端特定引导逻辑……

const { app, router } = createApp();
const { store } = createApp();

if (window.__INITIAL_STATE__) {
    console.log('--------has initial state---------');
    store.replaceState(window.__INITIAL_STATE__);
}

Vue.mixin({
    beforeCreate() {
        this.$store = store;
    },
    beforeRouteUpdate(to, from, next) {
        const { asyncData } = this.$options;
        if (asyncData) {
            asyncData({
                store: this.$store,
                route: to
            }).then(next).catch(next);
        } else {
            next();
        }
    }
});

// 策略二
router.onReady(() => {
    // 添加路由钩子函数，用于处理 asyncData.
    // 在初始路由 resolve 后执行，
    // 以便我们不会二次预取(double-fetch)已有的数据。
    // 使用 `router.beforeResolve()`，以便确保所有异步组件都 resolve。
    router.beforeResolve((to, from, next) => {
        const matched = router.getMatchedComponents(to);
        const prevMatched = router.getMatchedComponents(from);
  
        // 我们只关心非预渲染的组件
        // 所以我们对比它们，找出两个匹配列表的差异组件
        let diffed = false;
        const activated = matched.filter((c, i) => {
            diffed = diffed || (prevMatched[i] !== c);            
            return diffed;
        });
  
        if (!activated.length) {
            return next();
        }
  
        // 这里如果有加载指示器 (loading indicator)，就触发
  
        return Promise.all(activated.map(c => c.asyncData && c.asyncData({ store, route: to, isServer: true }))).then(() => {
            // 停止加载指示器(loading indicator)  
            next();
        }).catch(next);
    });
  
    // 这里假定 App.vue 模板中根元素具有 `id="app"`
    app.$mount('#app');
});

// service worker
if (window.location.protocol === 'https:' && navigator.serviceWorker && window.location.search.indexOf('sw=1') >= 0) {
    console.log('service worker init');
    navigator.serviceWorker.register('/service-worker.js');
}
