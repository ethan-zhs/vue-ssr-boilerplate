const fs = require('fs');
const http = require('http');
const path = require('path');
const LRU = require('lru-cache');
const express = require('express');
const redis = require('redis');
const favicon = require('serve-favicon');
const compression = require('compression');
const microcache = require('route-cache');
const { createBundleRenderer } = require('vue-server-renderer');

const app = express();
const useMicroCache = process.env.MICRO_CACHE !== 'false';
const resolve = file => path.resolve(__dirname, file);
const serverInfo = `express/${require('express/package.json').version} `
  + `vue-server-renderer/${require('vue-server-renderer/package.json').version}`;

const redisClient = redis.createClient({ host: '192.168.31.49', port: '6380' });

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


function createRenderer(bundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, Object.assign(options, {
        inject: false,
        cache: new LRU({
            max: 1000,
            maxAge: 1000
        }),
        // this is only needed when vue-server-renderer is npm-linked
        basedir: resolve('./dist'),

        // recommended for performance
        runInNewContext: false
    }));
}

let renderer;
let hit = {};
const templatePath = resolve('./src/server/template/index.tpl.html');

const readyPromise = require('./config/setup-dev-server')(app, templatePath, (bundle, options) => {
    renderer = createRenderer(bundle, options);
});


const serve = (filePath, cache) => express.static(resolve(filePath), {
    maxAge: 0
});

app.enable('trust proxy');
app.use(compression({ threshold: 0 }));
app.use(favicon(path.join(__dirname, 'src/view/statics/images', 'favicon.ico')));
app.use('/dist', serve('./dist', true));
app.use('/manifest.json', serve('./manifest.json', true));
app.use('/service-worker.js', serve('./dist/service-worker.js'));

// since this app has no user-specific content, every page is micro-cacheable.
// if your app involves user-specific content, you need to implement custom
// logic to determine whether a request is cacheable based on its url and
// headers.
// 1-second microcache.
// https://www.nginx.com/blog/benefits-of-microcaching-nginx/
app.use(microcache.cacheSeconds(1, req => useMicroCache && req.originalUrl));

async function render(req, res) {
    const s = Date.now();
  
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Server', serverInfo);
  
    const handleError = err => {
        if (err.url) {
            res.redirect(err.url);
        } else if (err.code === 404) {
            res.status(404).send('404 | Page Not Found');
        } else {
            // Render Error Page or Redirect
            res.status(500).send('500 | Internal Server Error');
            console.error(`error during render : ${req.url}`);
            console.error(err.stack);
        }
    };
    

    // 获取redis缓存信息
    try {
        const redisCache = await getRedisString(`SSRCache:apph5:${req.url}`);
        if (redisCache) {
            console.log('------- Get Redis Success');
            hit = JSON.parse(redisCache);
            return res.end(hit.renderString);
        }
    } catch (err) {
        console.log('------- Get Redis Failure', err);
    }
    
  
    const context = {
        title: '触电新闻', // 默认标题,
        meta: '<meta name="description" content="触电新闻" />',
        url: req.url
    };

    renderer.renderToString(context, (err, html) => {
        if (err) {
            return handleError(err);
        }

        res.send(html);
        setRedisString(`SSRCache:apph5:${req.url}`, JSON.stringify({ key: req.url, renderString: html }));
        
        console.log(`whole request: ${Date.now() - s}ms`);
        return undefined;
    });

    return undefined;
}
  
app.get('*', (req, res) => {
    readyPromise.then(() => render(req, res));
});

const PORT = process.env.PORT || 4999;

const httpServer = http.createServer(app);

httpServer.listen(PORT, function httpS() {
    console.log('HTTP Server is running on: http://localhost:%s', PORT);
});
