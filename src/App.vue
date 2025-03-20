<template>
    <el-config-provider :locale="lang">
        <router-view></router-view>
    </el-config-provider>
</template>
<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import iconfontInit from '/@/utils/iconfont'
import { useRoute } from 'vue-router'
import { setTitleFromRoute } from '/@/utils/common'
import { useConfig } from '/@/stores/config'
import { useTerminal } from '/@/stores/terminal'
import { useAdminInfo } from '/@/stores/adminInfo'
import { ElNotification } from 'element-plus'
// modules import mark, Please do not remove.
const { t } = useI18n()
const config = useConfig()
const route = useRoute()
const terminal = useTerminal()

// 初始化 element 的语言包
const { getLocaleMessage } = useI18n()
const lang = getLocaleMessage(config.lang.defaultLang) as any
var l=0;
onMounted(() => {
    iconfontInit()
    //terminal.init()
   var ip= window.location.host
     ip=ip.replaceAll("http://","")
    console.log("IP="+ip)
     ip=ip.replaceAll(":706","")
    console.log("IP="+ip)
     ip=ip.replaceAll(":71","")
    ip=ip.replaceAll(":81","")
     ip=ip.replaceAll(":701","")
    console.log("IP="+ip)
    ip='ws://'+ip+':7088'
    console.log("IP="+ip)
    var ws = new WebSocket(ip);
   console.log("尝试连接"+ws)

    // 2. ws.send()给服务器发送信息
   /* let submitCode = JSON.stringify({
        userId: id,
        problemId: props.problemId,
        isDebug: "0",
        lang: lang.value,
        code: code.value,
        info: "",
    });
*/
    ws.onopen = function(evt) {
        console.log("Connection open ...2222");
        ws.send(useAdminInfo().getProject_Key());
    };
  //  ws.send("submitCode");
    // 3.服务器每次返回信息都会执行一次onmessage方法
    ws.onmessage = function (e) {
        console.log("服务器返回的信息: " + e.data)
        var json = eval('(' + e.data + ')')
       // console.log("服务器返回的信息: " + json.toString())
        if(json.type=='device_sos'){
            if(json.device.sos==1){
                device_sos_Notify('<span>'+t('device_code_name')+':'+json.device.name+"<br/>"+t('code_sn')+":<span>"+json.device.sn +"</span><br/>"+t('key_sos_txt')+"</span>",json.device.sos)
            }else{
                device_sos_Notify('<span>'+t('device_code_name')+':'+json.device.name+"<br/>"+t('code_sn')+":<span>"+json.device.sn +"</span><br/>"+t('key_on_txt')+"</span>",json.device.sos)

            }

        }
        else if(json.type=='device_line'){

            if(json.device.online==1){
                device_line_Notify('<span>'+t('device_code_name')+':'+json.device.name+"<br/>"+t('code_sn')+":<el-tag>"+json.device.sn +"</el-tag><br/>"+t('sos_online')+"</span>",json.device.online)

            }
            else{
                device_line_Notify('<span>'+t('device_code_name')+':'+json.device.name+"<br/>"+t('code_sn')+":<el-tag>"+json.device.sn +"</el-tag><br/>"+t('unline1')+"</span>",json.device.online)
            }
        }
        else if(json.type=='device_area_sos'){
            device_line_Notify('<span>'+t('device_code_name')+':'+json.device.name+"<br/>"+t('code_sn')+"：<el-tag>"+json.device.sn +"</el-tag><br/>"+t('area_on_txt')+"</span>",json.device.online)
        }
        else if(json.type=='fence_person'){
            pence_person_Notify('<span>'+t('person_name')+'：'+json.data.name+"<br/>"+t('idcard')+"：<el-tag>"+json.data.idcard +"</el-tag><br/>"+t('fence_sos')+"</span>")

        }
        else if(json.type=='fence_devicep'){
            pence_person_Notify('<span>'+t('device_code_name')+'：'+json.data.name+"<br/>"+t('code_sn')+"：<el-tag>"+json.data.sn +"</el-tag><br/>"+t('fence_sos')+"</span>")


        }
    };
})


// 监听路由变化时更新浏览器标题
watch(
    () => route.path,
    () => {
        setTitleFromRoute()
    }
)
const device_sos_Notify = (data:string,status:number) => {
    if(status==1){
        ElNotification({
            title: t('device_sos_title'),
            message: data,
            position: 'bottom-right',
            type: 'error',
            duration:15000,
            dangerouslyUseHTMLString: true
        })
    }else{
        ElNotification({
            title: t('device_sos_title'),
            message: data,
            position: 'bottom-right',
            type: 'success',
            duration:15000,
            dangerouslyUseHTMLString: true
    })
    }

}
const device_line_Notify = (data:string,status:number) => {
    console.log(data)
  //  console.log("状态="+status)
    if(status==1){
        ElNotification({
            title: t('device_line_title'),
            message: data,
            position: 'bottom-right',
            type: 'success',
            duration:30000,
            dangerouslyUseHTMLString: true
        })
    }else{


    ElNotification({
        title: t('device_line_title'),
        message: data,
        position: 'bottom-right',
        type: 'error',
        duration:30000,
        dangerouslyUseHTMLString: true
    })
    }
}

const pence_person_Notify = (data:string) => {




        ElNotification({
            title: t('fence_sos'),
            message: data,
            position: 'bottom-right',
            type: 'error',
            duration:5000,
            dangerouslyUseHTMLString: true
        })

}
</script>
