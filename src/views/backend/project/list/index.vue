<template>


    <div  ref="init" id='main' class="common-layout">
        <el-container v-if='load'>

            <el-header style='height: 120px;margin-left: 0px;'>
                <div class='center' style='height: 120px'>

                    <el-input :maxlength=10
                              :placeholder="t('search_project')"
                              style='width: 500px;height: 45px;font-size: 20px' v-model="search" placeholder="Please input" clearable >
                    <template #append>
                        <el-button :icon="Search" @click='getProject'/>
                    </template>
                    </el-input>
                </div>

            </el-header>
            <el-main>
               <div >
                <el-row  :gutter="20" >
                    <el-col :span="7" >
                    <div :style="{'width':leftShowWidth.width}" class="grid-content ep-bg-purple">
                    <el-card  class="box-card center" :style="{'width':leftShowWidth.width}" shadow="hover">
                        <div class="flex justify-space-between mb-4 flex-wrap gap-4">
                            <PopupForm @get-change='getChange' v-model:show=show />
                            <el-button
                                @click="show=true"
                                style='font-size:20px'
                                type="primary"
                                link
                            >{{ '+'+t('addProject') }}</el-button>
                        </div>
                    </el-card>
                    </div></el-col>
                    <el-col :span="7" :offset="1" v-if="aslist.length>0"><card1 :width='width' :item='aslist[0]' @get-change='getChange'/></el-col>
                    <el-col :span="7" :offset="1" v-if="aslist.length>1"><card1 :width='width' :item='aslist[1]' @get-change='getChange'/></el-col>
                </el-row>

                <div v-if="aslist.length>2"   v-for='(item,index) in aslist'>

                <el-row  :gutter="20" class="el-row" style="margin-bottom: 20px;" v-if="index%3==2">
                    <el-col :span="7"  v-if="index<=aslist.length"><card1 :width='width' :item='item' @get-change='getChange'/></el-col>
                    <el-col :span="7" :offset="1" v-if="index+1<=aslist.length-1"><card1 :width='width' :item='aslist[index+1]' @get-change='getChange'/></el-col>
                    <el-col :span="7" :offset="1" v-if="index+2<=aslist.length-1"><card1 :width='width' :item='aslist[index+2]' @get-change='getChange'/></el-col>
                </el-row>

                </div>
               </div>



            </el-main>
        </el-container>
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
import { onMounted, onBeforeUnmount, reactive, ref, nextTick } from 'vue'
import { createApp } from 'vue'
import { setAddproject } from './data'
import PopupForm from './popupForm_add.vue'
import card from './card.vue'
import card1 from './card1.vue'
import { Search } from '@element-plus/icons-vue'
import { getProjects } from '/@/api/backend/project'
import test from './test.vue'
import { getFirstRoute, handleAdminRoute, routePush } from '/@/utils/router'
import { adminBaseRoute } from '/@/router/static'
import { isEmpty } from 'lodash-es'

const title = ref('65e')

const app = createApp({
    /* 根组件选项 */
})
const search = ref('')
let aslist  = reactive([])
let load = ref(false)
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
        getProject()
    }
   else if(data.startsWith('goin_')){
       init(data.split('_')[1])
   }

}
function getProject(){
    load.value=false
    getProjects(search.value)
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
    var one= (document.getElementById("main").offsetWidth-20)/22
    width=one*7;
    console.log(width)
    console.log(window.innerWidth)
    var cards=document.getElementsByClassName("grid-content")
    leftShowWidth.width =width+'px'
    console.log(leftShowWidth.width)
    init(null)
    //默认加载全部
    getProject()


})
import { index1 } from '/@/api/backend'
import { handleAdminRoute, getFirstRoute, routePush } from '/@/utils/router'
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
const init = (data:String) => {
    /**
     * 后台初始化请求，获取站点配置，动态路由等信息
     */
    index1(data).then((res) => {
        siteConfig.dataFill(res.data.siteConfig)
        terminal.changePort(res.data.terminal.installServicePort)
        terminal.changePackageManager(res.data.terminal.npmPackageManager)
        adminInfo.dataFill(res.data.adminInfo)

        if (res.data.menus) {
            handleAdminRoute(res.data.menus)

       /*     // 预跳转到上次路径
            if (route.params.to) {
                const lastRoute = JSON.parse(route.params.to as string)
                if (lastRoute.path != adminBaseRoute.path) {
                    let query = !isEmpty(lastRoute.query) ? lastRoute.query : {}
                    routePush({ path: lastRoute.path, query: query })
                    return
                }
            }*/

            // 跳转到第一个菜单
            let firstRoute = getFirstRoute(navTabs.state.tabsViewRoutes)
            if (firstRoute) routePush(firstRoute.path)
        }
    })
}








</script>
