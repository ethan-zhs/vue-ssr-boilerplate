import { callApi } from './callApi';
import apiBaseName from './baseName';


// 获得新闻详情
export const getNewsContent = (data) => callApi(apiBaseName.news + '/v12/newscontent', 'GET', data);
