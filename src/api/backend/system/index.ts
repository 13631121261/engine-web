import createAxios from '/@/utils/axios'
import { useAdminInfo } from '/@/stores/adminInfo'

export const url = '/userApi'

export function getSystemConfig() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/SystemGet',
        method: 'get'
    })
}
export function setSystemConfig(params: object = {}) {
    return createAxios({
        url: url + '/SystemSet',
        method: 'post',
        data: params
    })
}

export function configGet() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/configGet',
        method: 'get'
    })
}
export function configSet(arssi:number,n:number,used:number,z:number) {
    return createAxios({
        url: url + '/configSet',
        method: 'get',
        params: {
            A_Rssi: arssi,
            N:n,
            used:used,
            z:z
        }
    })
}
export function setDownloadUrl(host:string) {
    return createAxios({
        url: url + '/setDownloadUrl',
        method: 'get',
        params: {
            host: host
        }
    })
}
/*
export function updateConfig(params: object = {}) {
    return createAxios({
        url: url + '/config/edit',
        method: 'post',
        data: params
    })
}
export function deleteConfig(config_key:String) {
    return createAxios({
        url: url + '/config/del',
        method: 'get',
        params: {
            config_key: config_key,
        },
    })
}
export function getProjectGateway(config_key:String) {
    return createAxios({
        url: url + '/getProjectGateway',
        method: 'get',
        params: {
            config_key: config_key,
        },
    })
}
export function getConfigGateway(config_key:String) {
    return createAxios({
        url: url + '/getConfigGateway',
        method: 'get',
        params: {
            config_key: config_key,
        },
    })
}
export function addConfigGateway(config_key:String,params: object = {}) {
    return createAxios({
        url: url + '/addConfigGateway',
        method: 'post',
        params: {
            config_key: config_key,
        },
        data: params
    })
}*/


/*

export function login(method: 'get' | 'post', params: object = {}) {
    return createAxios({
        url: url + '/login',
        data: params,
        method: method,
    })
}

export function logout() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/logout',
        method: 'POST',
        data: {
            refreshToken: adminInfo.getToken('refresh'),
        },
    })
}
*/
