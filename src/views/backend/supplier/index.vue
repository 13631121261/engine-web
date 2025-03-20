
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

            :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('contacts')+'/'+t('companyName') })"

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
defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/supplier/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('id'), prop: 'id', width: '150',align: 'center' },
        { label: t('contacts'), prop: 'contacts', width: '150',align: 'center' },
        { label: t('companyName'), prop: 'name',  width: '300',align: 'center' },
        { label: t('company address'), prop: 'address', width: '400',align: 'center' },
        { label: t('Contact Number'), prop: 'phone', width: '150',align: 'center' },
        { label: t('Create time'), prop: 'create_time', align: 'center', width: '160', render: 'datetime' },
        { label: t('Update time'), prop: 'update_time', align: 'center', width: '160', render: 'datetime' },
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
