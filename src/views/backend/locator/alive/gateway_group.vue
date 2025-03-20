<template xmlns='http://www.w3.org/1999/html'>

    <div id='wrap' style='height: auto'>
        <div id='div1'>
        <el-card class="box-card">
            <template #header>

                <div class="card-header">
                    <h1>可选择网关</h1>


                </div>
            </template>

            <div style='height: 450px;'>
                <el-input v-model="filterText" placeholder="Mac过滤" />
            <el-scrollbar style='height:300px;margin-bottom: 10px'>

            <el-tree  default-expand-all accordion  node-key="id"  @check="check" style='margin-top: 10px' ref="atree" :data="dataSource"  show-checkbox  :filter-node-method="filterNode">
                <template #default="{ node, data }">
                    <span class="custom-tree-node">
                      <span>{{ node.label }}</span>
                      <span>
                          <el-text class="mx-1" type="primary">{{  data.address}}</el-text>
                      </span>
                    </span>
                </template>
            </el-tree>
            </el-scrollbar>
            </div>
        </el-card>
    </div>
        <div id='div2' style=' display: flex;  justify-content: center;  align-items: center;' >
            <div style=' align-items: center;'>
                <el-button :disabled='getAddDisable()' type="primary" style='margin-bottom: 10px' @click="appendChild()">
                    选择关联<el-icon class="el-icon--right" ><ArrowRight /></el-icon>
                </el-button>
                <el-button :disabled='getdelDisable()' type="danger" :icon="ArrowLeft" style='margin-left: 0px;margin-top: 10px' @click="remove()" >移除关联</el-button>

            </div>


        </div>
        <div id='div3'>
        <el-card class="box-card">
            <template #header>
                <div class="card-header">
                    <h1>已关联的网关</h1>
                    <div>
                        <el-button style='margin-right: 0px' class="button" @click='reback()' >返回</el-button>
                    <el-button  class="button" type="warning" @click='reset()' >重置</el-button>
                    <el-button class="button" type="primary" :disabled='getcommitDisable()' @click="commit1()">提交</el-button>
                    </div>
                </div>
            </template>
          <div style='height: 450px;'>
                <el-input v-model="filterTextb" placeholder="Mac过滤" />
                <el-scrollbar style='height:300px;margin-bottom: 10px'>

                    <el-tree default-expand-all node-key="id"  @check="check1" style='margin-top: 10px' ref="btree" :data="dataSourceb" :props="defaultProps" show-checkbox  :filter-node-method="filterNode">
                        <template #default="{ node, data }">
                            <span class="custom-tree-node">
                              <span>{{ node.label }}</span>
                              <span>
                                  <el-text class="mx-1" type="primary">{{  data.address}}</el-text>
                              </span>
                            </span>
                        </template>
                    </el-tree>
                </el-scrollbar>
            </div>
        </el-card>
        </div>
    </div>






</template>

<script lang="ts" setup>
import _ from 'lodash';
import { nextTick, onMounted, ref,watch } from 'vue'
import { toRefs } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ArrowRight } from '@element-plus/icons-vue'
import { getConfigGateway, getProjectGateway ,addConfigGateway} from '/@/api/backend/gatewayConfig'
import { Tree } from 'element-plus/es/components/tree-v2/src/types'
import { ElNotification } from 'element-plus'
const defaultProps = {
    children: 'children',
    label: 'label',
    disabled: 'disabled',
}
const atree = ref();
const btree = ref();
const filterText = ref('')
watch(filterText, (val) => {
    atree.value!.filter(val)
})
const filterTextb = ref('')
watch(filterTextb, (val) => {
    btree.value!.filter(val)
})
let config = defineProps({
    config_key: {
        type: String, // 设置数据类型
        require: false,// 设置是否必填
        default: "", //设置默认值
    }
})
// 接收父组件传过来的值
let  config_key=toRefs(config)

let add_disable=ref(true)
let del_disable=ref(true)


interface Tree {
    id: number
    label: string
    address: string
    disabled:boolean
    children?: Tree[]
    is_append:boolean
}
const dataSource = ref<Tree[]>([
])
const dataSourceb = ref<Tree[]>([
])
const dataSource_old = ref<Tree[]>([
])
const dataSourceb_old = ref<Tree[]>([
])

const dataSource_select = ref<Tree[]>([
])
const dataSourceb_select = ref<Tree[]>([
])


const getCssVarName = (type: string) => {
    return `--el-box-shadow${type ? '-' : ''}${type}`
}

onMounted(()=>{
    nextTick(()=>{
        getAllGateway()
        getConfigGateway1()
    })
})
const filterNode = (value: string, data: Tree) => {
    console.log(data)
    if (!value) return true

    return data.label.includes(value)||data.address.includes(value)
}
function  getAllGateway() {
    getProjectGateway(config_key.config_key.value).then((res) => {
        if(res.code==1){
            atree.value!.filter("")
            dataSource.value=res.data

            dataSource_old.value=  _.cloneDeep(res.data)
        }
    })
        .finally(() => {

        })
}
function  getConfigGateway1() {

    getConfigGateway(config_key.config_key.value).then((res) => {
        if(res.code==1){
            btree.value!.filter("")
            dataSourceb.value=res.data
            dataSourceb_old.value=  _.cloneDeep(res.data)

        }
    })
        .finally(() => {

        })
}
function check(data,checkData){
    add_disable.value=true
    if(checkData.checkedKeys.length>0){
        console.log(checkData.checkedKeys.length)
        dataSource_select.value=checkData.checkedNodes
        console.log("选择="+checkData.checkedNodes)
        for(let i=0;i<checkData.checkedNodes.length;i++){
            console.log(checkData.checkedNodes[i])
           // if(!checkData.checkedNodes[i].is_append){
                add_disable.value=false
           // }
        }
    }
    }
function check1(data,checkData){
    del_disable.value=true
    if(checkData.checkedKeys.length>0){
        console.log(checkData.checkedKeys.length)
        dataSourceb_select.value=checkData.checkedNodes
        console.log("选择="+checkData.checkedNodes)
        for(let i=0;i<checkData.checkedNodes.length;i++){
            console.log(checkData.checkedNodes[i])
           // if(!checkData.checkedNodes[i].is_append){
               del_disable.value=false
           // }
        }
    }
}

function appendChild(){
    for(let i=0;i<dataSource_select.value.length;i++){
      //  if(!dataSource_select.value[i].is_append){
            const newChild = { id:dataSource_select.value[i].id ,address:dataSource_select.value[i].address, label: dataSource_select.value[i].label, children: [] }
            dataSource_select.value[i].is_append=true
            if(!dataSource_select.value[i].children){
              /*  const children: { id:0, label: dataSource_select.value[i].label, children: [] }
                dataSourceb.value=*/
                dataSourceb.value[0].children.push(newChild)
            }

       // }
    }
    for(let i=0;i<dataSource.value.length;i++){
        if(dataSource.value[i].children.length>0){
            for(let j=0;j<dataSource.value[i].children.length; j++){
                for(let n=0;n<dataSource_select.value.length; n++){
                    console.log(dataSource_select.value[n])
                    const index = dataSource.value[i].children.findIndex((d) => d.id === dataSource_select.value[n].id)
                    if(index!=-1){
                        dataSource.value[i].children.splice(index, 1)
                        console.log("index="+index)
                    }
                }
            }
        }
        add_disable.value=true
    }
}
function remove() {
    console.log(dataSourceb_select)
    for(let i=0;i<dataSourceb_select.value.length;i++){
        console.log("循环="+i)
        console.log(dataSourceb_select.value[i].children)
    //if(!dataSourceb_select.value[i].is_append){
        const newChild = { id:dataSourceb_select.value[i].id ,assress:dataSourceb_select.value[i].assress, label: dataSourceb_select.value[i].label, children: [] }
        dataSourceb_select.value[i].is_append=true
        if(dataSourceb_select.value[i].children==null||dataSourceb_select.value[i].children.length==0) {
            console.log("push=")
            dataSource.value[0].children.push(newChild)
        }
    //}
}
    for(let i=0;i<dataSourceb.value.length;i++){
        if(dataSourceb.value[i].children.length>0){
            for(let j=0;j<dataSourceb.value[i].children.length; j++){
                for(let n=0;n<dataSourceb_select.value.length; n++){
                    console.log(dataSourceb_select.value[n])
                    const index = dataSourceb.value[i].children.findIndex((d) => d.id === dataSourceb_select.value[n].id)
                    if(index!=-1){
                        dataSourceb.value[i].children.splice(index, 1)
                        console.log("index="+index)
                    }
                }
            }
        }
        del_disable.value=true
    }
}

function reset() {
    console.log("重置")
    dataSourceb.value=_.cloneDeep(dataSourceb_old.value);
    dataSource.value=_.cloneDeep(dataSource_old.value);
    add_disable.value=true
    del_disable.value=true
    console.log(dataSource.value)
    console.log(dataSource_old.value)
}
const change=defineEmits(['showpop'])
function reback() {
    change('showpop')
    console.log("点击返回")
}


function getAddDisable(){

    return   add_disable.value
}
function getdelDisable(){
    return   del_disable.value
}
function getcommitDisable(){
   const  status=_.isEqual(dataSourceb_old.value, dataSourceb.value)
    return   status
}

function commit1(){
    console.log(dataSourceb.value)
    addConfigGateway(config_key.config_key.value,dataSourceb.value).then((res)=>{
        ElNotification({
            message: res.msg,
            type: 'success',
        })
        console.log(res)
    }).finally()
}
</script>
<style scoped>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

}

.box-card {
    width: 100%;
    height:450px;

}
#div1{
    width: 40%;
    float: left;


}
#div2 {
    width: 10%;
    float: right;
}
#div3 {
    width: 40%;
    float: right;
}

#wrap{
    display: flex;
    margin: 30px;
    justify-content: space-around;

}

</style>
<style>
.custom-tree-node {
flex: 1;
display: flex;
align-items: center;
justify-content: space-between;
font-size: 14px;
padding-right: 18px;
}

</style>
