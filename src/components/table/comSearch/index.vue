<template>
    <transition name="el-fade-in">
        <div class="table-com-search">
            <el-form @submit.prevent="" @keyup.enter="onComSearch" label-position="top" :model="baTable.comSearch.form">
                <el-row>
                    <template v-for="(item, idx) in baTable.table.column" :key="idx">
                        <template v-if="item.operator !== false">
                            <!-- 自定义渲染 component、slot -->
                            <el-col
                                v-if="item.comSearchRender == 'customRender' || item.comSearchRender == 'slot'"
                                v-bind="{
                                    xs: item.comSearchColAttr?.xs ? item.comSearchColAttr?.xs : 24,
                                    sm: item.comSearchColAttr?.sm ? item.comSearchColAttr?.sm : 6,
                                    ...item.comSearchColAttr,
                                }"
                            >
                                <!-- 外部可以使用 :deep() 选择器修改css样式 -->
                                <div class="com-search-col">
                                    <div class="com-search-col-label" v-if="item.comSearchShowLabel !== false">{{ item.label }}</div>
                                    <div class="com-search-col-input">
                                        <!-- 自定义组件/函数渲染 -->
                                        <component
                                            v-if="item.comSearchRender == 'customRender'"
                                            :is="item.comSearchCustomRender"
                                            :renderRow="item"
                                            :renderField="item.prop!"
                                            :renderValue="baTable.comSearch.form[item.prop!]"
                                        />

                                        <!-- 自定义渲染-slot -->
                                        <slot v-else-if="item.comSearchRender == 'slot'" :name="item.comSearchSlotName"></slot>
                                    </div>
                                </div>
                            </el-col>

                            <!-- 时间范围 -->
                            <el-col
                                v-else-if="item.render == 'datetime' && (item.operator == 'RANGE' || item.operator == 'NOT RANGE')"
                                :xs="24"
                                :sm="12"
                            >
                                <div class="com-search-col">
                                    <div class="com-search-col-label w16" v-if="item.comSearchShowLabel !== false">{{ item.label }}</div>
                                    <div class="com-search-col-input-range w83">
                                        <el-date-picker
                                            class="datetime-picker"
                                            v-model="baTable.comSearch.form[item.prop!]"
                                            :default-value="baTable.comSearch.form[item.prop! + '-default'] ? baTable.comSearch.form[item.prop! + '-default']:[new Date(), new Date()]"
                                            :type="item.comSearchRender == 'date' ? 'daterange' : 'datetimerange'"
                                            :range-separator="$t('To')"
                                            :start-placeholder="$t('el.datepicker.startDate')"
                                            :end-placeholder="$t('el.datepicker.endDate')"
                                            :value-format="item.comSearchRender == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
                                            :teleported="false"
                                        />
                                    </div>
                                </div>
                            </el-col>
                            <el-col v-else :xs="24" :sm="6">
                                <div class="com-search-col">
                                    <div class="com-search-col-label" v-if="item.comSearchShowLabel !== false">{{ item.label }}</div>
                                    <!-- 数字范围 -->
                                    <div v-if="item.operator == 'RANGE' || item.operator == 'NOT RANGE'" class="com-search-col-input-range">
                                        <el-input
                                            :placeholder="item.operatorPlaceholder"
                                            type="string"
                                            v-model="baTable.comSearch.form[item.prop! + '-start']"
                                            :clearable="true"
                                        ></el-input>
                                        <div class="range-separator">{{ $t('To') }}</div>
                                        <el-input
                                            :placeholder="item.operatorPlaceholder"
                                            type="string"
                                            v-model="baTable.comSearch.form[item.prop! + '-end']"
                                            :clearable="true"
                                        ></el-input>
                                    </div>
                                    <!-- 是否 [NOT] NULL -->
                                    <div v-else-if="item.operator == 'NULL' || item.operator == 'NOT NULL'" class="com-search-col-input">
                                        <el-checkbox v-model="baTable.comSearch.form[item.prop!]" :label="item.operator" size="large"></el-checkbox>
                                    </div>
                                    <div v-else-if="item.operator" class="com-search-col-input">
                                        <!-- 时间筛选 -->
                                        <el-date-picker
                                            class="datetime-picker"
                                            v-if="item.render == 'datetime' || item.comSearchRender == 'date'"
                                            v-model="baTable.comSearch.form[item.prop!]"
                                            :type="item.comSearchRender == 'date' ? 'date' : 'datetime'"
                                            :value-format="item.comSearchRender == 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DD HH:mm:ss'"
                                            :placeholder="item.operatorPlaceholder"
                                            :default-value="baTable.comSearch.form[item.prop! + '-default'] ? baTable.comSearch.form[item.prop! + '-default']:new Date()"
                                            :teleported="false"
                                        />

                                        <!-- beacon、tags、select -->
                                        <el-select
                                            class="w100"
                                            :placeholder="item.operatorPlaceholder"
                                            v-else-if="
                                                (item.render == 'tag' || item.render == 'tags' || item.comSearchRender == 'select') &&
                                                item.replaceValue
                                            "
                                            v-model="baTable.comSearch.form[item.prop!]"
                                            :clearable="true"
                                        >
                                            <el-option v-for="(opt, okey) in item.replaceValue" :key="item.prop! + okey" :label="opt" :value="okey" />
                                        </el-select>

                                        <!-- 远程 select -->
                                        <BaInput
                                            v-else-if="item.comSearchRender == 'remoteSelect'"
                                            type="remoteSelect"
                                            v-model="baTable.comSearch.form[item.prop!]"
                                            :attr="item.remote"
                                            :placeholder="item.operatorPlaceholder"
                                        />

                                        <!-- 开关 -->
                                        <el-select
                                            :placeholder="item.operatorPlaceholder"
                                            v-else-if="item.render == 'switch'"
                                            v-model="baTable.comSearch.form[item.prop!]"
                                            :clearable="true"
                                            class="w100"
                                        >
                                            <template v-if="!isEmpty(item.replaceValue)">
                                                <el-option
                                                    v-for="(opt, okey) in item.replaceValue"
                                                    :key="item.prop! + okey"
                                                    :label="opt"
                                                    :value="okey"
                                                />
                                            </template>
                                            <template v-else>
                                                <el-option :label="$t('utils.open')" value="1" />
                                                <el-option :label="$t('utils.close')" value="0" />
                                            </template>
                                        </el-select>

                                        <!-- 字符串 -->
                                        <el-input
                                            :placeholder="item.operatorPlaceholder"
                                            v-else
                                            type="string"
                                            v-model="baTable.comSearch.form[item.prop!]"
                                            :clearable="true"
                                        ></el-input>
                                    </div>
                                </div>
                            </el-col>
                        </template>
                    </template>
                    <el-col :xs="24" :sm="6">
                        <div class="com-search-col pl-20">
                            <el-button v-blur @click="onComSearch" type="primary">{{ $t('Search') }}</el-button>
                            <el-button @click="onResetForm()">{{ $t('Reset') }}</el-button>
                        </div>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type baTableClass from '/@/utils/baTable'
import { isEmpty } from 'lodash-es'
import BaInput from '/@/components/baInput/index.vue'

const baTable = inject('baTable') as baTableClass

const onComSearch = () => {
    let comSearchData: comSearchData[] = []
    for (const key in baTable.comSearch.form) {
        if (!baTable.comSearch.fieldData.has(key)) {
            continue
        }

        let val = ''
        let fieldDataTemp = baTable.comSearch.fieldData.get(key)
        if (fieldDataTemp.render == 'datetime' && (fieldDataTemp.operator == 'RANGE' || fieldDataTemp.operator == 'NOT RANGE')) {
            // 时间范围组件返回的是时间数组
            if (baTable.comSearch.form[key] && baTable.comSearch.form[key].length >= 2) {
                // 数组转字符串，以实现通过url参数传递预设搜索值
                if (fieldDataTemp.comSearchRender == 'date') {
                    val = baTable.comSearch.form[key][0] + ' 00:00:00' + ',' + baTable.comSearch.form[key][1] + ' 23:59:59'
                } else {
                    val = baTable.comSearch.form[key][0] + ',' + baTable.comSearch.form[key][1]
                }
            }
        } else if (fieldDataTemp.operator == 'RANGE' || fieldDataTemp.operator == 'NOT RANGE') {
            // 普通的范围筛选，baTable在初始化时已准备好start和end字段
            if (!baTable.comSearch.form[key + '-start'] && !baTable.comSearch.form[key + '-end']) {
                continue
            }
            val = baTable.comSearch.form[key + '-start'] + ',' + baTable.comSearch.form[key + '-end']
        } else if (baTable.comSearch.form[key]) {
            val = baTable.comSearch.form[key]
        }

        if (val) {
            comSearchData.push({
                field: key,
                val: val,
                operator: fieldDataTemp.operator,
                render: fieldDataTemp.render,
            })
        }
    }

    baTable.onTableAction('com-search', comSearchData)
}

const onResetForm = () => {
    // 封装好的onResetForm在此处不能使用
    for (const key in baTable.comSearch.form) {
        baTable.comSearch.form[key] = ''
    }
}
</script>

<style scoped lang="scss">
.table-com-search {
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    background-color: var(--ba-bg-color-overlay);
    border: 1px solid var(--ba-border-color);
    border-bottom: none;
    padding: 13px 15px;
    font-size: 14px;
    .com-search-col {
        display: flex;
        align-items: center;
        padding-top: 8px;
        color: var(--el-text-color-regular);
        font-size: 13px;
    }
    .com-search-col-label {
        width: 33.33%;
        padding: 0 15px;
        text-align: right;
        overflow: hidden;
        white-space: nowrap;
    }
    .com-search-col-input {
        padding: 0 15px;
        width: 66.66%;
    }
    .com-search-col-input-range {
        display: flex;
        align-items: center;
        padding: 0 15px;
        width: 66.66%;
        .range-separator {
            padding: 0 5px;
        }
    }
}
:deep(.datetime-picker) {
    width: 100%;
}
.pl-20 {
    padding-left: 20px;
}
.w16 {
    width: 16.5% !important;
}
.w83 {
    width: 83.5% !important;
}
</style>
