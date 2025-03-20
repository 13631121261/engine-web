<template>
  <div v-if='renderRow.type==1'>
      <el-tag class="ml-2" type="success">KTBB818</el-tag>
  </div>

    <div v-if='renderRow.type==2'>   <el-tag>KTBB818-K</el-tag></div>
    <div v-if='renderRow.type==3'>   <el-tag>KTBB818-A</el-tag></div>
    <div v-if='renderRow.type==4'>   <el-tag>AOA</el-tag></div>
</template>

<script setup lang="ts">
import { TableColumnCtx } from 'element-plus'
// 自定义

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
