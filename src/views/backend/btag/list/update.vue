<template>
    <!-- 对话框表单 -->
    <el-dialog
        class="ba-operate-dialog"
        :close-on-click-modal="false"
        :model-value="['update'].includes(baTable.form.operate!)"
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
                        :label="t('ble_firmware')"
                        v-model="baTable.form.items!.ble_version"
                        prop="ble_version"
                        type="remoteSelect"

                        :input-attr="{
                            pk:'version',
                            multiple: false,
                            field: 'version',
                            'remote-url':'/userApi/BleFirmware/index1',
                            placeholder: t('Click select')
                        }"
                    />
                    <FormItem
                        :label="t('wifi_firmware')"
                        v-model="baTable.form.items!.wifi_version"
                        prop="wifi_version"
                        type="remoteSelect"
                        :input-attr="{
                             pk:'version',
                            multiple: false,
                            field: 'version',
                            'remote-url':'/userApi/WifiFirmware/index1',
                            placeholder: t('Click select')
                        }"
                    />

                </el-form>
            </div>
        </el-scrollbar>
        <template #footer>
            <div :style="'width: calc(100% - ' + baTable.form.labelWidth! / 1.8 + 'px)'">
                <el-button @click="baTable.toggleForm('')">{{ t('Cancel') }}</el-button>
                <el-button v-blur :loading="baTable.form.submitLoading" @click="baTable.onSubmit(formRef)" type="primary">
                    {{  t('Save') }}
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

    ble_version: [buildValidatorData({ name: 'required', message: t('Please select field', { field: t('gateway.list.map_name') }) })],
    wifi_version: [buildValidatorData({ name: 'required', message: t('Please select field', { field: t('gateway.list.config_name') }) })],

})

function click(){
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
