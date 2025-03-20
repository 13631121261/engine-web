<template>
  <div >
     <span v-if="renderRow.area_id==renderRow.b_area_id||renderRow.is_area==0">
      <el-tag class="ml-2" type="success">{{renderRow.b_area_name}}</el-tag>
      </span>
      <span v-else>
      <el-tag class="ml-2"  type="error">{{renderRow.b_area_name}}</el-tag>
      </span>


  </div>

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

console.log(props.renderValue, props.renderRow, props.renderField, props.renderColumn, props.renderIndex)
</script>

<style scoped lang="scss">
// 自定义
</style>
