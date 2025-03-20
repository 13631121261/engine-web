
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('taglog.list.b_address')+'/'+t('taglog.list.g_address')+'/'+t('taglog.list.g_name') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
        <!-- 表单 -->

    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import baTableClass from '/src/utils/baTable'
import { baTableApi } from '/src/api/common'
import Table from '/src/components/table/index.vue'
import TableHeader from '/src/components/table/header/index.vue'

import { defaultOptButtons } from '/src/components/table'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { cloneDeep } from 'lodash-es'
import { getArrayKey } from '/src/utils/common'
import { useAdminInfo } from '/src/stores/adminInfo'

import { markRaw } from 'vue'
import bt from './bt1.vue'
defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()

const adminInfo = useAdminInfo()

const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/Taglog/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('taglog_1.list.b_address'), prop: 'beacon_address', width: '150',align: 'center' },
        {
            label: t('taglog_1.list.g_address'),
            prop: 'gateway_address',
            align: 'center',
            render: 'tag',


        },
        {
            label: t('taglog_1.list.g_name'),
            prop: 'gateway_name',
            align: 'center',
            render: 'tag',


        },
        {
            label: t('taglog_1.list.rssi'),
            prop: 'rssi',
            align: 'center',
            render: 'tag',


        },
        {  label: t('taglog_1.list.bt'),render: 'customRender', customRender: markRaw(bt),width: '90',align: 'center',},


        /*{
            label: t('taglog_1.list.keys'),
            prop: 'keys1',
            align: 'center',
            render: 'tag',
            custom: { '-1': 'info', '1': 'danger' ,'0':'success'},
            replaceValue: { '-1':  '/', '1': t('taglog_1.list.keys1'), '0': t('taglog_1.list.keys2') },
        },
        {
            label: t('taglog_1.list.run'),
            prop: 'run',
            align: 'center',
            render: 'tag',
            custom: { '0': 'danger', '1': 'success' },
            replaceValue: { '-1':  '/', '1': t('taglog_1.list.onrun'), '0': t('taglog_1.list.unrun') },
        },*/

        { label: t('Create time'), prop: 'create_time', align: 'center', width: '160', render: 'datetime' },

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
