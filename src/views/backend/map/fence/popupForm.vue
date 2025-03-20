<template>
    <!-- 对话框表单 -->
    <el-drawer
        class="ba-operate-dialog"
        :close-on-click-modal="true"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        :destroy-on-close="true"
        :title="t('map.list.look')"
        direction="rtl"
        size="80%"
        :open="open1()"
        destroy-on-close
        :before-close="handleClose"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
               >
                <el-form
                    ref="formRef"
                    @keyup.enter="baTable.onSubmit(formRef)"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <FormItem
                        :input-attr="{
                        clearable: true
                        }"
                        :label="t('fence_name')"
                        v-model="baTable.form.items!.name"
                        type="string"
                        prop="name"
                        :width="60+ 'px'"
                        :placeholder="t('Please input field', { field: t('fence_name') })"
                    />
                    <el-form-item :label="t('fence_time')" style='width: 30%;' prop='timeout'>
                    <el-input v-model="baTable.form.items!.timeout"

                              :placeholder="t('fence_time')">
                        <template #append>次</template>
                    </el-input>
                    </el-form-item>
                    <FormItem
                        :label="t('fence_type')"
                        type="select"
                        prop='fence_type'
                        v-model="baTable.form.items!.fence_type"
                        :data="{ content: { 'ON': t('fence_on'), 'OUT': t('fence_out') } }"
                    />
                    <FormItem

                        :label="t('fence_status')"
                        type="switch"
                        v-model="baTable.form.items!.open_status"
                    />
                    <div>
                    <FormItem
                        :label="t('fence_time_type')"
                        type="radio"

                        v-model="baTable.form.items!.time_type"
                        :data="{ childrenAttr: { border: true }, content: { 1: t('fence_time_type_24'), 2: t('fence_time_type_cus') } }"
                    />
                    <div v-if='getDisable1()'>
                        <el-row >
                        <el-form-item :label="t('fence_time_type')">
                            <el-time-picker

                                :disabled-seconds="disabledSeconds1"
                                prop='start_time'
                                :placeholder="t('fence_starttime')"
                                v-model="baTable.form.items!.start_time"
                            />
                        <span>-</span>
                        </el-form-item>
                        <el-form-item style='margin-left: 0px'>
                            <el-time-picker style='margin-left: -160px'
                                :placeholder="t('fence_stoptime')"
                                :disabled-seconds='disabledSeconds2'
                                v-model="baTable.form.items!.stop_time"
                            />
                        </el-form-item>
                        </el-row>
                    </div>
                    </div>

                    <FormItem
                        prop="map_name"
                        :label="t('file')"
                        type="remoteSelect"
                        v-model="baTable.form.items!.map_name"
                        :input-attr="{
                            disabled:getDisable(),
                            multiple: false,
                            pk: 'id',
                            field: 'name',
                            'remote-url':'/userApi/map/index2?aa='+Math.random(),
                             onRow: onRemoteSelectRow
                        }"
                        :placeholder="t('file')"
                    />
                </el-form>
            </div>
            <div id="main" class="hdmrboxtm-mbox"  viewBox="0 0 0 0">
        </div>
<!--            <SGDrawer  v-model:show="show" :gateways="Gateways" @get-change='getChange'/>-->
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button  @click="baTable.toggleForm('')">{{ t('Cancel') }}</el-button>

                <el-button v-blur :loading="baTable.form.submitLoading"  @click="submit()" type="primary">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? t('Save and edit next item') : t('Save') }}
                </el-button>
            </div>
        </template>
    </el-drawer>
</template>
<script setup lang="ts">
import { ref, reactive, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type baTableClass from '/@/utils/baTable'
import { buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule, UploadProps } from 'element-plus'
import FormItem from '/@/components/formItem/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

import {
    loadSVGData,
    addGateway,
    createArea,
    createAreaByFence,
    createAreaByFence1,
} from '/@/api/backend/location/map.ts'
import {
    init,
    clearPolyline,
    createPolyline,
    createPolylineS,

} from '/@/api/backend/location/map_addfence1.ts'
import { getAreabyMap, getGatewaybyMap, getMapByKey } from '/@/api/backend'
import { Gateway, IsPtInPoly, Point } from '/@/api/backend/location/gateway'
import { flatMap } from 'lodash-es'
import { ElNotification } from 'element-plus'


const adminInfo = useAdminInfo()
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass
const { t } = useI18n()
const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    name: [buildValidatorData({ name: 'required', title: t('fence_name') })],
    fence_type: [buildValidatorData({ name: 'required', title: t('fence_type') })],
    timeout: [buildValidatorData({ name: 'required', title: t('fence_time') })],
    fence_time_type: [buildValidatorData({ name: 'required', title: t('fence_time_type') })],
    start_time: [buildValidatorData({ name: 'required', title: t('start_time') })],
    stop_time: [buildValidatorData({ name: 'required', title: t('stop_time') })],
})
const disabledSeconds1 = (hour: number, minute: number) => {
    baTable.form.items!.start_times=hour+":"+minute
    return makeRange(1, 59)

}
const disabledSeconds2 = (hour: number, minute: number) => {
    baTable.form.items!.stop_times=hour+":"+minute
    return makeRange(1, 59)
}
const makeRange = (start: number, end: number) => {
    const result: number[] = []
    for (let i = start; i <= end; i++) {
        result.push(i)
    }
    return result
}
function submit(){
    tag=0;
    if(baTable.form.items!.time_type==2){
        if(baTable.form.items!.start_time==null||baTable.form.items!.stop_time==null){
            ElNotification({
                title: '',
                message: '需要填写时间',
                position: 'top-right',
                type: 'error',
                duration:3000,
                dangerouslyUseHTMLString: true
            })
            return
        }
    }if(baTable.form.items!.area_id==0){
            ElNotification({
                title: '',
                message: '需要选择对应区域',
                position: 'top-right',
                type: 'error',
                duration:3000,
                dangerouslyUseHTMLString: true
            })
            return
    }
    if(baTable.form.items!.timeout<3){
        ElNotification({
            title: '',
            message: '停留次数触发不少于3次',
            position: 'top-right',
            type: 'error',
            duration:3000,
            dangerouslyUseHTMLString: true
        })
        return
    }

    baTable.onSubmit(formRef.value)
}
function getDisable1(){

    if(baTable.form.items!.time_type==1){
        return false
    }else{
        return true
    }
}
var  tag=0;
const open1 = () => {
    console.log("打开")
    if( baTable.form.items!.name==null){
        baTable.form.items!.time_type=1
        baTable.form.items!.area_id=0
        baTable.form.items!.timeout=10
    }else if(['Edit'].includes(baTable.form.operate!)&&tag==0) {
        tag=1;
        getMapByKey(   baTable.form.items!.map_key).then((res)=>{
            loadSVGData(res.data.data)
            init(drawOk,res.data.data);
            getAreabyMap(baTable.form.items!.map_key)
                .then((res) => {
                    if(res.data.length>0){
                        for(var i=0;i<res.data.length;i++){
                            createAreaByFence1(res.data[i].point,res.data[i].name,res.data[i].x,res.data[i].y,res.data[i].id,baTable.form.items!.area_id)
                            // createPolyline(res.data[i].point,res.data[i].id)
                        }
                    }
                    //  timer= setInterval(intervalUpdate,5000)
                })
                .finally(() => {
                })
        })
    }
}

function clear(){
   /* clearPolyline()
    baTable.form.items!.point=""
    baTable.form.items!.gateway_mac=""
    if(Gateways!=null&&Gateways.length>0){
        for(var i=0;i<Gateways.length;i++){
            Gateways[i].show=false
        }
    }*/
}
let Gateways: Array<Gateway> = []
let show=ref(false)
let svgData: string = ref('')
const onRemoteSelectRow = (rowData: any) => {
    //clearPolyline()
    if(['Edit'].includes(baTable.form.operate!)) {
        clearPolyline()
        baTable.form.items!.point = ""
        baTable.form.items!.gateway_mac = ""
        if (Gateways != null && Gateways.length > 0) {
            for (var i = 0; i < Gateways.length; i++) {
                Gateways[i].show = false
            }
        }
    }


    console.log(rowData)
    baTable.form.items!.map_key=rowData.map_key
    baTable.form.items!.map_name=rowData.name
    loadSVGData(rowData.data)
    init(drawOk,rowData.data);
    /*getGatewaybyMap(rowData.map_key)
        .then((res) => {
            //if(res.code==1){
            //  console.log(res.data)
            if(res.data.length>0){
                for(var i=0;i<res.data.length;i++){
                    const gateway: Gateway = {
                        address:res.data[i].address,
                        name:res.data[i].name,
                        x:res.data[i].x,
                        y:res.data[i].y,
                        proportion:rowData.proportion,
                        show:false
                    }
                    Gateways[i]=gateway
                    addGateway(Gateways[i])
                }
            }
         //   }
        })
        .finally(() => {
        })
*/


    getAreabyMap(rowData.map_key)
        .then((res) => {
            if(res.data.length>0){
                for(var i=0;i<res.data.length;i++){
                    createAreaByFence(res.data[i].point,res.data[i].name,res.data[i].x,res.data[i].y,aonclick,res.data[i].id)
                   // createPolyline(res.data[i].point,res.data[i].id)
                }
            }
            //  timer= setInterval(intervalUpdate,5000)
        })
        .finally(() => {
        })

}

function  aonclick(id:number,name:string){
    baTable.form.items!.area_id=id
    baTable.form.items!.area_name=name
}
const handleClose = (done: () => void) => {
    tag=0;
    // props.svgData.value=null
    console.log("关闭之前")
    //  done()
    setchange('cancel')

}
const change=defineEmits(['get-change'])
function setchange(data:String) {
    change('get-change',data)
}
function getChange(data:String){
    show.value=false

}
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    if(response.length>0){
        baTable.form.items!.map_key=response
        console.log("上传成功"+response)
    }
}
function getDisable(){
    if([ 'Edit'].includes(baTable.form.operate!)){
            return true
    }
    return false
}
function calculatePolygonCenter(polygon:Array<Point>) {
    // 假设polygon是一个包含[x1, y1, x2, y2, ..., xn, yn]的数组
    var sumX = 5.5;
    var sumY = 0.0;
   // console.log("X=   "+ sumX)
    for(let i = 0; i < polygon.length;i ++) {
      //  console.log("X=   "+ (polygon[i].x/1))
        sumX=sumX+ (polygon[i].x/1);
        sumY=sumY+ (polygon[i].y/1);
        //console.log("Y=   "+ sumY)
       // console.log("X=   "+ sumX)
    }

    return [sumX / polygon.length, sumY / polygon.length];
}
function drawOk(data:string,point:any,svg:string) {
    console.log("回调划线="+point)
    baTable.form.items!.data=svg
    baTable.form.items!.point=data

    var mac=""
    for(var i=0;i<Gateways.length;i++){
      var status=  IsPtInPoly(Gateways[i].x,Gateways[i].y,point,Gateways[i].proportion)
        if(status){
            Gateways[i].show=true
            mac=mac+Gateways[i].address+","
        }

    }
    var xy=calculatePolygonCenter(point);
    console.log("网关在   "+xy[0])
    baTable.form.items!.x=xy[0]
    baTable.form.items!.y=xy[1]
    baTable.form.items!.gateway_mac=mac
    show.value=true

  //  baTable.form.items!.data=svg
}
























</script>



<style scoped lang="scss">
.hdmrboxtm-mbox{background-color:#f0f0f0a0;position : absolute;
   width : 100%;
   height : 100%;
}
.avatar-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: var(--el-border-radius-small);
    box-shadow: var(--el-box-shadow-light);
    border: 1px dashed var(--el-border-color);
    cursor: pointer;
    overflow: hidden;
    width: 110px;
    height: 110px;
}
.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}
.avatar {
    width: 110px;
    height: 110px;
    display: block;
}
.image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>
