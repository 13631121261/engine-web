<template>
    <!-- 通用搜索 -->
    <transition name="el-zoom-in-bottom" mode="out-in">
        <ComSearch v-show="props.buttons.includes('comSearch') && baTable.table.showComSearch">
            <template v-for="(slot, idx) in $slots" :key="idx" #[idx]>
                <slot :name="idx"></slot>
            </template>
        </ComSearch>
    </transition>

    <!-- 操作按钮组 -->
    <div v-bind="$attrs" class="table-header ba-scroll-style">
        <slot name="refreshPrepend"></slot>
        <el-tooltip v-if="props.buttons.includes('refresh')" :content="t('Refresh')" placement="top">
            <el-button v-blur @click="onAction('refresh', { loading: true })" color="#40485b" class="table-header-operate" type="info">
                <Icon name="fa fa-refresh" />
            </el-button>
        </el-tooltip>
        <slot name="refreshAppend"></slot>


        <el-select v-model="state.alarm_object" class="m-2" :placeholder="t('alarm_object')" style='margin-left: 10px'
        @change='onchange'
        >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <el-select v-model="state.alarm_type" class="m-2" :placeholder="t('Alarm_Type')" style='margin-left: 10px'
                   @change='onchange1'
        >
            <el-option
                v-for="item in alarm_type"
                :key="item.value1"
                :label="item.label"
                :value="item.value1"
            />
        </el-select>

        <el-tooltip v-if="props.buttons.includes('add') && auth('add')" :content="t('Add')" placement="top">
            <el-button v-blur @click="onAction('add')" class="table-header-operate" type="primary">
                <Icon name="fa fa-plus" />
                <span class="table-header-operate-text">{{ t('Add') }}</span>
            </el-button>
        </el-tooltip>
        <el-tooltip v-if="props.buttons.includes('edit') && auth('edit')" :content="t('Edit selected row')" placement="top">
            <el-button v-blur @click="onAction('edit')" :disabled="!enableBatchOpt" class="table-header-operate" type="primary">
                <Icon name="fa fa-pencil" />
                <span class="table-header-operate-text">{{ t('Edit') }}</span>
            </el-button>
        </el-tooltip>

        <el-popconfirm
            v-if="props.buttons.includes('delete') && auth('del')"
            @confirm="onAction('delete')"
            :confirm-button-text="t('Delete')"
            :cancel-button-text="t('Cancel')"
            confirmButtonType="danger"
            :title="t('Are you sure to delete the selected record?')"
            :disabled="!enableBatchOpt"
        >
            <template #reference>
                <div class="mlr-12">
                    <el-tooltip :content="t('Delete selected row')" placement="top">
                        <el-button v-blur :disabled="!enableBatchOpt" class="table-header-operate" type="danger">
                            <Icon name="fa fa-trash" />
                            <span class="table-header-operate-text">{{ t('Delete') }}</span>
                        </el-button>
                    </el-tooltip>
                </div>
            </template>
        </el-popconfirm>


        <el-tooltip v-if="props.buttons.includes('import') && auth('import')" :content="t('Import from Excel')" placement="top">

            <el-upload
                class="table-header-operate"
                style='margin-top: 10px'
                accept='excel'
                show-file-list='ture'
                action="./userApi/uploadBeacon"
                multiple
                name='data.xlsx'
                auto-upload='ture'
            >
            <el-button v-blur  class="table-header-operate" type="primary">
                <Icon name="fa fa-pencil" />
                <span class="table-header-operate-text">{{ t('import') }}</span>
            </el-button>
            </el-upload>
        </el-tooltip>
        <el-tooltip v-if="props.buttons.includes('export') && auth('export')" :content="t('export_tip')" placement="top">
            <el-button v-blur @click="onAction('export')" :disabled="!enableBatchOpt" class="table-header-operate" type="primary">
                <Icon name="fa fa-pencil" />
                <span class="table-header-operate-text">{{ t('export') }}</span>
            </el-button>
        </el-tooltip>



        <el-tooltip
            v-if="props.buttons.includes('unfold')"
            :content="(baTable.table.expandAll ? t('Shrink') : t('Open')) + t('All submenus')"
            placement="top"
        >
            <el-button
                v-blur
                @click="baTable.onTableHeaderAction('unfold', { unfold: !baTable.table.expandAll })"
                class="table-header-operate"
                :type="baTable.table.expandAll ? 'danger' : 'warning'"
            >
                <span class="table-header-operate-text">{{ baTable.table.expandAll ? t('Shrink all') : t('Expand all') }}</span>
            </el-button>
        </el-tooltip>

        <!-- slot -->
        <slot></slot>

        <!-- 右侧搜索框和工具按钮 -->
        <div class="table-search">
            <slot name="quickSearchPrepend"></slot>
            <el-input
                v-if="props.buttons.includes('quickSearch')"
                v-model="state.quickSearch"
                class="xs-hidden quick-search"
                @input="debounce(onSearchInput, 500)()"
                :placeholder="quickSearchPlaceholder ? quickSearchPlaceholder : t('Search')"
            />
            <div class="table-search-button-group" v-if="props.buttons.includes('columnDisplay') || props.buttons.includes('comSearch')">
                <el-dropdown v-if="props.buttons.includes('columnDisplay')" :max-height="380" :hide-on-click="false">
                    <el-button
                        class="table-search-button-item"
                        :class="props.buttons.includes('comSearch') ? 'right-border' : ''"
                        color="#dcdfe6"
                        plain
                    >
                        <Icon size="14" name="el-icon-Grid" />
                    </el-button>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(item, idx) in columnDisplay" :key="idx">
                                <el-checkbox
                                    v-if="item.prop"
                                    @change="onChangeShowColumn($event, item.prop!)"
                                    :checked="!item.show"
                                    :model-value="item.show"
                                    size="small"
                                    :label="item.label"
                                />
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <el-tooltip
                    v-if="props.buttons.includes('comSearch')"
                    :disabled="baTable.table.showComSearch"
                    :content="t('Expand generic search')"
                    placement="top"
                >
                    <el-button
                        class="table-search-button-item"
                        @click="baTable.table.showComSearch = !baTable.table.showComSearch"
                        color="#dcdfe6"
                        plain
                    >
                        <Icon size="14" name="el-icon-Search" />
                    </el-button>
                </el-tooltip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, inject } from 'vue'
import { debounce, auth } from '/@/utils/common'
import type baTableClass from '/@/utils/baTable'
import ComSearch from '/@/components/table/comSearch/index.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const baTable = inject('baTable') as baTableClass

interface Props {
    buttons: HeaderOptButton[]
    quickSearchPlaceholder?: string
}
const props = withDefaults(defineProps<Props>(), {
    buttons: () => {
        return ['refresh', 'add', 'edit', 'delete']
    },
    quickSearchPlaceholder: '',
})

const state = reactive({
    quickSearch: '',
    alarm_object:'',
    alarm_type:''

})
const onchange=(value: any)=>{
        console.log(value)
    baTable.onTableHeaderAction('alarm_object', { keyword: value })
}
const onchange1=(value: any)=>{
    console.log(value)
    baTable.onTableHeaderAction('alarm_type', { keyword: value })
}
import { ref } from 'vue'

const value = ref('')

const options = [
    {
        value: 'device',
        label: t('alarm_device')
    },
    {
        value: 'person',
        label: t('alarm_person')
    }
]


const alarm_type = [


    {
        value1: 'sos_all',
        label: t('sos_all')
    },
    {
        value1: 'sos_key',
        label: t('sos_key')
    },
    {
        value1: 'sos_run',
        label: t('sos_run')
    },
    {
        value1: 'sos_bt',
        label: t('sos_bt')
    },
    {
        value1: 'sos_offline',
        label: t('sos_offline')
    },
    {
        value1: 'sos_online',
        label: t('sos_online')
    },
    {
        value1: 'fence_on_sos',
        label: t('fence_on_sos')
    },
    {
        value1: 'fence_out_sos',
        label: t('fence_out_sos')
    }
]
const columnDisplay = computed(() => {
    let columnDisplayArr = []
    for (let item of baTable.table.column) {
        item.type === 'selection' || item.render === 'buttons' || item.enableColumnDisplayControl === false ? '' : columnDisplayArr.push(item)
    }
    return columnDisplayArr
})

const enableBatchOpt = computed(() => (baTable.table.selection!.length > 0 ? true : false))

const onAction = (event: string, data: anyObj = {}) => {
    baTable.onTableHeaderAction(event, data)
}

const onSearchInput = () => {
    baTable.onTableHeaderAction('quick-search', { keyword: state.quickSearch })
}

const onChangeShowColumn = (value: string | number | boolean, field: string) => {
    baTable.onTableHeaderAction('change-show-column', { field: field, value: value })
}
</script>

<style scoped lang="scss">
.table-header {
    position: relative;
    overflow-y: scroll;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    background-color: var(--ba-bg-color-overlay);
    border: 1px solid var(--ba-border-color);
    border-bottom: none;
    padding: 13px 15px;
    font-size: 14px;
    .table-header-operate-text {
        margin-left: 6px;
    }
}

.mlr-12 {
    margin-left: 12px;
}
.mlr-12 + .el-button {
    margin-left: 12px;
}
.table-search {
    display: flex;
    margin-left: auto;
    .quick-search {
        width: 300px;
    }
}
.table-search-button-group {
    display: flex;
    margin-left: 12px;
    border: 1px solid var(--el-border-color);
    border-radius: var(--el-border-radius-base);
    overflow: hidden;
    button:focus,
    button:active {
        background-color: var(--ba-bg-color-overlay);
    }
    button:hover {
        background-color: var(--el-color-info-light-7);
    }
    .table-search-button-item {
        height: 30px;
        border: none;
        border-radius: 0;
    }
    .el-button + .el-button {
        margin: 0;
    }
    .right-border {
        border-right: 1px solid var(--el-border-color);
    }
}

html.dark {
    .table-search-button-group {
        button:focus,
        button:active {
            background-color: var(--el-color-info-dark-2);
        }
        button:hover {
            background-color: var(--el-color-info-light-7);
        }
        button {
            background-color: #898a8d;
            el-icon {
                color: white !important;
            }
        }
    }
}
</style>
