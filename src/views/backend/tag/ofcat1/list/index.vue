
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay','import','export']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('ofcat1.list.mac') })"

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
import { cloneDeep } from 'lodash-es'
import { getArrayKey } from '/@/utils/common'
import { useAdminInfo } from '/@/stores/adminInfo'
import { markRaw } from 'vue'
import bt from './bt.vue'
defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/fwordcard/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('ofcat1.list.mac'), prop: 'mac', width: '150',align: 'center' },
        {
            label: t('ofcat1.list.state'),
            prop: 'online',
            align: 'center',
            render: 'tag',
            custom: { '0': 'warning', '1': 'success' },
            width: '160',
            replaceValue: { '0': t('unline'), '1': t('online') },
        },

        { label: t('ofcat1.list.sos'), prop: 'sos', align: 'center', width: '160',   render: 'tag',
            custom: { '1': 'warning', '0': 'success' },
            replaceValue: { '1': t('SOS1'), '0': t('unSOS'),'2': t('close_sos') },},
        {  label: t('ofcat1.list.bt'),render: 'customRender', customRender: markRaw(bt),width: '90',align: 'center',},


        { label: t('last time'), prop: 'last_time', align: 'center', width: '160', render: 'datetime' },
        { label: t('Create time'), prop: 'create_time', align: 'center', width: '160', render: 'datetime' },

        {
            label: t('Operate'),
            align: 'center',
            width: '130',
            render: 'buttons',
            buttons: defaultOptButtons(['edit', 'delete']),
        },
    ],
}, {

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
