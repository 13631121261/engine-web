<!--
<template>
    <div class="default-main ba-table-box">
        <el-alert class="ba-table-alert" v-if="baTable.table.remark" :title="baTable.table.remark" type="info" show-icon />

        &lt;!&ndash; 表格顶部菜单 &ndash;&gt;
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'comSearch', 'quickSearch', 'columnDisplay']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('gateway.list.address') })"
        />

        &lt;!&ndash; 表格 &ndash;&gt;
        &lt;!&ndash; 要使用`el-table`组件原有的属性，直接加在Table标签上即可 &ndash;&gt;
        <Table :pagination="true"/>

        &lt;!&ndash; 表单 &ndash;&gt;
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

const baTable = new baTableClass(
    new baTableApi('/userApi/Roles/'),
    {
        column: [
            { type: 'selection', align: 'center', operator: false },
            { label: t('auth.group.Role Name'), prop: 'name', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query'), width: 100 },
            { label: t('gateway.list.project_name'), prop: 'project_name', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') },
            { label: t('gateway.list.address'), prop: 'address', align: 'center', operator: 'LIKE', operatorPlaceholder: t('Fuzzy query') },

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
-->


<template>
    <div class="default-main ba-table-box">

        <!-- 表格顶部菜单 -->
        <TableHeader
            :buttons="['refresh', 'add', 'edit', 'delete', 'columnDisplay']"
        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef" />

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

defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/Roles/'), {

    dblClickNotEditColumn: [undefined],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('auth.group.Group name'), prop: 'name', align: 'left', width: '200' },
        { label: t('auth.group.jurisdiction'), prop: 'details', align: 'left'  , width: 300},
        {
            label: t('State'),
            prop: 'status',
            align: 'center',
            render: 'tag',
            custom: { '0': 'danger', '1': 'success' },
            replaceValue: { '0': t('Disable'), '1': t('Enable') },  width: 120,
        },
        { label: t('Update time'), prop: 'update_time', align: 'center', width: '160', render: 'datetime' },
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
    defaultItems: {
        status: '1',
    },
}, {
    // 提交前
    onSubmit: ({ formEl, operate, items }) => {
        var items = cloneDeep(items)

        items.rules = formRef.value.getCheckeds()

        for (const key in items) {
            if (items[key] === null) {
                delete items[key]
            }
        }

        operate = operate.replace(operate[0], operate[0].toLowerCase())

        // 表单验证通过后执行的api请求操作
        let submitCallback = () => {
            baTable.form.submitLoading = true
            baTable.api
                .postData(operate, items)
                .then((res) => {
                    baTable.onTableHeaderAction('refresh', {})
                    baTable.form.submitLoading = false
                    baTable.form.operateIds?.shift()
                    if (baTable.form.operateIds!.length > 0) {
                        baTable.toggleForm('Edit', baTable.form.operateIds)
                    } else {
                        baTable.toggleForm()
                    }
                    baTable.runAfter('onSubmit', { res })
                })
                .catch(() => {
                    baTable.form.submitLoading = false
                })
        }

        if (formEl) {
            baTable.form.ref = formEl
            formEl.validate((valid) => {
                if (valid) {
                    submitCallback()
                }
            })
        } else {
            submitCallback()
        }
        return false
    },
    // 双击编辑前
    onTableDblclick: ({ row }) => {
        return baTable.table.extend!['adminGroup'].indexOf(row.id) === -1
    },
}, {
    getIndex: ({ res }) => {
        baTable.table.extend!['adminGroup'] = res.data.group
        let buttonsKey = getArrayKey(baTable.table.column, 'render', 'buttons')
        /*baTable.table.column[buttonsKey].buttons!.forEach((value: OptButton) => {
            value.display = (row) => {
                return res.data.group.indexOf(row.id) === -1
            }
        })*/
    },
})

provide('baTable', baTable)

onMounted(() => {
    baTable.table.ref = tableRef.value
    baTable.mount()
    baTable.getIndex()
    console.log("sss="+baTable.table.ref)
    console.log(baTable.table.ref)
})
</script>

<style scoped lang="scss"></style>
