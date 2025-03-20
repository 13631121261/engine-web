<template>
    <div>

    <div id="container"></div>
        <div id="main" class="hdmrboxtm-mbox"  viewBox="0 0 1000 1000">
        </div>

    <!-- 终端数据展示 -->
    <div class="dataCount">
        <div style='background-color:#ffffff;'>
            <div style="margin-top: 20px;margin-left: 10px;margin-right: 10px">
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
            </div>

            <div  style="margin-left: 10px;margin-right: 10px">
            <el-tabs type="border-card" >



                <el-tab-pane :label="t('tag_name')">  <div>
                    <el-input
                        v-model='tag_filter'
                        clearable
                        style="width: 80%"
                        :placeholder="t('gateway_name')+'/'+t('code_sn')"
                        :suffix-icon="Search"
                        @input='search_tag'

                    />
                    <el-switch v-model="tag_show" @change="switch_tag" style='margin-left: 10px'/>
                </div>
                    <div >
                        <el-table :data="tags" :height='getHeight()' @row-click='tag_row_click'>

                            <el-table-column prop="address" :label="t('tag_address')"  />
                            <el-table-column prop="online" :label="t('State')" width="60" render='tag' >
                                <template #default="scope">
                                    <el-tag v-if="scope.row.online == '1'"
                                            type='success'
                                            disable-transitions
                                    >{{ t('online')}}</el-tag>
                                    <el-tag v-else
                                            type='info'
                                            disable-transitions
                                    >{{ t('unline')}}</el-tag>
                                </template>
                            </el-table-column>

                        </el-table>
                    </div></el-tab-pane>




                <el-tab-pane :label="t('gateway')">  <div>
                    <el-input
                        v-model='gateway_filter'
                        clearable
                        style="width: 80%"
                        :placeholder="t('gateway_name')+'/'+t('code_sn')"
                        :suffix-icon="Search"
                        @input='search_gateway'

                    />
                    <el-switch v-model="gateway_show" @change="switch_gateway" style='margin-left: 10px'/>
                </div>
                    <div >
                        <el-table :data="Gateways" :height='getHeight()' @row-click='gateway_row_click'>
                            <el-table-column prop="name" :label="t('gateway_name')" />
                            <el-table-column prop="address" :label="t('gateway_mac')"  />
                            <el-table-column prop="online" :label="t('State')" width="60" render='tag' >
                                <template #default="scope">
                                    <el-tag v-if="scope.row.online == '1'"
                                            type='success'
                                            disable-transitions
                                    >{{ t('online')}}</el-tag>
                                    <el-tag v-else
                                            type='info'
                                            disable-transitions
                                    >{{ t('unline')}}</el-tag>
                                </template>
                            </el-table-column>

                        </el-table>
                    </div></el-tab-pane>









            </el-tabs>
        </div>

        </div>
    </div>

    <tagDrawer  v-model:show="show" :TreeData="TreeData" @get-change='getChange' />



    </div>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { ref, onMounted, watch, reactive, onUnmounted } from 'vue'
import {getAllMap} from '/@/api/backend/location'
//import $ from 'jquery'
import {
    addGateway,
    addTag,
    createArea,
    loadSVGData,
    runGateway, runTag,
    updateGateway,
} from '/@/api/backend/location/map.ts'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import FormItem from '/@/components/formItem/index.vue'
import {
    getAreabyMap,
    getGatewaybyMap, getMap,

} from '/@/api/backend'
import {  Gateway, Tag } from '/@/api/backend/location/gateway'
import { createPolylineS } from '/@/api/backend/location/map'
import { ElNotification } from 'element-plus'
import tagDrawer from './DeviceDrawer.vue'
import iconfontInit from '/@/utils/iconfont'
import { useAdminInfo } from '/@/stores/adminInfo'
import { setTitleFromRoute } from '/@/utils/common'
import { forEach } from 'lodash-es'
const value = ref('')
const Gateways_map = new Map()
let gateway_show = ref(true)
let gateway_filter = ref('')
let Gateways=reactive([])



const tag_map = new Map()
let tag_show = ref(true)
let tag_filter = ref('')
let tags=reactive([])


//let tags: Array<tag> = []
var timer
var proportion
var map_key
var ws
function getHeight() {

    return window.innerHeight-250;
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
        ip='ws://'+ip+':7089'
        console.log("IP="+ip)
         ws = new WebSocket(ip);
        console.log("尝试连接"+ws)
        ws.onopen = function(evt) {
            console.log("Connection open ...链接完成7089");
        };
        //  ws.send("submitCode");
        // 3.服务器每次返回信息都会执行一次onmessage方法
        ws.onmessage = function (e) {
           console.log("服务器返回的信息: " + e.data)
            var json = eval('(' + e.data + ')')
          //   console.log("服务器返回的信息: " + json.toString())
            addTag1(json)
        };
    setTimeout(function() {
        getMap().then((res)=>{
            if(res.data.length>0){

                onRemoteSelectRow(res.data[0])
            }

        })
    },1000)

})
onUnmounted(()=>{
    console.log("断开")
    ws.close()

})

const onRemoteSelectRow = (rowData: any) => {
    console.log(rowData)
    Gateways.splice(0, Gateways.length);
    gateway_show.value=true
    Gateways_map.clear()
    gateway_filter.value=''
   // clearInterval( timer)




    tags.splice(0, tags.length);
    tag_show.value=true
    tag_map.clear()
    tag_filter.value=''

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
            timer= setInterval(intervalUpdate,5000)














    setTimeout(function() {
        ws.send(map_key+"-666-"+Math.random()*100);
    },1000)

   //tags=[]
}
const gateway_row_click = (rowData: any) => {

        runGateway(rowData.address)

}
const tag_row_click = (rowData: any) => {

    runTag(rowData.address)

}
function intervalUpdate() {
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
                        show:false,
                        type:1,
                        online:res.data[i].online,
                        last_time:res.data[i].lasttime
                    }
                    const gateway1=  Gateways_map.get(gateway.address)
                    if(gateway1!=null&&gateway_show.value){
                        if(gateway.name.includes(gateway_filter.value)||gateway.address.includes(gateway_filter.value)){
                        //    console.log("符合")
                            gateway.show=gateway_show.value;
                        }else{
                           // console.log("不符合")
                            gateway.show=false;
                        }
                    }
                    Gateways_map.set(gateway.address,gateway)
                 //   console.log("状态="+gateway.show+ gateway.address)
                    //更新网关
                    updateGateway(gateway)
                }
            }
        })
        .finally(() => {
        })


}

const switch_gateway = (state) => {
    Gateways.forEach(function(gateway,index){
        gateway.show=false
        updateGateway(gateway)
    })
    Gateways.splice(0, Gateways.length);
    Gateways_map.forEach(function(gateway1,key){
        console.log(gateway1.name+"==="+gateway_filter.value)
        gateway1.show=false
        if(gateway1.name.includes(gateway_filter.value)||gateway1.address.includes(gateway_filter.value)){
            if(state){
                gateway1.show=state;
                console.log("包含"+gateway1.show)
                Gateways.push(gateway1)
                Gateways_map.set(key,gateway1)
                updateGateway(gateway1)
            }
        }
    })
}
const search_gateway = (name_mac) => {
    Gateways.forEach(function(gateway,index){
        var state= gateway.show
        gateway.show=false
        updateGateway(gateway)
        gateway.show=state
    })
    gateway_filter.value=name_mac;
    console.log(name_mac)
    Gateways.splice(0, Gateways.length);
    Gateways_map.forEach(function(gateway1,key){
        console.log(gateway1.name+"==="+gateway_filter.value)

        if(gateway1.name.includes(gateway_filter.value)||gateway1.address.includes(gateway_filter.value)){
            console.log("包含"+gateway1.show)
            if(gateway_show.value){
                console.log("包含"+gateway1.address)
                 gateway1.show=true;
                Gateways.push(gateway1)
                Gateways_map.set(key,gateway1)
                updateGateway(gateway1)
            }

        }
    })
}














const switch_tag = (state) => {

    tags.forEach(function(tag,index){
        tag.show=false
        addTag(tag)
    })
    tags.splice(0, tags.length);
    tag_map.forEach(function(tag1,key){
        console.log(tag1.name+"==="+tag_filter.value)
        tag1.show=false
        if(tag1.address.includes(tag_filter.value)){
            if(state){
                tag1.show=state;
                console.log("包含"+tag1.show)
                tags.push(tag1)
                tag_map.set(key,tag1)
                addTag(tag1)
            }
        }
    })
}
const search_tag = (name_mac) => {
    tags.forEach(function(tag,index){
        var state= tag.show
        tag.show=false
        addTag(tag)
        tag.show=state
    })
    tag_filter.value=name_mac;
    console.log(name_mac)
    tags.splice(0,tags.length);
    tag_map.forEach(function(tag1,key){
        console.log(tag1.name+"==="+tag_filter.value)

        if(tag1.address.includes(tag_filter.value)){
            console.log("包含"+tag1.show)
            if(tag_show.value){
                console.log("包含"+tag1.address)
                tag1.show=true;
                tags.push(tag1)
                tag_map.set(key,tag1)
                addTag(tag1)
            }

        }
    })
}


function addTag1(res) {

     console.log(res)
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
                        online:res.tag[i].online,
                        last_time:res.tag[i].lastTime,
                        sos:res.tag[i].sos,
                        bt:res.tag[i].bt,
                    }

                        var tag1=tag_map.get(tag.address)
                        if(tag1!=null){
                            tag.show=false
                            if(tag.address.includes(tag_filter.value)){
                                if(tag_show.value){
                                    tag.show=tag_show.value
                                    // persons.push(tag)
                                }
                            }
                        }else{
                            tags.push(tag)
                            tag_map.set(tag.address,tag)
                        }


                        addTag(tag)


                }
            }

}
function dblclick(e) {
    //无用
}


let show=ref(false)
var TreeData=Array
var areaid=0
function getChange(data:String){
    show.value=false
}
const handleClick = () => {
    console.log('click')
}

const show_gateway = [
]




const tag_sos_Notify = (data:string,status:number) => {
    if(status==1){
        ElNotification({
            title: t('tag_sos_title'),
            message: data,
            position: 'bottom-right',
            type: 'error',
            duration:15000,
            dangerouslyUseHTMLString: true
        })
    }else{
        ElNotification({
            title: t('tag_sos_title'),
            message: data,
            position: 'bottom-right',
            type: 'success',
            duration:15000,
            dangerouslyUseHTMLString: true
        })
    }

}
const tag_line_Notify = (data:string,status:number) => {
    //console.log(data)
  //  console.log("状态="+status)
    if(status==1){
        ElNotification({
            title: t('tag_line_title'),
            message: data,
            position: 'bottom-right',
            type: 'success',
            duration:30000,
            dangerouslyUseHTMLString: true
        })
    }else{


        ElNotification({
            title: t('tag_line_title'),
            message: data,
            position: 'bottom-right',
            type: 'error',
            duration:30000,
            dangerouslyUseHTMLString: true
        })
    }
}
</script>

<style scoped>

body {
    overflow-y: hidden;
}
.hdmrboxtm-mbox{
    position : absolute;
    width : 80%;
    height : 100%;}

.dataCount {
    height: 1000px;
    background-color: #ffffff;
    width:auto;
    position: fixed;
    left: 80%;
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




</style>
<style type="text/css">
#pannel {
    position: absolute;
    left: 2%;
    bottom: 10%;
    z-index: 999;
}
</style>
