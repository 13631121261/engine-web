<template>

    <div class="grid-content ep-bg-purple">


        <div class="container1">
            <div class="item1" >
                <el-card  class="box-card" shadow="hover">
                    <template #header>
                        <div class="card-header" >
                            <span style='font-weight:bold;color: #00aaff'>{{t('gateway_info')}}</span>
                        </div>
                    </template>
                    <div  class="text item" >
                        <span style="font-weight:bold">蓝牙MAC</span>
                        {{': '+item.address  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">WiFi MAC</span>
                        {{': '+item.wifi_address  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">蓝牙版本</span>
                        {{': '+item.ble_version  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">WiFi版本</span>
                        {{': '+item.wifi_version  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">网关IP</span>
                        {{': '+item.ip  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">运行时长</span>
                        {{': '+item.up_time  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">标志位</span>
                        {{': '+item.CRC_FLAG  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">SSID</span>
                        {{': '+item.wlan_ssid  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">WiFi状态</span>
                        {{': '+item.wifi_onoff  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">网关地址</span>
                        {{': '+item.wlan_ip  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">工作模式</span>
                        {{': '+item.op_mode  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">动/静态IP</span>
                        {{': '+item.wan_mode  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">路由IP</span>
                        {{': '+item.wan_ip  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">上级路由IP</span>
                        {{': '+item.wan_gw  }}</div>
                    <div  class="text item" >
                        <span style="font-weight:bold">在线时间</span>
                        {{': '+dateFormat(item.lasttime)  }}</div>

                </el-card>

            </div>
            <div class="item1">
                <el-card  class="box-card" shadow="hover">
                <template #header>
                    <div class="card-header" >
                        <span style='font-weight:bold;color: #00aaff'>{{t('report_info')}}</span>
                    </div>
                </template>
                <div  class="text item" style="height: 30px;">
                    <span style="font-weight:bold">上报类型</span>
                    <span >   {{': '+getReport(item.report_type)  }}</span>
                </div>
                    <div  class="text item" style="height: 30px;">
                        <span style="font-weight:bold">扫描间隔</span>
                        <span >   {{': '+item.scan_interval+"ms" }}</span>
                    </div>
                <div class="demo-collapse">
                    <el-collapse v-model="activeName" accordion>
                        <el-collapse-item title="Consistency" name="1">
                            <div>
                                Consistent with real life: in line with the process and logic of real
                                life, and comply with languages and habits that the users are used to;
                            </div>
                            <div>
                                Consistent within interface: all elements should be consistent, such
                                as: design style, icons and texts, position of elements, etc.
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="Feedback" name="2">
                            <div>
                                Operation feedback: enable the users to clearly perceive their
                                operations by style updates and interactive effects;
                            </div>
                            <div>
                                Visual feedback: reflect current state by updating or rearranging
                                elements of the page.
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="Efficiency" name="3">
                            <div>
                                Simplify the process: keep operating process simple and intuitive;
                            </div>
                            <div>
                                Definite and clear: enunciate your intentions clearly so that the
                                users can quickly understand and make decisions;
                            </div>
                            <div>
                                Easy to identify: the interface should be straightforward, which helps
                                the users to identify and frees them from memorizing and recalling.
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="Controllability" name="4">
                            <div>
                                Decision making: giving advices about operations is acceptable, but do
                                not make decisions for the users;
                            </div>
                            <div>
                                Controlled consequences: users should be granted the freedom to
                                operate, including canceling, aborting or terminating current
                                operation.
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-card></div>
            <div class="item1"><el-card  class="box-card" shadow="hover">
                <template #header>
                    <div class="card-header" >
                        <span style='font-weight:bold;color: #00aaff'>{{t('scan_info')}}</span>
                    </div>
                </template>
                <div  class="text item" >
                    <span style="font-weight:bold">上报类型</span>
                    {{': '+item.report_type  }}</div>
                <div  class="text item">
                    <span style="font-weight:bold">{{t('update_time')}}</span>

                    {{': '+item.update_time  }}</div>
                <div  class="text item" style="height: 30px;">
                    <span style="font-weight:bold">{{t('project_info')}}</span>
                    <span >   {{': '+item.info  }}</span>
                </div>
                <div class="demo-collapse">
                    <el-collapse v-model="activeName" accordion>
                        <el-collapse-item title="Consistency" name="1">
                            <div>
                                Consistent with real life: in line with the process and logic of real
                                life, and comply with languages and habits that the users are used to;
                            </div>
                            <div>
                                Consistent within interface: all elements should be consistent, such
                                as: design style, icons and texts, position of elements, etc.
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="Feedback" name="2">
                            <div>
                                Operation feedback: enable the users to clearly perceive their
                                operations by style updates and interactive effects;
                            </div>
                            <div>
                                Visual feedback: reflect current state by updating or rearranging
                                elements of the page.
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="Efficiency" name="3">
                            <div>
                                Simplify the process: keep operating process simple and intuitive;
                            </div>
                            <div>
                                Definite and clear: enunciate your intentions clearly so that the
                                users can quickly understand and make decisions;
                            </div>
                            <div>
                                Easy to identify: the interface should be straightforward, which helps
                                the users to identify and frees them from memorizing and recalling.
                            </div>
                        </el-collapse-item>
                        <el-collapse-item title="Controllability" name="4">
                            <div>
                                Decision making: giving advices about operations is acceptable, but do
                                not make decisions for the users;
                            </div>
                            <div>
                                Controlled consequences: users should be granted the freedom to
                                operate, including canceling, aborting or terminating current
                                operation.
                            </div>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </el-card></div>
        </div>

    </div>

</template>

<script setup  lang='ts'>
import { ref } from 'vue'
import moment from 'moment'
import  popupForm_add  from './popupForm_add.vue'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
const activeName = ref('0')

const { t } = useI18n()
const d = defineProps({
    width:Number,
    item:{}
});

function dateFormat(date) {

    if (date == undefined) {
        return "";
    }
    console.log("时间戳="+date)
    return moment(date*1000).format("YYYY-MM-DD HH:mm:ss");
}

function getReport(type) {

    if (type == undefined) {
        return "";
    }
    var type_str=""
    switch (type) {
        case 0:
            type_str="不上报"
            break
        case 1:
            type_str="仅有广播包"
            break
        case 2:
            type_str="含有响应包"
            break
        case 3:
            type_str="只有信号值"
            break
        case 5:
            type_str="昆仑工卡"
            break
    }
    return type_str;
}


</script>

<style scoped>
*{
    padding:0;
    margin:0;
}
.container1
{

    background:#ccc;

    display: flex;
    display: -webkit-flex; /* Safari */
}
.item1
{
    flex:1;
    margin-left: 5px;
    margin-top: 5px;
    margin-bottom: 5px;

}
</style>
