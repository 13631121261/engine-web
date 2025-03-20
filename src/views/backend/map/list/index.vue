
<template>
    <div class="default-main ba-table-box">

        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('map.list.map_name') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
`       <PopupForm/>
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
import {unBindTag,reback} from '/@/api/backend/index.ts'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'

import { useAdminInfo } from '/@/stores/adminInfo'
import MapDrawer from './MapDrawer.vue'
import height from './height.vue'
import width from './width.vue'
import { markRaw } from 'vue'
import { ElNotification } from 'element-plus'
import PopupForm from '/@/views/backend/map/list/popupForm.vue'
import barn_type from '/@/views/backend/device/list/barn_type.vue'

defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

let optButtons: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = defaultOptButtons(['edit', 'delete'])

let newButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'map.list.look',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'info',
        // 按钮 icon
        icon: 'fa fa-search-plus',
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
        attr: {}
    },
]
optButtons=newButton.concat(optButtons)
optButtons[0].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
  //  baTable.toggleForm('Info',row.id)
   // baTable.form.items=row
    svgData=row.data
    show.value=true

  //  loadSVGData(row.data)
}
function getChange(data:String){
    show.value=false
    svgData=''
}
const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/map/'), {
    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('map.list.map_name'), prop: 'name',  align: 'center' },
        { label: t('map.list.create_time'),render:'datetime', prop: 'create_time', align: 'center' },
        { label: t('map.list.sum'),prop: 'sum', align: 'center',render:'tag' },
        { label: t('map.list.map_id'),prop: 'map_id', align: 'center',render:'tag' },
        { label: t('map.list.height'), align: 'center' ,render: 'customRender', customRender: markRaw(height)},
        { label: t('map.list.width'),  align: 'center' ,render: 'customRender', customRender: markRaw(width)},
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
