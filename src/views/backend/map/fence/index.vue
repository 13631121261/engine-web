
<template>
    <div class="default-main ba-table-box">

        <!-- 表格顶部菜单 -->
        <TableHeader

            :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('fence_name') })"
        />

        <Table ref="tableRef"></Table>
        `       <PopupForm @get-change='getChange' />
        <MapDrawer v-model:show="show" :svgData="svgData" @get-change='getChange' />

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import {unBindTag,reback} from '/@/api/backend'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'

import { useAdminInfo } from '/@/stores/adminInfo'

import { markRaw } from 'vue'
import { ElNotification } from 'element-plus'
import PopupForm from './popupForm.vue'
import time from './time.vue'

defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

let optButtons: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = defaultOptButtons(['edit', 'delete'])


function getChange(data:String){
    show.value=false
    svgData=''
    baTable.toggleForm('',['0'])
}
const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/fence/'), {
    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('fence_name'), prop: 'name',  align: 'center' },

        { label: t('fence_area'),prop: 'area_name', align: 'center',render:'tag' },
        { label: t('fence_map'),prop: 'map_name', align: 'center',render:'tag' },

        {
            label: t('fence_type'),
            prop: 'fence_type',
            align: 'center',
            render: 'tag',
            custom: { 'ON': 'info', 'OUT':'success'},
            replaceValue: {'ON': t('fence_on'), 'OUT': t('fence_out')  },
        },
        {
            label: t('fence_status'),
            prop: 'open_status',
            align: 'center',
            render: 'tag',
            custom: { 'false': 'info', 'true':'success'},
            replaceValue: {'false': t('Disable'), 'true': t('Enable')  },
        },


        { label: t('fence_time_type'), prop: 'fence_time_type', render: 'customRender', customRender: markRaw(time),align: 'center' },

        {
            label: t('Operate'),
            align: 'center',
            width: '150',
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
let show=ref(false)
let svgData: string = ref('')

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()
    console.log("sss="+baTable.table.ref)
    console.log(baTable.table.ref)
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
