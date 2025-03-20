<template>
    <div>
        <div id="main" class="hdmrboxtm-mbox"  viewBox="0 0 0 0">

        </div>
    <!-- 终端数据展示 -->
    <div class="dataCount">
        <div>
            <div>
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
                        :placeholder="t('file')"
                    />
                </div>
            </div>
        </div>
        <div >
<!--            <div class="center">
                <el-scrollbar v-if='d'>
                    <p  class="scrollbar-demo-item" @click='addCreate'>


                        <el-button>
                            {{t('add_area')}}

                        </el-button>
                           </p>
                    <p v-for="item in area.length" :key="item" class="scrollbar-demo-item">  {{
                            area[item-1].name}}
                    <el-button type='danger' style="margin-left: 10px" @click='deleteArea(area[item-1].id)'>{{t('Delete')}}</el-button>
                    </p>
                </el-scrollbar>
            </div>-->
            <div style='height: 40px;float:right'>
                <el-button style='margin-right: 20px;' type="primary" @click='addCreate()'>{{ t('Add')}}</el-button>

            </div>
         <div >
                <el-table :data="area" :height='getHeight()' >
                    <el-table-column prop="name" :label="t('area_name')" :align='center'/>
                    <el-table-column prop="map_name" :label="t('map_name')"  />
                    <el-table-column :label="t('Operate')"  :header-align='center' :width='90'>
                        <template #default="scope">
                            <el-button style='margin-right: 0;margin-left: 0'  type="danger" @click='click_area(scope.row.id)'>{{ t('Delete')}}</el-button>

                        </template>
                    </el-table-column>

                </el-table>
            </div>
        </div>
    </div>

        <PopAreaName  v-model:show="area_name_show" :gateways="Gateways" :area_name="Area.name" :id="areaid"  @get-change='getChange'/>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, reactive } from 'vue'
import {getAllMap} from '/@/api/backend/location'
import $ from 'jquery'
import { addGateway, createArea, loadSVGData, runGateway } from '/@/api/backend/location/map.ts'
import { init, createPolyline, drawAgain, startDraw, stopDraw } from '/@/api/backend/location/map_addfence1.ts'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import FormItem from '/@/components/formItem/index.vue'
import {
    add_update_Area,
    delete_area, getAoALocatorByMap,
    getAreabyMap,

    getDevicebyMap,
    getGatewaybyMap, getMap,
} from '/@/api/backend'
import { Device, Gateway, IsPtInPoly, Point } from '/@/api/backend/location/gateway'
import { createPolylineS } from '/@/api/backend/location/map'
import { ElNotification } from 'element-plus'
import PopAreaName from './PopAreaName.vue'
import { loadSVG } from '/@/api/backend/location/map_addfence'
import { Area } from '/@/api/backend/location/Area'
const value = ref('')
let Gateways: Array<Gateway> = []
let Areas: Array<Area> = []
let Area:Area={}
var timer
var proportion
var map_key
var map_name
var  rowdata
let area=reactive([])
let d = ref(0)
onMounted(()=>{
    setTimeout(function() {
        getMap().then((res)=>{
            if(res.data.length>0){

                onRemoteSelectRow(res.data[0])
            }

        })
    },1000)

})
const click_area= (id: number) => {
    console.log(id)
    delete_area(id).then((res)=>{
        console.log(res)
        onRemoteSelectRow(rowdata);
        if(res.code==-10){
            ElNotification({
                message: t('delete_area_tip'),
                type: 'error',
                duration:3000,
                dangerouslyUseHTMLString: true
            })
        }
    })
}

function getHeight() {

    return window.innerHeight-250;
}
const onRemoteSelectRow = (rowData: any) => {
    rowdata=rowData
    Gateways=[]
    Areas=[]
    d.value=0
    area.splice(0, area.length);
    stopDraw()
    clearInterval( timer)
    proportion=rowData.proportion;
    loadSVGData(rowData.data)
    init(drawOk,rowData.data);
    map_key=rowData.map_key
    map_name=rowData.name
    getAreabyMap(rowData.map_key)
        .then((res) => {
            d.value=1;
            if(res.data.length>0){
            //    area=res.data
                console.log(d)
                for(var i=0;i<res.data.length;i++){
                    createArea(res.data[i].point,res.data[i].name,res.data[i].x,res.data[i].y,drawOk,res.data[i].id,1)
                    const area1: Area={
                            id:res.data[i].id,
                            name:res.data[i].name,
                            x:res.data[i].x,
                            y:res.data[i].y,
                            data:'',
                            point:res.data[i].point,
                            gateway_mac:res.data[i].gateway_mac,
                            map_key:res.data[i].may_key,
                            map_name:res.data[i].map_name
                    }
                    console.log("aaaa"+area1)
                    console.log(area1)
                    area.push(area1)
                   // createPolyline(res.data[i].point,res.data[i].id)
                }
            }
         /*   getGatewaybyMap(rowData.map_key).then((res) => {
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
                                online:0,
                                last_time:0,
                                type:1
                            }
                            Gateways.push(gateway)
                            //添加网关
                            addGateway(gateway)
                        }
                    }
                    //   }
                })
                .finally(() => {
                })*/
            getAoALocatorByMap(rowData.map_key).then((res) => {
                //if(res.code==1){
                console.log("厕所")
                 console.log(res.data)
                if(res.data.length>0){
                    for(var i=0;i<res.data.length;i++){
                        const gateway: Gateway = {
                            address:res.data[i].address,
                            name:res.data[i].name,
                            x:res.data[i].x,
                            y:res.data[i].y,
                            proportion:proportion,
                            show:false,
                            online:0,
                            last_time:res.data[i].last_time,
                            type:2
                        }
                        Gateways.push(gateway)

                        //添加网关
                        addGateway(gateway)
                    }
                }
                //   }
            })
                .finally(() => {
                })
         //   timer= setInterval(intervalUpdate,5000)
        })
        .finally(() => {
        })
}
function dblclick(e) {

        var data = this.data("data");
        var html='<span>网关名称：'+data+"</span>"

        /*ElNotification({
            message: html,
            type: 'success',
            duration:3000,
            dangerouslyUseHTMLString: true
        })*/
         console.log(data)
        areaid=data.id
        getData()


}/*
function deleteArea(id) {
    delete_area(id).then((res)=>{
        console.log(res)
        onRemoteSelectRow(rowdata);
        if(res.code==-10){
            ElNotification({
              message: t('delete_area_tip'),
              type: 'error',
              duration:3000,
              dangerouslyUseHTMLString: true
            })
        }
    })

}*/

let area_name_show=ref(false)
var TreeData=Array
var areaid=0
function getChange(opt:String,name:String){
    area_name_show.value=false
    for(var i=0;i<Gateways.length;i++){
        Gateways[i].show=false
    }
    console.log("回调="+name+areaid+opt)
    Area.name=name;
    Area.id=areaid;

    if(opt=="submit"){
        console.log("回调="+name+areaid+opt)
        add_update_Area(Area).then((res)=>{
            console.log(res)
            onRemoteSelectRow(rowdata);
        })
    }else{
        onRemoteSelectRow(rowdata);
    }
}
function getData() {
    getDevicebyArea(areaid).then((res)=>{
        console.log(res.data)
        TreeData=res.data
    }).finally()
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
function drawOk(data:string,points:any,point:any,svg:string,type:string,id:Number,name:string) {
    console.log(point)
    var mac=""
    if(type=="add"){
        console.log("新增区域")
        console.log("回调划线="+point)
        drawAgain()
        stopDraw()
    }else if(type=="edit"){
        console.log("编辑区域")
    }
    for(var i=0;i<Gateways.length;i++){
        var status=  IsPtInPoly(Gateways[i].x,Gateways[i].y,point,Gateways[i].proportion)
        if(status){
            Gateways[i].show=true
            mac=mac+Gateways[i].address+","+Gateways[i].type+"-"
            console.log("有网关符合区域="+mac)
            }
        }
    Area.map_name=map_name;
    Area.map_key=map_key;
    Area.name=name
    Area.data=svg
    Area.point=data
    Area.gateway_mac=mac
    var xy=calculatePolygonCenter(point);
    Area.x=xy[0]
    Area.y=xy[1]
    console.log("网关在   "+xy[0])
    area_name_show.value=true
    areaid=id;
    //  baTable.form.items!.data=svg
}







 function addCreate() {
    console.log("创建")
     startDraw()
 }
</script>

<style scoped>

body {
    overflow-y: hidden;
}
.hdmrboxtm-mbox{position : absolute;
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
    height: calc(90% );

    text-align: center;
    opacity: 0.8;
}

.time:hover {
    opacity: 1;
}
.time.n2 {
    background-color: #E0E0E0;
    color: #fff;
    cursor: pointer;
}

.dataCount .time .center {
    position: relative;

}

.center p:nth-child(n) {
    font-size: 20px;
    margin-bottom: 5px;
}

.center p:nth-child(2) {
    font-size: 20px;
    margin-bottom: 5px;
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

.scrollbar-demo-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    margin: 10px;
    text-align: center;
    border-radius: 4px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
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

</style>
