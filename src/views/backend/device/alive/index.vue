
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('device_code_name')+'/'+t('Consuming_who') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
`
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide, onUnmounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import {unBindTag,reback} from '/@/api/backend/index.ts'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'
import { useAdminInfo } from '/@/stores/adminInfo'
import bind_mac from './bind_mac.vue'
import bt from './bt.vue'
import aArea from './aArea.vue'
import bArea from './bArea.vue'
import map_name from './map_name.vue'
import gateway_name from './gateway_name.vue'
import { markRaw } from 'vue'
import { ElNotification } from 'element-plus'

defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/Devicep/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('code_sn'), prop: 'sn', align: 'center',render:'tag',width:180},
        { label: t('device_code_name'), prop: 'name',  align: 'center',width:150 },
   

        {
            width:90,
            label: t('State'),
            prop: 'online',
            align: 'center',
            render: 'tag',
            custom: { '0': 'warning', '1': 'success' },
            replaceValue: { '0': t('unline'), '1': t('online') },
        },
        {  label: t('bt'), prop: 'bt',render: 'customRender', customRender: markRaw(bt),width: '80',align: 'center',width:180,},
        {  label: t('a_area_name'), prop: 'bt',render: 'customRender', customRender: markRaw(aArea),width: '100',align: 'center',width:180,},
        {  label: t('b_area_name'), prop: 'bt',render: 'customRender', customRender: markRaw(bArea),width: '150',align: 'center',},
        {  label: t('map_name'), prop: 'bt',render: 'customRender', customRender: markRaw(map_name),width: '150',align: 'center',},
        {  label: t('fence_name'), prop: 'fence_name' ,align: 'center',  render: 'tag',width:180},
        { label: t('Consuming_who'), prop: 'person_name', align: 'center' ,width:180},
        {

            label: t('SOS'),
            prop: 'sos',
            align: 'center',
            render: 'tag',
            custom: { '1': 'error', '0': 'success','-1': 'info' },
            replaceValue: { '-1': t('usSOS'),'0': t('unSOS'), '1': t('SOS') },width:180
        },
        {
            width:120,
            label: t('run_state'),
            prop: 'run',
            align: 'center',
            render: 'tag',
            custom: { '1': 'error', '0': 'success','-1': 'info' },
            replaceValue: { '-1': t('usSOS'),'0': t('unrun'), '1': t('sos_run') ,width:150},
        },
        { label: t('near_gateway'), prop: 'gateway_mac', align: 'center',width:180},
        {  label: t('gateway_name'), prop: 'bt',render: 'customRender', customRender: markRaw(gateway_name),width: '200',align: 'center',},


        { label: t('bind_tag'), prop: 'isbind', align: 'center' ,render: 'customRender', customRender: markRaw(bind_mac),width:150},
        { label: t('last time'),render:'datetime', prop: 'lasttime', align: 'center' ,width:180}
    ],
}, {
    defaultItems: {
        status: '1',
    },
} )

provide('baTable', baTable)
var timer;
onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()
    console.log("sss="+baTable.table.ref)
    console.log(baTable.table.ref)
    timer=setInterval(function(){
        baTable.getIndex()
    },3000)
})

onUnmounted(()=>{
    clearInterval(timer)
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
function rebacks(sn:string) {
    reback(sn).then((res)=>{
        if(res.code==1){
            ElNotification({
                message: res.msg,
                type: 'success',
            })
        }
    })
}
</script>

<style scoped lang="scss">
.table-wrapper {
    height: calc(100% - 60px);
}</style>
