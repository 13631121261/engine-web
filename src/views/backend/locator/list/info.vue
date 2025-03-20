<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Info'].includes(baTable.form.operate!)"
        :closed='consoed()'
        :open='open()'
        @close="baTable.toggleForm"
        :destroy-on-close="true"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">


                <div class="demo-collapse">
                    <el-collapse v-model="activeName" accordion>
                        <el-collapse-item title="网络参数" name="1">

                            <div class="container1">
                                <div class='item1'>
                                    <div  class="text item" >
                                        <span>蓝牙版本</span>
                                        {{': '+baTable.form.items!.ble_version  }}</div>
                                    <div  class="text item" >
                                        <span >WiFi版本</span>
                                        {{': '+baTable.form.items!.wifi_version  }}</div>
                                    <div  class="text item" >
                                        <span >网关IP</span>
                                        {{': '+baTable.form.items!.wan_ip  }}</div>
                                    <div  class="text item" >
                                        <span>运行时长</span>
                                        {{': '+baTable.form.items!.up_time  }}</div>
                                    <div  class="text item" >
                                        <span>标志位</span>
                                        {{': '+baTable.form.items!.crc_flag  }}</div>
                                    <div  class="text item" >
                                        <span>SSID</span>
                                        {{': '+baTable.form.items!.wlan_ssid  }}</div>
                                    <div  class="text item" >
                                        <span>WiFi状态：</span>
                                        <el-tag v-if="baTable.form.items!.wifi_onoff=='on'">打开</el-tag>
                                        <el-tag v-else>关闭</el-tag>
                                    </div>
                                    <div  class="text item" >
                                        <span>订阅主题</span>
                                        {{': '+baTable.form.items!.sub_topic  }}</div>
                                </div>
                                <div class='item1'>
                                    <div  class="text item" >
                                        <span>同步功能：</span>
                                        <el-tag v-if='baTable.form.items!.isyn==1'>打开</el-tag>
                                        <el-tag v-else>关闭</el-tag>


                                    </div>
                                    <div  class="text item" >
                                        <span>网关地址</span>
                                        {{': '+baTable.form.items!.wlan_ip  }}</div>
                                    <div  class="text item" >
                                        <span >工作模式</span>
                                        {{': '+baTable.form.items!.op_mode  }}</div>
                                    <div  class="text item" >
                                        <span>动/静态IP</span>
                                        {{': '+baTable.form.items!.wan_mode  }}</div>
                                    <div  class="text item" >
                                        <span>路由IP</span>
                                        {{': '+baTable.form.items!.wan_ip  }}</div>
                                    <div  class="text item" >
                                        <span>上级路由IP</span>
                                        {{': '+baTable.form.items!.wan_gw  }}</div>
                                    <div  class="text item" >
                                        <span>在线时间</span>
                                        {{': '+dateFormat(baTable.form.items!.lasttime)  }}</div>
                                <div  class="text item" >
                                    <span>发布主题</span>
                                    {{': '+baTable.form.items!.pub_topic  }}</div>
                            </div>
                            </div>

                        </el-collapse-item>
                        <el-collapse-item title="上报参数" name="2">
                            <div class="container1">
                                <div class='item1'>
                                    <div  class="text item" >
                                        <span>上报数据：</span>
                                        <el-tag v-if='baTable.form.items!.scan_out==0'>关闭</el-tag>
                                        <el-tag v-else>打开</el-tag>
                                    </div>
                                    <div  class="text item" >
                                        <span>上报间隔</span>
                                        {{': '+baTable.form.items!.scan_interval  +'毫秒'}}</div>

                                    <div  class="text item" >
                                        <span>上报类型：</span>
                                        <el-tag v-if='baTable.form.items!.report_type==1'>只有扫描包</el-tag>
                                        <el-tag v-else-if='baTable.form.items!.report_type==2'>扫描包和响应包</el-tag>
                                        <el-tag v-else-if='baTable.form.items!.report_type==3'>仅上报MAC和RSSI</el-tag>
                                        <el-tag v-else-if='baTable.form.items!.report_type==4'>仅扫描昆仑蓝牙工卡</el-tag>

                                    </div>
                                </div>

                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="扫描过滤" name="3">
                            <div class="container1">
                                <div class='item1'>
                                        <div  class="text item" >
                                            <span>rssi 过滤: </span>
                                            <el-tag v-if='baTable.form.items!.filter_rssi <0'>{{+baTable.form.items!.filter_rssi  }}</el-tag>
                                            <el-tag v-else>关闭</el-tag>
                                        </div>
                                        <div  class="text item" >
                                            <span>名称过滤：</span>
                                            <span v-if='names.length>0'>
                                            <el-tag v-if='names.length>0&&names[0].length>0'>{{names[0]}}</el-tag>
                                            &nbsp;
                                            <el-tag v-if='names.length>1&&names[1].length>0'>{{names[1]}}</el-tag>
                                            &nbsp;
                                            <el-tag v-if='names.length>2&&names[2].length>0'>{{names[2]}}</el-tag> &nbsp;
                                            <el-tag v-if='names.length>3&&names[3].length>0'>{{names[3]}}</el-tag>   &nbsp;
                                            <el-tag v-if='names.length>4&&names[4].length>0'>{{names[4]}}</el-tag>   &nbsp;
                                            <el-tag v-if='names.length>5&&names[5].length>0'>{{names[5]}}</el-tag>   &nbsp;
                                            <el-tag v-if='names.length>6&&names[6].length>0'>{{names[6]}}</el-tag>   &nbsp;
                                            <el-tag v-if='names.length>7&&names[7].length>0'>{{names[7]}}</el-tag>
                                            </span>
                                            <el-tag v-else>关闭</el-tag>
                                        </div>

                                        <div  class="text item" >
                                            <span>IBeacon 过滤：</span>
                                            <el-tag v-if='baTable.form.items!.filter_ibeacon===0'>关闭</el-tag>
                                            &nbsp;
                                            <el-tag v-else>打开</el-tag>
                                        </div>
                                        <div  class="text item" >
                                            <span>Mac 段过滤：</span>
                                            <span v-if='filter_dev_mac.length>0'>
                                            <el-tag v-if='filter_dev_mac.length>0&&filter_dev_mac[0].length>0'>{{filter_dev_mac[0]}}</el-tag>
                                            <span>-</span>
                                            <el-tag v-if='filter_dev_mac.length>1&&filter_dev_mac[1].length>0'>{{filter_dev_mac[1]}}</el-tag>
                                            &nbsp;
                                            </span>
                                            <el-tag v-else>关闭</el-tag>

                                        </div>
                            </div>
                                <div class='item1'>
                                    <div  class="text item" >
                                        <span>iBeacon UUID：</span>
                                            <div v-if='filter_ibeacon_uuid.length>0'>
                                                <el-tag v-if='filter_ibeacon_uuid.length>0&&filter_ibeacon_uuid[0].length>0'>{{filter_ibeacon_uuid[0]}}</el-tag>

                                                <el-tag v-if='filter_ibeacon_uuid.length>1&&filter_ibeacon_uuid[1].length>0'>{{filter_ibeacon_uuid[1]}}</el-tag>

                                                <el-tag v-if='filter_ibeacon_uuid.length>2&&filter_ibeacon_uuid[2].length>0'>{{filter_ibeacon_uuid[2]}}</el-tag>
                                                <el-tag v-if='filter_ibeacon_uuid.length>3&&filter_ibeacon_uuid[3].length>0'>{{filter_ibeacon_uuid[3]}}</el-tag>

                                                <el-tag v-if='filter_ibeacon_uuid.length>4&&filter_ibeacon_uuid[4].length>0'>{{filter_ibeacon_uuid[4]}}</el-tag>

                                                <el-tag v-if='filter_ibeacon_uuid.length>5&&filter_ibeacon_uuid[5].length>0'>{{filter_ibeacon_uuid[5]}}</el-tag>

                                                <el-tag v-if='filter_ibeacon_uuid.length>6&&filter_ibeacon_uuid[6].length>0'>{{filter_ibeacon_uuid[6]}}</el-tag>

                                                <el-tag v-if='filter_ibeacon_uuid.length>7&&filter_ibeacon_uuid[7].length>0'>{{filter_ibeacon_uuid[7]}}</el-tag>
                                            </div>
                                            <el-tag v-else>关闭</el-tag>
                                    </div>
                                  <div  class="text item" >
                                        <span >Services UUID：</span>
                                        <span v-if='filter_serv_data_uuid.length>0'>
                                            <el-tag v-if='filter_serv_data_uuid.length>0&&filter_serv_data_uuid[0].length>0'>{{filter_serv_data_uuid[0]}}</el-tag>
                                           &nbsp;
                                            <el-tag v-if='filter_serv_data_uuid.length>1&&filter_serv_data_uuid[1].length>0'>{{filter_serv_data_uuid[1]}}</el-tag>
                                            &nbsp;
                                            <el-tag v-if='filter_serv_data_uuid.length>2&&filter_serv_data_uuid[2].length>0'>{{filter_serv_data_uuid[2]}}</el-tag>
                                            &nbsp;
                                            <el-tag v-if='filter_serv_data_uuid.length>3&&filter_serv_data_uuid[3].length>0'>{{filter_serv_data_uuid[3]}}</el-tag>
                                             &nbsp;
                                            <el-tag v-if='filter_serv_data_uuid.length>4&&filter_serv_data_uuid[4].length>0'>{{filter_serv_data_uuid[4]}}</el-tag>
                                                &nbsp;
<!--                                            <el-beacon v-if='filter_serv_data_uuid.length>5&&filter_serv_data_uuid[5].length>0'>{{filter_serv_data_uuid[5]}}</el-beacon>
                                            &nbsp;
                                            <el-beacon v-if='filter_serv_data_uuid.length>6&&filter_serv_data_uuid[6].length>0'>{{filter_serv_data_uuid[6]}}</el-beacon>
                                                &nbsp;
                                            <el-beacon v-if='filter_serv_data_uuid.length>7&&filter_serv_data_uuid[7].length>0'>{{filter_serv_data_uuid[7]}}</el-beacon>
                                       -->
                                        </span>
                                        <el-tag v-else>关闭</el-tag>
                                    </div>
                                    <div  class="text item" >
                                        <span >Company Id：</span>
                                        <span v-if='companyid.length>0'>
                                            <el-tag v-if='companyid.length>0&&companyid[0].length>0'>{{companyid[0]}}</el-tag>
                                           &nbsp;
                                            <el-tag v-if='companyid.length>1&&companyid[1].length>0'>{{companyid[1]}}</el-tag>
                                            &nbsp;
                                            <el-tag v-if='companyid.length>2&&companyid[2].length>0'>{{companyid[2]}}</el-tag>
                                            &nbsp;
                                            <el-tag v-if='companyid.length>3&&companyid[3].length>0'>{{companyid[3]}}</el-tag>
                                             &nbsp;
                                            <el-tag v-if='companyid.length>4&&companyid[4].length>0'>{{companyid[4]}}</el-tag>
                                                &nbsp;
                                            <el-tag v-if='companyid.length>5&&companyid[5].length>0'>{{companyid[5]}}</el-tag>
                                            &nbsp;
                                            <el-tag v-if='companyid.length>6&&companyid[6].length>0'>{{companyid[6]}}</el-tag>
                                                &nbsp;
                                            <el-tag v-if='companyid.length>7&&companyid[7].length>0'>{{companyid[7]}}</el-tag>
                                        </span>
                                        <el-tag v-else>关闭</el-tag>
                                    </div>



                            </div>
                            </div>
                        </el-collapse-item>

                    </el-collapse>
                </div>






        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm('')">{{ t('Cancel') }}</el-button>

            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type baTableClass from '/@/utils/baTable'
import { regularPassword, buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'
import FormItem from '/@/components/formItem/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'
import moment from 'moment'

const adminInfo = useAdminInfo()
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const { t } = useI18n()
let activeName = ref('1')
function dateFormat(date) {

    if (date == undefined) {
        return "";
    }
    console.log("时间戳="+date)
    return moment(date*1000).format("YYYY-MM-DD HH:mm:ss");
}
var names=[]
var filter_dev_mac=[]
var filter_ibeacon_uuid=[]
var filter_serv_data_uuid=[]
var companyid=[]
function getFilterName(){
    if(baTable.form.items!.filter_name!=null){
        names=  baTable.form.items!.filter_name.split('-')
        if(names[0].length==0){
            names=[];
        }
    }

 /*   if(baTable.form.items!.filter_name !=null&&baTable.form.items!.filter_name .startsWith('1')){
        names=  baTable.form.items!.filter_name .split('-')
        console.log(names)
        names=names.splice(1,names.length-1)
        console.log(names)
    }else{

    }*/
    if(baTable.form.items!.filter_dev_mac!=null){
        filter_dev_mac=  baTable.form.items!.filter_dev_mac.split('-')
        if(filter_dev_mac[0].length==0){
            filter_dev_mac=[];
        }
    }

   /* if(baTable.form.items!.filter_dev_mac !=null&&baTable.form.items!.filter_dev_mac.startsWith('1')){

        console.log(filter_dev_mac)
        filter_dev_mac=filter_dev_mac.splice(1,filter_dev_mac.length-1)
        console.log(filter_dev_mac)
    }else{
        filter_dev_mac=[];
    }*/
    if( baTable.form.items!.filter_uuid!=null){
        filter_ibeacon_uuid=  baTable.form.items!.filter_uuid.split('-')
        if(filter_ibeacon_uuid[0].length==0){
            filter_ibeacon_uuid=[];
        }
    }

   /* if(baTable.form.items!.filter_uuid !=null&&baTable.form.items!.filter_uuid.startsWith('1')){
        filter_ibeacon_uuid=  baTable.form.items!.filter_uuid.split('-')
        console.log(filter_ibeacon_uuid)
        filter_ibeacon_uuid=filter_ibeacon_uuid.splice(1,filter_ibeacon_uuid.length-1)
        console.log(filter_ibeacon_uuid)
    }else{
        filter_ibeacon_uuid=[];
    }*/
    if( baTable.form.items!.scan_filter_serv_data_uuid!=null){
        filter_serv_data_uuid=  baTable.form.items!.scan_filter_serv_data_uuid.split('-')
        if(filter_serv_data_uuid[0].length==0){
            filter_serv_data_uuid=[]
        }
    }

   /* if(baTable.form.items!.scan_filter_serv_data_uuid !=null&&baTable.form.items!.scan_filter_serv_data_uuid.startsWith('1')){


        filter_serv_data_uuid=filter_serv_data_uuid.splice(1,filter_serv_data_uuid.length-1)

    }else{
        filter_serv_data_uuid=[];
    }*/
    if(baTable.form.items!.filter_company_id !=null){
        companyid=  baTable.form.items!.filter_company_id.split('-')
        if(companyid[0].length==0){
            companyid=[]
        }
    }
    /*if(baTable.form.items!.filter_company_id !=null&&baTable.form.items!.filter_company_id.startsWith('1')){
        companyid=  baTable.form.items!.filter_company_id.split('-')

        companyid=companyid.splice(1,companyid.length-1)

    }else{
        companyid=[];
    }*/


    }
function getReport(type) {

    if (type == undefined) {
        return "";
    }
    var type_str=""
    switch (type) {
        case 0:
            type_str="不上报"
            break
        case 1:
            type_str="仅有广播包"
            break
        case 2:
            type_str="含有响应包"
            break
        case 3:
            type_str="只有信号值"
            break
        case 5:
            type_str="昆仑工卡"
            break
    }
    return type_str;
}
function consoed(){
    activeName='1';
}

function open(){
    getFilterName()
}


</script>

<style scoped lang="scss">

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

<style scoped lang="scss">


.container1
{
    display: flex;
    display: -webkit-flex; /* Safari */
}
.item1
{
    flex:1;
    margin-left: 5px;
    margin-top: 5px;
    margin-bottom: 5px;

}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}
</style>
