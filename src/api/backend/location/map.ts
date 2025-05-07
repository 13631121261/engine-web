

import { SVG, extend as SVGextend, Element as SVGElement, StrokeData } from '@svgdotjs/svg.js'
import $ from 'jquery'
import { Gateway } from '/@/api/backend/location/gateway'
import { ElNotification } from 'element-plus'
import moment from 'moment'
import { types } from 'sass'
import Color = types.Color
import { i18n } from '/@/lang/index'
export var scale = 20;
// var befor_scale = 0;//记录上一次缩放比例
var min_scale = 1;

var svg = "";
var bgpolys = []; //地图边缘点
var zoomin_number = 1;
var customercount = 0;

var isDrop = false; //移动状态的判断鼠标按下才能移动
var draw
var wurl = "CommonHttpService/";
var furl = "FlowmonitorHttpService/";
var durl = "data/";
var fact_p = {}; //长宽比例缩放
var buildingId = null;
var floorId = null;
var customertype = null;
var w;
var h;
var imgWidth = 10;
var GatewayMap=new Map()
var AreaMap=new Map()
var TagMap=new Map()
export function loadSVGData (data) {
    GatewayMap.clear()
    TagMap.clear()
    //外部容器的高度和宽度
    //console.log(scale);
    var div = $("#main");
    var height, width;
   // console.log(div);

    if (div.offsetWidth == undefined || div.offsetHeight == undefined || div.offsetWidth == 0 || div.offsetHeight == 0) {
        height = div.height();
        width = div.width();
        console.log("111实际宽高=" + height + "  " + width);
    } else {
        height = div.offsetHeight;
        width = div.offsetWidth;
        console.log("222实际宽高=" + height + "  " + width);
    }
    //  var height=document.getElementById("main");
    // var divc=document.getElementById("main");
    //  divc.height= window.innerHeight ;
    //  divc.width= window.innerWidth;
    console.log("实际宽高=" + height + "  " + width);
    //  var svgmap = "svg/"+buidlingId+"_"+floor+".svg";


    if (data == null) {
        return;
    }
    //console.log("原始数据1=" + data);
    data = data.replace(/\r|\n|\t/g, '');
    //console.log("原始数据2=" + data);
    var aa = data.split(/<svg.*?>/);
    var zw = /(width=)/;
    var zh = /(height=)/;
    var ww = data.split(zw);
    var hh = data.split(zh);
    //  var svg2=svg[1].split(exp);
    // exp=/(\d*\.?\d*)/;
    //console.log("原始数据4=" + ww[2]);
    w = ww[2].split(/(\d*\.?\d*)/)[1];
    h = hh[2].split(/(\d*\.?\d*)/)[1];
    console.log("宽==" + w + "  高=" + h);

    var svgbox = $("#main")[0];
    if (w / h > width / height) {
        scale = (width / w);
    } else {
        scale = (height / h);
    }
    console.log(div)
    svgbox.innerHTML=""
    console.log(svgbox)
    svgbox.innerHTML = "<svg id=\"svgmain\" style=\"width:" + width + "px;height:" + height + "px\" viewBox=\"0 0 " + width + " " + height + "\"><filter id=\"grayscale\"><feColorMatrix type=\"matrix\" values=\"0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0.3333 0.3333 0.3333 0 0 0 0 0 1 0\"/></filter><g id=\"svgPanel\"  >" + aa[1] + "</g></svg>";
    //svgbox.innerHTML="<svg id='svgmain' style='width:1920px;height:1080px'  viewBox='0 0  1920 1080'><g id='svgPanel' viewBox='-100 -100  1920 1080' >"+aa[1]+"</g></svg>";


    var t = (width - w * scale) / 2;
    var m = (height - h * scale) / 2;

    console.log("scale="+t+" m="+m);

    if (scale <= 0) {
        scale = 1;
    } else {
        var s = "translate(" + t + "," + m + ")  scale(" + scale + ")";
        //console.log(s);
        svgPanel.setAttribute("transform", s);
    }

    //小人大小
    console.log("imgWidth = "+imgWidth )
    console.log("scale = "+scale )
   // imgWidth = 40 / scale;
  //  imgWidth = w*0.00625
    console.log("imgWidth = "+imgWidth )


    /*   if ( imgWidth < 16) {
           imgWidth = 16;
       }
       if ( imgWidth > 46) {
           imgWidth = 46;
       }*/
    /*
                    if ( scale < 0.5) {
                        zoomin_number = 2*zoomin_number/scale;
                    }else {
                        zoomin_number = 40*zoomin_number/scale;
                    }*/

    //   imgWidth = imgWidth/zoomin_number;
    /*
                    svgPeopleGap = 10/scale;
                    imageHalf = imgWidth/(scale*2);
                    topgap = imgWidth/scale;
                    firstscale = scale;*/

    draw =  SVG('#svgPanel');
   // draw = SVG().addTo('svgPanel')
    // draw = SVG('svgPanel');
    //draw=document.getElementById("svgPanel")
    console.log("执行创建画布" + draw);

    mousemove();
    onmouse();

}

  function onmouse() {
    $('#svgmain').on('mousewheel DOMMouseScroll', function (e) {
        e.preventDefault();
        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) || // chrome & ie
            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
        scrollZoom(e, delta);
    });
}

//----------------------滚轮缩放------------------------
function scrollZoom(e, delta) {
    //e=e || window.event;
    delta > 0 ? zoom(e,1.05) : zoom(e,0.95);
}

function zoom(e,num) {
    // if(scale*num>min_scale){
    scale *= num;
    var svgPanel = document.getElementById("svgPanel");
    var str = svgPanel.getAttribute("transform");

    str = str.match(/translate\([^)]+\)/);
    if (scale > 100) {
        scale = 100;
    }else if(scale<0.1){
        scale=0.1
    }
   // console.log(str[0])
   // var s = (str ? str[0] : "") + " scale(" + scale + ")";
   // console.log(s)
  // var xy= str[0].replace('translate(','').replace(')','').split(",")
   // var x=0,y=0
   //x= (e.clientX - xy[0]) * (scale - 1)
   // y= (e.clientY - xy[1]) * (scale - 1)
    //console.log(x)
    //console.log(y)
 //   var b="translate("+e.offsetX+","+e.offsetY+")" + " scale(" + scale + ")";
   // var b="translate("+str[0]+")" + " scale(" + scale + ")";
    var b=str[0] + " scale(" + scale + ")";
    svgPanel.setAttribute("transform", b);

    // }
}


function zoom1(e,num) {
    // if(scale*num>min_scale){
    scale *= num;
    var svgPanel = document.getElementById("svgPanel");
    var str = svgPanel.getAttribute("transform");
    str = str.match(/translate\([^)]+\)/);
    if (scale > 100) {
        scale = 100;
    }else if(scale<0.5){
        scale=0.5
    }
  //  console.log(str[0])
    var s = (str ? str[0] : "") + " scale(" + scale + ")";
    // console.log(s)
    var xy= str[0].replace('translate(','').replace(')','').split(",")
    var x=xy[0],y=xy[1]
    if(num>1){
        xy[0]*=0.95
        xy[1]*=0.95
    }else{
        xy[0]*=1.05
        xy[1]*=1.05
    }
    let ratio = 1.1;
    // 缩小
    if (e.deltaY > 0) {
        ratio = 1 / 1.1;
    }
    // 限制缩放倍数
    const _scale = scale * ratio;

    // 目标元素是img说明鼠标在img上，以鼠标位置为缩放中心，否则默认以图片中心点为缩放中心

        const origin = {
            x: (ratio - 1) * w * 0.5,
            y: (ratio - 1) * h * 0.5
        };
        // 计算偏移量
        x -= (ratio - 1) * (e.clientX -x) - origin.x;
        y -= (ratio - 1) * (e.clientY -y) - origin.y;


    //   var b="translate("+e.offsetX+","+e.offsetY+")" + " scale(" + scale + ")";
    var b="translate("+x+","+y+")" + " scale(" + scale + ")";
    svgPanel.setAttribute("transform", b);

    // }
} //--------------------鼠标拖拽事件--------------------


var isMove = true;
//--------------------鼠标拖拽事件--------------------
export function mousemove() {
    $('#main').mousedown(

        function (event) {
        console.log("移动触发")
            if (isDrop) {
                return;
            }
            this.setCapture && this.setCapture();
            isMove = true;
            var abs_x = event.pageX - $('#svgPanel').offset().left;
            var abs_y = event.pageY - $('#svgPanel').offset().top;
            $('#main').mousemove(function (event1) {
                if (isMove) {
                   // console.log("移动触发11")
                    var svgPanel = document.getElementById("svgPanel");
                    var str = svgPanel.getAttribute("transform");
                    var idx = str.indexOf(",");
                    if (idx == -1) idx = str.indexOf(" ");
                    var t = str.substring(str.indexOf("(") + 1, idx);
                    var m = str.substring(idx + 1, str.indexOf(")"));
                    var leftgap = $('#svgPanel').offset().left - parseInt(t);
                    var topgap = $('#svgPanel').offset().top - parseInt(m);
                    var obj = $('#svgPanel');
                    var left = event1.pageX - abs_x;
                    var top = event1.pageY - abs_y;
                    var s = "translate(" + (Math.floor((event1.pageX - abs_x) * 100) / 100 - leftgap) + "," + (Math.floor((event1.pageY - abs_y) * 100) / 100 - topgap) + ") " + " scale(" + scale + ")";
                    svgPanel.setAttribute("transform", s);
                }
            })
            $('#main').mouseup(function () {
                //document.onmousemove = document.onmouseup = null;
                isMove = false;
                console.log('map2');
                return;
            });
        }
    );
}
//--------------------加载POI数据，SVG新增地名--------------------

export function addGateway(gateway:Gateway) {
    console.log("开始添加"+gateway.address)
    if (draw == null) {
        return;
    }
    console.log(draw)
    var group = draw.group().addClass('my-group2');
    console.log("宽高="+imgWidth);
    var image
    if(gateway.type==1){

        if(gateway.online==1){
            console.log("网关在线")
            image= group.image("/src/assets/gateway_online.png");
        }
        else{
            console.log("网关离线")
            image=group.image("/src/assets/gateway.png");
        }
    }
    else if(gateway.type==2){

        if(gateway.online==1){
            console.log("网关在线")
            image= group.image("/src/assets/gateway_online.png");
        }
        else{
            console.log("网关离线")
            image=group.image("/src/assets/gateway.png");
        }
    }
    image.size(imgWidth,imgWidth)

    group.move(gateway.x * gateway.proportion , gateway.y * gateway.proportion);
    console.log("666=="+gateway.x)
    console.log("666=="+gateway.y)
    console.log("666=="+ (imgWidth) / 2)
    console.log(gateway.address+"  X="+(gateway.x * gateway.proportion ))
    console.log("网关在线"+gateway.address+"  Y="+(gateway.y * gateway.proportion - (imgWidth) / 2))
    group.data("data", {
        value: gateway
    });
    group.click(function (e) {
        var data = this.data("data").value;
        console.log(data)
        var type
        var html
        if(data.online==1){
            type='success'
            html='<span>'+i18n.global.t('gateway_name')+'：'+data.name+"<br/>"+i18n.global.t('aoa_mac')+"：<span>"+data.address +"</span><br/>"+i18n.global.t('x')+":"+data.x+"<br/>"+i18n.global.t('y')+":"+data.y+"<br/>"+i18n.global.t('last time')+":"+dateFormat(data.last_time)
        }else{
            type='error'
            html='<span>'+i18n.global.t('gateway_name')+'：'+data.name+"<br/>"+i18n.global.t('aoa_mac')+"：<span>"+data.address +"</span><br/>"+i18n.global.t('x')+":"+data.x+"<br/>"+i18n.global.t('y')+":"+data.y+"<br/>"+i18n.global.t('last time')+":"+dateFormat(data.last_time)
        }
        ElNotification({
            message: html,
            type: type,
            duration:5000,
            dangerouslyUseHTMLString: true
        })
    })
    console.log("添加完成")
    GatewayMap.set(gateway.address,group)

}
function dateFormat(date) {

    if (date == undefined) {
        return "";
    }

    return moment(date*1000).format("YYYY-MM-DD HH:mm:ss");
}

export function updateGateway(gateway:Gateway) {
    // console.log("开始添加"+gateway.address)
    if (draw == null) {
        return;
    }
    var group = GatewayMap.get(gateway.address)
    if(group==null){
     return
    }
    group.data("data", {
        value: gateway
    });
    //console.log("保存数据")
    if(!gateway.show){
        group.hide()
        return
    }else{
        group.show()
    }
    var image

    if(gateway.online!=group.data().data.value.online){
        group.clear()
        if(gateway.online==1){
          //  console.log("网关在线")
            image= group.image("/src/assets/gateway_online.png")
            image.size(5,5);
            image.move(gateway.x * gateway.proportion - (imgWidth) / 2, gateway.y * gateway.proportion - (imgWidth) / 2);

        }
        else{
            // console.log("网关离线")
            image=group.image("/src/assets/gateway.png")
            image.size(5,5);
            image.move(gateway.x * gateway.proportion - (imgWidth) / 2, gateway.y * gateway.proportion - (imgWidth) / 2);
           // console.log("网关在线"+gateway.address+"  X="+gateway.x * gateway.proportion - (imgWidth) / 2)
           // console.log("网关在线"+gateway.address+"  Y="+gateway.y * gateway.proportion - (imgWidth) / 2)
        }
    }


}

export function addTag(tag:Tag) {
    // console.log("开始添加"+gateway.address)
   //
    if (draw == null) {
        return;
    }
    var group=TagMap.get(tag.address);

    if(group==null){
        group= draw.group().addClass('my-group3');

        var image= group.image("/src/assets/aoa_on.png");
        image.size(imgWidth,imgWidth)
        image.animate().move(tag.x * tag.proportion , (tag.y * tag.proportion  ));
        group.data("data", {
            value: tag
        });
        group.click(function (e) {
            var data = this.data("data").value;
            console.log(data)
            var html
            html='<span>'+i18n.global.t('tag_address')+":"+data.address+"<br/>"+i18n.global.t('x')+":"+data.x+"<br/>"+i18n.global.t('y')+":"+data.y+"<br/>"+i18n.global.t('last time')+":"+dateFormat(data.last_time)+"</span>"


            ElNotification({
                message: html,
                type: 'success',
                duration:3000,
                dangerouslyUseHTMLString: true
            })
        })
       // console.log("添加完成")

    }else{
        //console.log(device.show)
        if(tag.show==false){
            group.hide()
            return
        }else{
            group.show()
        }
        group.data("data", {
            value: tag
        });
        group.animate(1000).move(tag.x * tag.proportion, tag.y * tag.proportion)
    }
    TagMap.set(tag.address,group)

}
export function runGateway(address:string ) {
    var group = GatewayMap.get(address)
                console.log("执行动画")
                group.animate({
                    duration: 100,
                    delay: 10,
                    when: 'now',
                    swing: true,
                    times: 4,
                }).attr({ fill: '#f03' }).size(imgWidth*1.5, imgWidth*1.5)

}

export function runTag(address:string ) {
    var group = TagMap.get(address)
    console.log("执行动画")
    group.animate({
        duration: 100,
        delay: 10,
        when: 'now',
        swing: true,
        times: 4,
    }).attr({ fill: '#f03' }).size(imgWidth*1.5, imgWidth*1.5)

}

export function createPolylineS(points,id) {
    var polyLineId = document.getElementById(id);
    if (!polyLineId) {
        var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        var svgPanel = document.getElementById("svgPanel");
       // console.log("创建这项11" + svgPanel)
        polyline.setAttribute("id", id);
        polyline.setAttribute("points", points);
        polyline.setAttribute("style", "fill:none;stroke:red;stroke-width:" + 0.5);
        svgPanel.appendChild(polyline);
      //  console.log("创建这项*********" + points)
    }else{
        $(id).attr("points",points);
     //   console.log("创建这项222")
    }
}




var pointmarker=[]
var group
/*
export function createArea(points,name,x,y,dblclick,id,edit) {
    group=draw.group()
    var polygon = group.polygon(points)
    polygon.opacity(0.3)
    polygon.fill('#0aa')
    var text = group.text(name)
    text.move(x-10,y-5).font({ fill: '#000', family: 'Inconsolata' , size: 5})
    text.data("data", {
        name: name,
        id: id
    });

    polygon.data("data", {
        name: name,
        id:id,
        status:0
    });
   if(edit==1){
       var polyline=group.polyline(points);
       var data:StrokeData = {
       }
       data.color="#f00"
       data.width=0.3
       polyline.fill("none")
       polyline.stroke(data)

       polygon.dblclick( function(event){
           var pp=this
           var data = this.data("data");
           var status=data.status
           console.log("区域双击"+status)
           var pointArray=this.plot()
           if(status==0){
               status=1;
               console.log("点位="+pointArray.length)
               // pointArray.remove(pointArray.length-1)
               pointArray.splice(pointArray.length-1,1)
               for(var i=0;i<pointArray.length-1;i++){

                   if(i!=pointArray.length-1&&pointArray[i][0]==pointArray[i+1][0]&&pointArray[i][1]==pointArray[i+1][1]){
                       pointArray.splice(i,1)
                       // i--;
                   }
               }
               console.log("最后点位="+pointArray.length)

               if(pointmarker.length>0){
                   for(var i=0;i<pointArray.length;i++){
                       if(pointmarkerp[i]!=null){
                           pointmarker[i].remove()
                       }
                   }
                   pointmarker=[]
               }
               for(var i=0;i<pointArray.length;i++){
                   if(i!=pointArray.length-1&&pointArray[i][0]==pointArray[i+1][0]&&pointArray[i][1]==pointArray[i+1][1]){
                       continue
                   }
                   // console.log(pointArray[i][0])
                   var marker = draw.circle(2).fill('#0af').move(pointArray[i][0]-1,pointArray[i][1]-1)
                   marker.data("data", {
                       move:true,
                       index:i
                   });
                   pointmarker[i]=marker;
                   marker.mousedown(function(e){
                       var data = this.data("data");
                       this.data("data", {
                           move:true,
                           index:data.index
                       });

                       console.log("按下")

                       this.mousemove(function(e){
                           isMove=false;
                             console.log("标点移动")
                           data = this.data("data");
                           isMove=false;
                           if(data.move){
                               var moveIndex1 = p2m(e.offsetX, e.offsetY,0);
                               this.move(moveIndex1.x,moveIndex1.y)
                               pointArray[data.index][0]=moveIndex1.x+3
                               pointArray[data.index][1]=moveIndex1.y+3
                           //    console.log("index="+pointArray.toString()+pointArray[0])
                            //   polygon.remove()
                               polyline.remove()
                               polyline= group.polyline(pointArray.toString()+','+pointArray[0]);
                               var data:StrokeData = {
                               }
                               data.color="#f00"
                               data.width=0.3
                               polyline.fill("none")
                               polyline.stroke(data)
                               console.log("index="+pointArray.toString())
                              // pointArray.push(pointArray[0])
                               console.log("index="+pointArray.toString())
                               pp.plot(pointArray)
                            /!*   polygon=group.polygon(pointArray.toString()+','+pointArray[0])
                               polygon.opacity(0.3)
                               polygon.fill('#0aa')*!/
                           }

                       })
                       this.mouseup(function(e){
                           console.log("抬起")
                           //  is_markerMove=false
                           isMove=false;
                           this.data("data", {
                               move:false,
                               index:data.index
                           });
                       })
                       console.log(marker)
                   })
               }
               pointArray.push(pointArray[0])
           }else if(status==1){
               if(pointmarker.length>0){
                   for(var i=0;i<pointmarker.length;i++){
                       if( pointmarker[i]!=null){
                           pointmarker[i].remove()
                       }

                   }
                   pointmarker=[]

               }
               status=0;
               var points=[];
               for(var i=0;i<pointArray.length;i++){
                   points.push(new Point(pointArray[i][0],pointArray[i][1]));
               }
               dblclick(pointArray.toString(),points,points, svg,'edit',id,name);
           }
           data.status=data;
           this.data("data", {
               status:status,
               name: data.name,
               id:data.id,
            });

           //   marker = draw.circle(2).fill('#0af').move(moveIndex1.x,moveIndex1.y)
       })
   }
*/
var colors=["#3399ff","#33ffff","#33ff99","#97b651","#5500FF","#FF99CC"]
export function createArea(points,name,x,y,dblclick,id,edit) {
    console.log("创建"+id)
    group=draw.group()
    var polygon = group.polygon(points)
    polygon.opacity(0.5)
    var n=id%5


    polygon.fill(colors[n])
    var text = group.text(name)
    text.move(x-10,y-5).font({ fill: '#000', family: 'Inconsolata' , size: 2.5})
    text.data("data", {
        name: name,
        id: id
    });

    polygon.data("data", {
        name: name,
        id:id,
        status:0
    });
    if(edit==1){
        var polyline=group.polyline(points);
        var data:StrokeData = {
        }
        data.color="#f00"
        data.width=0.3
        polyline.fill("none")
        polyline.stroke(data)

        polygon.dblclick( function(event){
            var pp=this
            var data = this.data("data");
            var status=data.status
            console.log("区域双击"+status)
            var pointArray=this.plot()
            if(status==0){
                status=1;
                console.log("点位="+pointArray.length)
                // pointArray.remove(pointArray.length-1)
                pointArray.splice(pointArray.length-1,1)
                for(var i=0;i<pointArray.length-1;i++){

                    if(i!=pointArray.length-1&&pointArray[i][0]==pointArray[i+1][0]&&pointArray[i][1]==pointArray[i+1][1]){
                        pointArray.splice(i,1)
                        // i--;
                    }
                }
                console.log("最后点位="+pointArray.length)

                if(pointmarker.length>0){
                    for(var i=0;i<pointArray.length;i++){
                        if(pointmarkerp[i]!=null){
                            pointmarker[i].remove()
                        }
                    }
                    pointmarker=[]
                }
                for(var i=0;i<pointArray.length;i++){
                    if(i!=pointArray.length-1&&pointArray[i][0]==pointArray[i+1][0]&&pointArray[i][1]==pointArray[i+1][1]){
                        continue
                    }
                    // console.log(pointArray[i][0])
                    var marker = draw.circle(2).fill('#0af').move(pointArray[i][0]-1,pointArray[i][1]-1)
                    marker.data("data", {
                        move:true,
                        index:i
                    });
                    pointmarker[i]=marker;
                    marker.mousedown(function(e){
                        var m=this;
                        var data = this.data("data");
                        this.data("data", {
                            move:true,
                            index:data.index
                        });

                        console.log("按下")

                        draw.mousemove(function(e){
                            isMove=false;
                            console.log("标点移动")
                            data = m.data("data");
                            isMove=false;
                            if(data.move){
                                var moveIndex1 = p2m(e.offsetX, e.offsetY,0);
                                m.move(moveIndex1.x,moveIndex1.y)
                                pointArray[data.index][0]=moveIndex1.x+3
                                pointArray[data.index][1]=moveIndex1.y+3
                                //    console.log("index="+pointArray.toString()+pointArray[0])
                                //   polygon.remove()
                                polyline.remove()
                                polyline= group.polyline(pointArray.toString()+','+pointArray[0]);
                                var data:StrokeData = {
                                }
                                data.color="#f00"
                                data.width=0.3
                                polyline.fill("none")
                                polyline.stroke(data)
                                console.log("index="+pointArray.toString())
                                // pointArray.push(pointArray[0])
                                console.log("index="+pointArray.toString())
                                pp.plot(pointArray)
                                /*   polygon=group.polygon(pointArray.toString()+','+pointArray[0])
                                   polygon.opacity(0.3)
                                   polygon.fill('#0aa')*/
                            }

                        })
                        this.mouseup(function(e){
                            console.log("抬起")
                            //  is_markerMove=false
                            isMove=true;
                            this.data("data", {
                                move:false,
                                index:data.index
                            });
                            draw.mousemove(null)
                            mousemove()
                        })
                        console.log(marker)
                    })
                }
                pointArray.push(pointArray[0])
            }else if(status==1){
                if(pointmarker.length>0){
                    for(var i=0;i<pointmarker.length;i++){
                        if( pointmarker[i]!=null){
                            pointmarker[i].remove()
                        }

                    }
                    pointmarker=[]

                }
                status=0;
                var points=[];
                for(var i=0;i<pointArray.length;i++){
                    points.push(new Point(pointArray[i][0],pointArray[i][1]));
                }
                dblclick(pointArray.toString(),points,points, svg,'edit',id,name);
            }
            data.status=data;
            this.data("data", {
                status:status,
                name: data.name,
                id:data.id,
            });

            //   marker = draw.circle(2).fill('#0af').move(moveIndex1.x,moveIndex1.y)
        })
    }

// 为多边形的每个顶点添加拖动事件监听器

  /*  let vertices = polygon.nodes().map((node) => {
        return node.getAttribute('points');
    });
    console.log("获取到端点")
    console.log(vertices)
    vertices.forEach((vertex, index) => {
        console.log("遍历端点开始注册事件")
        let pointsArray = vertex.split(',');
        let x = parseFloat(pointsArray[0]);
        let y = parseFloat(pointsArray[1]);
        svg.circle(x, y, 5).attr({
            fill: '#003',
            stroke: 'none',
        }).drag(function(event) {
            console.log("开始拖拽")
            let newX = event.x;
            let newY = event.y;
            polygon.attr('points', vertices.map((vertex) => {
                return vertex.split(',').map((coord) => {
                    if (index === parseInt(coord.split(' ')[0])) {
                        return newX + ',' + newY;
                    } else {
                        return coord;
                    }
                }).join(' ');
            }).join(' '));
        }, true);
    });*/
}

var history_group;
var time_history_group
var lines=[]
var time_text
export function drawHistory(time,x1,y1,x2,y2,time_ms){
    if(history_group==null){
        history_group=draw.group()
    }
    console.log("X1="+x1)
    console.log("Y1="+y1)
    console.log("X2="+x2)
    console.log("Y2="+y2)
    // 定义直线的起始和结束坐标
    var startX = x1;
    var startY = y1;
    var endX = x2;
    var endY = y2;
    var line = draw.line(startX, startY, startY, endY)
    line.plot(startX, startY,startX, startY)
    line.mouseover(function(e){
        var moveIndex1 = p2m(e.offsetX, e.offsetY,0);
        time_history_group=draw.group()
        time_text = time_history_group.text(dateFormat(time/1000))
        time_text.font({ fill: '#000', family: 'Inconsolata' , size: 3}).move(moveIndex1.x,moveIndex1.y-10)


    })
    line.mouseout(function(e){
        time_text.remove()
        time_history_group.remove()
    })
    lines.push(line)
    line.stroke({ color: '#aFF', width: 0.3, linecap: 'round' })
    line.animate(time_ms, 'now').during(function(pos, morph, eased) {
        //  console.log("aaaa")
        // 在动画过程中更新直线的绘制位置
        // var x = startX + (endX - startX) * eased;
        //var y = startY + (endY - startY) * eased;
        var x = startX + (endX - startX) * pos;
        var y = startY + (endY - startY) * pos;

        //console.log(startX)
        this.plot(startX, startY, x, y);
        if(history_point_group==null){
            history_point_group=draw.group()

        }
        if(EndPoint==null){
            EndPoint=  history_point_group.image("/src/assets/point_end.png");
            EndPoint.size(5,5)

        }
        EndPoint.mouseover(null)
        EndPoint.mouseout(null)
        EndPoint.move(x-2.5,y-5)

        EndPoint.mouseover(function(e){
            var moveIndex1 = p2m(e.offsetX, e.offsetY,0);
            time_history_group=draw.group()
            time_text = time_history_group.text(dateFormat(time/1000))
            time_text.font({ fill: '#000', family: 'Inconsolata' , size: 3}).move(moveIndex1.x,moveIndex1.y-10)
        })
        EndPoint.mouseout(function(e){
            time_text.remove()
            time_history_group.remove()
        })
    });
    // 开始动画
  //  animation.schedule(1000,"now");
}
export function clearHistory(){

    EndPoint=null;
    StartPoint=null
    history_group=null
    history_point_group=null
    time_history_group=null
    console.log(history_point_group)
}

export function drawHistoryFash(time,x1,y1,x2,y2,index){
    if(history_group==null){
        history_group=draw.group()
    }
    if(history_point_group==null){
        history_point_group=draw.group()

    }
    if(EndPoint==null){
        EndPoint=  history_point_group.image("/src/assets/point_end.png");
        EndPoint.size(5,5)

    }
    EndPoint.mouseover(null)
    EndPoint.mouseout(null)
    EndPoint.move(x1-2.5,y1-5)

    EndPoint.mouseover(function(e){
        var moveIndex1 = p2m(e.offsetX, e.offsetY,0);
        time_history_group=draw.group()
        time_text = time_history_group.text(dateFormat(time/1000))
        time_text.font({ fill: '#000', family: 'Inconsolata' , size: 3}).move(moveIndex1.x,moveIndex1.y-10)
    })
    EndPoint.mouseout(function(e){
        time_text.remove()
        time_history_group.remove()
    })
   // console.log("lll="+lines.length)
    if(lines.length>index){
        var len=lines.length-index
        for(var i=0;i<len;i++){
            lines[index+i].remove()
        }
        lines.splice(index,len)
    //    console.log("ppp="+lines.length+"  len="+len)
    }
   else if(lines.length==index){
       // console.log("kkk="+index)
        return
    }else{
        // 定义直线的起始和结束坐标
        var startX = x1;
        var startY = y1;
        var endX = x2;
        var endY = y2;
        var line = draw.line(startX, startY, endX, endY)
        line.mouseover(function(e){
            var moveIndex1 = p2m(e.offsetX, e.offsetY,0);
            time_history_group=draw.group()
            time_text = time_history_group.text(dateFormat(time/1000))

            time_text.font({ fill: '#000', family: 'Inconsolata' , size: 3}).move(moveIndex1.x,moveIndex1.y-10)


        })
        line.mouseout(function(e){
            time_text.remove()
            time_history_group.remove()
        })
        // line.plot(startX, startY,endX, endY)
        lines.push(line)
        line.stroke({ color: '#aFF', width: 0.3, linecap: 'round' })

    }


    // 开始动画
    //  animation.schedule(1000,"now");
}

var history_point_group
var StartPoint
var EndPoint
export function drawHistoryStartPoint(time,x1,y1){
    if(history_point_group==null){
        history_point_group=draw.group()
    }
    console.log("花店")
    StartPoint=  history_point_group.image("/src/assets/point_start.png");
    StartPoint.move(x1-2.5,y1-5)
    StartPoint.size(5,5)
    StartPoint.mouseover(function(e){
        var moveIndex1 = p2m(e.offsetX, e.offsetY,0);
        time_history_group=draw.group()
        time_text = time_history_group.text(dateFormat(time/1000))
        time_text.font({ fill: '#000', family: 'Inconsolata' , size: 3}).move(moveIndex1.x,moveIndex1.y-10)
    })
    StartPoint.mouseout(function(e){
        time_text.remove()
        time_history_group.remove()
    })
}
export function drawHistoryEndPoint(time,x1,y1){
    if(history_point_group==null){
        history_point_group=draw.group()

    }
    if(EndPoint==null){
        EndPoint=  history_point_group.image("/src/assets/point_end.png");
        EndPoint.size(5,5)
    }

    EndPoint.move(x1,y1-5)
    EndPoint.mouseover(function(e){
        var moveIndex1 = p2m(e.offsetX, e.offsetY,0);
        time_history_group=draw.group()
        time_text = time_history_group.text(dateFormat(time/1000))
        time_text.font({ fill: '#000', family: 'Inconsolata' , size: 3}).move(moveIndex1.x,moveIndex1.y-10)
    })
    EndPoint.mouseout(function(e){
        time_text.remove()
        time_history_group.remove()
    })
}

export function createAreaByFence(points,name,x,y,click,id) {
    group=draw.group()
    var polygon = group.polygon(points)
    polygon.opacity(0.3)
    polygon.fill('#0aa')
    var text = group.text(name)
    text.move(x-10,y-5).font({ fill: '#000', family: 'Inconsolata' , size: 2.5})
    text.data("data", {
        name: name,
        id: id
    });
    polygon.data("data", {
        name: name,
        id:id,
    //    polygon:polygon
    });

    group.click(function(e){
        AreaMap.forEach((key,val)=>{
            //   console.log(key.data("data").value.online)
            key.fill('#0aa')

        })
        click(polygon.data("data").id,polygon.data("data").name)
        polygon.fill('#a00')
    })
    AreaMap.set(id,polygon);
}

//不可编辑选中区域
export function createAreaByFence1(points,name,x,y,id,id1) {
    group=draw.group()
    var polygon = group.polygon(points)
    if(id==id1){
        polygon.fill('#a00')
    }else{
        polygon.fill('#0aa')
    }
    polygon.opacity(0.3)

    var text = group.text(name)
    text.move(x-10,y-5).font({ fill: '#000', family: 'Inconsolata' , size: 2.5})



}
//-----------------SVG新增人物-----------------
function createPerson(root, name, attrs) {
    var doc = root.ownerDocument,
        svg = root.ownerSVGElement || root;
    var el = doc.createElementNS("http://www.w3.org/2000/svg", name);

    for (var attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
            var parts = attr.split(':');
            if (parts[1]) {
                el.setAttributeNS("http://www.w3.org/1999/xlink", "xlink:href", attrs[attr]);
            } else {
                if (attr == "tlText") {
                    el.appendChild(document.createTextNode(attrs[attr]));
                } else {
                    el.setAttributeNS(null, attr, attrs[attr]);
                }
            }
        }
    }
    root.appendChild(el);
}



function p2m(px, py,ie) {
    var $building = $("li.building-on"),trX = 0,trY = 0,translate = "",scale = "",str="";
    var svgPanel = document.getElementById("svgPanel");
    var transform = svgPanel.getAttribute("transform");
    if(transform.indexOf(",")<0){
        var strReplace= transform.split(' ');
        transform = strReplace[0]+","+strReplace[1]+" "+strReplace[2];
    }
    str= transform.split(' ');
    translate=str[0].substring(10,(str[0].length-1)).split(',');
    if(str.length == 3){
        scale = parseFloat(str[2].substring(6,str[2].length-1));
    }else if(str.length == 2){
        scale = parseFloat(str[1].substring(6,str[1].length-1));
    }
    trX = parseFloat(translate[0]);
    trY = parseFloat(translate[1]);
    if(ie == 1){
        //   console.log("trX/scale :",(trX/scale).toFixed(2));
        // console.log("trY/scale :",(trY/scale).toFixed(2));
        return new Point((px/scale).toFixed(2), (py/scale).toFixed(2));
    }else{
        return new Point(((px-trX)/scale).toFixed(2), ((py-trY)/scale).toFixed(2));
    }
}
function Point (x, y) {
    this.x = x;
    this.y = y;
}
//-----------------计算SVG各模块中心点-----------------
