<template>

        <div :style="{'width':width.width.value+'px'}" class="grid-content ep-bg-purple">
            <el-card  class="box-card" :style="{'width':width.width.value+'px'}" shadow="hover">
                <template #header>
                    <div class="card-header" >
                        <span style='font-weight:bold;color: #00aaff'>{{item.name}}</span>
                    </div>
                </template>
                <div  class="text item" >
                    <span style="font-weight:bold">{{t('create_time')}}</span>
                    {{': '+dateFormat(item.create_time)  }}</div>
                <div  class="text item">
                    <span style="font-weight:bold">{{t('update_time')}}</span>

                    {{': '+dateFormat(item.update_time)  }}</div>
                <div  class="text item" style="height: 30px;">
                    <span style="font-weight:bold">{{t('gateway_count')}}</span>
                    <span >   {{': '+item.gateway_count  }}</span>
                </div>
                <div class='container flex justify-space-between mb-4 flex-wrap gap-4'>
                    <popupForm_add v-model:show="show" :items='d.item' @get-change='getChange'/>
                    <el-button type="primary" @click='click()' link>{{ t('Info') }}</el-button>
                    <el-button type="primary" @click='gointo()'>{{ t('go_gateway') }}</el-button>
                </div>
            </el-card>
        </div>

</template>

<script setup  lang='ts'>
import { ref } from 'vue'
import  popupForm_add  from './popupForm_add.vue'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { routePush } from '/@/utils/router'


const { t } = useI18n()
const d = defineProps({
    width:Number,
    item:{}
});
let show=ref(false)

const width =toRefs(d)

function getChange(data:String){
    console.log("返回="+data)
    show.value=false
    console.log("返回="+data)
    setchange(data)
}
function click() {
    show.value=true
}
function gointo() {

    setchange('gateway_group-'+d.item.config_key)
}
const change=defineEmits(['get-change'])
function setchange(data:String) {
    change('get-change',data)
}
function dateFormat(date) {

    if (date == undefined) {
        return "";
    }
    console.log("时间戳="+date)
    return moment(date*1000).format("YYYY-MM-DD HH:mm:ss");
}
</script>

<style scoped>

</style>
