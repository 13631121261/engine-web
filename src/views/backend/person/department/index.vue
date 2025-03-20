<template>
    <div class="custom-tree-container" style='background-color: #ffffff;margin-left: 10px;margin-right: 10px;height: 1000px;margin-bottom: 100px'>
        <div>
     <p style='margin-top: 20px'>
         <el-button  type="primary" @click='add()' style='margin-top: 20px;margin-left: 20px'>
         <Icon name="fa fa-plus" style='color: #ffffff;font-size: 14px' />
         <span class="table-header-operate-text">{{ t('Add') }}</span>
     </el-button></p>
        </div>
        <el-tree
            style='margin-top: 30px;margin-left: 10px;width: 1000px;'
            :data="dataSource"
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
            :render-content="renderContent">

        </el-tree>
        <popupForm v-model:show=show :department='department' @get-change='getChange'></popupForm>
    </div>

</template>

<script lang="ts" setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { onMounted, reactive, ref } from 'vue'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { useI18n } from 'vue-i18n'
import { addDepartment, deleteDepartment, editDepartment, getAllDepartment } from '/@/api/backend'
import popupForm from './popupForm.vue'
import { ElNotification } from 'element-plus'
const { t } = useI18n()
let show=ref(false)
var change_data;
interface Department {
    name:  string,
    id:number,
    p_id:number
}
const department = reactive<Department>({
    name:  '',
    id:0,
    p_id:0
})
interface Tree {
    id: number
    p_id: number
    label: string
    children?: Tree[]
}
let id = 1000
const edit  = (data: Tree) => {
    console.log(show)
    department.name=data.label
    department.id=data.id;
    department.p_id=data.p_id;
    show.value=true;
    change_data=data;
    console.log(show)
}
const append = (data: Tree) => {
    console.log(show)
    department.name=''
    department.id=0;
    department.p_id=data.id
    show.value=true;
    change_data=data;

   /* const newChild = { id: id++, label: 'testtest', children: [] }
    if (!data.children) {
        data.children = []
    }
  //  data.children.push(newChild)
    dataSource.value = [...dataSource.value]*/
}
function clickck(data:Tree){
    console.log(data)
}
function add() {
    console.log(show)
    department.name=''
    department.id=0;
    department.p_id=0;
    show.value=true;

}
const remove = (node: Node, data: Tree) => {
    deleteDepartment(data.id).then((res)=>{
        console.log(res)
        if(res.code==1){
            getDepartment()
            ElNotification({
                message: res.msg,
                type: 'success',
            })

        }/*else if(res.code==-10){
            ElNotification({
                message: t('person.department.error_tip'),
                type: 'success',
            })
        }
        else{
            ElNotification({
                message: res.msg,
                type: 'error',
            })
        }*/
    })
}

function getChange(pid:number,id:number,name:String,operate:String){
    if(operate=='add'){

        department.name=name;
        department.id=0;
        department.p_id=pid
        addDepartment(department).then((res)=>{
        if(res.code==1){
            getDepartment()
            /*const newChild = { id: id++, label: name, children: [] }

            if (!change_data.children) {
                change_data.children = []
            }
            change_data .children.push(newChild)
            dataSource.value = [...dataSource.value]*/
            ElNotification({
                message: res.msg,
                type: 'success',
            })
        }
        else{
            ElNotification({
                message: res.msg,
                type: 'error',
            })
        }
        })
    }
    else if(operate=='edit'){
        department.name=name;
        department.id=id
        department.p_id=pid
        editDepartment(department).then((res)=>{
            if(res.code==1){
                getDepartment()
                /*change_data.label=name;
                dataSource.value = [...dataSource.value]*/
                ElNotification({
                    message: res.msg,
                    type: 'success',
                })
            }else{
                ElNotification({
                    message: res.msg,
                    type: 'error',
                })
            }
        })
    }
    show.value=false;
    console.log(show)
}
var a=0;
const renderContent = (
    h,
    {
        node,
        data,
        store,
    }: {
        node: Node
        data: Tree
        store: Node['store']
    }
) => {
    return h(
        'span',
        {
            class: 'custom-tree-node',

        },
        h('span', null, node.label),

        h(

            'span',
            null,
            h(
                'a',
                {
                    style: 'font-size: 12px;height:23px;width:35px',
                    class:'el-button el-button--primary',
                    onClick: () => append(data),
                },
                t('person.department.addend')
            ),
            h(
                'a',
                {
                    style: 'font-size: 12px;height:23px;width:35px',
                    class:'el-button el-button--primary',
                    onClick: () => edit(data),
                },
                t('person.department.edit')
            ),
            h(
                'a',
                {
                    style: 'font-size: 12px;height:23px;width:35px',
                    class:'el-button el-button--danger',
                    onClick: () => remove(node,data),
                },
                t('person.department.delete')
            )
        )
    )
}
function getNodeStyle(data) {
    a=a+1
    console.log(data)
    if(a%2==1){
        return { 'background-color': '#eeeeee' }
    }else{
        return { 'background-color': '#cccccc' }
    }

}
const dataSource = ref<Tree[]>([

])

onMounted(()=>{
    getDepartment()
})
function getDepartment() {
    getAllDepartment().then((res)=>{
        console.log(res)
        dataSource.value=res.data

    })
}

</script>

<style>
.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
    height: 100px;

}
.el-tree-node {

    line-height: 0px;
}
.el-tree-node .el-tree-node__content {

}
</style>
