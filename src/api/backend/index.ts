import createAxios from '/@/utils/axios'
import { useAdminInfo } from '/@/stores/adminInfo'

export const url = '/userApi'
import { useConfig } from '/@/stores/config'
import { Area } from '/@/api/backend/location/Area'
export function index() {
    const adminInfo = useAdminInfo()
    const config = useConfig()

    return createAxios({
        url: url + '/route',
        method: 'get',
        params:{'project_key':adminInfo.getProject_Key(),'lang':config.lang.defaultLang}
    })
}
export function index1(project_key:String) {
    const adminInfo = useAdminInfo()

    const config = useConfig()
    return createAxios({
        url: url + '/route',
        method: 'get',
        params:{'project_key':project_key,'lang':config.lang.defaultLang}
    })
}
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
export function addDeviceBarn(params: object = {}) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/DeviceBarn/add',
        method: 'POST',
        data: params
    })
}
export function outDeviceBarn(params: object = {}) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/DeviceOutBarn/add',
        method: 'POST',
        data: params
    })
}
export function bindTag(params: object = {}) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/bindTag',
        method: 'POST',
        data: params
    })
}
export function unBindTag(sn:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/unBindTag',
        method: 'GET',
        params:{"sn":sn}
    })
}
export function reback(sn:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/reback',
        method: 'GET',
        params:{"sn":sn}
    })
}
export function getGatewaybyMap(map_key:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getGatewayByMap',
        method: 'GET',

        params:{"map_key":map_key,"sn":Math.random()}
    })
}

export function getAreabyMap(map_key:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getAreaByMap',
        method: 'GET',
        params:{"map_key":map_key,"sn":Math.random()}
    })
}/*
export function getDevicebyArea(area_id:number) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getDevicebyArea',
        method: 'GET',
        params:{"area_id":area_id,"sn":Math.random()}
    })
}
/*export function getDevicebyMap(map_key:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getDevicebyMap',
        method: 'GET',
        params:{"map_key":map_key,"sn":Math.random()}
    })
}*/
export function getSn(code_sn:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/DeviceOutBarn/getSn',
        method: 'GET',
        params:{"code_sn":code_sn,"sn":Math.random()}
    })
}
export function getCode(type_id:number) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/DeviceCode/getCode',
        method: 'GET',
        params:{"type_id":type_id,"sn":Math.random()}
    })
}
export function getAllDepartment() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getAllDepartment',
        method: 'GET',
    })
}
export function addDepartment(data: object = {}) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/Department/add',
        method: 'POST',
        data:data
    })
}

export function editDepartment(data: object = {}) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/Department/edit',
        method: 'POST',
        data:data
    })
}

export function deleteDepartment(id: number) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/Department/del',
        method: 'GET',
        params:{"id":id}
    })
}
export function unbindPerson(idcard: string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/Person/unbind',
        method: 'GET',
        params:{"idcard":idcard}
    })
}
export function getMapByKey(mapkey: string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/map/getByKey',
        method: 'GET',
        params:{"mapkey":mapkey}
    })
}
export function add_update_Area(area: Area) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/area/add_update_Area',
        method: 'POST',
        data:area
    })
}
export function delete_area(id:number) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/area/delete',
        method: 'GET',
        params:{"id":id}
    })
}
export function getAoALocatorByMap(map_key:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getAoALocatorByMap',
        method: 'GET',

        params:{"map_key":map_key,"sn":Math.random()}
    })
}

export function getDevicebyMap(map_key:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/Devicep/getByMap',
        method: 'GET',

        params:{"map_key":map_key,"sn":Math.random()}
    })
}
export function getPersonbyMap(map_key:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/Person/getByMap',
        method: 'GET',
        params:{"map_key":map_key,"sn":Math.random()}
    })
}

export function getMap() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/map/index2?aa='+Math.random(),
        method: 'GET'
    })

}
    export function getAssetState() {
        const adminInfo = useAdminInfo()
        return createAxios({
            url: url + '/getAssetState?aa='+Math.random(),
            method: 'GET'
        })
        }
export function getBeaconState() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getBeaconState?aa='+Math.random(),
        method: 'GET'
    })
}
export function getLocatorState() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getLocatorState?aa='+Math.random(),
        method: 'GET'
    })
}
export function getSosOnDay() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getSosOnDay?aa='+Math.random(),
        method: 'GET'
    })
}
export function getAssetByAllMap() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getAssetByAllMap?aa='+Math.random(),
        method: 'GET'
    })
}

export function getSosDatail() {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/getSosDatail?aa='+Math.random(),
        method: 'GET'
    })
}

export function Search(query:string,type:string) {
    const adminInfo = useAdminInfo()
    return createAxios({
        url: url + '/History/Search?aa='+Math.random()+"&history_type="+type+"&name="+query,
        method: 'GET'
    })
}


