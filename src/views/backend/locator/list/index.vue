<template>
    <div class="default-main ba-table-box" style='height: 13px;'>

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('locator.list.address')+'/'+t('locator.list.name') })"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->

        <Table>


        </Table>

        <!-- 表单 -->
        <PopupForm />
        <info />
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import info from './info.vue'
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


optButtons[0].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
    baTable.toggleForm('Info',row.id)
    baTable.form.items=row
}
const baTable = new baTableClass(
    new baTableApi('/userApi/Locator/'),
    {
        expandAll: false,
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('locator.list.name'), prop: 'name',align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query'), width: 201,fixed:'left'},
        {
                width:150,
                label: t('inlineSta'),
                prop: 'online',
                align: 'center',
                render: 'tag',
                custom: { '0': 'warning', '1': 'success' },
                replaceValue: { '0': t('unline'), '1': t('online') },
            },
          { label: t('locator.list.address'), prop: 'address', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') , width: 120},
            { label: t('locator.list.version'), prop: 'version', align: 'center', render: 'tags' , width: 100},
            { label: t('locator.list.ip'), prop: 'ip', align: 'center', render: 'tags' , width: 160},
            { label: t('locator.list.map_name'), prop: 'map_name', align: 'center', width: 200 },
            { label: t('locator.list.x'), prop: 'x', align: 'center' ,width: '80' },
            { label: t('locator.list.y'), prop: 'y', align: 'center', width: '80' },
            { label: t('locator.list.z'), prop: 'z', align: 'center', width: '80' },
            { label: t('update_time'), prop: 'last_time', align: 'center',render:'datetime', width: '180' },
            { label: t('locator.list.create_time'), prop: 'create_time', align: 'center',render:'datetime', width: '180' },






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


provide('baTable', baTable)

baTable.mount()
baTable.getIndex()



</script>

<style scoped lang="scss"></style>
<style lang="scss" scoped>

</style>
