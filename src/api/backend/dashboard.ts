import createAxios from '/@/utils/axios'
import { useAdminInfo } from '/@/stores/adminInfo'

export const url = '/userApi/'

export function dashboard() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + 'dashboard',
        method: 'get'
    })
}
