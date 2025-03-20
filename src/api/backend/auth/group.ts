import createAxios from '/@/utils/axios'

export function getAdminRules() {
    return createAxios({
        url: '/userApi/Menu/index',
        method: 'get',
    })
}
