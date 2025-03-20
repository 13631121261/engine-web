
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

            :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('person.bind.name') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
        <!-- 表单 -->
        <PopupForm ref="formRef" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide, onUnmounted } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index_person.vue'
import PopupForm from './popupForm.vue'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash-es'
import { getArrayKey } from '/@/utils/common'
import { useAdminInfo } from '/@/stores/adminInfo'

import { markRaw } from 'vue'
import { ElNotification } from 'element-plus'
import { unbindPerson } from '/@/api/backend'
defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

let addButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'bind',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'success',
        // 按钮 icon
        icon: 'fa fa-link',
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
        title:'unbind',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'success',
        // 按钮 icon
        icon: 'fa fa-unlink',
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
addButton = addButton.concat(outButton)

addButton[0].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
    baTable.toggleForm('Edit',[row.id])
    baTable.form.items=row
}
addButton[1].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮' + row)
    baTable.toggleForm('unbind', row.id)
    baTable.form.items = row
    unbind(row.idcard);
}
const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/Person/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('person.bind.name'), prop: 'name', width: '150',align: 'center' },
        {
            label: t('State'),
            prop: 'online',
            align: 'center',
            render: 'tag',
            custom: { '0': 'info', '1': 'success' },
            replaceValue: { '0': t('person.bind.unline'), '1': t('person.bind.online') },
        },
        {
            label: t('person.bind.isbind'),
            prop: 'isbind',
            align: 'center',
            render: 'tag',
            custom: { '0': 'danger', '1': 'success' },
            replaceValue: { '0': t('person.bind.unbind'), '1': t('person.bind.bind') },
        },
        { label: t('person.bind.bind_mac'), prop: 'bind_mac', align: 'center', width: '160'},
        { label: t('person.bind.b_area_name'), prop: 'b_area_name', align: 'center',    render: 'tag'},
        { label: t('person.bind.gateway_mac'), prop: 'gateway_mac', align: 'center',    render: 'tag'},
        { label: t('person.bind.gateway_name'), prop: 'gateway_name', align: 'center',    render: 'tag'},
        { label: t('person.bind.map_name'), prop: 'map_name', align: 'center',    render: 'tag'},
        {  label: t('fence_name'), prop: 'fence_name' ,width: '150',align: 'center',  render: 'tag'},
        { label: t('person.bind.phone'), prop: 'phone', align: 'center', width: '160'},
        { label: t('person.bind.last_time'), prop: 'lasttime', align: 'center', width: '160', render: 'datetime'},

        {
            label: t('Operate'),
            align: 'center',
            width: '130',
            render: 'buttons',
            buttons: addButton
        },
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
function unbind(idcard:string) {
    unbindPerson(idcard).then((res)=>{
        if(res.code==1){
            baTable.getIndex()
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
