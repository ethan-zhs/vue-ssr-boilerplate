/**
 * 
 * @param {object} store store对象
 * @param {array} prefetch 需要prefetch的方法
 */
const prefetchApi = function (store, prefetch) {
    console.log('prefetch data', prefetch.map(p => p.action));
    return Promise.all(prefetch.map(p => store.dispatch(p.action, p.payload)));
};

export default prefetchApi;
