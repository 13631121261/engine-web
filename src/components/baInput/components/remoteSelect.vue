<template>
    <div class="w100">
        <!-- el-select 的远程下拉只在有搜索词时，才会加载数据（显示出 option 列表） -->
        <!-- 使用 el-popover 在无数据/无搜索词时，显示一个无数据的提醒 -->
        <el-popover
            width="100%"
            placement="bottom"
            popper-class="remote-select-popper"
            :visible="state.focusStatus && !state.loading && !state.keyword && !state.options.length"
            :teleported="false"
            :content="$t('utils.No data')"
        >
            <template #reference>
                <el-select
                    ref="selectRef"
                    class="w100"
                    @focus="onFocus"
                    @blur="onBlur"
                    :loading="state.loading || state.accidentBlur"
                    :filterable="true"
                    :remote="true"
                    clearable
                    remote-show-suffix
                    :remote-method="onLogKeyword"
                    v-model="state.value"
                    @change="onChangeSelect"
                    :multiple="multiple"
                    :key="state.selectKey"
                    @clear="onClear"
                    @visible-change="onVisibleChange"
                    v-bind="$attrs"
                >
                    <el-option
                        class="remote-select-option"
                        v-for="item in state.options"
                        :label="item[field]"
                        :value="item[state.primaryKey].toString()"
                        :key="item[state.primaryKey]"
                    >
                        <el-tooltip placement="right" effect="light" v-if="!isEmpty(tooltipParams)">
                            <template #content>
                                <p v-for="(tooltipParam, key) in tooltipParams" :key="key">{{ key }}: {{ item[tooltipParam] }}</p>
                            </template>
                            <div>{{ item[field] }}</div>
                        </el-tooltip>
                    </el-option>
                    <el-pagination
                        v-if="state.total"
                        :currentPage="state.currentPage"
                        :page-size="state.pageSize"
                        class="select-pagination"
                        layout="->, prev, next"
                        :total="state.total"
                        @current-change="onSelectCurrentPageChange"
                    />
                </el-select>
            </template>
        </el-popover>
    </div>
</template>

<script setup lang="ts">
import { reactive, watch, onMounted, onUnmounted, ref, nextTick, getCurrentInstance, toRaw } from 'vue'
import { getSelectData } from '/@/api/common'
import { uuid } from '/@/utils/random'
import type { ElSelect } from 'element-plus'
import { isEmpty } from 'lodash-es'
import { getArrayKey } from '/@/utils/common'

const selectRef = ref<InstanceType<typeof ElSelect> | undefined>()
type ElSelectProps = Partial<InstanceType<typeof ElSelect>['$props']>
type valType = string | number | string[] | number[]

interface Props extends /* @vue-ignore */ ElSelectProps {
    pk?: string
    field?: string
    params?: anyObj
    multiple?: boolean
    remoteUrl: string
    modelValue: valType
    labelFormatter?: (optionData: anyObj, optionKey: string) => string
    tooltipParams?: anyObj
}
const props = withDefaults(defineProps<Props>(), {
    pk: 'id',
    field: 'name',
    params: () => {
        return {}
    },
    remoteUrl: '',
    modelValue: '',
    multiple: false,
    tooltipParams: () => {
        return {}
    },
})

const state: {
    // 主表字段名(不带表别名)
    primaryKey: string
    options: anyObj[]
    loading: boolean
    total: number
    currentPage: number
    pageSize: number
    params: anyObj
    keyword: string
    value: valType
    selectKey: string
    initializeData: boolean
    accidentBlur: boolean
    focusStatus: boolean
} = reactive({
    primaryKey: props.pk,
    options: [],
    loading: false,
    total: 0,
    currentPage: 1,
    pageSize: 10,
    params: props.params,
    keyword: '',
    value: props.modelValue ? props.modelValue : '',
    selectKey: uuid(),
    initializeData: false,
    accidentBlur: false,
    focusStatus: false,
})

let io: null | IntersectionObserver = null
const instance = getCurrentInstance()

const emits = defineEmits<{
    (e: 'update:modelValue', value: valType): void
    (e: 'row', value: any): void
}>()

const onChangeSelect = (val: valType) => {
   // console.log("函数"+val)
    emits('update:modelValue', val)
    if (typeof instance?.vnode.props?.onRow == 'function') {

        if (typeof val == 'number' || typeof val == 'string') {
            const dataKey = getArrayKey(state.options, props.pk, val.toString())
            emits('row', dataKey ? toRaw(state.options[dataKey]) : {})
        } else {
            const valueArr = []
            for (const key in val) {
                let dataKey = getArrayKey(state.options, props.pk, val[key].toString())
                if (dataKey) valueArr.push(toRaw(state.options[dataKey]))
            }
            emits('row', valueArr)
        }
    }
}

const onVisibleChange = (val: boolean) => {
    // 保持面板状态和焦点状态一致
    if (!val) {
        nextTick(() => {
            selectRef.value?.blur()
        })
    }
}

const onFocus = () => {
    state.focusStatus = true
    if (selectRef.value?.query != state.keyword) {
        state.keyword = ''
        state.initializeData = false
        // el-select 自动清理搜索词会产生意外的脱焦
        state.accidentBlur = true
    }
    if (!state.initializeData) {
        getData()
    }
}

const onBlur = () => {
    state.focusStatus = false
}

const onClear = () => {
    state.keyword = ''
    state.initializeData = false
}

const onLogKeyword = (q: string) => {
    state.keyword = q
    getData()
}

const getData = (initValue: valType = '') => {
    state.loading = true
    state.params.page = state.currentPage
    state.params.initKey = props.pk
    state.params.initValue = initValue
    getSelectData(props.remoteUrl, state.keyword, state.params)
        .then((res) => {
            let initializeData = true
            let opts = res.data
            if (typeof props.labelFormatter == 'function') {
                for (const key in opts) {
                    opts[key][props.field] = props.labelFormatter(opts[key], key)
                }
            }
            state.options = opts
            state.total = res.data.total ?? 0
            if (initValue) {
                // 重新渲染组件,确保在赋值前,opts已加载到-兼容 modelValue 更新
                state.selectKey = uuid()
                initializeData = false
            }
            state.loading = false
            state.initializeData = initializeData
            if (state.accidentBlur) {
                nextTick(() => {
                    const inputEl = selectRef.value?.$el.querySelector('.el-select__tags .el-select__input')
                    inputEl && inputEl.focus()
                    state.accidentBlur = false
                })
            }
        })
        .catch(() => {
            state.loading = false
        })
}

const onSelectCurrentPageChange = (val: number) => {
    state.currentPage = val
    getData()
}

const initDefaultValue = () => {
    if (state.value) {
        // number[]转string[]确保默认值能够选中
        if (typeof state.value === 'object') {
            for (const key in state.value as string[]) {
                state.value[key] = state.value[key].toString()
            }
        } else if (typeof state.value === 'number') {
            state.value = state.value.toString()
        }
        getData(state.value)
    }
}

onMounted(() => {
    if (props.pk.indexOf('.') > 0) {
        let pk = props.pk.split('.')
        state.primaryKey = pk[1] ? pk[1] : pk[0]
    }
    initDefaultValue()

    setTimeout(() => {
        if (window?.IntersectionObserver) {
            io = new IntersectionObserver((entries) => {
                for (const key in entries) {
                    if (!entries[key].isIntersecting) selectRef.value?.blur()
                }
            })
            if (selectRef.value?.$el instanceof Element) {
                io.observe(selectRef.value.$el)
            }
        }
    }, 500)
})

onUnmounted(() => {
    io?.disconnect()
})

watch(
    () => props.modelValue,
    (newVal) => {
        if (String(state.value) != String(newVal)) {
            state.value = newVal ? newVal : ''
            initDefaultValue()
        }
    }
)

const getSelectRef = () => {
    return selectRef.value
}

const focus = () => {
    selectRef.value?.focus()
}

const blur = () => {
    selectRef.value?.blur()
}

defineExpose({
    blur,
    focus,
    getSelectRef,
})
</script>

<style scoped lang="scss">
:deep(.remote-select-popper) {
    text-align: center;
}
.remote-select-option {
    white-space: pre;
}
</style>
