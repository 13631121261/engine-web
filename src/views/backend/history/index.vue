
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table v-if='table_show' ref="tableRef" style='width: 20px'></Table>
        <div>
            <div id="main" class="hdmrboxtm-mbox"  viewBox="0 0 0 0">

            </div>
           <div v-if='map_show' class="bottom" >
               <el-slider v-model="value1" @input='input' :max='history_data.length-1'/>
                <el-button @Click='start()' :disabled='button_status' type="primary">{{ t('play') }}</el-button>
               <el-button @Click='stop()'  :disabled='!button_status' type="warning" >{{t('stop')}}</el-button>
               <el-select
                   v-model="value"
                   class="m-2"
                   placeholder="Select"
                   style="width: 100px;margin-left: 10px"
                   @change='onchange'
               >
               <el-option
                   v-for="item in options"
                   :key="item.value"
                   :label="item.label"
                   :value="item.value"
               />
               </el-select>
               <el-button      style="margin-left: 10px" @Click='exit()' type='danger'>{{t('out')}}</el-button>
             </div>
       </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index_history.vue'
import { unBindTag, reback, getAoALocatorByMap } from '/@/api/backend/index.ts'
import { defaultOptButtons } from '/@/components/table/index'

import { cloneDeep } from 'lodash-es'
import { useAdminInfo } from '/@/stores/adminInfo'
import $ from 'jquery'
import {
    addGateway,
    addTag,
    createArea,
    loadSVGData,
    drawHistory, runTag, drawHistoryFash, drawHistoryStartPoint, drawHistoryEndPoint, clearHistory,

} from '/@/api/backend/location/map.ts'
import { useI18n } from 'vue-i18n'
import { markRaw } from 'vue'
import { ElNotification } from 'element-plus'
import bt from '/@/views/backend/beacon/list/bt.vue'
import { Gateway } from '/@/api/backend/location/gateway'

defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()
var history_data
let optButtons: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = defaultOptButtons([ 'delete'])

let outButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'look',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'success',
        // 按钮 icon
        icon: 'fa fa-play',
        class: 'table-row-info',
        // tipButton 禁用 tip
        disabledTip: false,
        // 自定义点击事件
        click: (row: TableRow, field: TableColumn) => {},
        // 按钮是否显示，请返回布尔值
        display: (row: TableRow, field: TableColumn) => {
            return true
        },
        // 按钮是否禁用，请返回布尔值
        disabled: (row: TableRow, field: TableColumn) => {
            return false
        },
        // 自定义el-button属性
        attr: {"color":"#0AFF85"}
    },
]
optButtons = optButtons.concat(outButton)
optButtons[1].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
    history_data=row.list
    table_show.value=false;
    map_show.value=true
    index=0;
    value1.value= index
    loadSVGData(row.map_data)
    clearHistory()
    getAoALocatorByMap(row.map_key).then((res) => {
        if(res.data.length>0){
            for(var i=0;i<res.data.length;i++){
                const locator: Gateway = {
                    address:res.data[i].address,
                    name:res.data[i].name,
                    x:res.data[i].x,
                    y:res.data[i].y,
                    proportion:10,
                    show:false,
                    online:res.data[i].online,
                    last_time:res.data[i].last_time,
                    type:2
                }
                //添加网关
                addGateway(locator)
            }
        }
        //   }
    })
}
const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/History/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('id'), prop: 'id',  align: 'center' },
        { label: t('device_person_name'), prop: 'name',  align: 'center' },
        { label: t('sn_idcard'), prop: 'sn', align: 'center',render:'tag'},
       { label: t('map_name'), prop: 'map_name',  align: 'center' , render: 'tag' },
        { label: t('fence_starttime'),render:'datetime', prop: 'start_time', align: 'center' },
        { label: t('fence_stoptime'),render:'datetime', prop: 'stop_time', align: 'center' },
        { label: t('history_sum_tip'),prop: 'sum', align: 'center' },
        {
            label: t('Operate'),
            align: 'center',
            width: '180',
            render: 'buttons',
            buttons: optButtons,
            fixed:'right'
        },
    ],
}, {
    defaultItems: {
        status: '1',
    },
} )



let table_show=ref(true)
let map_show=ref(false)
const value = ref('')
const value1 = ref(0)
const options = [
    {
        value: '1',
        label: '1X',
    },
    {
        value: '3',
        label: '3X',
    },
    {
        value: '5',
        label: '5X',
    },
    {
        value: '10',
        label: '10X',
    },

]
provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()

})
function unbind(sn:string) {
    unBindTag(sn).then((res)=>{
        if(res.code==1){
            ElNotification({
                message: res.msg,
                type: 'success',
            })
        }
    })
}
var index=0
var timer
var time_ms=1000
function start(){
    button_status.value=true
    stop_status=false
    varyInterval()
   // drawHistory(10,30,100,50)
    /* timer=setInterval(function() {
         if(index<0){
             index=0
         }
        if(index<history_data.length-1){

               console.log("index="+index+" 长度="+history_data.length)
            time_ms=history_data[index+1].time-history_data[index].time
            console.log("延时=="+time_ms)
       //     drawHistory(history_data[index].time,history_data[index].x*10,history_data[index].y*10,history_data[index+1].x*10,history_data[index+1].y*10,time_ms)
            index++
          //  console.log(index)
            value1.value= index
        }else{
            console.log("杀掉定时")
            clearInterval(timer)
        }
    },time_ms)*/
}




let button_status =ref(false);
var stop_status =false
var beisu=1;
function varyInterval() {

    if (stop_status == true) {
        console.log("停止了")
        return;
    }
    let timer = setTimeout(() => {
        if(index<0){
            index=0
        }
        if(index<history_data.length-1){
            console.log("index="+index+" 长度="+history_data.length)
            time_ms=(history_data[index+1].time-history_data[index].time)/beisu
            console.log("延时=="+time_ms)
          //  drawHistoryEndPoint(history_data[index].time,history_data[index].x*10,history_data[index].y*10)
            drawHistory(history_data[index].time,history_data[index].x*10,history_data[index].y*10,history_data[index+1].x*10,history_data[index+1].y*10,time_ms)

            //  console.log(index)
            value1.value= index
            if(index==0){
                drawHistoryStartPoint(history_data[index].time,history_data[index].x*10,history_data[index].y*10)
            }
            index++
        }else{
            console.log("88888888888index="+index+" 长度="+history_data.length)
            console.log("杀掉定时")
            stop_status = true;

        }

        clearTimeout(timer);
        varyInterval();
    }, time_ms);
}



const input= (data: any) => {
    stop()
   var index1=data
 //  console.log("data="+data)
   // console.log("index="+index)
    if(index<0){
        index=0
    }


    if(index1>index){
        for(;index<index1;index++){
           console.log(index)
            if(index>history_data.length-2){
                console.log("kkkkkkk"+index)
                return
            }
        if(index==0){
            drawHistoryStartPoint(history_data[index].time,history_data[index].x*10,history_data[index].y*10)
        }



            drawHistoryFash(history_data[index].time,history_data[index].x*10,history_data[index].y*10,history_data[index+1].x*10,history_data[index+1].y*10,index)
        }
        index--;
    }
    else{
        for(;index1<=index;index--){
          //  console.log(index)
            if(index==0){
                drawHistoryStartPoint(history_data[index].time,history_data[index].x*10,history_data[index].y*10)
            }
            if(index>=history_data.length-1){
                index--
            }
            drawHistoryFash(history_data[index].time,history_data[index].x*10,history_data[index].y*10,history_data[index+1].x*10,history_data[index+1].y*10,index)
        }
        if(index<0){
            index=0
        }

    }
   // drawHistoryFash(history_data[index].x*10,history_data[index].y*10,history_data[index+1].x*10,history_data[index+1].y*10,index)

}
const onchange= (data: any) => {

    beisu=data;
    console.log(data)

}
function stop(){
    button_status.value=false
    stop_status=true

}
function exit(){
    stop();
    table_show.value=true;
    map_show.value=false
    clearHistory()
}
</script>
<!--

<style scoped lang="scss">

body {
    overflow-y: hidden;
}
.hdmrboxtm-mbox{
    position : absolute;
    width : 100%;
    height : 70%;}
.table-wrapper {
    height: calc(100% - 60px);
}</style>
-->
<style scoped lang="scss">
.hdmrboxtm-mbox{
    position : absolute;
    width : 100%;
    height : 90%;}

.bottom {

    justify-content: center; /*水平居中*/
    align-items: Center; /*垂直居中*/
    bottom: 0px;
    position: fixed;

    height: 15%;
    width: 90%;
    padding: 20px;
    background-color: white;
}
</style>
