<template>


    <div >
            <el-dialog
                :close-on-click-modal="false"
                :before-close="close"
                :show-close='false'
            v-model:title="title"
            width="30%"
            align-center
            v-model='props.show'
            draggable>

        <div/>

        <el-form
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="rules"
            label-position="top"
            label-width="100px"
            style="max-width: 460px"
        >
            <el-form-item :label="t('project_name')" prop="project_name">
                <el-input
                          prop="project_name"
                          v-model="ruleForm.project_name" clearable
                          maxlength="20"
                          show-word-limit/>
            </el-form-item>


            <el-form-item :label="t('project_info')" prop="project_info">
                <el-input
                    show-word-limit
                    maxlength="50"
                    v-model="ruleForm.project_info"
                    :rows="4"
                    type="textarea"
                    :placeholder="t('project_hint')"
                    clearable/>
            </el-form-item>
        </el-form>
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
import { addProject,index ,updateProject,deleteProject} from '/@/api/backend/project'
import { ElNotification } from 'element-plus'
import router from '/@/router'
import clickCaptcha from '/@/components/clickCaptcha/index'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
interface RuleForm {
    project_key:  string,
    user_key:  string,
    project_name: string
    project_info: string
}
const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
    user_key:'',
    project_key:'',
    project_name: '',
    project_info: '',
})
let visible = ref(false)
const buttons = [
    { type: 'primary', text: '+'+t('addProject') },
] as const
const rules = reactive<FormRules<RuleForm>>({
    project_name: [
        { required: true, message: t('project_name_tip'), trigger: 'blur' },
        { min: 3, max: 20, message: t('project_name_tip_len'), trigger: 'blur' },
    ],
    project_info: [
        { required: true, message: t('project_info_tip'), trigger: 'blur' },
        { min: 10, max: 50, message: t('project_info_tip_len'), trigger: 'blur' },
    ],

})
let props = defineProps({
    show:Boolean,
    items:{}
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
        ruleForm.project_name=props.items.project_name
        ruleForm.project_info=props.items.info
    }else {
        ruleForm.project_name = ""
        ruleForm.project_info = ""
    }
}
//删除项目
function deletes(id:number) {
    visible.value =false
   // setchange('reload')
    deleteProject(ruleForm.project_key)
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
    ruleFormRef.value?.validate((valid) => {
        console.log("000")
        if (valid) {
            state.submitLoading=true
            if(props.items!=null){
                if(ruleForm.project_name==props.items.project_name&&ruleForm.project_info==props.items.info){
                    ElNotification({
                        message: t('no_change'),
                        type: 'success',
                    })
                    state.submitLoading=false
                    return
                }
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
      title.value=t('addProject')
    }else{
        ruleForm.project_key=props.items.project_key
        title.value=t('updateProject')
        ruleForm.project_name=props.items.project_name
        ruleForm.project_info=props.items.info
        ruleForm.user_key=props.items.user_key
    }
})
function close() {
    visible.value=false
    setchange('cancel')
}
function add() {
    addProject(ruleForm)
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
    updateProject(ruleForm)
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


</style>
