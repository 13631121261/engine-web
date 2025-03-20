<template>
    <div class="default-main ba-table-box">

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('auth.adminLog.title') +'/'+t('auth.adminLog.nickname') })"
        />
        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->

        <Table :pagination='true'/>
        <Info />
    </div>
</template>

<script setup lang="ts">
import { concat, cloneDeep } from 'lodash-es'
import { onMounted, onUnmounted, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import { defaultOptButtons } from '/@/components/table'
import { baTableApi } from '/@/api/common'
import { useI18n } from 'vue-i18n'
import Info from './info.vue'
import { buildJsonToElTreeData } from '/@/utils/common'

defineOptions({
    name: 'auth/adminLog',
})

const { t } = useI18n()

let optButtons: OptButton[] = [
    {
        render: 'tipButton',
        name: 'info',
        title: 'Info',
        text: '',
        type: 'primary',
        icon: 'fa fa-search-plus',
        class: 'table-row-edit',
        disabledTip: false,
        click: (row: TableRow) => {
            infoButtonClick(row)
        },
    },
]

optButtons = concat(optButtons, defaultOptButtons(['delete']))

const baTable = new baTableClass(new baTableApi('/userApi/Logs/'), {
    column: [
        { type: 'selection', align: 'center', operator: false },

        {
            label: t('auth.adminLog.username'),
            prop: 'username',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
            width: 160,
        },
        {
            label: t('auth.adminLog.nickname'),
            prop: 'nickname',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
            width: 160,
        },
        {
            label: t('auth.adminLog.title'),
            prop: 'operation',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
        },
        {
            show: false,
            label: t('auth.adminLog.data'),
            prop: 'data',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
            showOverflowTooltip: true,
        },
        {
            label: t('auth.adminLog.url'),
            prop: 'url',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
            showOverflowTooltip: true,
        },
        {
            label: t('auth.adminLog.ip'),
            prop: 'ip',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
            render: 'tag',
        },
        {
            label: t('auth.adminLog.useragent'),
            prop: 'agent',
            align: 'center',
            operator: 'LIKE',
            operatorPlaceholder: t('Fuzzy query'),
            showOverflowTooltip: true,
        },
        {
            label: t('Create time'),
            prop: 'create_time',
            align: 'center',
            render: 'datetime',
            sortable: 'custom',
            operator: 'RANGE',
            width: 160,
        },
        {
            label: t('Operate'),
            align: 'center',
            width: '100',
            render: 'buttons',
            buttons: optButtons,
            operator: false,
        },
    ],
    dblClickNotEditColumn: [undefined],
}, {}, {
    onTableDblclick: ({ row }) => {
        infoButtonClick(row)
        return false
    },
})

baTable.mount()
baTable.getIndex()



provide('baTable', baTable)

/** 点击查看详情按钮响应 */
const infoButtonClick = (row: TableRow) => {
    if (!row) return
    // 数据来自表格数据,未重新请求api,深克隆,不然可能会影响表格
    let rowClone = cloneDeep(row)
    rowClone.data = rowClone.data ? [{ label: '点击展开', children: buildJsonToElTreeData(JSON.parse(rowClone.data)) }] : []
    baTable.form.extend!['info'] = rowClone
    baTable.form.operate = 'Info'
}
</script>

<style scoped lang="scss"></style>
