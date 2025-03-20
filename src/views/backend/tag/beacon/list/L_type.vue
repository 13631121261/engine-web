<template>
  <div v-if='renderRow.type==1'>
      <el-tag class="ml-2" type="success">KTBB818</el-tag>
  </div>

    <div v-if='renderRow.l_type==0'>   <el-tag type='info'>{{t('0wei')}}</el-tag></div>
    <div v-else-if='renderRow.l_type==1'>   <el-tag type='success'>{{t('1wei')}}</el-tag></div>
    <div v-else-if='renderRow.l_type==2'>   <el-tag type='success'>{{t('2wei')}}</el-tag></div>
    <div v-else>   <el-tag type='primary'>{{t('Nwei')}}</el-tag></div>
</template>

<script setup lang="ts">
import { TableColumnCtx } from 'element-plus'
import { useI18n } from 'vue-i18n'
// 自定义
const { t } = useI18n()
// BuildAdmin将自动为此组件传递五个Props
interface Props {
    renderValue: any // 单元格值
    renderRow: TableRow // 当前行数据
    renderField: TableColumn // 当前列数据
    renderColumn: TableColumnCtx<TableRow> // 当前列上下文数据
    renderIndex: number // 当前行号
}
const props = defineProps<Props>()
</script>

<style scoped lang="scss">
// 自定义
</style>
