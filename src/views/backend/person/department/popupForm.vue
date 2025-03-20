<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="d.show"
        @open="open()"
        @close='cancel()'
        :destroy-on-close="true">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ d.department.id>0? t('person.department.edit'):t('person.department.addend') }}
            </div>
        </template>
        <el-scrollbar class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
              >
                <el-form
                    ref="formRef"
                    @keyup.enter="alert('回车')"
                    :model="ruleForm"
                    label-position="right"
                    :rules="rules"
                >
                    <FormItem
                        :label="t('person.department.name')"
                        v-model="ruleForm.name"
                        type="string"
                        prop="name"
                        :placeholder="t('person.department.name_tip')"
                        :input-attr="{
                            clearable: true,
                        }"
                    />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div >
                <el-button @click="cancel()">{{ t('Cancel') }}</el-button>
                <el-button   @click="save()" type="primary">
                    {{t('Save') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { regularPassword, buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'
import FormItem from '/@/components/formItem/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()
const formRef = ref<FormInstance>()


const { t } = useI18n()
let url1 =ref('/userApi/beacon/index1?type=0')

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    name: [buildValidatorData({ name: 'required', title: t('person.department.name_tip') }),buildValidatorData({ name: 'varName'})]
})

interface Department {
    name:  string,
    id:number,
    p_id:number
}
const ruleForm = reactive<Department>({
    name:  '',
    id:0,
    p_id:0
})
const d = defineProps({
    show:Boolean,
    department:{}
});
function open(){
    ruleForm.name=d.department.name;
    ruleForm.id=d.department.id;
    ruleForm.p_id=d.department.p_id;
}
const change=defineEmits(['get-change'])


function save() {
    formRef.value?.validate((valid) => {
        if( ruleForm.name.length>0){
            if(d.department.id!=0){
                change('get-change', ruleForm.p_id,ruleForm.id, ruleForm.name,'edit')
            }else{
                change('get-change', ruleForm.p_id,ruleForm.id ,ruleForm.name,'add')
            }
        }
    })



}

function cancel() {
    change('get-change',0,0,'',"cancel")
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
