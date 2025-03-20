<template>
    <div style='margin-top: 10px'>
    <div style='background-color: white;box-shadow: var(--el-box-shadow-dark);width: 98%;height: 98%; position : absolute;margin-left: 1%;margin-bottom: 10px' >

        <div style='margin-left: 20px;' >
        <el-collapse  v-model="activeNames" >
            <el-collapse-item name="1" >
                <template #title>
                     <el-text >MQTT  Broker </el-text>
                            <el-text style='margin-left: 10px' type="primary" >Host:</el-text>
                            <el-input v-model="system_config.value.host" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                            <el-text style='margin-left: 10px' type="primary"  >Port:</el-text>
                            <el-input v-model="system_config.value.port" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                            <el-text style='margin-left: 10px' type="primary" >Subscription Topic:</el-text>
                            <el-input v-model="system_config.value.sub" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                            <el-text style='margin-left: 10px' type="primary"  >Publish Topic:</el-text>
                            <el-input v-model="system_config.value.pub" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                            <el-button type="primary" style='margin-left: 10px' @click='setConfig'>设置</el-button>
                    <div  style='margin-left: 10px'>  <el-tag  v-if='system_config.value.mqtt_status' type="success">Connect Success</el-tag>
                        <el-tag  v-else type="danger">Connect Fail</el-tag>

                    </div>

                </template >
                <div style='margin-left: 30px'>
                    <br/>
                    设置平台的目标MQTT地址以及相关订阅参数，如果你需要设置更详细的信息，请在这里设置。
                    <br/>
                    <br/>
                    <el-text type="primary" >User:</el-text>
                    <el-input v-model="system_config.value.user" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                    <el-text style='margin-left: 10px' type="primary"  >Password:</el-text>
                    <el-input v-model="system_config.value.password" @click='stopCollapse' style="width: 180px" placeholder="Please input" />

                    <el-text style='margin-left: 10px' type="primary"  >QoS:</el-text>
                    <el-select
                        v-model="system_config.value.qos"
                        placeholder="0"
                        size="large"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="item in qos"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <el-button type="primary" @click='setConfig' style='margin-left: 10px'>设置</el-button>
                </div>
            </el-collapse-item>

            <el-collapse-item name="2">
                <template #title>


                            <el-text >数据推送</el-text>
                            <el-switch  style='margin-left: 10px'
                                class="ml-2"
                                        :active-value="1"
                                        :inactive-value="0"
                                @click='stopCollapse'
                                        @change='relay_change'
                                v-model="system_config.value.relay_status"
                            />
                    <el-select

                        v-model="system_config.value.relay_type"
                        placeholder="0"
                        size="large"
                        style="width: 100px;margin-left: 10px"
                    >
                        <el-option
                            v-for="item in put_type"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    <div v-if="system_config.value.relay_type==0">
                        <el-text
                                  style='margin-left: 10px' type="primary" >UDP Host:</el-text>
                        <el-input v-model="system_config.value.udp" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                        <el-text style='margin-left: 10px' type="primary"  >Port:</el-text>
                        <el-input v-model="system_config.value.r_port" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                    </div>
                    <div v-if="system_config.value.relay_type==1">
                        <el-text
                            style='margin-left: 10px' type="primary" >MQTT Host:</el-text>
                        <el-input v-model="system_config.value.r_host" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                        <el-text style='margin-left: 10px' type="primary"  >Port:</el-text>
                        <el-input v-model="system_config.value.r_port" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                        <el-text style='margin-left: 10px' type="primary"  >Subscription Topic:</el-text>
                        <el-input v-model="system_config.value.r_pub" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                    </div>
                            <el-button type="primary"  style='margin-left: 10px' @click='setConfig'>设置</el-button>

                </template >
                <div>
                    <br/>
                    <div v-if='system_config.value.relay_type==1'>

                    <el-text type="primary" >User:</el-text>
                    <el-input v-model="system_config.value.r_user" @click='stopCollapse' style="width: 180px" placeholder="Please input" />
                    <el-text style='margin-left: 10px' type="primary"  >Password:</el-text>
                    <el-input v-model="system_config.value.r_password" @click='stopCollapse' style="width: 180px" placeholder="Please input" />

                    <el-text style='margin-left: 10px' type="primary"  >QoS:</el-text>
                    <el-select
                        v-model="system_config.value.r_qos"
                        placeholder="0"
                        size="large"
                        style="width: 240px"
                    >
                        <el-option
                            v-for="item in qos"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                    </div>
                    <br/>
                    <br/> <br/>

                    关于网关以及信标，手环的信息进行推送。包括全部设备上线离线；位置信息；信标运动状态；信标/手环报警；电量信息等。
                </div>
                <br/>
                <div>


                </div>
            </el-collapse-item>
            <el-collapse-item title="Efficiency" name="13">
                <template #title>


                    <el-text >离线检测</el-text>
                    <el-slider       style="width: 500px;margin-left: 30px"    @click='stopCollapse' v-model="system_config.value.line_time" :step="1" :max="10"  :min="1" show-stops :format-tooltip="formatTooltip"  />
                    <el-button type="primary"  style='margin-left: 30px' @click='setConfig'>设置</el-button>
                </template>
                <div>
              此时间值，用于判断设备离线，应用于系统内全部硬件产品。比如网关、信标。如果系统检测到设备没有数据更新，持续时间超过此设置时间，则判断为离线状态。
                </div>

            </el-collapse-item>
            <el-collapse-item title="Efficiency" name="15">
                <template #title>


                    <el-text >定位参数</el-text>

                    <el-text style='margin-left: 10px'>一米信号值</el-text>
                    <el-select v-model="a_rssi" @click='stopCollapse'        size="large"
                            style="width: 140px;margin-left: 5px">
                        <el-option v-for="option in options" :value="option.value" :key="option.label">
                            {{ option.label }}
                        </el-option>
                    </el-select>
                    <el-text style='margin-left: 10px'>环境因子</el-text>

                    <el-input v-model="N" style="width: 200px;margin-left: 5px" placeholder="Please input" @click='stopCollapse' />
                    <el-text style='margin-left: 10px'>基站高度</el-text>

                    <el-input v-model="z" style="width: 200px;margin-left: 5px" placeholder="Please input" @click='stopCollapse' />
                    <el-text style='margin-left: 10px'>限制范围算法</el-text>

                    <el-switch style='margin-left: 5px' v-model="used" @click='stopCollapse' />


                    <el-button type="primary"  style='margin-left: 30px' @click='setConfig_other'>设置</el-button>
                </template>
                <div>
                  设置定位网关的高度值，以及对应的定位设备在距离网关1米范围的信号强度，以及环境因子值：N。设置一次网关高度，就会把全部网关的高度重置为当前设置值。
                </div>

            </el-collapse-item>




            <el-collapse-item title="Efficiency" name="16">
                <template #title>
                    <el-text>固件下载地址</el-text>
                    <el-input v-model="download_host" style="width: 300px;margin-left: 5px" placeholder="Please input" @click='stopCollapse' />
                    <el-button type="primary"  style='margin-left: 30px' @click='setdownloadHost'>设置</el-button>
                </template>
                <div>
                    设置关于本机服务器的一个可供给网关访问的下载地址，因为本机服务器可能涉及的IP较多，不能自主获取，目前只好通过手动设置的方式来进行设置。
                </div>

            </el-collapse-item>
        </el-collapse>

        </div>
    </div>
<!--    <div style='box-shadow: var(&#45;&#45;el-box-shadow-dark);width: 48.5%;height: 98%; position : absolute;margin-left: 50.5%;margin-bottom: 10px' >

    </div>-->
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { configGet, configSet, getSystemConfig, setDownloadUrl, setSystemConfig } from '/@/api/backend/system'


import { ElNotification } from 'element-plus'

const { t } = useI18n()
const activeNames = ref(['0'])
const host = ref('emqx')

const port = ref(1883)

const offline_time = ref(3)
const subTopic = ref('GwData')
const pubTopic = ref('SrvData')
const handleChange = (val: string[]) => {
    console.log(val)
}
const relay_change=(val: boolean | string | number) => {
    console.log(val)
    if(!val){
        system_config.value.low_p=0
        system_config.value.tag_l=0
        system_config.value.person_l=0
        system_config.value.device_l=0
        system_config.value.detach=0
        system_config.value.move=0
        system_config.value.offline=0
        system_config.value.online=0
        system_config.value.fence=0
    }
}
function stopCollapse(e){

    return e.stopPropagation()
}
/*const udp_value = ref(true)
const qos_value = ref('')
const put_value = ref(0)*/
const N=ref(0.0);
const download_host=ref('不建议设置');
const a_rssi =ref(-40)
const z=ref(0)
const used=ref(false)
const qos = [
    {
        value: '0',
        label: '0',
    },
    {
        value: '1',
        label: '1',
    },
    {
        value: '2',
        label: '2',
    }

]
const put_type = [
    {
        value: 0,
        label: 'udp',
    },
    {
        value: 1,
        label: 'mqtt',
    }

]

const system_config =reactive({
value: {
    id: 0,
    udp:"",
    name: "",
    createtime: 0,
    userkey: "",
    host: "",
    port: "",
    sub: "",
    user: "",
    pub: "",
    password: "",
    qos: 0,
    relay_type: 0,
    r_host: "",
    r_port: 1883,
    r_sub: "",
    r_pub: "",
    r_user: "",
    r_qos: 0,
    r_password: "",
    relay_status: 0,
    person_l: 0,
    device_l: 0,
    tag_l: 0,
    online: 0,
    offline: 0,
    fence: 0,
    low_p: 0,
    detach: 0,
    move: 0,
    line_time: 3,
    mqtt_status:false,

}
})

onMounted(()=>{
    getSystemConfig().then((res)=>{

      if(res.code==1){
          system_config.value={
              id:res.data.id,
              udp:res.data.udp,
              name:"",
              createtime:res.data.createtime,
              userkey:res.data.userkey,
              host:res.data.host,
              port:res.data.port,
              sub:res.data.sub,
              user:res.data.user,
              pub:res.data.pub,
              password:res.data.password,
              qos:res.data.qos,
              relay_type:res.data.relay_type,
              r_host:res.data.r_host,
              r_port:res.data.r_port,
              r_sub:res.data.r_sub,
              r_pub:res.data.r_pub,
              r_user:res.data.r_user,
              r_password:res.data.r_password,
              r_qos:res.data.r_qos,
              relay_status:res.data.relay_status,
              person_l:res.data.person_l,
              device_l:res.data.device_l,
              tag_l:res.data.tag_l,
              online:res.data.online,
              offline:res.data.offline,
              fence:res.data.fence,
              low_p:res.data.low_p,
              detach:res.data.detach,
              move:res.data.move,
              line_time:res.data.line_time,
              mqtt_status:res.mqtt_status
          }
console.log(system_config)
      }
    })
    configGet().then((res)=>{
        console.log(res)
        if(res.code==1){
            a_rssi.value=res.data.arssi
            z.value=res.data.z
            N.value=res.data.n
            if(res.data.used==0){
                used.value=false
            }else{
                used.value=true
            }
        }
    })
})
const formatTooltip = (val: number) => {
    return val+"分钟"
}
const setConfig = (e) => {

    setSystemConfig(system_config.value).then((res)=>{
        if(res.code==1){
            ElNotification({
                title: t('ok'),
                message: res.msg,
                position: 'bottom-right',
                type: 'success',
                duration:1000,
                dangerouslyUseHTMLString: true
            })
        }
        else{
            ElNotification({
                title: t('fail'),
                message: res.msg,
                position: 'bottom-right',
                type: 'error',
                duration:1000,
                dangerouslyUseHTMLString: true
            })
        }

    })
    return e.stopPropagation()

}


const setdownloadHost = (e) => {
    if(download_host.value.startsWith("http://")){
        setDownloadUrl(download_host.value).then((res)=>{
            if(res.code==1){
                ElNotification({
                    title: t('ok'),
                    message: res.msg,
                    position: 'bottom-right',
                    type: 'success',
                    duration:1000,
                    dangerouslyUseHTMLString: true
                })
            }
            else{
                ElNotification({
                    title: t('fail'),
                    message: res.msg,
                    position: 'bottom-right',
                    type: 'error',
                    duration:1000,
                    dangerouslyUseHTMLString: true
                })
            }

        })
    }else{
        ElNotification({
            title: t('fail'),
            message: '地址错误',
            position: 'bottom-right',
            type: 'error',
            duration:1000,
            dangerouslyUseHTMLString: true
        })
    }

    return e.stopPropagation()

}

const setConfig_other = (e) => {
    var u=0;
if(used.value){
    u=1
}else{
    u=0;
}
    configSet(a_rssi.value,N.value,u,z.value).then((res)=>{
        if(res.code==1){
            ElNotification({
                title: t('ok'),
                message: res.msg,
                position: 'bottom-right',
                type: 'success',
                duration:1000,
                dangerouslyUseHTMLString: true
            })
        }
        else{
            ElNotification({
                title: t('fail'),
                message: res.msg,
                position: 'bottom-right',
                type: 'error',
                duration:1000,
                dangerouslyUseHTMLString: true
            })
        }

    })
    return e.stopPropagation()

}
const options= [
    {
        value: '-31',
        label: '-31',
    },
    {
        value: '-32',
        label: '-32',
    },
    {
        value: '-33',
        label: '-33',
    },
    {
        value: '-34',
        label: '-34',
    },
    {
        value: '-35',
        label: '-35',
    },
    {
        value: '-36',
        label: '-36',
    },
    {
        value: '-37',
        label: '-37',
    },  {
        value: '-38',
        label: '-38',
    },  {
        value: '-39',
        label: '-39',
    },  {
        value: '-40',
        label: '-40',
    },
    {
        value: '-41',
        label: '-41',
    },  {
        value: '-42',
        label: '-42',
    },
    {
        value: '-43',
        label: '-43',
    },
    {
        value: '-44',
        label: '-44',
    },
    {
        value: '-45',
        label: '-45',
    },
]
</script>

<style>
/* 直接修改类名来覆盖默认样式 */
.el-collapse-item__header {
    height: 50px; /* 修改为你想要的高度 */
    line-height: 50px; /* 行高与高度相同 */
}

.container {
    width: 98%;
    position: absolute;

}

.left-content {
    float: left; /* 靠左浮动 */
}

.right-content {
    float: right; /* 靠右浮动 */
}
</style>
