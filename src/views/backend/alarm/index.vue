
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('device_code_name')+'/'+t('person_name')+'/'+t('idcard')+'/'+t('code_sn') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" style='width: 20px'></Table>
`       <bind_pop/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide, onUnmounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index_1.vue'
import {unBindTag,reback} from '/@/api/backend/index.ts'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash-es'
import fence_name from './fence_name.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

import { markRaw } from 'vue'
import { ElNotification } from 'element-plus'
import bt from '/@/views/backend/beacon/list/bt.vue'

defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

let optButtons: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = defaultOptButtons(['edit', 'delete'])



const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/Alarm/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },

        { label: t('sn_idcard'), prop: 'sn', align: 'center',render:'tag'},
        { label: t('device_person_name'), prop: 'name',  align: 'center' },
        { label: t('alarm_object'), prop: 'alarm_object', render:'tag',custom: { 'person': 'primary', 'device': 'success' }, replaceValue: { 'bracelet': t('alarm_bracelet'), 'beacon': t('alarm_beacon'),'locator':t('alarm_locator'),'gateway':t('alarm_gateway') }},
        { label: t('Alarm_Type'), prop: 'alarm_type', render:'tag',custom:  { 'sos_key': 'danger', 'sos_run': 'danger', 'sos_bt': t('sos_bt') , 'sos_offline': 'info', 'sos_online': 'success', 'fence_on_sos': 'warning', 'fence_out_sos': 'warning' }, replaceValue: { 'sos_key': t('sos_key'), 'sos_run': t('sos_run'), 'sos_bt': t('sos_bt') , 'sos_offline': t('sos_offline'), 'sos_online': t('sos_online'), 'fence_on_sos': t('fence_on_sos'), 'fence_out_sos': t('fence_out_sos') }},
        { label: t('last time'),render:'datetime', prop: 'last_time', align: 'center' },
        { label: t('create_time'),render:'datetime', prop: 'create_time', align: 'center' },
        {
            label: t('Operate'),
            align: 'center',
            width: '80',
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

provide('baTable', baTable)
let timer;
onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()
    console.log("sss="+baTable.table.ref)
    console.log(baTable.table.ref)


    timer=setInterval(function(){
        baTable.getIndex()
    },5000)
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
