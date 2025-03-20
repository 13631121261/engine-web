<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
        :open='open()'
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ t('outBran')}}
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
                    @keyup.enter="addDeviceBarn1()"
                    :model='ruleForm'
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
<!--                    <el-form-item

                        :label="t('device_code_name')">
                        <el-input  v-model="ruleForm.code_name" disabled/>
                    </el-form-item>-->
<!--                    <el-form-item
                        :label="t('device_code_name')">
                        <el-input-number
                            v-model='ruleForm.code_name'
                            :min='1'
                            :max='1000'>
                        </el-input-number>
                        <span style='margin-left: 5px'>   {{  "  "+ baTable.form.items!.unit}}</span>
                    </el-form-item>-->
                    <FormItem
                        prop="code_sn"
                        :label="t('device_code_name')"
                        type="remoteSelect"
                        v-model="ruleForm.code_sn"
                        :input-attr="{
                            multiple: false,
                            pk: 'code_sn',
                            field: 'name',
                            'remote-url': '/userApi/DeviceCode/index1',
                            render:'datetime',
                            onRow:onChangeSelect

                        }"
                        :placeholder="t('device_code_name')"/>

                    <el-form-item

                        :label="t('stock')">
                        <el-input  v-model="ruleForm.surplus"  disabled>
                            <template #append>{{ruleForm.unit}}</template>
                        </el-input>
                    </el-form-item>



                    <FormItem

                        :label="t('out_type')"
                        type="radio"
                        v-model="ruleForm.barnType"
                        :input-attr="{ size: 'small',
                        onChange:onChange
                        }"
                        :data="{ childrenAttr: { border: true }, content: {Consuming: t('Consuming'), Destruction: t('Destruction'),Check: t('inventory check') } }"
                    />
                    <el-form-item
                        :label="t('out_sum')">
                        <el-input-number
                            v-model='ruleForm.out_sum'
                            :min='1'
                            :max=ruleForm.max>
                        </el-input-number>
                        <span style='margin-left: 5px'>   {{  "  "+ ruleForm.unit}}</span>
                    </el-form-item>
                    <el-form-item
                        v-if="['Normal','Consuming'].includes(ruleForm.barnType)"
                        prop="sn"
                        :label="t('code_sn')">
                        <el-input  v-model="ruleForm.sn"  :placeholder="t('create_sn')" clearable>
                        </el-input>
                        <el-button style='margin-top: 5px' type="info" @click='createSn()'>{{t('Autogenerate')}}</el-button>
                    </el-form-item>


                <FormItem
                        v-if="ruleForm.barnType=='Consuming'"

                        :label="t('Consuming_who')"
                        type="remoteSelect"
                        v-model="ruleForm.idcard"
                        :input-attr="{
                            multiple: false,
                            pk: 'idcard',
                            field: 'name',
                            'remote-url': '/userApi/Person/index1',
                              tooltipParams:{
                                    '部门': 'department_name',
                              }
                        }"
                        :placeholder="t('Consuming_who')"/>




                    <FormItem
                        :label="t('notes')"
                        v-model="ruleForm.notes"
                        type="string"

                        :placeholder="t('notes')"
                        :input-attr="{
                            clearable: true
                        }"

                    />

                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm('')">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="addDeviceOutBarn1()" type="primary">
                    {{ t('Save') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch, toRaw } from 'vue'
import { useI18n } from 'vue-i18n'
import type baTableClass from '/@/utils/baTable'
import { regularPassword, buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'
import FormItem from '/@/components/formItem/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'
import { getSn, outDeviceBarn } from '/@/api/backend/index.ts'
import { ElNotification } from 'element-plus'
import { getArrayKey } from '/@/utils/common'
const adminInfo = useAdminInfo()
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const { t } = useI18n()

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    code_name: [buildValidatorData({ name: 'required', title: t('type_name') })],
    price: [buildValidatorData({ name: 'required', title: t('unit-price') }),buildValidatorData({ name: 'price'})],
    notes: [buildValidatorData({ name: 'required', title: t('notes') })],
    batch: [buildValidatorData({ name: 'required', title: t('batch') }),buildValidatorData({ name: 'id'})],
    sn: [buildValidatorData({ name: 'required', title: t('code_sn') })],
    code_sn: [buildValidatorData({ name: 'required', title: t('code_sn') })],
})



function createSn() {
    getSn( ruleForm.code_sn).then((res)=>{
        if(res.code==1){
            ruleForm.sn=res.sn
        }
        console.log(res)
    })
}
function getDisable(){
    var dis=['Edit'].includes(baTable.form.operate!);
    console.log(dis)
    return dis;
}
interface RuleForm {
    project_key:  string,
    user_key:  string,
    notes: string,
    out_sum:number,
    code_sn:string,
    code_name:string,
    barn_name:string,
    batch:number,
    surplus:number,
    unit:string,
    barnType:string,
    idcard:string,
    type_id:number,
    sn:string,
    max:number

}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    project_key:  '',
    user_key:  '',
    notes: '',
    out_sum:0,
    code_sn:'',
    code_name:'',
    barn_name:"",
    batch:-1,
    surplus:1,
    unit:'台',
    barnType:"Normal",
    idcard:'',
    type_id:0,
    sn:'',
    max:500
})
function addDeviceOutBarn1(){

    ruleFormRef.value?.validate((valid) => {

        console.log("000")
        if (valid) {
            if(ruleForm.out_sum>  ruleForm.surplus||ruleForm.out_sum>  ruleForm.max){
                ElNotification({
                    title: t('State'),
                    message: t('cdcd'),
                    type: 'error',
                    duration:1000,
                    dangerouslyUseHTMLString: true
                })
                return
            }
            outDeviceBarn(ruleForm).then((res)=>{
                if(res.code==1){
                    ElNotification({
                        message: res.msg,
                        type: 'success',
                    })
                    baTable.onTableHeaderAction('refresh', {})
                    baTable.form.operate=''
                }

            })


        }
    })
}
function open(){
    ruleForm.sn=''
    ruleForm.code_sn=baTable.form.items!.code_sn;
    ruleForm.code_name=baTable.form.items!.name;
    ruleForm.batch=-1;
    ruleForm.barn_name="";
    console.log("打开"+baTable.form.items!.name)
    console.log(ruleForm)
    ruleForm.surplus=1
    ruleForm.out_sum=0;
    ruleForm.barnType="Normal"
    ruleForm.notes=""
    ruleForm.type_id=baTable.form.items!.type_id
}

type valType = string | number | string[] | number[]
const onChangeSelect = (val: valType) => {
    //ruleForm.out_sum=1
    console.log(val)
    ruleForm.unit=val.unit
    ruleForm.sn=''
    ruleForm.max=val.stock
    ruleForm.surplus=val.stock

}
const onChange = (val: valType) => {
   // ruleForm.out_sum=1
    console.log(ruleForm.out_sum)
    console.log(val)
    if(val=='Check'||val=='Destruction'){
        ruleForm.max=  ruleForm.surplus
        ruleForm.sn=""
    }else{
        ruleForm.max=1;
        ruleForm.sn=''
        ruleForm.out_sum=1
    }

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
