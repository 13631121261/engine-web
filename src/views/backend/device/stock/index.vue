
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('device_code_name')+'/'+t('code_sn1')+'/'+'/'+t('code')+'/'+t('model')+'/'+t('supplier_name') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
        <!-- 表单 -->



    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'

import { useAdminInfo } from '/@/stores/adminInfo'
import price from './price.vue'
import unit from './unit.vue'
import stock from './stock.vue'

import count_monery from './count_monery.vue'
import { markRaw } from 'vue'

defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()
/*
let optButtons: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = defaultOptButtons(['edit', 'delete'])

let addButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'addBran',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'success',
        // 按钮 icon
        icon: 'fa fa-arrow-down',
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


let outButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'outBran',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'success',
        // 按钮 icon
        icon: 'fa fa-arrow-up',
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
        attr: {"color":"#626aef"}
    },
]
// 新按钮合入到默认的按钮数组
optButtons = addButton.concat(outButton).concat(optButtons)

optButtons[0].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
    baTable.toggleForm('Info',row.id)
    baTable.form.items=row
}
optButtons[1].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
    baTable.toggleForm('OutPut',row.id)
    baTable.form.items=row
}*/
const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/DeviceCode/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('code_sn1'), prop: 'code_sn', align: 'center' ,render:"tag"  ,width:150,fixed:"left"},

        { label: t('device_code_name'), prop: 'name', align: 'center',width:155 },
        { label: t('model'), prop: 'model', align: 'center',width:180 },
        { label: t('brand'), prop: 'brand', align: 'center' ,render:"tag",width:150},
        { label: t('device_type_describe'), prop: 'describes',  align: 'center',width:300 },
        { label: t('stock'), prop: 'sum', align: 'center',width:120 ,render: 'customRender', customRender: markRaw(stock)},
        { label: t('create_time'),render:'datetime', prop: 'create_time', align: 'center' ,width:155 },
        { label: t('update_time'),render:'datetime', prop: 'update_time', align: 'center',width:155  },

    ],
}, {
    defaultItems: {
        status: '1',
    },
} )

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()
    console.log("sss="+baTable.table.ref)
    console.log(baTable.table.ref)
})
</script>

<style scoped lang="scss">
.table-wrapper {
    height: calc(100% - 60px);
}</style>
