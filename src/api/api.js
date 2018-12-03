import axios from 'axios';
import qs from 'qs'

let base = '/apis/api/v1';

let headers = {headers: {"Content-Type": "multipart/form-data"}}

let headers1 = {headers: {'Content-Type':'application/json;','token':window.localStorage.token}}

//列表 , end_time
export const getPluginsGuessList = (page,state,uid,nick_name ,start_time,end_time) => {
    return axios.get(`${base}/plugins/guess?page_size=10&page=`+page+`&state=`+state+`&uid=`
        +uid+`&nick_name=`+nick_name+`&start_time=`+start_time+`&end_time=`+end_time,headers1)
        .then(res => res.data); };
//审核
export const postConfirm = (id,params)=> {
    return axios.post(`${base}/plugins/guess/`+id+'/confirm',params,headers1)
        .then(res => res.data); };

//答案列表
export const getAnswerList = (id,page)=> {
    return axios.get(`${base}/plugins/guess/`+id+'/anwser?page_size=15&page='+page,headers1)
        .then(res => res.data); };

//删除
export const deletePluginsGuess = id=> {
    return axios.delete(`${base}/plugins/guess/`+id,headers1)
        .then(res => res.data); };

//删除竞猜答案
export const postAnswer = id => {
    return axios.delete(`${base}/plugins/guess/anwser/`+id,headers1)
        .then(res => res.data); };












export const requestLogin = params => { return axios.post(`${base}/api/xcxAdminLogin`, qs.stringify(params)).then(res => res.data); };
export const getProvince = params => { return axios.post(`${base}/api/queryProvince`, { params: params }); };
export const activities = params => {return axios.post(`${base}/api/activities`, params,headers1)}
export const updateActivity =  params => {return axios.post(`${base}/api/updateActivity`, params,headers1)}
export const addActivity =  params => {return axios.post(`${base}/api/addActivity`, params,headers1)}
export const itemONOFF = params => {return axios.post(`${base}/api/itemONOFF`, params,headers1)}
export const activitiesByTitle = params =>{return axios.post(`${base}/api/activitiesByTitle`, params,headers1)}
export const queryAllTags = params =>{return axios.post(`${base}/api/queryAllTags`, params,headers1)}


export const getActivityIndexByTimeDesc = params =>{return axios.post(`${base}/api/getActivityIndexByTimeDesc`, params,headers1)}

export const uploadActivityImage = params =>{return axios.post(`${base}/api/uploadActivityImage`, params,headers1)}

export const delActivityItemById = params =>{return axios.post(`${base}/api/delActivityItemById`, params,headers1)}

export const bindActivityItemById = params =>{return axios.post(`${base}/api/bindActivityItemById`, params,headers1)}

export const updateActivityIndexById = params =>{return axios.post(`${base}/api/updateActivityIndexById`, params,headers1)}

export const delActivityIndexById = params =>{return axios.post(`${base}/api/delActivityIndexById`, params,headers1)}

export const addActivityIndex = params =>{return axios.post(`${base}/api/addActivityIndex`, params,headers1)}


export const getRedPacketList  = params =>{return axios.post(`${base}/api/getRedPacketList`, params,headers1)}

export const addRedPacket = params =>{return axios.post(`${base}/api/addRedPacket`, params,headers1)}

export const delRedPacketPostLog  = params =>{return axios.post(`${base}/api/delRedPacketPostLog`, params,headers1)}

export const updateRedPacketById = params =>{return axios.post(`${base}/api/updateRedPacketById`, params,headers1)}

export const updateRedPacketImg  = params =>{return axios.post(`${base}/api/updateRedPacketImg`, params,headers1)}


