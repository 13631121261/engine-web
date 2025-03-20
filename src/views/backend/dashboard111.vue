<template>
    <div class="default-main" id='div2'>
        <el-row :gutter="20">
            <el-col :span="18">
                <div  id='div1'>
                    <div class="banner">

                        <el-row :gutter="10">
                            <el-col :md="24" >
                                <div class="welcome suspension"  style='height: 100px;justify-content: center; align-items: center;' >

                                    <div class="welcome-text">
<!--                                        <div class="welcome-title">{{ adminInfo.nickname + t('utils.comma') + getGreet() }}</div>-->
                                        <div class="welcome-note" style='font-size: 50px;' >{{t('Asset management platform')}}</div>
                                    </div>
                                </div>
                            </el-col>

                        </el-row>
                    </div>
                    <div class="small-panel-box">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <div class="small-panel suspension" style='display: flex;'>

                                    <div style='text-align: center;width: 20%'>
                                        <div style='color: #92969a;font-size: 15px;width: 100px '>
                                            <span >{{t('device_status')}}</span>
                                        </div>
                                        <div style='margin-top: 20px;font-size: 30px;color: #000000;width: 70px'>
                                            <span id="all_asset">{{asset_offline+asset_online}}</span>
                                            <br>
                                            <span id="all_asset" style='color:#99FFFF;font-size: 20px'>{{asset_online}}</span>
                                            <span style='color: #FF0000;font-size: 20px'>/</span>
                                            <span id="all_asset" style='color:#aaaaaa;font-size: 20px'>{{asset_offline}}</span>
                                        </div>
                                    </div>
                                    <div >
                                    <div id='all_asset_view' style='height: 150px;width: 280px;margin-right: 20px'></div>

                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="small-panel suspension" style='display: flex;'>

                                    <div style='text-align: center'>
                                        <div style='color: #92969a;font-size: 15px;width: 100px'>
                                            <span >{{t('beacon_status')}}</span>
                                        </div>
                                        <div style='margin-top: 20px;font-size: 30px;color: #000000;width: 70px'>
                                            <span id="all_asset">{{beacon_aoa_offline+beacon_aoa_online}}</span>
                                            <br>
                                            <span id="all_asset" style='color:#99FFFF;font-size: 20px'> {{ beacon_aoa_online}}</span>
                                            <span style='color: #FF0000;font-size: 20px'>/</span>
                                            <span id="all_asset" style='color:#aaaaaa;font-size: 20px'>{{ beacon_aoa_offline}}</span>
                                        </div>
                                    </div>
                                    <div style='text-align: center'>
                                        <div id='all_beacon_view' style='height: 150px;width: 300px;margin-left: 0px'></div>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="8">
                                <div class="small-panel suspension" style='display: flex;'>
                                    <div style='text-align: center'>
                                        <div style='color: #92969a;font-size: 15px;width: 130px'>
                                            <span >{{t('Locator_status')}}</span>
                                        </div>
                                        <div style='margin-top: 20px;font-size: 30px;color: #000000;width: 70px'>
                                            <span id="all_asset">{{locator_offline+locator_online}}</span>
                                            <br>
                                            <span id="all_asset" style='color:#99FFFF;font-size: 20px'>{{ locator_online }}</span>
                                            <span style='color: #FF0000;font-size: 20px'>/</span>
                                            <span id="all_asset" style='color:#aaaaaa;font-size: 20px'>{{ locator_offline }}</span>
                                        </div>
                                    </div>
                                    <div style='text-align: center'>
                                        <div id='all_gateway_view' style='height: 150px;width: 300px;margin-right: 0px'></div>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="growth-chart">
                        <el-row :gutter="10">
                            <el-col class="lg-mb-20" :span="12">

                                <el-card shadow="hover" :header="t('Alarm Log')">
                                    <div id='dom_sos' class='file-growth-chart'></div>

                                </el-card>
                            </el-col>
                            <el-col class="lg-mb-20" :span="12">
                                <el-card shadow="hover" :header="t('Asset Allocation')">

                                    <div id='dom_map' class='file-growth-chart'></div>
                                </el-card>
                            </el-col>

                        </el-row>
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div  style='height: 100px; width: auto;  justify-content: center; display: flex;align-items: center;' class="small-panel suspension" >

                    <div ><span style='font-size: 25px;color: #00aaff'>
                           {{time1 }}
                           </span>
                       <br>
                       <br>
                        <span style='font-size: 30px;color: #00aaff'>
                           {{time2}}
                    </span>
                </div>
                </div>
                <div >
                    <el-scrollbar :height='h'>
                        <p :id="'item'+index" v-for="index in sos_detail.length" :key="index" class="suspension" style='float: left;color: #00aaff;   background-color: #ffffff;width: 100%;
    border-radius: var(--el-border-radius-base);
    padding: 15px;
    margin-bottom: 10px;'>
                            {{getItem(index,this)}}</p>
                    </el-scrollbar>
                </div>
            </el-col>
        </el-row>

    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, nextTick, onActivated, onDeactivated,watch, onBeforeMount, ref } from 'vue'
import headerSvg from '/@/assets/dashboard/header-1.svg'
import coffeeSvg from '/@/assets/dashboard/coffee.svg'
import { CountUp } from 'countup.js'
import * as echarts from 'echarts'
import { useNavTabs } from '/@/stores/navTabs'
import { useTemplateRefsList } from '@vueuse/core'
import { dashboard } from '/@/api/backend/dashboard'
import { useI18n } from 'vue-i18n'
import { Local } from '/@/utils/storage'
import { useAdminInfo } from '/@/stores/adminInfo'
import { WORKING_TIME } from '/@/stores/constant/cacheKey'
import { getGreet } from '/@/utils/common'
import { useEventListener } from '@vueuse/core'

let time1=ref('')
let time2=ref('')
defineOptions({
    name: 'dashboard',
})

const d = new Date()
const { t } = useI18n()
const navTabs = useNavTabs()
const adminInfo = useAdminInfo()
const chartRefs = useTemplateRefsList<HTMLDivElement>()
let h=ref(0)
function  getHeight(){

    console.log("ssss="+h)
   return h
}
const state: {
    charts: any[]
    remark: string
    workingTimeFormat: string
    pauseWork: boolean
} = reactive({
    charts: [],
    remark: 'dashboard.Loading',
    workingTimeFormat: '',
    pauseWork: false,
})

dashboard().then((res) => {
    state.remark = res.data.remark
})

const countUpFun = (id: string) => {
    nextTick(() => {
        let value = document.getElementById(id)?.innerText
        if (value) {
            new CountUp(id, parseInt(value), {
                startVal: 0,
                duration: 3,
            }).start()
        }
    })
}

const initCountUp = () => {
    countUpFun('all_asset')
    countUpFun('user_reg_number')
    countUpFun('file_number')
    countUpFun('users_number')
    countUpFun('addons_number')
}




const echartsResize = () => {
    nextTick(() => {
        for (const key in state.charts) {
            state.charts[key].resize()
        }
    })
}


onActivated(() => {
    echartsResize()
    console.log("reg onDeactivated,每次离开都执行一下aaaaaaaaaaaa")

    setInterval1();
    timer2=setInterval(getTime,1000);
})

onDeactivated(()=>{
    console.log("reg onDeactivated,每次离开都执行一下")

    clearInterval(timer1)
    clearInterval(timer2)
})

import {
    TooltipComponent,
    TooltipComponentOption,
    LegendComponent,
    LegendComponentOption
} from 'echarts/components';
import { PieChart, PieSeriesOption } from 'echarts/charts';
import { LabelLayout } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {
    getAssetByAllMap,
    getAssetState,
    getBeaconState,
    getLocatorState,
    getSosDatail,
    getSosOnDay,
} from '/@/api/backend'
import moment from 'moment'
import { i18n } from '/@/lang'

echarts.use([
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout
]);

type EChartsOption = echarts.ComposeOption<TooltipComponentOption | LegendComponentOption | PieSeriesOption>;

var chartDom_asset
var chartDom_gateway
var chartDom_person
var chartDom_sos
var chartDom_map

var myChart_asset
var myChart_gateway
var myChart_beacon
var myChart_sos
var myChart_map

var option_asset: { color: string[]; legend: { orient: string; left: string; show: boolean }; series: { data: ({ name: string; value: number } | { name: string; value: number })[]; name: string; emphasis: { itemStyle: { shadowOffsetX: number; shadowBlur: number; shadowColor: string } }; type: string; radius: string }[]; emphasis: { label: { show: boolean; fontSize: number; fontWeight: string } }; tooltip: { trigger: string }; title: { subtext: string; left: string; text: string } };
var option_gateway: { color: string[]; legend: { orient: string; left: string; show: boolean }; series: { data: ({ name: string; value: number } | { name: string; value: number })[]; name: string; emphasis: { itemStyle: { shadowOffsetX: number; shadowBlur: number; shadowColor: string } }; type: string; radius: string }[]; emphasis: { label: { show: boolean; fontSize: number; fontWeight: string } }; tooltip: { trigger: string }; title: { subtext: string; left: string; text: string } };
var option_map: { yAxis: { data: string[]; type: string }; xAxis: { type: string }; legend: {}; grid: { left: string; bottom: string; right: string; containLabel: boolean }; series: ({ stack: string; data: number[]; name: string; emphasis: { focus: string }; label: { show: boolean }; type: string } | { stack: string; data: number[]; name: string; emphasis: { focus: string }; label: { show: boolean }; type: string } | { stack: string; data: number[]; name: string; emphasis: { focus: string }; label: { show: boolean }; type: string } | { stack: string; data: number[]; name: string; emphasis: { focus: string }; label: { show: boolean }; type: string } | { stack: string; data: number[]; name: string; emphasis: { focus: string }; label: { show: boolean }; type: string })[]; tooltip: { axisPointer: { type: string }; trigger: string } };
var option_beacon: { color: string[]; legend: { orient: string; left: string; show: boolean }; series: { data: ({ name: string; value: number } | { name: string; value: number })[]; name: string; emphasis: { itemStyle: { shadowOffsetX: number; shadowBlur: number; shadowColor: string } }; type: string; radius: string }[]; emphasis: { label: { show: boolean; fontSize: number; fontWeight: string } }; tooltip: { trigger: string }; title: { subtext: string; left: string; text: string } };
var option_sos: { yAxis: { type: string }; xAxis: { data: string[]; type: string }; legend: undefined; series: { data: (number | { itemStyle: { color: string }; value: number })[]; type: string }[]; tooltip: undefined };


option_map = {
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            // Use axis to trigger tooltip
            type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
        }
    },
    legend: {},
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
        type: 'value'
    },
    yAxis: {
        type: 'category',
        data: ['地图1','地图5']
    },
    series: [
        {
            color:'#99FFaa',
            name: t('online'),
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [120,210]
        },
        {
            color:'#aaaaaa',
            name: t('unline'),
            type: 'bar',
            stack: 'total',
            label: {
                show: true
            },
            emphasis: {
                focus: 'series'
            },
            data: [10, 20]
        },


    ]
};

let asset_online=ref(0)
let asset_offline=ref(0)
option_asset = {
    color: [ '#99FFFF','#aaaaaa'],
    title: {
        text: '',
        subtext: '',
        left: 'center'
    },
    emphasis: {
        label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'right',
        show:false
    },
    series: [
        {
            name: i18n.global.t('device_status'),
            type: 'pie',
            radius: '60%',
            data: [
                { value: 0,  name: t('online') },
                { value: 0, name: t('unline')  },

            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
let locator_online=ref(0)
let locator_offline=ref(0)

option_gateway = {
    color: [ '#99FFaa','#aaaaaa'],
    title: {
        text: '',
        subtext: '',
        left: 'center'
    },
    emphasis: {
        label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'right',
        show:false
    },
    series: [
        {
            name: i18n.global.t('Locator_status'),
            type: 'pie',
            radius: '60%',
            data: [
                { value: 31,  name: t('online') },
                { value: 10,name: t('unline')  },

            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};
let beacon_aoa_online=ref(0)
let beacon_aoa_offline=ref(0)
option_beacon = {
    color: [ '#77ddff','#aaaaaa'],
    title: {
        text: '',
        subtext: '',
        left: 'center'
    },
    emphasis: {
        label: {
            show: true,
            fontSize: 10,
            fontWeight: 'bold'
        }
    },
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'right',
        show:false
    },
    series: [
        {
            name: i18n.global.t('beacon_status'),
            type: 'pie',
            radius: '60%',
            data: [
                { value: 0,   name: t('online') },
                { value: 0, name: t('unline')  },

            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
};

option_sos = {
    legend: undefined, tooltip: undefined,
    xAxis: {
        type: 'category',
        data: [ t('disassemble'), t('move'),t('unline1'),t('outto'),t('into'),  t('bt_sos')]
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data: [
                5,
                5,
                5,
                5,
                5,
                5
            ],
            type: 'bar'
        }
    ]
};



onMounted(() => {

    initCountUp()
  //  initUserGrowthChart()
   // initFileGrowthChart()
   // initUserSourceChart()
   // initUserSurnameChart()
    useEventListener(window, 'resize', echartsResize)
    chartDom_asset = document.getElementById('all_asset_view')!;
    myChart_asset = echarts.init(chartDom_asset);
    option_asset && myChart_asset.setOption(option_asset,true);


    chartDom_person = document.getElementById('all_beacon_view')!;
    myChart_beacon = echarts.init(chartDom_person);
    option_beacon && myChart_beacon.setOption(option_beacon,true);

    chartDom_gateway = document.getElementById('all_gateway_view')!;
    myChart_gateway= echarts.init(chartDom_gateway);
    option_gateway && myChart_gateway.setOption(option_gateway,true);

    chartDom_sos = document.getElementById('dom_sos')!;
    myChart_sos= echarts.init(chartDom_sos);
    option_sos && myChart_sos.setOption(option_sos,true);

    chartDom_map = document.getElementById('dom_map')!;
    myChart_map= echarts.init(chartDom_map);
    option_map && myChart_map.setOption(option_map,true);

    var div=document.getElementById("div1");
    console.log(div?.offsetHeight)
    h.value=<number>div?.offsetHeight-100





})
onUnmounted(() => {
    console.log("注销"+timer1)

    clearInterval(timer1)
    clearInterval(timer2)
})
function getItem(index,view){
    console.log(  view)
    console.log( "DDD="+ index)
 //   console.log( sos_detail.value[index].name)
    var item= sos_detail.value[index-1]
    console.log(item)
    if(item!=null){
    var html
        var type=item.alarm_type;

        if(type=='sos_offline'){
            html='<span style="color: #000000">'+item.name+'-'+item.sn+'：</span>'+'<span style="color: #aaaaaa">'+t('sos_offline')+'</span><span style="margin-left: 20px">'+   dateFormat(item.create_time)+'</span>'
        }else if(type=='sos_online'){
            html='<span style="color: #000000">'+item.name+'-'+item.sn+'：</span>'+'<span style="color: #00FF00">'+t('sos_online')+'</span><span style="margin-left: 20px">'+   dateFormat(item.create_time)+'</span>'

        }else if(type=='sos_key'){
            html='<span style="color: #000000">'+item.name+'-'+item.sn+'：</span>'+'<span style="color: #FF0000">'+t('disassemble1')+'</span><span style="margin-left: 20px">'+   dateFormat(item.create_time)+'</span>'
        }
        else if(type=='sos_run'){
            html='<span style="color: #000000">'+item.name+'-'+item.sn+'：</span>'+'<span style="color: #FF0000">'+t('sos_run')+'</span><span style="margin-left: 20px">'+   dateFormat(item.create_time)+'</span>'
        }
        else if(type=='sos_bt'){
            html='<span style="color: #000000">'+item.name+'-'+item.sn+'：</span>'+'<span style="color: #FF0000">'+t('sos_bt')+'</span><span style="margin-left: 20px">'+   dateFormat(item.create_time)+'</span>'
        }
        else if(type=='fence_out_sos'){
            html='<span style="color: #000000">'+item.name+'-'+item.sn+'：</span>'+'<span style="color: #FF0000">'+t('fence_out_sos')+'</span><span style="margin-left: 20px">'+   dateFormat(item.create_time)+'</span>'
        }
        else if(type=='fence_on_sos'){
            html='<span style="color: #000000">'+item.name+'-'+item.sn+'：</span>'+'<span style="color: #FF0000">'+t('fence_on_sos')+'</span><span style="margin-left: 20px">'+   dateFormat(item.create_time)+'</span>'
        }


        var sp=document.getElementById("item"+index);
        /*if(view!=null){
            view=html
        }*/

            if(sp!=null){
                sp.innerHTML=html
            }
       // return html
    }

}
function dateFormat(date) {

    if (date == undefined) {
        return "";
    }
    console.log("时间戳="+date)
    return moment(date*1000).format("YYYY-MM-DD HH:mm:ss");
}

function getTime(){
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    time1.value=year+"-"+month+"-"+day;
    if(hour<10){
        time2.value='0'+hour+":"
    }
    else{
        time2.value=hour+":"
    }
    if(minute<10){
        time2.value=  time2.value+"0"+minute+":"

    }else{
        time2.value=  time2.value+minute+":"
    }
    if(second<10){
        time2.value=  time2.value+"0"+second

    }else{
        time2.value=  time2.value+second
    }

  //  return
    //console.log(`${year}-${month}-${day} ${hour}:${minute}:${second}`);
}
interface Data {
    value:number,
    name:string
}

interface Color{
    color:string
}
interface Data_SOS {
    value:number,
    itemStyle: Color
}
var timer1
var timer2
let sos_detail=ref([])
function setInterval1() {
 //   console.log(option_asset)
    timer1=  setInterval(function(){
        getAssetState().then((res)=>{
            if(res.code==1&&res.data!=null){
                asset_offline.value=res.data.offline_sum
                asset_online.value=res.data.online_sum
                const newData = [];
                const off:Data={
                    value:res.data.offline_sum,
                    name: t('unline')
                }
                const on:Data={
                    value:res.data.online_sum,
                    name: t('online'),
                }


                 newData.push(on)
                newData.push(off)
                option_asset.series[0].data = newData;

                myChart_asset.setOption(option_asset);
            }

        })

//beacon信标

        getBeaconState().then((res)=>{
            if(res.code==1&&res.data!=null){
                beacon_aoa_offline.value=res.data.offline_sum
                beacon_aoa_online.value=res.data.online_sum
                const newData = [];
                const off:Data={
                    value:res.data.offline_sum,
                    name: t('unline')
                }
                const on:Data={
                    value:res.data.online_sum,
                    name: t('online'),
                }


                newData.push(on)
                newData.push(off)
                option_beacon.series[0].data = newData;

                myChart_beacon.setOption(option_beacon);
            }

        })


        //获取AOA基站
        getLocatorState().then((res)=>{
            if(res.code==1&&res.data!=null){
            locator_offline.value=res.data.offline_sum
            locator_online.value=res.data.online_sum
            const newData = [];
            const off:Data={
                value:res.data.offline_sum,
                name: t('unline')
            }
            const on:Data={
                value:res.data.online_sum,
                name: t('online'),
            }


            newData.push(on)
            newData.push(off)
            option_gateway.series[0].data = newData;

            myChart_gateway.setOption(option_gateway);
        }
        })


        //获取SOS状态
        getSosOnDay().then((res)=>{
            if(res.code==1&&res.data!=null){
                let key_sum=ref(0)
                let run_sum=ref(0)

                let fence_on_sum=ref(0)
                let fence_out_sum=ref(0)
                let offline_sum=ref(0)
                let bt_sum=ref(0)
                const newData = [];
                const color1:Color={
                  color:'#FF0000'
                }
                const key:Data_SOS={
                    value:res.data.key_sum,
                    itemStyle:color1
                }
                const color2:Color={
                    color:'#ffaadd'
                }
                const run:Data_SOS={
                    value:res.data.run_sum,
                    itemStyle:color2
                }

                const color3:Color={
                    color:'#aaaaaa'
                }
                const offline:Data_SOS={
                    value:res.data.offline_sum,
                    itemStyle:color3
                }




                const color4:Color={
                    color:'#FF0000'
                }
                const fence_out:Data_SOS={
                    value:res.data.fence_out_sum,
                    itemStyle:color4
                }



                const color5:Color={
                    color:'#00ffff'
                }
                const fence_on:Data_SOS={
                    value:res.data.fence_on_sum,
                    itemStyle:color5
                }


                const color6:Color={
                    color:'#aaaaaa'
                }
                const bt:Data_SOS={
                    value:res.data.bt_sum,
                    itemStyle:color6
                }
                newData.push(key)
                newData.push(run)
                newData.push(offline)
                newData.push(fence_out)
                newData.push(fence_on)
                newData.push(bt)
                option_sos.series[0].data = newData;

                myChart_sos.setOption(option_sos);
            //    console.log(option_sos)
            }
        })

        //获取每个地图设备状态
        getAssetByAllMap().then((res)=>{

            if(res.code==1){
                var map_name=[]
                var on=[]
                var off=[]
            //    console.log(res.data)
                for(var i=0;i<res.data.length;i++){
                    var a=res.data[i];
                    map_name.push(a.name)
                    on.push(a.on)
                    off.push(a.off)
                }
                option_map.yAxis.data=map_name
                    option_map.series[0].data=on
                option_map.series[1].data=off

                option_map && myChart_map.setOption(option_map);
              //  console.log(option_map)
/*
                option_map.yAxis.data.
                option_map.series.*/
            }
        })


        getSosDatail().then((res)=>{

            if(res.code==1){
                sos_detail.value=[]
                console.log(res.data)
                console.log(sos_detail.value.length)

                for(var i=0;i<res.data.length;i++){
                    var a=res.data[i];
                    sos_detail.value.push(a)
                }
            }
        })

    },3000)
}

onBeforeMount(() => {
    for (const key in state.charts) {
        state.charts[key].dispose()
    }
})



watch(
    () => navTabs.state.tabFullScreen,
    () => {
        echartsResize()
    }
)
</script>

<style scoped lang="scss">
.welcome {
    background: #e1eaf9;
    border-radius: 6px;
    display: flex;
    align-items: center;
    padding: 15px 20px !important;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    .welcome-img {
        height: 60px;
        margin-right: 10px;
        user-select: none;
    }
    .welcome-title {
        font-size: 1.5rem;
        line-height: 30px;
        color: var(--ba-color-primary-light);
    }
    .welcome-note {
        padding-top: 6px;
        font-size: 15px;
        color: var(--el-text-color-primary);
    }
}
.working {
    height: 130px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    height: 100%;
    position: relative;
    &:hover {
        .working-coffee {
            -webkit-transform: translateY(-4px) scale(1.02);
            -moz-transform: translateY(-4px) scale(1.02);
            -ms-transform: translateY(-4px) scale(1.02);
            -o-transform: translateY(-4px) scale(1.02);
            transform: translateY(-4px) scale(1.02);
            z-index: 999;
        }
    }
    .working-coffee {
        transition: all 0.3s ease;
        width: 80px;
    }
    .working-text {
        display: block;
        width: 100%;
        font-size: 15px;
        text-align: center;
        color: var(--el-text-color-primary);
    }
    .working-opt {
        position: absolute;
        top: -40px;
        right: 10px;
        background-color: rgba($color: #000000, $alpha: 0.3);
        padding: 10px 20px;
        border-radius: 20px;
        color: var(--ba-bg-color-overlay);
        transition: all 0.3s ease;
        cursor: pointer;
        opacity: 0;
        z-index: 999;
        &:active {
            background-color: rgba($color: #000000, $alpha: 0.6);
        }
    }
    &:hover {
        .working-opt {
            opacity: 1;
            top: 0;
        }
        .working-done {
            opacity: 1;
            top: 50px;
        }
    }
}
.small-panel-box {
    margin-top: 20px;
}
.small-panel {
    background-color: #ffffff;
    border-radius: var(--el-border-radius-base);
    padding: 20px;
    margin-bottom: 20px;
    .small-panel-title {
        color: #92969a;
        font-size: 15px;
    }
    .small-panel-content {
        display: flex;
        align-items: flex-end;
        margin-top: 20px;
        color: #2c3f5d;
        .content-left {
            font-size: 24px;
            .icon {
                margin-right: 10px;
            }
            span {
                display: inline-block;
                font-size: 28px;
            }
        }
        .content-right {
            font-size: 18px;
            margin-left: auto;
        }
        .color-success {
            color: var(--el-color-success);
        }
        .color-warning {
            color: var(--el-color-warning);
        }
        .color-danger {
            color: var(--el-color-danger);
        }
        .color-info {
            color: var(--el-text-color-secondary);
        }
    }
}
.growth-chart {
    margin-bottom: 20px;
}
.user-growth-chart,
.file-growth-chart {
    height: 260px;
}
.new-user-growth {
    height: 300px;
}

.user-source-chart,
.user-surname-chart {
    height: 400px;
}
.new-user-item {
    display: flex;
    align-items: center;
    padding: 20px;
    margin: 10px 15px;
    box-shadow: 0 0 30px 0 rgba(82, 63, 105, 0.05);
    background-color: var(--ba-bg-color-overlay);
    .new-user-avatar {
        height: 48px;
        width: 48px;
        border-radius: 50%;
    }
    .new-user-base {
        margin-left: 10px;
        color: #2c3f5d;
        .new-user-name {
            font-size: 15px;
        }
        .new-user-time {
            font-size: 13px;
        }
    }
    .new-user-arrow {
        margin-left: auto;
    }
}
.new-user-card :deep(.el-card__body) {
    padding: 0;
}

@media screen and (max-width: 425px) {
    .welcome-img {
        display: none;
    }
}
@media screen and (max-width: 1200px) {
    .lg-mb-20 {
        margin-bottom: 20px;
    }
}
html.dark {
    .welcome {
        background-color: var(--ba-bg-color-overlay);
    }
    .small-panel {
        background-color: var(--ba-bg-color-overlay);
        .small-panel-content {
            color: var(--el-text-color-regular);
        }
    }
    .new-user-item {
        .new-user-base {
            color: var(--el-text-color-regular);
        }
    }
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
