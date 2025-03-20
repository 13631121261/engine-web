<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true">
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth/ 2 + 'px)'">
                <el-form
                    ref="formRef"
                    @keyup.enter="baTable.onSubmit(formRef)"
                    :model="baTable.form.items"
                    label-position="right"
                    :label-width="baTable.form.labelWidth + 'px'"
                    :rules="rules"
                    v-if="!baTable.form.loading"
                >
                    <FormItem
                        :label="t('person.list.name')"
                        v-model="baTable.form.items.name"
                        type="string"
                        prop="name"
                        :placeholder="t('person.list.name_tip')"
                        :input-attr="{
                            clearable: true,
                            disabled: getDisable(),
                        }"
                    />
                    <FormItem
                        :label="t('person.list.idcard')"
                        v-model="baTable.form.items.idcard"
                        type="string"
                        prop="idcard"
                        :placeholder="t('person.list.idcard')"
                        :input-attr="{
                            clearable: true,
                                disabled: getDisable(),
                        }"
                    />

                    <FormItem
                        :label="t('person.list.department')"
                        type="remoteSelect"
                        prop="department_id"
                        v-model="baTable.form.items.department_id"
                        :input-attr="{
                            multiple: false,
                            pk: 'id',
                            field: 'name',
                            'remote-url': '/userApi/Department/index1',
                        }"
                        :placeholder="t('person.list.department')"/>
                    <FormItem
                        :label="t('person.list.jobnumber')"
                        v-model="baTable.form.items.jobnumber"
                        type="string"

                        :placeholder="t('person.list.jobnumber_tip')"
                        :input-attr="{
                            clearable: true,

                        }"
                    />
                    <FormItem
                        :label="t('person.list.phone')"
                        v-model="baTable.form.items.phone"
                        type="string"
                        :placeholder="t('person.list.phone')"
                        :input-attr="{
                            clearable: true,
                        }"
                    />
                    <el-form-item
                        :label="t('person.list.sex')">
                        <el-select
                            v-model="baTable.form.items.sex"
                            @change='onChange'>
                            <el-option
                                v-for="item in sexs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <FormItem
                        :label="t('person.list.fence_id')"
                        type="remoteSelect"
                        v-model="baTable.form.items.fence_id"
                        :input-attr="{
                            multiple: false,
                            pk: 'id',
                            field: 'name',
                            'remote-url': '/userApi/fence/index1',
                        }"
                        :placeholder="t('person.list.fence_id')"/>
<!--                    <el-form-item
                        :label="t('person.list.type')">
                        <el-select
                            v-model="baTable.form.items.type"
                            @change='onChange'>
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                    </el-form-item>


                    <FormItem
                        v-if='url1.length>0'
                        :label="t('person.list.tag_mac')"
                        type="remoteSelect"
                        v-model="baTable.form.items.bind_mac"
                        :input-attr="{
                            multiple: false,
                            pk: 'mac',
                            field: 'mac',
                            'remote-url': url1,
                        }"
                        :placeholder="t('person.list.bind_mac')"
                      />-->

                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth/ 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm('')">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary">
                    {{ baTable.form.operateIds && baTable.form.operateIds.length > 1 ? t('Save and edit next item') : t('Save') }}
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, inject, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type baTableClass from '/@/utils/baTable'
import { regularPassword, buildValidatorData } from '/@/utils/validate'
import type { FormInstance, FormItemRule } from 'element-plus'
import FormItem from '/@/components/formItem/index.vue'
import { useAdminInfo } from '/@/stores/adminInfo'

const adminInfo = useAdminInfo()
const formRef = ref<FormInstance>()
const baTable = inject('baTable') as baTableClass

const { t } = useI18n()
let url1 =ref('/userApi/beacon/index1?type=0')

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    name: [buildValidatorData({ name: 'required', title: t('person.list.name') }),buildValidatorData({ name: 'varName'})],
    type: [buildValidatorData({ name: 'required', title: t('person.list.type') })],
    department_id: [buildValidatorData({ name: 'required', title: t('person.list.department') })],
    idcard: [buildValidatorData({ name: 'required', title: t('person.list.idcard') }),buildValidatorData({ name: 'idNumber'}) ],

})

const options = [
    {
        value: 1,
        label: 'KTBB818-K iBeacon',
    },
    {
        value: 2,
        label: 'KTBB818-A iBeacon',
    },
    {
        value: 3,
        label: 'KTBB818-KA iBeacon',
    },
    {
        value: 4,
        label: 'AOA',
    },
    {
        value: 5,
        label: 'UWB',
    },
]

const sexs = [
    {
        value: 1,
        label: '男',
    },
    {
        value: 0,
        label: '女',
    }
]
function getDisable(){
    var dis=['Edit'].includes(baTable.form.operate!);
    console.log(dis)
    return dis;
}
function onChange(data:any){

    url1.value= '/userApi/beacon/index1?type='+data
    console.log(url1)
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
