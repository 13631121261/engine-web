<template>
    <el-dialog
        style='height: 300px;'
        v-model="props.show"
        :modal=false
        :draggable='true'
         direction="rtl"
        :opened="open()"
        :width=300
        destroy-on-close
        :before-close="handleClose">
        <template #header>
            <div class="title">
            {{t('gateway_sum')+sum}}
            </div>
        </template>
        <el-scrollbar >
        <div>
            <div v-for="(value, key) in props.gateways">
                <div  v-if='value.show'>
                    <br/>
                    <el-tag  type="success">{{t('gateway_name')+':'+value.name+'-MAC:'+value.address}}</el-tag>
                </div>
            </div>
        </div>
        </el-scrollbar>
        <template #footer>
            <div >
                <el-button>{{ t('Cancel') }}</el-button>
                <el-button  type="primary">
                    {{t('Save') }}
                </el-button>
            </div>
        </template>
        </el-dialog>
</template>

<script lang='ts' setup>
import { onMounted } from 'vue'

import {loadSVGData} from '/@/api/backend/location/map.ts'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
let props = defineProps({
    show:Boolean,
    gateways: {}
});

let sum=0
const change=defineEmits(['get-change'])
function setchange(data:String) {
    change('get-change',data)
}
onMounted(() => {
        console.log("安排安排")
        sum=0
})
function open(){
    console.log(props.gateways)
    if(props.gateways!=null&&props.gateways.length>0){
        sum=0
        for(var i=0;i<props.gateways.length;i++){
            if(props.gateways[i].show){
                sum++;
            }
        }
    }
}
const handleClose = (done: () => void) => {
           // props.svgData.value=null
            console.log("关闭之前")
          //  done()
            setchange('cancel')
            sum=0
}
</script>
<style scoped>
body {
    overflow-y: hidden;
}
.hdmrboxtm-mbox{background-color:#f0f0f0a0;position : absolute;
    width : 100%;
    height : 100%;}



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
    top: 20%;
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
/*控件容器*/
.control-wrapper {
    position: absolute;
}

.top {
    top: 20px!important;
}


.right {
    right: 20px!important;
}


.bottom {
    bottom: 20px!important;
}


.left {
    left: 20px!important;
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
