<template>
    <div class="default-main ba-table-box" style='height: 13px;'>

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'update','quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('btag.list.address')+'/'+t('btag.list.name') })"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->

        <Table>


        </Table>

        <!-- 表单 -->
        <PopupForm />

        <update/>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'

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


const baTable = new baTableClass(
    new baTableApi('/userApi/Btag/'),
    {
        expandAll: false,
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('btag.list.name'), prop: 'name',align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query'), width: 101,fixed:'left'},

            { label: t('btag.list.Major'), prop: 'major', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') , width: 120},

            { label: t('btag.list.Minor'), prop: 'minor', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') , width: 120},

       {
                width:90,
                label: t('inlineSta'),
                prop: 'online',
                align: 'center',
                render: 'tag',
                custom: { '0': 'warning', '1': 'success' },
                replaceValue: { '0': t('unline'), '1': t('online') },
            },


            { label: t('btag.list.map_name'), prop: 'map_name', align: 'center', width: 100 },
            { label: t('btag.list.x'), prop: 'x', align: 'center' ,width: '80' },
            { label: t('btag.list.y'), prop: 'y', align: 'center', width: '80' },

            { label: t('create_time'), prop: 'create_time', align: 'center',render:'datetime', width: '180' },
            { label: t('update_time'), prop: 'last_time', align: 'center',render:'datetime', width: '180' },







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
