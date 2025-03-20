<template>

<div >
    <div v-if='!show_detail'>    <div  ref="init" id='main' class="common-layout">
        <el-container v-if='load'>

            <el-header style='height: 120px;margin-left: 0px;'>
                <div class='center' style='height: 120px'>

                    <el-input :maxlength=10
                              :placeholder="t('search_config')"
                              style='width: 500px;height: 45px;font-size: 20px' v-model="search" placeholder="Please input" clearable >
                        <template #append>
                            <el-button :icon="Search" @click='getConfig'/>
                        </template>
                    </el-input>
                </div>

            </el-header>
            <el-main>
                <div >
                    <el-row  :gutter="0" >
                        <el-col :span="5" >
                            <div :style="{'width':leftShowWidth.width}" class="grid-content ep-bg-purple">
                                <el-card  class="box-card center" :style="{'width':leftShowWidth.width}" shadow="hover">
                                    <div >
                                        <PopupForm @get-change='getChange' v-model:show=show />
                                        <el-button
                                            @click="show=true"
                                            style='font-size:20px'
                                            type="primary"
                                            link
                                        >{{ '+'+t('addConfig') }}</el-button>
                                    </div>
                                </el-card>
                            </div></el-col>
                        <el-col :span="5" :offset="1" v-if="aslist.length>0"><card1  :width='width' :item='aslist[0]' @get-change='getChange'/></el-col>
                        <el-col :span="5" :offset="1" v-if="aslist.length>1"><card1   :width='width' :item='aslist[1]' @get-change='getChange'/></el-col>
                        <el-col :span="5" :offset="1" v-if="aslist.length>2"><card1 :width='width' :item='aslist[2]' @get-change='getChange'/></el-col>
                    </el-row>

                    <div v-if="aslist.length>3"   v-for='(item,index) in aslist'>

                        <el-row  :gutter="0" class="el-row" style="margin-bottom: 20px;" v-if="index%4==3">
                            <el-col :span="5"  v-if="index<=aslist.length"><card1 :width='width' :item='item' @get-change='getChange'/></el-col>
                            <el-col :span="5" :offset="1" v-if="index+1<=aslist.length-1"><card1 :width='width' :item='aslist[index+1]' @get-change='getChange'/></el-col>
                            <el-col :span="5" :offset="1" v-if="index+2<=aslist.length-1"><card1 :width='width' :item='aslist[index+2]' @get-change='getChange'/></el-col>
                            <el-col :span="5" :offset="1" v-if="index+3<=aslist.length-1"><card1 :width='width' :item='aslist[index+3]' @get-change='getChange'/></el-col>

                        </el-row>

                    </div>
                </div>



            </el-main>
        </el-container>
    </div></div>
    <div v-if='show_detail'>
        <gateway_group  :config_key="config_key" @showpop='showpop'>
        </gateway_group>

    </div>


</div>


</template>
<style>
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
/*居中*/
.center {
    display: flex;
    justify-content: center;
    align-items: center;
}
/*靠右对齐*/
.container {
    display: flex;
    justify-content: flex-end;
}
.box-card {
    width: 450px;
    height: 250px;
}
</style>
<style lang="scss">
.el-row {
    margin-bottom: 20px;
}
.el-row:last-child {
    margin-bottom: 0;
}
.el-col {
    border-radius: 4px;
}

.grid-content {
    border-radius: 4px;
    min-height: 36px;
}
</style>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { onMounted, onBeforeUnmount, reactive, ref, nextTick, toRefs } from 'vue'
import { createApp } from 'vue'
import { Search } from '@element-plus/icons-vue'
import PopupForm from './popupForm_add.vue'

import card1 from './card1.vue'
import gateway_group from './gateway_group.vue'

import { getConfig } from '/@/api/backend/gatewayConfig'
import test from './test.vue'
import { getFirstRoute, handleAdminRoute, routePush } from '/@/utils/router'
import { adminBaseRoute } from '/@/router/static'
import { isEmpty } from 'lodash-es'

let config_key = ref('')
const parentMsg = ref('我是父组件的消息')
const app = createApp({
    /* 根组件选项 */
})
const search = ref('')
let aslist  = reactive([])
let load = ref(false)
let show_detail = ref(false)
let show=ref(false)
const leftShowWidth  = reactive({
    width:'400px'
});
let width=0;

function getChange(data:String){
    show.value=false
   if(data=='reload'){
        console.log("返回="+data)
        load.value=false
       getConfig1()
    }else if(data.startsWith('gateway_group')){
       show_detail.value=true
       config_key.value=data.split('-')[1]


   }
  /* else if(data.startsWith('goin_')){
       init(data.split('_')[1])
   }*/

}
function getConfig1(){
    load.value=false
    getConfig(search.value)
        .then((res) => {
            if(res.code==1){
                aslist=res.data
                aslist.length=res.data.length
                load.value=true
            }
        })
        .finally(() => {

        })
}
onMounted(()=>{
    var one= (document.getElementById("main").offsetWidth-20)/26
    width=one*6;
    console.log(width)
    console.log(window.innerWidth)
    var cards=document.getElementsByClassName("grid-content")
    leftShowWidth.width =width+'px'
    console.log(leftShowWidth.width)

    //默认加载全部
    getConfig1()
})

import { index1 } from '/@/api/backend'
import { useConfig } from '/@/stores/config'
import { useNavTabs } from '/@/stores/navTabs'
import { useTerminal } from '/@/stores/terminal'
import { useSiteConfig } from '/@/stores/siteConfig'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useRoute } from 'vue-router'
const terminal = useTerminal()
const navTabs = useNavTabs()
const config = useConfig()
const route = useRoute()
const siteConfig = useSiteConfig()
const adminInfo = useAdminInfo()

function showpop() {
    show_detail.value=false
    console.log("真的接受")
}





</script>
