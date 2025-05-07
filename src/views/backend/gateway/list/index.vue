<template>
    <div class="default-main ba-table-box" style='height: 13px;'>

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'update','quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('gateway.list.address')+'/'+t('gateway.list.name') })"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->

        <Table>


        </Table>

        <!-- 表单 -->
        <PopupForm />
        <info />
        <update/>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import info from './info.vue'
import update from './update.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table/index'
import { baTableApi } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useI18n } from 'vue-i18n'
import { template } from 'lodash-es'
import { getArrayKey } from '/@/utils/common'

defineOptions({
    name: 'auth/admin',
})

const { t } = useI18n()
const adminInfo = useAdminInfo()

let optButtons: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = defaultOptButtons(['edit', 'delete'])
optButtons[1].display = (row) => {
    return row.id != adminInfo.id
}

let newButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'gateway.list.more',
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
// 新按钮合入到默认的按钮数组
optButtons = newButton.concat(optButtons)
optButtons[0].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
    baTable.toggleForm('Info',row.id)
    baTable.form.items=row
}
const baTable = new baTableClass(
    new baTableApi('/userApi/gateway/'),
    {
        expandAll: false,
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('gateway.list.name'), prop: 'name',align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query'), width: 101,fixed:'left'},
            {
                width:90,
                label: t('sync'),
                prop: 'isyn',
                align: 'center',
                render: 'switch',
                custom: { '0': 'danger', '1': 'success' },
                replaceValue: { '0': t('Disable'), '1': t('Enable') },
            },
            {
                width:90,
                label: t('sync_sta'),
                prop: 'syn',
                align: 'center',
                render: 'tag',
                custom: { '0': 'warning', '1': 'success' },
                replaceValue: { '0': t('Wait'), '1': t('Complete') },
            },  {
                width:90,
                label: t('inlineSta'),
                prop: 'online',
                align: 'center',
                render: 'tag',
                custom: { '0': 'warning', '1': 'success' },
                replaceValue: { '0': t('unline'), '1': t('online') },
            },
            { label: t('gateway.list.config_name'), prop: 'config_name', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') , width: 120},
            { label: t('gateway.list.address'), prop: 'address', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') , width: 120},
            { label: t('gateway.list.ble_version'), prop: 'ble_version', align: 'center', render: 'tags' , width: 100},


            { label: t('gateway.list.wan_mode'), prop: 'wan_mode', align: 'center', render: 'tags' , width: 120},
             { label: t('gateway.list.wan_ip'), prop: 'wan_ip', align: 'center', render: 'tags' , width: 120},
            { label: t('gateway.list.wifi_version'), prop: 'wifi_version', align: 'center', render: 'tags', width: 100},
            { label: t('gateway.list.map_name'), prop: 'map_name', align: 'center', width: 100 },
            { label: t('gateway.list.x'), prop: 'x', align: 'center' ,width: '80' },
            { label: t('gateway.list.y'), prop: 'y', align: 'center', width: '80' },
            { label: t('gateway.list.z'), prop: 'z', align: 'center', width: '80' },
            { label: t('update_time'), prop: 'lasttime', align: 'center',render:'datetime', width: '180' },
            { label: t('gateway.list.create_time'), prop: 'create_time', align: 'center',render:'datetime', width: '180' },






            {
                label: t('Operate'),
                align: 'center',
                width: '120',
                render: 'buttons',
                buttons: optButtons,
                operator: false,
                fixed:'right'
            },
        ],
        dblClickNotEditColumn: [undefined, 'status'],
    },
    {
        defaultItems: {
            status: '1',
        },
    }




)

let timer;
provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
onMounted(()=>{
    timer=setInterval(function(){
        baTable.getIndex()
    },3000)

})
onUnmounted(()=>{
    clearInterval(timer)
})


</script>

<style scoped lang="scss"></style>
<style lang="scss" scoped>

</style>
