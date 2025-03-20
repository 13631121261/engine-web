
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('beacon.list.mac') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
        <!-- 表单 -->
      <PopupForm ref="formRef" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import PopupForm from './popupForm.vue'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { cloneDeep } from 'lodash-es'
import { getArrayKey } from '/@/utils/common'
import { useAdminInfo } from '/@/stores/adminInfo'
import bt from './bt.vue'
import beacon_type from './beacon_type.vue'
import { markRaw } from 'vue'
defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()

const adminInfo = useAdminInfo()

const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/beacon/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('beacon.list.mac'), prop: 'mac', width: '150',align: 'center' },
        {
            label: t('beacon.list.state'),
            prop: 'online',
            align: 'center',
            render: 'tag',
            custom: { '0': 'warning', '1': 'success' },
            replaceValue: { '0': t('unline'), '1': t('online') },
        },


        {
            label: t('beacon.list.sos'),
            prop: 'sos',
            align: 'center',
            render: 'tag',
            custom: { '-1': 'info', '1': 'danger' ,'0':'success'},
            replaceValue: { '-1': '/', '1': t('beacon.list.unmount'), '0': t('beacon.list.mount') },
        },
        {
            label: t('beacon.list.run'),
            prop: 'run',
            align: 'center',
            render: 'tag',
            custom: { '-1': 'info', '1': 'danger' ,'0':'success'},
            replaceValue: { '-1': '/', '1': t('beacon.list.onrun'), '0': t('beacon.list.unrun') },
        },
        {
            label: t('beacon.list.isbind'),
            prop: 'isbind',
            align: 'center',
            render: 'tag',
            custom: { '0': 'danger', '1': 'success' },
            replaceValue: { '0': t('beacon.list.unbind'), '1': t('beacon.list.bind') },
        },
        { label: t('beacon.list.device_sn'), prop: 'device_sn', align: 'center', width: '160'},
        { label: t('beacon.list.device_name'), prop: 'device_name', align: 'center', width: '100'},
        {  label: t('beacon.list.type'), prop: 'bt',render: 'customRender', customRender: markRaw(beacon_type),width: '100',align: 'center',},

        {  label: t('beacon.list.bt'), prop: 'bt',render: 'customRender', customRender: markRaw(bt),width: '60',align: 'center',},
        { label: t('Create time'), prop: 'createtime', align: 'center', width: '160', render: 'datetime' },
        {
            label: t('Operate'),
            align: 'center',
            width: '130',
            render: 'buttons',
            buttons: defaultOptButtons(['edit', 'delete']),
        },
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
