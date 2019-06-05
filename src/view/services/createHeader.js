import MD5 from 'crypto-js/md5';
import Base64 from 'crypto-js/enc-base64';
import HmacSHA256 from 'crypto-js/hmac-sha256';

function createHeaders(method, requestUrl, bodyStream) {
    const Timestamp = new Date().getTime();
    let headers = {};

    const key = 'test key';
    const secret = 'test secret';

    let md5 = '';
    let contentMD5 = '';

    if (bodyStream) {
        md5 = MD5(bodyStream);
        contentMD5 = Base64.stringify(md5);
    }

    const stringToSigned = `${method}\n${requestUrl}\n${Timestamp}\n${contentMD5}`;

    const sign = Base64.stringify(HmacSHA256(stringToSigned, secret));

    headers = {
        'Content-Type': 'application/json',
    };


    if (global.__X_FORWARDED_FOR__) {
        headers['X-Forwarded-For'] = global.__X_FORWARDED_FOR__;
    }

    return headers;
}

export default createHeaders;
