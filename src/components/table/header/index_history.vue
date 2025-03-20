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
        <div style='margin-left: 10px'>

            <el-date-picker

                value-format="YYYY-MM-DD HH:mm:ss"
                v-model="value1"
                type="datetimerange"
                :start-placeholder="t('fence_starttime')"
                :end-placeholder="t('fence_stoptime')"
                :default-time="defaultTime1"
                @change='time_change'
            />
        </div>


        <el-select v-model="state.history_type" :placeholder="t('history_type')" style='margin-left: 10px;width: 200px;'
        @change='onchange'
        >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>

        <el-select
            v-model="state.quickSearch"
            filterable
            remote
            reserve-keyword
            :placeholder="t('select_tip')"
            remote-show-suffix
            :remote-method="remoteMethod"
            :loading="loading"
            style="width: 200px;margin-left: 10px"
        >
            <el-option
                v-for="item in data"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
        </el-select>
        <el-button type='primary' style='margin-left: 10px;' @click='onSearchInput'>
            {{t('Search')}}
        </el-button>









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

const loading=ref(false);
const state = reactive({
    quickSearch: '',
    history_type:'',
    start_time:0,
    stop_time:0,


})

interface Label{
    value:string,
    label:string
}
const remoteMethod = (query: string) => {
    if(state.history_type==''){
        ElNotification({
            title: t('Reminder'),
            message: t('history_type_tip'),
            position: 'bottom-right',
            type: 'error',
            duration:3000,
            dangerouslyUseHTMLString: true
        })
        return
    }
    //if (query) {
        loading.value = true
        Search(query,state.history_type).then((res)=>{
            loading.value = false
            data.value=[]
            for(var i=0;i<res.data.length;i++){
                if(state.history_type=="person"){
                    var label:Label={
                        label: res.data[i].name,
                        value: res.data[i].idcard
                    }
                    data.value.push(label)
                }
                else if(state.history_type=="device"){
                    var label:Label={
                        label: res.data[i].name,
                        value: res.data[i].sn
                    }
                    data.value.push(label)
                }
            }

        })
   /* } else {
        loading.value = false
        data.value=[]
    }*/
}
const onchange=(value: any)=>{
       console.log(value)
       state.history_type=value
       state.quickSearch=''
       data.value=[]
   /*  baTable.onTableHeaderAction('alarm_object', { keyword: value })*/
}

const time_change=(value: any)=>{
    console.log(value[0])
    console.log(value[1])

    const start_date = new Date(value[0]);
    const stop_date = new Date(value[1]);
    state.start_time=start_date.getTime()/1000
    state.stop_time=stop_date.getTime()/1000
    /*baTable.onTableHeaderAction('alarm_type', { keyword: value })*/
}
import { ref } from 'vue'

const value = ref('')

const options = [
    {
        value: 'device',
        label: t('device')
    },
    {
        value: 'person',
        label: t('person1')
    }
]
let data = ref([])

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
    if(state.start_time==0){
        ElNotification({
            title: t('Reminder'),
            message: t('history_tip'),
            position: 'bottom-right',
            type: 'error',
            duration:3000,
            dangerouslyUseHTMLString: true
        })
        return
    }
    if(state.history_type==''){
        ElNotification({
            title: t('Reminder'),
            message: t('history_type_tip'),
            position: 'bottom-right',
            type: 'error',
            duration:3000,
            dangerouslyUseHTMLString: true
        })
        return
    }

  /*  ata.history_type
    this.table.filter!.start_time = data.start_time
    this.table.filter!.stop_time = data.stop_time
    this.table.filter!.quickSearch = data.quickSearch*/
    baTable.onTableHeaderAction('history', state)
}

const onChangeShowColumn = (value: string | number | boolean, field: string) => {
    baTable.onTableHeaderAction('change-show-column', { field: field, value: value })
}
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { Search } from '/@/api/backend'
import { Interface } from 'readline'

const value1 = ref('')


const defaultTime1 = new Date(2000, 1, 1, 12, 0, 0) // '12:00:00'

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
