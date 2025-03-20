
<template>
    <div class="default-main ba-table-box">
        <!--            :buttons="['refresh', 'add', 'edit', 'delete', 'import', 'export', 'quickSearch', 'columnDisplay']"-->
        <!-- 表格顶部菜单 -->
        <TableHeader

            :buttons="['refresh', 'add', 'edit', 'delete', 'quickSearch', 'columnDisplay','import','export']"
            :quick-search-placeholder="t('Quick search placeholder', { fields: t('device_code_name')+'/'+t('Consuming_who') })"

        />

        <!-- 表格 -->
        <!-- 要使用`el-table`组件原有的属性，直接加在Table标签上即可 -->
        <Table ref="tableRef"></Table>
        <PopupForm ref="formRef" />
`       <bind_pop/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, provide } from 'vue'
import baTableClass from '/@/utils/baTable'
import { baTableApi } from '/@/api/common'
import Table from '/@/components/table/index.vue'
import TableHeader from '/@/components/table/header/index.vue'
import {unBindTag,reback} from '/@/api/backend/index.ts'
import { defaultOptButtons } from '/@/components/table/index'
import { useI18n } from 'vue-i18n'
import { cloneDeep } from 'lodash-es'
import PopupForm from './popupForm.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

import barn_type from './barn_type.vue'
import bind_pop from './bind_pop.vue'
import bind_mac from './bind_mac.vue'
import { markRaw } from 'vue'
import { ElNotification } from 'element-plus'

defineOptions({
    name: 'auth/group',
})

const formRef = ref()
const tableRef = ref()
const { t } = useI18n()
const adminInfo = useAdminInfo()

let optButtons: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = defaultOptButtons(['edit', 'delete'])

let addButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'bind',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'success',
        // 按钮 icon
        icon: 'fa fa-link',
        class: 'table-row-info',
        // tipButton 禁用 tip
        disabledTip: false,
        // 自定义点击事件
        click: (row: TableRow, field: TableColumn) => {},
        // 按钮是否显示，请返回布尔值
        display: (row: TableRow, field: TableColumn) => {
            return true
        },
        // 按钮是否禁用，请返回布尔值
        disabled: (row: TableRow, field: TableColumn) => {
            return false
        },
        // 自定义el-button属性
        attr: {}
    },
]




let rebackButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'return',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'success',
        // 按钮 icon
        icon: 'fa fa-arrow-left',
        class: 'table-row-info',
        // tipButton 禁用 tip
        disabledTip: false,
        // 自定义点击事件
        click: (row: TableRow, field: TableColumn) => {},
        // 按钮是否显示，请返回布尔值
        display: (row: TableRow, field: TableColumn) => {
            return true
        },
        // 按钮是否禁用，请返回布尔值
        disabled: (row: TableRow, field: TableColumn) => {
            return false
        },
        // 自定义el-button属性
        attr: {"color":"#026faa"}
    },
]

let outButton: { display: (row: TableRow, field: TableColumn) => boolean; name: string; icon: string; disabled: (row: TableRow, field: TableColumn) => boolean; title: string; type: string; attr: {}; render: string; class: string; click: (row: TableRow, field: TableColumn) => void; disabledTip: boolean }[] = [
    {
        // 渲染方式:tipButton=带tip的按钮,confirmButton=带确认框的按钮,moveButton=移动按钮
        render: 'tipButton',
        // 按钮名称
        name: 'info',
        // 鼠标放置时的 title 提示
        title:'unbind',
        // 直接在按钮内显示的文字，title 有值时可为空

        // 按钮类型，请参考 element plus 的按钮类型
        type: 'success',
        // 按钮 icon
        icon: 'fa fa-unlink',
        class: 'table-row-info',
        // tipButton 禁用 tip
        disabledTip: false,
        // 自定义点击事件
        click: (row: TableRow, field: TableColumn) => {},
        // 按钮是否显示，请返回布尔值
        display: (row: TableRow, field: TableColumn) => {
            return true
        },
        // 按钮是否禁用，请返回布尔值
        disabled: (row: TableRow, field: TableColumn) => {
            return false
        },
        // 自定义el-button属性
        attr: {"color":"#626aef"}
    },
]
// 新按钮合入到默认的按钮数组
optButtons = addButton.concat(outButton).concat(rebackButton).concat(optButtons)

optButtons[0].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
    baTable.toggleForm('bind',row.id)
    baTable.form.items=row

}
optButtons[1].click = (row: TableRow, field: TableColumn) => {
    console.log('点击了按钮'+row)
    baTable.toggleForm('unbind',row.id)
    baTable.form.items=row

   unbind(row.sn)
    row.person_name=''
    row.isbind=0
}
optButtons[2].click = (row: TableRow, field: TableColumn) => {
   // console.log('点击了按钮'+row)
   // baTable.toggleForm('return',row.id)

    if(row.person_name!=null&&row.person_name!=''&&row.bind_mac!=null&&row.bind_mac!=''){
        ElNotification({
            message: t('unbind_tip'),
            type: 'error',
        })
        return
    }else{
        rebacks(row.sn)
        baTable.getIndex()
    }
    //console.log("as")
}
const baTable: baTableClass = new baTableClass(new baTableApi('/userApi/Devicep/'), {

    dblClickNotEditColumn: ['all'],
    column: [
        { type: 'selection', align: 'center' },
        { label: t('code_sn1'), prop: 'sn', align: 'center',render:'tag'},

        { label: t('device_code_name'), prop: 'name',  align: 'center' },

        { label: t('select_area'), prop: 'area_name', align: 'center', render:'tag'},
        {  label: t('fence_name'), prop: 'fence_name' ,width: '150',align: 'center',  render: 'tag'},
        { label: t('Consuming_who'), prop: 'person_name', align: 'center' },

        { label: t('bind_tag'), prop: 'isbind', align: 'center' ,render: 'customRender', customRender: markRaw(bind_mac)},
        { label: t('create_time'),render:'datetime', prop: 'createtime', align: 'center' },
        {
            label: t('Operate'),
            align: 'center',
            width: '150',
            render: 'buttons',
            buttons: optButtons,
            fixed:'right'
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
function unbind(sn:string) {
    unBindTag(sn).then((res)=>{
        if(res.code==1){
            ElNotification({
                message: res.msg,
                type: 'success',
            })
        }
    })
}
function rebacks(sn:string) {
    reback(sn).then((res)=>{
        if(res.code==1){
            ElNotification({
                message: res.msg,
                type: 'success',
            })
        }
    })
}
</script>

<style scoped lang="scss">
.table-wrapper {
    height: calc(100% - 60px);
}</style>
