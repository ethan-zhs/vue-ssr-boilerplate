import axios from 'axios';
import createHeaders from './createHeader';

export const callApi = (endpoint, method, data) => {
    const bodyStream = data && method.toUpperCase() !== 'GET' ? JSON.stringify(data) : '';
    endpoint = paramsForGetMethod(endpoint, method, data);

    const headers = createHeaders(method, endpoint, bodyStream); 
    const { __X_FORWARDED_FOR__: xForwardedFor = '', logger } = global;

    console.log(endpoint);

    return new Promise((resolve, reject) => {
        axios({
            method: method || 'POST',
            url: endpoint,
            data: bodyStream,
            timeout: 20000,
            responseType: 'json',
            headers: headers
        }).then((res) => {
            // 打印接口请求日志
            logger && logger.log('fetch success:', xForwardedFor, res.config.method.toUpperCase(), `status ${res.status}`, endpoint);
            resolve(res.data);
        }).catch((err) => {
            if (err.response) {
                const error = err.response;

                // 打印错误日志
                logger && logger.error('fetch error:', xForwardedFor, error.config.method.toUpperCase(), `status ${error.status}`, endpoint);
                
                return reject(error.data);
            } 
            
            logger && logger(err);  
            return reject(err);
        });
    });
};


// 设置请求方法GET的参数
function paramsForGetMethod(endpoint, method, data) {
    if (method.toUpperCase() === 'GET' && data && typeof (data) == 'object') {
        const paramsArr = [];
        const keys = Object.keys(data);
        keys.forEach(key => {
            paramsArr.push(`${key}=${data[key].toString()}`);
        });
        endpoint = paramsArr.length ? `${endpoint}?${paramsArr.join('&')}` : endpoint;
    }

    return endpoint;
}
