
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

          :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('device_code_name')+'/'+t('notes') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
        <!-- 表单 -->
     <outPut ref="formRef" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import outPut from './outPut.vue'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash-es'
import { getArrayKey } from '/@/utils/common'
import { useAdminInfo } from '/@/stores/adminInfo'

import price from './price.vue'
import unit from './unit.vue'
import stock from './stock.vue'
import barn_type from './barn_type.vue'
import { markRaw } from 'vue'
import beacon_type from '/@/views/backend/tag/beacon/list/beacon_type.vue'
defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/DeviceOutBarn/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('code_sn1'), prop: 'code_sn',  align: 'center' },

        { label: t('device_code_name'), prop: 'code_name',  align: 'center' },
        { label: t('model'), prop: 'model', align: 'center' },
        { label: t('brand'), prop: 'brand', align: 'center' ,render:"tag"},
        { label: t('notes'), prop: 'notes', align: 'center' },

        { label: t('out_sum'), prop: 'out_sum',width:180, align: 'center' ,render: 'customRender', customRender: markRaw(unit)},



        { label: t('out_type'), prop: 'barn_type', align: 'center' ,render: 'customRender', customRender: markRaw(barn_type)},
        { label: t('Consuming_who'), prop: 'person_name', align: 'center' },
        { label: t('who_in'),width:180, prop: 'customer_name', align: 'center' },
        { label: t('out_time'),render:'datetime', prop: 'create_time', align: 'center' },



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
