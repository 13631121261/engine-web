
<template>
    <div class="default-main ba-table-box">

        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('area_name') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
`       <PopupForm @get-change='getChange' />
        <MapDrawer v-model:show="show" :svgData="svgData" @get-change='getChange' />
<!--        <el-drawer
            v-model="show_map"
            :title="t('map.list.look')"
            direction="rtl"
            :open-delay='10000'
            size="30%"
        >
            <div id="main" class="hdmrboxtm-mbox"  viewBox="0 0 0 0">
    dfdf
            </div>
        </el-drawer>-->
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

import height from './height.vue'
import width from './width.vue'
import { markRaw } from 'vue'
import { ElNotification } from 'element-plus'
import PopupForm from './popupForm.vue'
import MapDrawer from './SGDrawer.vue'

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
const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/area/'), {
    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('area_name'), prop: 'name',  align: 'center' },

        { label: t('gateway_sum'),prop: 'g_count', align: 'center',render:'tag' },
        { label: t('file'), align: 'center' ,prop: 'map_name',render: 'tag'},
        { label: t('Create time'),render:'datetime', prop: 'createtime', align: 'center' },
        { label: t('update_time'),render:'datetime', prop: 'updatetime', align: 'center' },
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
