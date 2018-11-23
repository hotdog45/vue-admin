import axios from 'axios';
import qs from 'qs'

let base = '';

let headers = {headers: {"Content-Type": "multipart/form-data"}}

let headers1 = {headers: {'Content-Type':'application/json;'}}

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


