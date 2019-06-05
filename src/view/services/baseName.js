
const HTTPS = 'https://';
const HTTP = 'http://';
const isProd = process.env.NODE_ENV == 'production';

const DEV = HTTPS + 'devapi.domain.cn';
const TEST = HTTPS + 'testapi.domain.cn';
const PRO = HTTPS + 'api.domain.cn';

const BASENAME = {
    localhost: TEST,
    'local.domain.cn': TEST,
    'dev.domain.cn': DEV,
    'test.domain.cn': TEST,
    'prod.domain.cn': PRO
};

const SLB_PROD_HOST = '0.0.0.0';

const SLB_TEST_HOST = {
    newsservice: '192.168.31.78'
};

const SLB_INTERAL = {
    newsservice: 8182
};

let mapBaseName = {};

if (typeof window === 'object') {
    const BaseName = BASENAME[window.location.hostname] || TEST;
    mapBaseName = Object.assign({}, mapBaseName, {
        news: BaseName + '/newsservice'
    });
} else {
    const getBaseName = (service) => `${HTTP}${isProd ? SLB_PROD_HOST : SLB_TEST_HOST[service]}:${SLB_INTERAL[service]}`;
    mapBaseName = Object.assign({}, mapBaseName, {
        news: getBaseName('newsservice')
    });
}

const apiBaseName = mapBaseName;

export default apiBaseName;
