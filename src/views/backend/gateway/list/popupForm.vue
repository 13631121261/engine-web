<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['Add', 'Edit'].includes(baTable.form.operate!)"
        @close="baTable.toggleForm"
        :destroy-on-close="true"
    >
        <template #header>
            <div class="title" v-drag="['.ba-operate-dialog', '.el-dialog__header']" v-zoom="'.ba-operate-dialog'">
                {{ baTable.form.operate ? t(baTable.form.operate) : '' }}
            </div>
        </template>
        <el-scrollbar v-loading="baTable.form.loading" class="ba-table-form-scrollbar">
            <div
                class="ba-operate-form"
                :class="'ba-' + baTable.form.operate + '-form'"
                :style="'width: calc(100% - ' + baTable.form.labelWidth! / 2 + 'px)'"
            >
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
                        :input-attr="{
                        clearable: true
                        }"
                        :label="t('gateway.list.name')"
                        v-model="baTable.form.items!.name"
                        type="string"
                        prop="name"
                        :placeholder="t('Please input field', { field: t('gateway.list.name') })"

                    />
                    <FormItem
                        :label="t('gateway.list.address')"
                        v-model="baTable.form.items!.address"
                        type="string"
                        prop="address"

                        :placeholder="t('gateway.list.address_tip')"
                        :input-attr="{
                            clearable: true,
                            disabled: getDisable(),
                        }"

                    />
                    <FormItem
                        :label="t('gateway.list.config_name')"
                        v-model="baTable.form.items!.config_key"
                        prop="config_key"
                        type="remoteSelect"
                        :input-attr="{
                            pk:'config_key',
                            multiple: false,
                            params: {  project_Key: adminInfo.getProject_Key()},
                            field: 'name',
                            'remote-url':'/userApi/config/index1',
                            placeholder: t('Click select')
                        }"
                    />
                    <FormItem
                        :label="t('gateway.list.map_name')"
                        v-model="baTable.form.items!.map_key"
                        prop="map_key"
                        type="remoteSelect"
                        :input-attr="{
                             pk:'map_key',
                            multiple: false,
                            params: { project_Key: adminInfo.getProject_Key() },
                            field: 'name',
                            'remote-url':'/userApi/map/index1',
                            placeholder: t('Click select')
                        }"
                    />
                    <FormItem
                        :label="t('gateway.list.x')"
                        v-model.number="baTable.form.items!.x"
                        type="number"
                        prop="x"
                        :placeholder="t('gateway.list.x_tip')"
                    />
                    <FormItem
                        :label="t('gateway.list.y')"
                        v-model.number="baTable.form.items!.y"
                        type="number"
                        prop="y"
                        :placeholder="t('gateway.list.y_tip')"
                    />

                    <FormItem
                        :label="t('gateway.list.state')"
                        v-model="baTable.form.items!.isyn"
                        type="radio"
                        prop="isyn"
                        :data="{ content: { '0': t('Disable'), '1': t('Enable') }, childrenAttr: { border: true } }"
                    />
                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
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

const rules: Partial<Record<string, FormItemRule[]>> = reactive({
    name: [buildValidatorData({ name: 'required', title: t('gateway.list.name') }), buildValidatorData({ name: 'varName' })],
    address: [buildValidatorData({ name: 'required', title: t('gateway.list.address') }),buildValidatorData({ name: 'address'})],

    y: [buildValidatorData({ name: 'axis', title: t('Please enter the correct field', { field: t('gateway.list.x') }) })],
    x: [buildValidatorData({ name: 'axis', title: t('Please enter the correct field', { field: t('gateway.list.y') }) })],

    map_key: [buildValidatorData({ name: 'required', message: t('Please select field', { field: t('gateway.list.map_name') }) })],
    config_key: [buildValidatorData({ name: 'required', message: t('Please select field', { field: t('gateway.list.config_name') }) })],

})

function getDisable(){
    var dis=['Edit'].includes(baTable.form.operate!);
    console.log(dis)
    return dis;
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
