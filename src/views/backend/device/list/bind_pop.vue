<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['bind'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        :open='open()'
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ t('bind')}}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
                <el-form
                    ref="ruleFormRef"
                    @keyup.enter="bind()"
                    :model='ruleForm'
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                   <el-form-item :label="t('tag_type')">
                       <el-select v-model="ruleForm.type"
                                  @change='onChange'>
                           <el-option
                               v-for="item in options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value"
                           />
                       </el-select>
                   </el-form-item>
                    <FormItem :label="t('open_run')" type="switch" v-model="ruleForm.open_run"  :input-attr="{

                            disabled: getDisable(),
                        }" />
                    <FormItem
                        prop="mac"
                        :label="t('bind_tag')"
                        type="remoteSelect"
                        v-model="ruleForm.mac"
                        :input-attr="{
                            multiple: false,
                            pk: 'mac',
                            field: 'mac',
                            'remote-url':ruleForm.url,
                        }"
                        :placeholder="t('bind_tag')"

                    />
                    <FormItem
                        prop="idcard"
                        :label="t('Consuming_who')"
                        type="remoteSelect"
                        v-model="ruleForm.idcard"
                        :input-attr="{
                            multiple: false,
                            pk: 'idcard',
                            field: 'name',
                            'remote-url': '/userApi/Person/index1',

                        }"
                        :placeholder="t('Consuming_who')"

                    />
                    <FormItem

                        :label="t('select_area')"
                        type="remoteSelect"
                        v-model="ruleForm.area_id"
                        :input-attr="{
                            multiple: false,
                            pk: 'id',
                            field: 'name',
                            'remote-url': '/userApi/area/index1',

                        }"
                        :placeholder="t('select_area')"

                    />

                    <FormItem

                        :label="t('fence_name')"
                        type="remoteSelect"
                        v-model="ruleForm.fence_id"
                        :input-attr="{
                            multiple: false,
                            pk: 'id',
                            field: 'name',
                            'remote-url': '/userApi/fence/index1',
                        }"


                    />


                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm('')">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="bind()" type="primary">
                    {{ t('Save') }}
                </el-button>

            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type baTableClass from '/@/utils/baTable'
import { buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'
import FormItem from '/@/components/formItem/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'
import {bindTag} from '/@/api/backend/index.ts'
import { ElNotification } from 'element-plus'
import { ary } from 'lodash-es'
const adminInfo = useAdminInfo()
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const { t } = useI18n()

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    mac: [buildValidatorData({ name: 'required', title: t('bind_tag') })],
    idcard: [buildValidatorData({ name: 'required', title: t('Consuming_who') })],
    area_id: [buildValidatorData({ name: 'required', title: t('select_area') })],

})


interface RuleForm {
   mac:string,
    idcard:string
   type:string,
    tag_type:number
    url:string,
    sn:string,
    area_id:number,
    open_run:number,
    fence_id:number

}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    mac:'',
    idcard:'-1',
    type:'AOA',
    tag_type:5,
    url:'/userApi/beacon/index1?type=5',
    sn:'',
    area_id:-1,
    open_run:0,
    fence_id:-1
})
const options = [

    {
        value: '5',
        label: 'AOA',
    }
    ,
    {
        value: '1',
        label: 'KTBB818',
    }
    ,
    {
        value: '2',
        label: 'KTBB818-K',
    }
    ,
    {
        value: '3',
        label: 'KTBB818-A',
    }
    ,
    {
        value: '4',
        label: 'KTBB818-KA',
    }
]
function bind(){
    ruleFormRef.value?.validate((valid) => {

        if (valid) {
            bindTag(ruleForm).then((res)=>{
                if(res.code==1){
                    ElNotification({
                        message: res.msg,
                        type: 'success',
                    })
                    baTable.form.operate=""
                    baTable.getIndex()
                }
            })
        }
    })
}
function open(){
    if(baTable.form.items.idcard!=null&&baTable.form.items.idcard!='-1'&&baTable.form.items.idcard!=''){
        ruleForm.idcard=baTable.form.items.idcard
        ruleForm.area_id=baTable.form.items.area_id
        ruleForm.fence_id=baTable.form.items.fence_id
    }else{
        ruleForm.idcard='-1'
       // ruleForm.area_id=-1
    }
   if(baTable.form.items.bind_mac!=null){
       ruleForm.mac=baTable.form.items.bind_mac
   }else{
       ruleForm.mac=''
   }
    ruleForm.sn=baTable.form.items.sn
    ruleForm.open_run=baTable.form.items.open_run
    ruleForm.type='AOA'
    ruleForm.tag_type=5
    ruleForm.url='/userApi/beacon/index1?type=5'
    console.log(ruleForm)
}
function onChange(data:any){
    console.log("改变"+data)
    ruleForm.mac=''
    ruleForm.tag_type=data
    ruleForm.url='/userApi/beacon/index1?type='+data

}

function getDisable(){
    if(ruleForm.tag_type==5){

        return false;
    }
    return true;
}
</script>

<style scoped lang="scss">
.avatar-uploader {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: var(--el-border-radius-small);
    box-shadow: var(--el-box-shadow-light);
    border: 1px dashed var(--el-border-color);
    cursor: pointer;
    overflow: hidden;
    width: 110px;
    height: 110px;
}
.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}
.avatar {
    width: 110px;
    height: 110px;
    display: block;
}
.image-slot {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}
</style>
