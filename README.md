
# Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3010
npm start

# build for production with minification
npm run build
```


## Main Libiries

* [vue 2](https://cn.vuejs.org/)
* [vuex](https://vuex.vuejs.org/zh/guide/)
* [vue-router](https://router.vuejs.org/zh/)
* [vue-server-renderer](https://www.npmjs.com/package/vue-server-renderer)
* [express](http://facebook.github.io/immutable-js/)
* [axios](https://www.axios.com/)
* [webpack 4](https://webpack.github.io/)

---
## 1. 工程目录
> 
```
- build                     // webpack config
- src
  - client                  // 客户端
    - client-entry.js
  - server                  // 服务端
    - template              // html模板
    - server-entry.js
    - server-prod.js        // server 打包文件
  -view
    - components            // 组件库
      - ComA
      - ComB
    - mixin
    - pages                 // 页面
      - PageA
      - PageB
    - services              // 异步请求封装
    - statics               // 静态资源
    - store                 // 状态管理
    - utils                 // 工具函数
    - routes.js
    - app.js
    - App.vue
- server.js

```

---
## 2. CLIENt & SERVER
> 
```
- client
- server
- view
```

---
## 2. SEO
> 
```
- headMixin
```

---
## 3. Redis
> 
```
const redisClient = redis.createClient({ host: ip, port: '6380' });

redisClient.on('error', function (error) {
    console.log(`error event - ${redisClient.host}:${redisClient.port} - ${error}`); 
});

function setRedisString(key, data) {
    redisClient.set(key, data, function (setErr, setRes) { 
        if (setErr) {
            console.log('------- Set Redis Failure');
        }
        if (setRes) {
            console.log('------- Set Redis Success');
        }
    }); 
    // 设置redis过期时间
    redisClient.expire(key, 60 * 5);
}

function getRedisString(key) {
    return new Promise((rs, rj) => {
        redisClient.get(key, (err, res) => {
            if (res) {
                rs(res);
            } else {
                rj(err);
            }
        }); 
    }); 
}
```

---
## 4. Service Worker
> 
```
// service worker
if (window.location.protocol === 'https:' && navigator.serviceWorker && window.location.search.indexOf('sw=1') >= 0) {
    console.log('service worker init');
    navigator.serviceWorker.register('/service-worker.js');
}
```
