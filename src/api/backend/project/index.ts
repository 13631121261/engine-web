import createAxios from '/@/utils/axios'
import { useAdminInfo } from '/@/stores/adminInfo'

export const url = '/userApi'

export function getProjects(project_name: Ref<UnwrapRef<string>>) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getAllProject',
        method: 'get',
        params: {
            project_name: project_name,
        },
    })
}
export function addProject(params: object = {}) {
    return createAxios({
        url: url + '/addProject',
        method: 'post',
        data: params
    })
}
export function updateProject(params: object = {}) {
    return createAxios({
        url: url + '/updateProject',
        method: 'post',
        data: params
    })
}
export function deleteProject(project_key:String) {
    return createAxios({
        url: url + '/deleteProject',
        method: 'get',
        params: {
            project_key: project_key,
        },
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
