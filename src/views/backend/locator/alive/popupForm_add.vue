<template>


    <div >
            <el-dialog
                :close-on-click-modal="false"
                :before-close="close"
                :show-close='false'
                v-model:title="title"
                align-center
                v-model='props.show'
                draggable>

        <div/>

      <el-scrollbar  class="ba-table-form-scrollbar">
          <div style='height: 500px;margin-right: 20px;margin-left: 10px;'>
      <el-form
            ref="ruleFormRef"
            @keyup.enter="onSubmit(ruleFormRef)"
            :model="ruleForm"
            label-position="right"
            :rules="rules"
        >
            <FormItem
                :input-attr="{
                        clearable: true
                        }"
                :label="t('config_name')"
                v-model="ruleForm.name"
                type="string"
                prop="name"
                :placeholder="t('Please input field', { field: t('config_name') })"

            />
            <FormItem
                :label="t('pub_topic')"
                v-model="ruleForm.pub_topic"
                type="string"
                prop="pub_topic"
                :placeholder="t('Please input field', { field: t('pub_topic') })"
                :input-attr="{
                        clearable: true
                        }"
            />
          <FormItem
              :label="t('sub_topic')"
              v-model="ruleForm.sub_topic"
              type="string"
              prop="sub_topic"
              :placeholder="t('Please input field', { field: t('sub_topic') })"
              :input-attr="{
                        clearable: true
                        }"
          />

          <FormItem
              :label="t('report_type')"
              v-model="ruleForm.report_type"
              prop="report_type"
              type="radio"
              :data="{ childrenAttr: { border: true }, content: { 1: '只有广播包', 2: '包含响应包',3: '只有Mac和Rssi',4: '昆仑蓝牙工卡', } }"
          />
          <div>


              <el-row >
                  <el-col :span="4">

                      <FormItem

                          :label="t('scan_out')"
                          v-model="ruleForm.scan_out"
                          type="switch"
                          prop="scan_out"
                      />
                  </el-col>

                  <el-col :span="10" :offset='2'>

                  <el-form-item :label="t('report_interval')"  prop="scan_interval">
                      <el-input-number v-model='ruleForm.scan_interval'
                                       :min=100
                                       :max=10000
                                       :step=100
                                       :controls=true>
                      </el-input-number>
                      <el-icon class="el-input__icon" style="font-style: normal; margin-left: 10px">ms</el-icon>

                  </el-form-item>
                  </el-col>

                  <el-col :span=1 :offset='1'>
                      <FormItem

                          :label="t('filter_beacon')"
                          v-model="ruleForm.filter_ibeacon"
                          type="switch"
                          prop="filter_ibeacon"
                      />
                  </el-col>
              </el-row>
          </div>

          <el-row :gutter="20" style='margin-bottom: 0px'>
              <el-col :span='3'>
                  <FormItem
                      :label="t('filter_rssi')"
                      v-model="ruleForm.is_filter_rssi"
                      type="switch"
                      prop="is_filter_rssi"

                  />
              </el-col>
              <el-col :span="19" :offset='1' style='margin-right: 20px' >

                  <el-slider v-model="ruleForm.filter_rssi" :disabled='!ruleForm.is_filter_rssi' :min='-100' :max='-30'/>
              </el-col>
          </el-row>



          <el-row style='margin-bottom: 0px'>

              <el-col :span="4">
                  <FormItem
                      :label="t('filter_mac')"
                      v-model="ruleForm.is_filter_mac"
                      type="switch"
                      prop="is_filter_mac"
                  />
              </el-col>
              <el-col :span="8" :offset='1'>
                  <FormItem
                      v-model="ruleForm.filter_mac1"
                      type="string"
                      prop="filter_mac1"
                      placeholder='Start 00:00:00:00:00:00'
                      :input-attr="{
                        clearable: true,
                        disabled:!ruleForm.is_filter_mac
                        }"
                  />
              </el-col>
                <span style='margin-top:7px'>-</span>
              <el-col :span="8" :offset='0'>
                  <FormItem
                      v-model="ruleForm.filter_mac2"
                      type="string"
                      prop="filter_mac2"
                      placeholder='End FF:FF:FF:FF:FF:FF'
                      :input-attr="{
                        clearable: true,
                        disabled:!ruleForm.is_filter_mac
                        }"
                  />
              </el-col>

          </el-row>

          <FormItem
              style='width: 300px;'
              :label="t('Data Forwarding')"
              v-model="ruleForm.rules_name"
              type="remoteSelect"
              prop="rules_key"
              :input-attr="{
                 multiple: false,
                pk: 'rule_key',
                field: 'name',
                remoteUrl: '/userApi/rules/index'
            }"
          />




          <div>
              <el-row style='margin-bottom: 0px'>
                  <el-col :span="1">
                      <FormItem
                          :label="t('filter_name')"
                          v-model="ruleForm.is_filter_name"
                          type="switch"
                          prop="is_filter_name"
                      />
                  </el-col>
              </el-row>
              <el-row style='margin-bottom: 0px'>
                  <el-col v-if='ruleForm.is_filter_name'>
                      <el-row  :gutter="20" style='margin-bottom: 0px;'>
                          <el-col :span="5"  >
                              <FormItem
                                  style='width: 140px;'
                                  v-model="ruleForm.filter_name1"
                                  type="string"
                                  prop="filter_name1"
                                  :placeholder="t('filter_name1') +'1'"
                                  :input-attr="{
                                        clearable: true,
                                        disabled: getDisable(),
                                    }"
                              />

                          </el-col>
                          <el-col :span="5"  >
                              <FormItem
                                  style='width: 140px;'
                                  v-model="ruleForm.filter_name2"
                                  type="string"
                                  prop="filter_name2"
                                  :placeholder="t('filter_name1') +'2'"
                                  :input-attr="{
                                        clearable: true,
                                        disabled: getDisable(),
                                    }"
                              />
                          </el-col>
                          <el-col :span="5"  >
                              <FormItem
                                  style='width: 140px;'
                                  v-model="ruleForm.filter_name3"
                                  type="string"
                                  prop="filter_name3"
                                  :placeholder="t('filter_name1') +'3'"
                                  :input-attr="{
                                        clearable: true,
                                        disabled: getDisable(),
                                    }"
                              />
                          </el-col>
                          <el-col :span="5"  >
                              <FormItem
                                  style='width: 140px;'
                                  v-model="ruleForm.filter_name4"
                                  type="string"
                                  prop="filter_name4"
                                  :placeholder="t('filter_name1') +'4'"
                                  :input-attr="{
                                        clearable: true,
                                        disabled: getDisable(),
                                    }"
                              />
                          </el-col>

                      </el-row>
                      <el-row  :gutter="20" >
                          <el-col :span="5"  >
                              <FormItem
                                  style='width: 140px;'
                                  v-model="ruleForm.filter_name5"
                                  type="string"
                                  prop="filter_name5"
                                  :placeholder="t('filter_name1') +'5'"
                                  :input-attr="{
                                        clearable: true,
                                        disabled: getDisable(),
                                    }"
                              />
                          </el-col>
                          <el-col :span="5"  >
                              <FormItem
                                  style='width: 140px;'
                                  v-model="ruleForm.filter_name6"
                                  type="string"
                                  prop="filter_name6"
                                  :placeholder="t('filter_name1') +'6'"
                                  :input-attr="{
                                        clearable: true,
                                        disabled: getDisable(),
                                    }"
                              />
                          </el-col>
                          <el-col :span="5"  >
                              <FormItem
                                  style='width: 140px;'
                                  v-model="ruleForm.filter_name7"
                                  type="string"
                                  prop="filter_name7"
                                  :placeholder="t('filter_name1') +'7'"
                                  :input-attr="{
                                        clearable: true,
                                        disabled: getDisable(),
                                    }"
                              />
                          </el-col>
                          <el-col :span="5"  >
                              <FormItem

                                  style='width: 140px;'
                                  v-model="ruleForm.filter_name8"
                                  type="string"
                                  prop="filter_name8"
                                  :placeholder="t('filter_name1') +'8'"
                                  :input-attr="{
                                        clearable: true,
                                        disabled: getDisable(),
                                    }"
                              />
                          </el-col>
                      </el-row>
                  </el-col>
              </el-row>
          </div>





          <div>
              <el-row style='margin-bottom: 0px'>
                  <el-col :span="1">
                      <FormItem
                          :label="t('filter_companyId')"
                          v-model="ruleForm.is_filter_companyid"
                          type="switch"
                          prop="is_filter_companyid"
                      />
                  </el-col>
              </el-row>
              <el-row style='margin-bottom: 0px'>
                  <el-col  v-if='ruleForm.is_filter_companyid'>
                      <el-row  :gutter="20" style='margin-bottom: 0px;'>
                          <el-col :span="5"  >




                              <el-form-item  style='width: 140px;'
                                             prop="filter_companyId1">

                                  <el-input   v-model="ruleForm.filter_companyId1"
                                              :placeholder="t('filter_companyId1') +'1'"
                                              clearable
                                              :disabled=' !ruleForm.is_filter_companyid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>

                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="filter_companyId2">

                              <el-input  v-model="ruleForm.filter_companyId2"
                                          :placeholder="t('filter_companyId1') +'2'"
                                          clearable
                                          :disabled=' !ruleForm.is_filter_companyid'>
                                  <template #prepend >
                                      <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                              </el-input>
                              </el-form-item>



                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="filter_companyId3">

                                  <el-input  v-model="ruleForm.filter_companyId3"
                                              :placeholder="t('filter_companyId1') +'3'"
                                              clearable
                                              :disabled=' !ruleForm.is_filter_companyid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="filter_companyId4">

                                  <el-input  v-model="ruleForm.filter_companyId4"
                                              :placeholder="t('filter_companyId1') +'4'"
                                              clearable
                                              :disabled=' !ruleForm.is_filter_companyid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>

                      </el-row>
                      <el-row  :gutter="20" >
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="filter_companyId5">

                                  <el-input  v-model="ruleForm.filter_companyId5"
                                              :placeholder="t('filter_companyId1') +'5'"
                                              clearable
                                              :disabled=' !ruleForm.is_filter_companyid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="filter_companyId6">

                                  <el-input  v-model="ruleForm.filter_companyId6"
                                              :placeholder="t('filter_companyId1') +'6'"
                                              clearable
                                              :disabled=' !ruleForm.is_filter_companyid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="filter_companyId7">

                                  <el-input  v-model="ruleForm.filter_companyId7"
                                              :placeholder="t('filter_companyId1') +'7'"
                                              clearable
                                              :disabled=' !ruleForm.is_filter_companyid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="filter_companyId8">

                                  <el-input  v-model="ruleForm.filter_companyId8"
                                              :placeholder="t('filter_companyId1') +'8'"
                                              clearable
                                              :disabled=' !ruleForm.is_filter_companyid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                      </el-row>
                  </el-col>
              </el-row>
          </div>

          <div>
              <el-row style='margin-bottom: 0px'>
                  <el-col :span=1>
                      <FormItem
                          label="Services UUID"
                          v-model="ruleForm.is_services_uuid"
                          type="switch"
                          prop="is_services_uuid">
                      </FormItem>
                  </el-col>
              </el-row>
              <el-row style='margin-bottom: 0px'>
                  <el-col v-if='ruleForm.is_services_uuid'>
                      <el-row  :gutter="20" style='margin-bottom: 0px;'>
                          <el-col :span=5 >

                          <el-form-item  style='width: 140px;'
                                         prop="services_uuid1">

                              <el-input   v-model="ruleForm.services_uuid1"
                                          :placeholder="t('filter_service_uuid') +'1'"
                                          clearable
                                          :disabled=' !ruleForm.is_services_uuid'>
                                  <template #prepend >
                                      <span style='width:0px;margin-left: -10px;'>0x</span>
                                  </template>
                              </el-input>
                          </el-form-item>

                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="services_uuid2">

                                  <el-input   v-model="ruleForm.services_uuid2"
                                              :placeholder="t('filter_service_uuid') +'2'"
                                              clearable
                                              :disabled=' !ruleForm.is_services_uuid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="services_uuid3">

                                  <el-input   v-model="ruleForm.services_uuid3"
                                              :placeholder="t('filter_service_uuid') +'3'"
                                              clearable
                                              :disabled=' !ruleForm.is_services_uuid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="services_uuid4">

                                  <el-input   v-model="ruleForm.services_uuid4"
                                              :placeholder="t('filter_service_uuid') +'4'"
                                              clearable
                                              :disabled=' !ruleForm.is_services_uuid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>

                      </el-row>
                      <el-row  :gutter="20" >
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="services_uuid5">

                                  <el-input   v-model="ruleForm.services_uuid5"
                                              :placeholder="t('filter_service_uuid') +'5'"
                                              clearable
                                              :disabled=' !ruleForm.is_services_uuid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="services_uuid6">

                                  <el-input   v-model="ruleForm.services_uuid6"
                                              :placeholder="t('filter_service_uuid') +'6'"
                                              clearable
                                              :disabled=' !ruleForm.is_services_uuid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="services_uuid7">

                                  <el-input   v-model="ruleForm.services_uuid7"
                                              :placeholder="t('filter_service_uuid') +'7'"
                                              clearable
                                              :disabled=' !ruleForm.is_services_uuid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                          <el-col :span="5"  >
                              <el-form-item  style='width: 140px;'
                                             prop="services_uuid8">

                                  <el-input   v-model="ruleForm.services_uuid8"
                                              :placeholder="t('filter_service_uuid') +'8'"
                                              clearable
                                              :disabled=' !ruleForm.is_services_uuid'>
                                      <template #prepend >
                                          <span style='width:0px;margin-left: -10px;'>0x</span>
                                      </template>
                                  </el-input>
                              </el-form-item>
                          </el-col>
                      </el-row>
                  </el-col>
              </el-row>
          </div>




          <FormItem
              :label="t('filter_UUID')"
              v-model="ruleForm.is_filter_uuid"
              type="switch"
              prop="is_services_uuid"
          />
          <div v-if='ruleForm.is_filter_uuid'>
              <el-form-item
                  prop="filter_uuid1">
                  <el-input   v-model="ruleForm.filter_uuid1"
                              :placeholder="t('filter_UUID') +'1'"
                              clearable
                              :disabled=' !ruleForm.is_filter_uuid'>
                      <template #prepend >
                          <span style='width:0px;margin-left: -10px;'>0x</span>
                      </template>
                  </el-input>
              </el-form-item>
              <el-form-item
                  prop="filter_uuid2">
                  <el-input   v-model="ruleForm.filter_uuid2"
                              :placeholder="t('filter_UUID') +'2'"
                              clearable
                              :disabled=' !ruleForm.is_filter_uuid'>
                      <template #prepend >
                          <span style='width:0px;margin-left: -10px;'>0x</span>
                      </template>
                  </el-input>
              </el-form-item>
              <el-form-item
                  prop="filter_uuid3">
                  <el-input   v-model="ruleForm.filter_uuid3"
                              :placeholder="t('filter_UUID') +'3'"
                              clearable
                              :disabled=' !ruleForm.is_filter_uuid'>
                      <template #prepend >
                          <span style='width:0px;margin-left: -10px;'>0x</span>
                      </template>
                  </el-input>
              </el-form-item>
              <el-form-item
                  prop="filter_uuid4">
                  <el-input   v-model="ruleForm.filter_uuid4"
                              :placeholder="t('filter_UUID') +'4'"
                              clearable
                              :disabled=' !ruleForm.is_filter_uuid'>
                      <template #prepend >
                          <span style='width:0px;margin-left: -10px;'>0x</span>
                      </template>
                  </el-input>
              </el-form-item>
              <el-form-item
                  prop="filter_uuid5">
                  <el-input   v-model="ruleForm.filter_uuid5"
                              :placeholder="t('filter_UUID') +'5'"
                              clearable
                              :disabled=' !ruleForm.is_filter_uuid'>
                      <template #prepend >
                          <span style='width:0px;margin-left: -10px;'>0x</span>
                      </template>
                  </el-input>
              </el-form-item>
              <el-form-item
                  prop="filter_uuid6">
                  <el-input   v-model="ruleForm.filter_uuid6"
                              :placeholder="t('filter_UUID') +'6'"
                              clearable
                              :disabled=' !ruleForm.is_filter_uuid'>
                      <template #prepend >
                          <span style='width:0px;margin-left: -10px;'>0x</span>
                      </template>
                  </el-input>
              </el-form-item>
              <el-form-item
                  prop="filter_uuid7">
                  <el-input   v-model="ruleForm.filter_uuid7"
                              :placeholder="t('filter_UUID') +'7'"
                              clearable
                              :disabled=' !ruleForm.is_filter_uuid'>
                      <template #prepend >
                          <span style='width:0px;margin-left: -10px;'>0x</span>
                      </template>
                  </el-input>
              </el-form-item>
              <el-form-item
                  prop="filter_uuid8">
                  <el-input   v-model="ruleForm.filter_uuid8"
                              :placeholder="t('filter_UUID') +'8'"
                              clearable
                              :disabled=' !ruleForm.is_filter_uuid'>
                      <template #prepend >
                          <span style='width:0px;margin-left: -10px;'>0x</span>
                      </template>
                  </el-input>
              </el-form-item>
          </div>













            <FormItem
                :label="t('State')"
                v-model="ruleForm.isyn"
                type="radio"
                prop="isyn"
                :data="{ content: { '0': t('Disable'), '1': t('Enable') }, childrenAttr: { border: true } }"
            />
          <div style='height: 10px;'/>
        </el-form>
          </div>
                </el-scrollbar>
        <template #footer>
      <span class="dialog-footer">

          <el-popover :visible="visible" placement="top" :width="160">
    <p>{{t('delete_tip')}}</p>
    <div style="text-align: right; margin: 0">
      <el-button size="small" type='info' @click="visible = false">{{t('Cancel')}}</el-button>
      <el-button size="small" type="danger" @click="deletes()"
      >{{t('Delete')}}</el-button
      >
    </div>
    <template #reference>
        <el-button type="danger" v-if='props.items!=null'  @click="visible = true">{{ t('Delete') }}</el-button>
    </template>
  </el-popover>

        <el-button type="info" @click="setchange('cancel')" >{{ t('Cancel') }}</el-button>
        <el-button type="warning" @click="reset()">{{ t('Reset') }}</el-button>
        <el-button type="primary"  :loading="state.submitLoading" @click="onSubmit()">{{ t('Confirm') }}</el-button>
      </span>
        </template>
    </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive,ref, toRefs } from 'vue'

import type { FormInstance, FormRules } from 'element-plus'
import { addConfig,getConfig ,updateConfig,deleteConfig} from '/@/api/backend/gatewayConfig'
import { ElNotification } from 'element-plus'
import router from '/@/router'
import clickCaptcha from '/@/components/clickCaptcha/index'
import { useI18n } from 'vue-i18n'
import FormItem from '/@/components/formItem/index.vue'
import { buildValidatorData } from '/@/utils/validate'

const { t } = useI18n()
interface RuleForm {
    config_key:  string,
    name: string,
    user_key:  string,
    project_key: string,
    id:number,
    create_time:number,
    sub_topic:string,
    pub_topic:string,
    scan_out:number,
    scan_interval:number,
    report_type:number,
    filter_rssi:number,
    is_filter_rssi:boolean,
    is_filter_name:boolean,
    filter_name:any,
    filter_ibeacon:number,
    filter_uuid:any,
    is_filter_uuid:boolean,
    filter_companyid:any,
    is_filter_companyid:boolean,
    rules_key:string,
    rules_name:string,
    isyn:number,
    services_uuid:any,
    is_services_uuid:boolean,
    is_filter_mac:boolean,
    filter_mac:any,
    filter_companyId1:string,
    filter_companyId2:string,
    filter_companyId3:string,
    filter_companyId4:string,
    filter_companyId5:string,
    filter_companyId6:string,
    filter_companyId7:string,
    filter_companyId8:string,
    services_uuid1:string,
    services_uuid2:string,
    services_uuid3:string,
    services_uuid4:string,
    services_uuid5:string,
    services_uuid6:string,
    services_uuid7:string,
    services_uuid8:string,
    filter_uuid1:string,
    filter_uuid2:string,
    filter_uuid3:string,
    filter_uuid4:string,
    filter_uuid5:string,
    filter_uuid6:string,
    filter_uuid7:string,
    filter_uuid8:string,
    filter_mac1:string,
    filter_mac2:string,
    filter_name1:string,
    filter_name2:string,
    filter_name3:string,
    filter_name4:string,
    filter_name5:string,
    filter_name6:string,
    filter_name7:string,
    filter_name8:string,
}
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    config_key:  '',
    name: '',
    user_key:  '',
    project_key: '',
    id:0,
    create_time:0,
    sub_topic:'',
    pub_topic:'',
    scan_out:1,
    scan_interval:1000,
    report_type:1,
    filter_rssi:-88,
    is_filter_rssi:false,
    is_filter_name:false,
    filter_name:['','','','','','','','',],
    filter_ibeacon:0,
    filter_uuid:['','','','','','','',''],
    is_filter_uuid:false,
    filter_companyid:['','','','','','','',''],
    is_filter_companyid:false,
    rules_key:'',
    rules_name:'',
    isyn:0,
    services_uuid:['','','','','','','','',],
    is_services_uuid:false,
    is_filter_mac:false,
    filter_mac:['',''],
    filter_companyId1:'',
    filter_companyId2:'',
    filter_companyId3:'',
    filter_companyId4:'',
    filter_companyId5:'',
    filter_companyId6:'',
    filter_companyId7:'',
    filter_companyId8:'',
    services_uuid1:'',
    services_uuid2:'',
    services_uuid3:'',
    services_uuid4:'',
    services_uuid5:'',
    services_uuid6:'',
    services_uuid7:'',
    services_uuid8:'',
    filter_uuid1:'',
    filter_uuid2:'',
    filter_uuid3:'',
    filter_uuid4:'',
    filter_uuid5:'',
    filter_uuid6:'',
    filter_uuid7:'',
    filter_uuid8:'',
    filter_mac1:'',
    filter_mac2:'',
    filter_name1:'',
    filter_name2:'',
    filter_name3:'',
    filter_name4:'',
    filter_name5:'',
    filter_name6:'',
    filter_name7:'',
    filter_name8:'',

})
let visible = ref(false)
const buttons = [
    { type: 'primary', text: '+'+t('addConfig') },
] as const
const rules = reactive<FormRules<RuleForm>>({
    name: [
        { required: true, message: t('config_name_tip'), trigger: 'blur' },
        { min: 3, max: 10, message: t('config_name_tip_len'), trigger: 'blur' },
    ],
    pub_topic: [buildValidatorData({ name: 'required', title: t('pub_topic') }),buildValidatorData({ name: 'topic'})],
    sub_topic: [buildValidatorData({ name: 'required', title: t('pub_topic') }),buildValidatorData({ name: 'topic'})],
   filter_companyId1: [buildValidatorData({ name: 'companyId'})],
    filter_companyId2: [buildValidatorData({ name: 'companyId'})],
    filter_companyId3: [buildValidatorData({ name: 'companyId'})],
    filter_companyId4: [buildValidatorData({ name: 'companyId'})],
    filter_companyId5: [buildValidatorData({ name: 'companyId'})],
    filter_companyId6: [buildValidatorData({ name: 'companyId'})],
    filter_companyId7: [buildValidatorData({ name: 'companyId'})],
    filter_companyId8: [buildValidatorData({ name: 'companyId'})],
    services_uuid1: [buildValidatorData({ name: 'companyId'})],
    services_uuid2: [buildValidatorData({ name: 'companyId'})],
    services_uuid3: [buildValidatorData({ name: 'companyId'})],
    services_uuid4: [buildValidatorData({ name: 'companyId'})],
    services_uuid5: [buildValidatorData({ name: 'companyId'})],
    services_uuid6: [buildValidatorData({ name: 'companyId'})],
    services_uuid7: [buildValidatorData({ name: 'companyId'})],
    services_uuid8: [buildValidatorData({ name: 'companyId'})],
    filter_uuid1: [buildValidatorData({ name: 'beaconuuid'})],
    filter_uuid2: [buildValidatorData({ name: 'beaconuuid'})],
    filter_uuid3: [buildValidatorData({ name: 'beaconuuid'})],
    filter_uuid4: [buildValidatorData({ name: 'beaconuuid'})],
    filter_uuid5: [buildValidatorData({ name: 'beaconuuid'})],
    filter_uuid6: [buildValidatorData({ name: 'beaconuuid'})],
    filter_uuid7: [buildValidatorData({ name: 'beaconuuid'})],
    filter_uuid8: [buildValidatorData({ name: 'beaconuuid'})],
    filter_name1: [buildValidatorData({ name: 'blename'})],
    filter_name2: [buildValidatorData({ name: 'blename'})],
    filter_name3: [buildValidatorData({ name: 'blename'})],
    filter_name4: [buildValidatorData({ name: 'blename'})],
    filter_name5: [buildValidatorData({ name: 'blename'})],
    filter_name6: [buildValidatorData({ name: 'blename'})],
    filter_name7: [buildValidatorData({ name: 'blename'})],
    filter_name8 : [buildValidatorData({ name: 'blename'})],
    filter_mac1 : [buildValidatorData({ name: 'address'})],
    filter_mac2 : [buildValidatorData({ name: 'address'})],




})
let props = defineProps({
    show:Boolean,
    items: {}
});
const change=defineEmits(['get-change'])
function setchange(data:String) {
    change('get-change',data)
}

let dialogShow=ref(false)


const state = reactive({
    submitLoading: false,
})
//重置内容
function reset(){
    if(props.items!=null){
       init();
    }else {
        init1()
    }
}
function getDisable(){
    var dis=ruleForm.is_filter_name;
    return !dis;
}
//删除项目
function deletes(id:number) {
    visible.value =false
   // setchange('reload')
    deleteConfig(ruleForm.config_key)
        .then((res) => {
            reset()
            // show.show =false;
            //console.log(show)
            setchange('reload')
            if(res.code==1){
                ElNotification({
                    message: res.msg,
                    type: 'success',
                })
            }

        })
        .finally(() => {
            console.log("这里aa")
            state.submitLoading = false
        })
}
//提交表单
function onSubmit() {
    console.log("准备校验")
    ruleFormRef.value?.validate((valid) => {
        console.log("000"+valid)
        if (valid) {
            state.submitLoading=true
            chang()
            if(props.items!=null){
                update()
            }else{
                add()
            }

        }
    })
}
let title=ref('')

onMounted(()=>{
    if(props.items==null){
      title.value=t('addConfig')
    }else{
        init();
    }
})
function init(){
    ruleForm.project_key=props.items.project_key
    title.value=t('updateConfig')
    ruleForm.name=props.items.name
    ruleForm.config_key=props.items.config_key
    ruleForm.project_key=props.items.project_key
    ruleForm.id=props.items.id
    ruleForm.create_time=props.items.create_time
    ruleForm.sub_topic=props.items.sub_topic
    ruleForm.pub_topic=props.items.pub_topic
    ruleForm.scan_out=props.items.scan_out
    ruleForm.scan_interval=props.items.scan_interval
    ruleForm.report_type=props.items.report_type
    ruleForm.filter_rssi=props.items.filter_rssi
    ruleForm.is_filter_rssi=props.items.is_filter_rssi
    ruleForm.is_filter_name=props.items.is_filter_name
    ruleForm.filter_name=props.items.filter_name
    ruleForm.filter_ibeacon=props.items.filter_ibeacon
    ruleForm.filter_uuid=props.items.filter_uuid
    ruleForm.is_filter_uuid=props.items.is_filter_uuid
    ruleForm.filter_companyid=props.items.filter_companyid
    ruleForm.is_filter_companyid=props.items.is_filter_companyid
    ruleForm.rules_key=props.items.rules_key
    ruleForm.rules_name=props.items.rules_name
    ruleForm.isyn=props.items.isyn
    ruleForm.services_uuid=props.items.services_uuid
    ruleForm.is_services_uuid=props.items.is_services_uuid
    ruleForm.is_filter_mac=props.items.is_filter_mac
    ruleForm.filter_mac=props.items.filter_mac
    ruleForm.filter_companyId1=props.items.filter_companyid[0]
    ruleForm.filter_companyId2=props.items.filter_companyid[1]
    ruleForm.filter_companyId3=props.items.filter_companyid[2]
    ruleForm.filter_companyId4=props.items.filter_companyid[3]
    ruleForm.filter_companyId5=props.items.filter_companyid[4]
    ruleForm.filter_companyId6=props.items.filter_companyid[5]
    ruleForm.filter_companyId7=props.items.filter_companyid[6]
    ruleForm.filter_companyId8=props.items.filter_companyid[7]
    ruleForm.filter_uuid1=props.items.filter_uuid[0]
    ruleForm.filter_uuid2=props.items.filter_uuid[1]
    ruleForm.filter_uuid3=props.items.filter_uuid[2]
    ruleForm.filter_uuid4=props.items.filter_uuid[3]
    ruleForm.filter_uuid5=props.items.filter_uuid[4]
    ruleForm.filter_uuid6=props.items.filter_uuid[5]
    ruleForm.filter_uuid7=props.items.filter_uuid[6]
    ruleForm.filter_uuid8=props.items.filter_uuid[7]
    ruleForm.services_uuid1=props.items.services_uuid[0]
    ruleForm.services_uuid2=props.items.services_uuid[1]
    ruleForm.services_uuid3=props.items.services_uuid[2]
    ruleForm.services_uuid4=props.items.services_uuid[3]
    ruleForm.services_uuid5=props.items.services_uuid[4]
    ruleForm.services_uuid6=props.items.services_uuid[5]
    ruleForm.services_uuid7=props.items.services_uuid[6]
    ruleForm.services_uuid8=props.items.services_uuid[7]
    ruleForm.filter_name1=props.items.filter_name[0]
    ruleForm.filter_name2=props.items.filter_name[1]
    ruleForm.filter_name3=props.items.filter_name[2]
    ruleForm.filter_name4=props.items.filter_name[3]
    ruleForm.filter_name5=props.items.filter_name[4]
    ruleForm.filter_name6=props.items.filter_name[5]
    ruleForm.filter_name7=props.items.filter_name[6]
    ruleForm.filter_name8=props.items.filter_name[7]
    ruleForm.filter_mac1=props.items.filter_mac[0]
    ruleForm.filter_mac2=props.items.filter_mac[1]
}
function init1(){

    ruleForm.name=''
    ruleForm.sub_topic=''
    ruleForm.pub_topic=''
    ruleForm.scan_out=1
    ruleForm.scan_interval=1000
    ruleForm.report_type=1
    ruleForm.filter_rssi=-50
    ruleForm.is_filter_rssi=false
    ruleForm.is_filter_name=false
    ruleForm.filter_name=['','','','','','','','',]
    ruleForm.filter_ibeacon=0
    ruleForm.filter_uuid=['','','','','','','','']
    ruleForm.is_filter_uuid=false
    ruleForm.filter_companyid=['','','','','','','','',]
    ruleForm.is_filter_companyid=false
    ruleForm.rules_key=''
    ruleForm.rules_name=''
    ruleForm.isyn=1
    ruleForm.services_uuid=['','','','','','','','',]
    ruleForm.is_services_uuid=false
    ruleForm.is_filter_mac=false
    ruleForm.filter_mac=['','']
    ruleForm.filter_companyId1=''
    ruleForm.filter_companyId2=''
    ruleForm.filter_companyId3=''
    ruleForm.filter_companyId4=''
    ruleForm.filter_companyId5=''
    ruleForm.filter_companyId6=''
    ruleForm.filter_companyId7=''
    ruleForm.filter_companyId8=''
    ruleForm.filter_uuid1=''
    ruleForm.filter_uuid2=''
    ruleForm.filter_uuid3=''
    ruleForm.filter_uuid4=''
    ruleForm.filter_uuid5=''
    ruleForm.filter_uuid6=''
    ruleForm.filter_uuid7=''
    ruleForm.filter_uuid8=''
    ruleForm.services_uuid1=''
    ruleForm.services_uuid2=''
    ruleForm.services_uuid3=''
    ruleForm.services_uuid4=''
    ruleForm.services_uuid5=''
    ruleForm.services_uuid6=''
    ruleForm.services_uuid7=''
    ruleForm.services_uuid8=''
    ruleForm.filter_name1=''
    ruleForm.filter_name2=''
    ruleForm.filter_name3=''
    ruleForm.filter_name4=''
    ruleForm.filter_name5=''
    ruleForm.filter_name6=''
    ruleForm.filter_name7=''
    ruleForm.filter_name8=''
    ruleForm.filter_mac1=''
    ruleForm.filter_mac2=''
}
function chang() {
    ruleForm.filter_companyid[0]=ruleForm.filter_companyId1
    ruleForm.filter_companyid[1]=ruleForm.filter_companyId2
    ruleForm.filter_companyid[2]=ruleForm.filter_companyId3
    ruleForm.filter_companyid[3]=ruleForm.filter_companyId4
    ruleForm.filter_companyid[4]=ruleForm.filter_companyId5
    ruleForm.filter_companyid[5]=ruleForm.filter_companyId6
    ruleForm.filter_companyid[6]=ruleForm.filter_companyId7
    ruleForm.filter_companyid[7]=ruleForm.filter_companyId8

    ruleForm.filter_uuid[0]=ruleForm.filter_uuid1
    ruleForm.filter_uuid[1]=ruleForm.filter_uuid2
    ruleForm.filter_uuid[2]=ruleForm.filter_uuid3
    ruleForm.filter_uuid[3]=ruleForm.filter_uuid4
    ruleForm.filter_uuid[4]=ruleForm.filter_uuid5
    ruleForm.filter_uuid[5]=ruleForm.filter_uuid6
    ruleForm.filter_uuid[6]=ruleForm.filter_uuid7
    ruleForm.filter_uuid[7]=ruleForm.filter_uuid8

    ruleForm.services_uuid[0]=ruleForm.services_uuid1
    ruleForm.services_uuid[1]=ruleForm.services_uuid2
    ruleForm.services_uuid[2]=ruleForm.services_uuid3
    ruleForm.services_uuid[3]=ruleForm.services_uuid4
    ruleForm.services_uuid[4]=ruleForm.services_uuid5
    ruleForm.services_uuid[5]=ruleForm.services_uuid6
    ruleForm.services_uuid[6]=ruleForm.services_uuid7
    ruleForm.services_uuid[7]=ruleForm.services_uuid8


    ruleForm.filter_name[0]=ruleForm.filter_name1
    ruleForm.filter_name[1]=ruleForm.filter_name2
    ruleForm.filter_name[2]=ruleForm.filter_name3
    ruleForm.filter_name[3]=ruleForm.filter_name4
    ruleForm.filter_name[4]=ruleForm.filter_name5
    ruleForm.filter_name[5]=ruleForm.filter_name6
    ruleForm.filter_name[6]=ruleForm.filter_name7
    ruleForm.filter_name[7]=ruleForm.filter_name8
    ruleForm.filter_mac[0]= ruleForm.filter_mac1
    ruleForm.filter_mac[1]= ruleForm.filter_mac2
}
function close() {
    visible.value=false
    setchange('cancel')
}
function add() {
    addConfig(ruleForm)
        .then((res) => {
            if(res.code==1){
                ElNotification({
                    message: res.msg,
                    type: 'success',
                })
            }
            reset()
            //show.show =false;
            //console.log(show)
            setchange('reload')
        })
        .finally(() => {
            console.log("这里aa")
            state.submitLoading = false
        })
}
function update(){
    updateConfig(ruleForm)
        .then((res) => {
            if(res.code==1){
                ElNotification({
                    message: res.msg,
                    type: 'success',
                })
            }
            reset()
           // show.show =false;
           // console.log(show)
            setchange('reload')
        })
        .finally(() => {
            console.log("这里aa")
            state.submitLoading = false
        })
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
