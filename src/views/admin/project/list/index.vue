<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('gateway.list.address') })"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table :pagination="true"/>

        <!-- 表单 -->
        <PopupForm />
    </div>
</template>

<script setup lang="ts">
import { provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import PopupForm from './popupForm.vue'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table/index'
import { baTableApi } from '/@/api/common'
import { useAdminInfo } from '/@/stores/adminInfo'
import { useI18n } from 'vue-i18n'

defineOptions({
    name: 'auth/admin',
})

const { t } = useI18n()
const adminInfo = useAdminInfo()

const optButtons = defaultOptButtons(['edit', 'delete'])
optButtons[1].display = (row) => {
    return row.id != adminInfo.id
}

const baTable = new baTableClass(new baTableApi('/userApi/gateway/'), {
    column: [
        { type: 'selection', align: 'center', operator: false },
        {
            label: t('gateway.list.name'),
            prop: 'name',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
            width: 100,
        },
        {
            label: t('gateway.list.project_name'),
            prop: 'project_name',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        },
        {
            label: t('gateway.list.address'),
            prop: 'address',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        },
        {
            label: t('gateway.list.wifi_address'),
            prop: 'wifi_address',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        },
        { label: t('gateway.list.ble_version'), prop: 'ble_version', align: 'center', render: 'tags' },
        { label: t('gateway.list.wifi_version'), prop: 'wifi_version', align: 'center', render: 'tags' },
        { label: t('gateway.list.x'), prop: 'x', align: 'center' },
        { label: t('gateway.list.y'), prop: 'y', align: 'center' },
        { label: t('gateway.list.create_time'), prop: 'create_time', align: 'center' },

        {
            label: t('Operate'),
            align: 'center',
            width: '100',
            render: 'buttons',
            buttons: optButtons,
            operator: false,
        },
    ],
    dblClickNotEditColumn: [undefined, 'status'],
}, {
    defaultItems: {
        status: '1',
    },
})

provide('baTable', baTable)

baTable.mount()
baTable.getIndex()
</script>

<style scoped lang="scss"></style>
