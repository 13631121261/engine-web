<template>
    <div>
    <div id="container"></div>
        <div id="main" class="hdmrboxtm-mbox"  viewBox="0 0 0 0">
        </div>
    <!-- 终端数据展示 -->
    <div class="dataCount">
        <div style='background-color:#ffffff;'>
<!--            <div style="margin-top: 20px;margin-left: 10px;margin-right: 10px">
                <FormItem
                    :label="t('file')"
                    type="remoteSelect"
                    :input-attr="{
                        multiple: false,
                        pk: 'id',
                        field: 'name',
                        'remote-url':'/userApi/map/index2?aa='+Math.random(),
                         onRow: onRemoteSelectRow
                    }"
                    default:
                    :placeholder="t('file')"
                />
            </div>-->
            <div class="m-4">
                <div class="flex flex-wrap gap-4 items-center" style='margin: 5px'>
                <el-select
                    v-model="tag_mac"
                    filterable
                    remote
                    reserve-keyword
                    :placeholder="t('tag_name')"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    style="width: 140px"
                    @change="onChange"
                >
                    <el-option
                        v-for="item in beacon_list"
                        :key="item.mac"
                        :label="item.mac"
                        :value="item.mac"
                    />
                </el-select>
                <el-select v-model="interval"  :placeholder="t('report_interval')" style="width: 140px;margin-left: 5px"   @change="interval_change">
                    <el-option
                        v-for="item in times"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    />
                </el-select>
                    <el-button type="primary"  ref="start_button" style="margin-left: 5px" :disabled="isButtonDisabled" :onclick='onclick'> {{buttonText}}</el-button>
                </div>
                <div >
                    <el-table
                        ref="tableNode"
                        :data="Gateway_Tag" :height='getHeight()'
                        :row-class-name="tableRowClassName"
                    >
                        <el-table-column prop="g_address" :label="t('tag_address')"  />
                        <el-table-column prop="rssi" :label="t('rssi')" sortable  />

                       <el-table-column prop="time" :label="t('update_time')" width="200" render='tag'  sortable>
                            <template #default="scope">
                                <el-tag>{{dateFormat(scope.row.time)}}</el-tag>
                            </template>
                        </el-table-column>

                    </el-table>
                </div>
            </div>

        </div>
    </div>



    </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, watch, reactive, onUnmounted, nextTick } from 'vue'
import { getAllMap, setInterval } from '/@/api/backend/debug'
import {
    addGateway,
    addTag, clear,
    loadSVGData,
    runGateway, runTag,
    updateGateway,
} from '/@/api/backend/debug/map.ts'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import FormItem from '/@/components/formItem/index.vue'
import {
    getGatewaybyMap

} from '/@/api/backend'
import { Gateway, Gateway_Tag, Tag } from '/@/api/backend/debug/gateway'

import iconfontInit from '/@/utils/iconfont'
import { getAllBeaconByMac, getMapByKey } from '/@/api/backend/debug'
import moment from 'moment/moment'
const value = ref('')
const Gateways_map = new Map()
let gateway_show = ref(true)
let gateway_filter = ref('')
let Gateways=reactive([])
const person_map = new Map()
let person_show = ref(true)
let person_filter = ref('')
let persons=reactive([])
const locator_map = new Map()
let locator_show = ref(true)
let locator_filter = ref('')
let locators=reactive([])

const device_map = new Map()
let device_show = ref(true)
let device_filter = ref('')
let devices=reactive([])

const tableNode = ref()
const start_button = ref()
//let Devices: Array<Device> = []
var timer,locator_timer;
var proportion
var map_key
var ws

const beacon_list = ref<Beacon[]>([])
const tag_mac = ref<string>("")
const loading = ref(false)

let Gateway_Tag = reactive([])
interface Beacon {
    mac: string
    map_key:string
}
const isButtonDisabled = ref(true);
const buttonText = ref(t('stop'));
const interval = ref('')

const times = [
    {
        value: '1',
        label: t('s1'),
    },
    {
        value: '2',
        label: t('s2'),
    },
    {
        value: '3',
        label: t('s3'),
    },
    {
        value: '4',
        label: t('s4'),
    },
    {
        value: '5',
        label: t('s5'),
    },
    {
        value: '10',
        label: t('s6'),
    },
    {
        value: '15',
        label: t('s7'),
    },
    {
        value: '20',
        label: t('s8'),
    },
    {
        value: '30',
        label: t('s9'),
    },
]
const onChange=(mac:string)=>{
    console.log("选中"+mac)
    map_key="";
    for(var i=0;i<beacon_list.value.length;i++){
        if(mac==beacon_list.value[i].mac){
            map_key=beacon_list.value[i].map_key;
            break;
        }
    }
    if(map_key==null||map_key==""){
        isButtonDisabled.value=true
        alert("未检测到信标有定位，请选择有定位的信标")
    }else{
        isButtonDisabled.value=false
        getMapByKey(map_key,mac).then((res)=>{
                if(res.code==1){
                    onRemoteSelectRow(res.data)
                    buttonText.value=t('stop')
                    start=true
                }
        })

    }
}
const  interval_change=(interval:number)=>{
    console.log("选中"+interval)

    setInterval(interval).then((res)=>{
        console.log(res)
        if(res.code==1){

        }
    })
}


var start=false;
function onclick(){
  if(!start){
      buttonText.value=t('stop')
  }else{
      buttonText.value=t('start')
  }
  start=!start;

}

function dateFormat(date) {

    if (date == undefined) {
        return "";
    }

    return moment(date*1000).format("YYYY-MM-DD HH:mm:ss");
}
const remoteMethod = (query: string) => {
    if (query) {
        loading.value = true
        beacon_list.value = []
        getAllBeaconByMac(query).then((res)=>{
            loading.value = false
            if(res.code==1){
                if(res.data.length>0){
                    for(var i=0;i<res.data.length;i++){
                        const beacon: Beacon ={
                            mac:res.data[i].mac,
                            map_key:res.data[i].map_key
                        }
                        beacon_list.value.push(beacon)
                    }

                }
            }

        })

    } else {
        beacon_list.value = []
    }
}








function getHeight() {

    return window.innerHeight-100;
}
const value1 = ref(true)
onMounted(()=>{

        iconfontInit()

        //terminal.init()
        var ip= window.location.host
         ip=ip.replaceAll("http://","")
        console.log("IP="+ip)
         ip=ip.replaceAll(":706","")
        console.log("IP="+ip)
         ip=ip.replaceAll(":71","")
         ip=ip.replaceAll(":701","")
        console.log("IP="+ip)
        ip='ws://'+ip+':7090'
        console.log("IP="+ip)
         ws = new WebSocket(ip);
        console.log("尝试连接"+ws)
        ws.onopen = function(evt) {
            console.log("Connection open ...链接完成7090");
        };
        //  ws.send("submitCode");
        // 3.服务器每次返回信息都会执行一次onmessage方法
        ws.onmessage = function (e) {
            if(!start){
                return
            }
           console.log("服务器返回的信息: " + e.data)
            var json = eval('(' + e.data + ')')
             console.log("11服务器返回的信息: " + json)
            addTag1(json)
        };
/*    setTimeout(function() {
        getMap().then((res)=>{
            if(res.data.length>0){

                onRemoteSelectRow(res.data[0])
            }

        })
    },1000)*/

})
onUnmounted(()=>{
    console.log("断开")
    ws.send
    ws.close()
    clearInterval(locator_timer)
})

const onRemoteSelectRow = (rowData: any) => {
    console.log(rowData)
    Gateways.splice(0, Gateways.length);
    gateway_show.value=true
    Gateways_map.clear()
    gateway_filter.value=''
   // clearInterval( timer)


    locators.splice(0, locators.length);
    locator_show.value=true
    locator_map.clear()
    locator_filter.value=''
    clearInterval(locator_timer)

    persons.splice(0, persons.length);
    person_show.value=true
    person_map.clear()
    person_filter.value=''

    devices.splice(0, persons.length);
    device_show.value=true
    device_map.clear()
    device_filter.value=''

    proportion=rowData.proportion;
    loadSVGData(rowData.data)
    map_key=rowData.map_key
    getGatewaybyMap(rowData.map_key).then((res) => {
        //if(res.code==1){
        //  console.log(res.data)
        if(res.data.length>0){
            for(var i=0;i<res.data.length;i++){
                const gateway: Gateway = {
                    address:res.data[i].address,
                    name:res.data[i].name,
                    x:res.data[i].x,
                    y:res.data[i].y,
                    proportion:proportion,
                    show:false,
                    online:res.data[i].online,
                    last_time:0,
                    type:1,
                }
                gateway.show=gateway_show.value
                Gateways_map.set(gateway.address,gateway);
                Gateways.push(gateway)
                //添加网关
                addGateway(gateway)
            }
        }
    })
        .finally(() => {
        })
//    intervalUpdate()
   // timer= setInterval(intervalUpdate,5000)

    setTimeout(function() {
        ws.send(map_key+"-666-"+Math.random()*100);
    },1000)

   //Devices=[]
}
const gateway_row_click = (rowData: any) => {

        runGateway(rowData.address)

}
const device_row_click = (rowData: any) => {

    runTag(rowData.address)

}
/*
function intervalUpdate() {
    Gateway_Tag.splice(0, Gateway_Tag.length);
    getGatewaybyMap(map_key)
        .then((res) => {
            if(res.data.length>0){
                for(var i=0;i<res.data.length;i++){
                    const gateway: Gateway = {
                        address:res.data[i].address,
                        name:res.data[i].name,
                        x:res.data[i].x,
                        y:res.data[i].y,
                        proportion:proportion,
                        show:true,
                        type:1,
                        online:res.data[i].online,
                        last_time:res.data[i].lasttime,
                        is_use:false,
                        rssi:-100,
                        d:
                    }
                    const gateway1=  Gateways_map.get(gateway.address)
                    if(gateway1!=null&&gateway_show.value){
                        if(gateway.name.includes(gateway_filter.value)||gateway.address.includes(gateway_filter.value)){
                            console.log("符合")
                            gateway.show=gateway_show.value;
                        }else{
                            console.log("不符合")
                            gateway.show=false;
                        }
                    }
                    Gateways_map.set(gateway.address,gateway)
                    console.log("状态="+gateway.show+ gateway.address)
                    //更新网关
                    updateGateway(gateway)
                }
            }
        })
        .finally(() => {
        })

}
*/







function addTag1(res) {
    Gateway_Tag.splice(0, Gateway_Tag.length);
    for (const [key, value] of Gateways_map) {
           clear(key)
    }


            if(res.tag.length>0){
                for(var i=0;i<res.tag.length;i++){
                    if(map_key!=res.tag[i].map_key){
                        return
                    }
                    const tag: Tag = {
                        address:res.tag[i].mac,
                        x:res.tag[i].x,
                        y:res.tag[i].y,
                        proportion:proportion,
                        show:false,
                        online:res.tag[i].online,
                        last_time:res.tag[i].lastTime,
                        bt:res.tag[i].bt,
                        sn:res.tag[i].sn,
                        type:'tag'
                    }
                    for(var j=0;j<res.tag[i].gatewayDevices.length;j++){
                        const gateway_Tag:Gateway_Tag = {
                            g_address:res.tag[i].gatewayDevices[j].gAddress,
                            rssi:res.tag[i].gatewayDevices[j].rssi,
                            time:res.tag[i].gatewayDevices[j].time,
                            is_map:false,
                            is_use:false,
                            d:0
                        }
                        if(map_key==res.tag[i].gatewayDevices[j].map_key){
                            gateway_Tag.is_map=true
                        }
                        Gateway_Tag.push(gateway_Tag)

                    }
                    for(var j=0;j<res.tag[i].useDatalist.length;j++){
                        for(var n=0;n<Gateway_Tag.length;n++){
                            var gateway=Gateways_map.get(Gateway_Tag[n].g_address);
                            gateway.is_use=false;
                            gateway.rssi=-100;
                            if(Gateway_Tag[n].g_address==res.tag[i].useDatalist[j].gAddress&&Gateway_Tag[n].rssi==res.tag[i].useDatalist[j].rssi&&Gateway_Tag[n].time==res.tag[i].useDatalist[j].time){

                                res.tag[i].useDatalist[j].time
                               console.log("使用66="+ dateFormat(res.tag[i].useDatalist[j].time))
                                Gateway_Tag[n].is_use=true;
                                gateway.is_use=true;
                                gateway.rssi=Gateway_Tag[n].rssi+'|'+res.tag[i].useDatalist[j].d;
                                gateway.last_time=Gateway_Tag[n].time;

                                updateGateway(gateway)
                            }

                        }

                    }
                        addTag(tag)
                    }






            }

}
function dblclick(e) {
    //无用
}

let show=ref(false)
function getChange(data:String){
    show.value=false

}
const tableRowClassName = ({
    row,
    rowIndex,
}: {
    row: Gateway_Tag
    rowIndex: number
}) => {
    if (row.is_use) {
        return 'success-row'
    } else {
        return ''
    }

}





</script>

<style scoped>

body {
    overflow-y: hidden;
}
.hdmrboxtm-mbox{
    position : absolute;
    width : 75%;
    height : 100%;}

.dataCount {
    height: 1000px;
    background-color: #ffffff;
    width:auto;
    position: fixed;
    left: 75%;
    right: 0px;
}
.dataCount .time {
    background-color: #fff;
    border-radius: 3px;
    /* box-shadow: 0 0 10px #eee; */
    height: calc(20% - 10px);
    margin-bottom: 25px;
    text-align: center;
    opacity: 0.8;
}

.time:hover {
    opacity: 1;
}
.time.n2 {
    background-color: #5FB878;
    color: #fff;
    cursor: pointer;
}
.time.n3 {
    background-color: #009688;
    color: #fff;
    cursor: pointer;
}

.time.n4 {
    background-color: #FF5722;
    color: #fff;
    cursor: pointer;
}

.dataCount .time .center {
    position: relative;

}

.center p:nth-child(1) {
    font-size: 25px;
    margin-bottom: 5px;
}

.center p:nth-child(2) {
    font-size: 14px;
}

.n1 .center p:nth-child(1) {
    font-weight: 500;
    font-size: 27px;
    letter-spacing: 3px;
}

.n1 .center p:nth-child(2) {
    font-weight: bold;
    font-size: 13px;
    letter-spacing: 1px;
}

/* 在线离线样式 */
.online {
    opacity:1;
}

.offline {
    opacity: 1;
}

/* 选中样式 */
.select {
    box-shadow: 10px 10px 5px #c2c2c2;
    transform: scale(1.1);
}
</style>
<style>
  html,
  body,
  #container {
      width: auto;

      height: 100%;

  }



   .el-table .success-row  {
       --el-table-tr-bg-color: var(--el-color-success-light-9);
   }
  .el-table .warning-row {
      --el-table-tr-bg-color: var(--el-color-primary);
  }

</style>
<style type="text/css">
#pannel {
    position: absolute;
    left: 2%;
    bottom: 10%;
    z-index: 999;
}
</style>
