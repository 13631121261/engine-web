import createAxios from '/@/utils/axios'
import { useAdminInfo } from '/@/stores/adminInfo'

export const url = '/userApi'

export function getConfig(project_name: Ref<UnwrapRef<string>>) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/config/index',
        method: 'get',
        params: {
            project_Key: adminInfo.getProject_Key(),
        },
    })
}
export function addConfig(params: object = {}) {
    return createAxios({
        url: url + '/config/add',
        method: 'post',
        data: params
    })
}
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
}


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
