<template>
  <div>
      {{}}
      <span v-if='renderRow.time_type==1'>
            {{t('fence_time_type_24')}}
      </span>
      <span v-else>
            {{renderRow.start_times}} {{t('to')}} {{renderRow.stop_times}}
      </span>

  </div>

</template>

<script setup lang="ts">
import { TableColumnCtx } from 'element-plus'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
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
