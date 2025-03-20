
import  {SVG} from '@svgdotjs/svg.js'
import { mousemove, poiArr } from '/@/api/backend/location/map.ts'
import $ from 'jquery'
 var scale = 20;
var draw
 let dblFlag = false;
 var mouseMoveFlag = true;
  var traces = [];
var poiArr = [];
var polygonS = [];
var tracesS = [];
var poiArrS = [];
 var myCallBackListener
var xx=0
var yy=0
let start=false
var marker
export function startDraw(){
    start=true
}
export function stopDraw(){
    start=false
}
export function drawAgain(){
    traces=[];
    dblFlag = false;
    mouseMoveFlag = true;
}
export function init(callback: (data,points,point,svg,type,id,name) => void,svg:string){
    draw =  SVG('#svgPanel');
    myCallBackListener=callback;
     traces=[];
     dblFlag = false;
     mouseMoveFlag = true;
    var ie = 0;
    //console.log("mouseMoveFlag:"+mouseMoveFlag);
    mousemove();
    if(isIE()){
        ie = 1
    }
    $("#svgPanel").on("click", function(e) {

      if(!start){
          return
      }
        if (dblFlag) {
            dblFlag = false;
            return;
        }
        //console.log("mouseMoveFlag:"+mouseMoveFlag);
        if (!mouseMoveFlag) return;

        if(xx==e.offsetX&&yy==e.offsetY){
            return
        }
        else{
            xx=e.offsetX
            yy=e.offsetY
            traces.push(p2m(e.offsetX, e.offsetY,ie));
        }

        if (traces.length > 0) {
            var str = "" ;
            for(var i = 0 ; i<traces.length ; i++){
                str = str + traces[i].x + ","+ traces[i].y+" ";
            }
            console.log("折线="+str)
            createPolyline(str,tracesS.length);

        }

    }).on("mousemove", function(e) {
        if(start){
          //  console.log("位置="+e.offsetX)
            var moveIndex1 = p2m(e.offsetX, e.offsetY,ie);
            if(marker){
                marker.remove()
            }
             marker = draw.circle(2).fill('#0af').move(moveIndex1.x,moveIndex1.y)
         //   marker.remove()
        }







        if (traces.length > 0 && mouseMoveFlag && !dblFlag) {

            /*helperCtx.clearRect(0, 0, canvasWidth, canvasHeight);

            var lastPoint = m2p(traces[traces.length - 1]);
            helperCtx.beginPath();
            helperCtx.moveTo(lastPoint.x, lastPoint.y);
            helperCtx.lineTo(e.offsetX, e.offsetY);
            helperCtx.stroke();
            helperCtx.closePath();*/
            var str = "" ;
            for(var i = 0 ; i<traces.length ; i++){
                str = str + traces[i].x + ","+ traces[i].y+" ";
            }
            var moveIndex = p2m(e.offsetX, e.offsetY,ie);
            str = str +moveIndex.x + "," +moveIndex.y;
            createPolyline(str,tracesS.length);
        }

    }).on("dblclick", function(e) {
        if(!start){
            return
        }
        if (traces.length > 3) {
            console.log(dblFlag)
            dblFlag= true;
            var firstPoint = traces[0];
            /* var lastPoint = m2p(traces[traces.length - 1]);
             ctx.beginPath();
             ctx.moveTo(lastPoint.x, lastPoint.y);
             ctx.lineTo(firstPoint.x, firstPoint.y);
             ctx.stroke();
             ctx.closePath();*/
            var str = "" ;
            for(var i = 0 ; i<traces.length ; i++){
                str = str + traces[i].x + ","+ traces[i].y+" ";
            }
            str = str+traces[0].x + ","+ traces[0].y;
            traces.push({
                x:traces[0].x,
                y:traces[0].y
            });
            createPolyline(str,tracesS.length);
            var polygon = draw.polygon(str)
            polygon.opacity(0.2)
            polygon.fill('#0aa')
            polygonS.push(polygon)
            mouseMoveFlag = false;
            if(marker){
                marker.remove()
            }
            tracesS.push(traces)
            callback(str,tracesS,traces, svg,'add',0,"");


        }

    });
}
function Point (x, y) {
    this.x = x;
    this.y = y;
}

Point.prototype.toString = function () {
    if (this == null) return "null";
    return '{"x": '+ this.x +', "y": '+ this.y + '}';
};

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
//-------创建过程中  创建折线-------
export function createPolyline(points,id) {

    var polyLineId = document.getElementById("polyline"+id);
    if(!polyLineId){

        var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        var svgPanel = document.getElementById("svgPanel");
      //  console.log("创建这项11")
        polyline.setAttribute("id","polyline"+id);
        polyline.setAttribute("points",points);
        polyline.setAttribute("style","fill:none;stroke:red;stroke-width:"+0.5);
        svgPanel.appendChild(polyline);
      //  console.log("创建这项*********"+points)
    }else{
        var polylineid = 'polyline' + id;
        $("#" + polylineid + "").attr("points",points);

    }

    //console.log("points:"+points);
}
//-------手动根据后台数据加载创建折线-------
export function createPolylineS(points) {
  /*  draw=SVG('#svgPanel')
    var polyline=draw.polyline(points).fill('none').stroke({ width: 1 })
    polyline.stroke({ color: '#f06', width: 4, linecap: 'round', linejoin: 'round' })*/


     dblFlag = true;
     mouseMoveFlag = false;
     var point=points.split(" ");
     for(var i=0;i<point.length;i++){
         var ts=point[i].split(",")
         traces.push(new Point(ts[0],ts[1]));

     }

    var polyLineId = document.getElementById("polyline");
    if(!polyLineId){
        var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
        var svgPanel = document.getElementById("svgPanel");
      //  console.log("创建这项11"+svgPanel)
        polyline.setAttribute("id","polyline");
        polyline.setAttribute("points",points);
        polyline.setAttribute("style","fill:none;stroke:red;stroke-width:"+0.5);
        svgPanel.appendChild(polyline);
        //console.log("创建这项*********"+points)
    }
   // $("#polyline").attr("points",points);
   // console.log("points:"+points);
}
export  function clearPolyline() {
    var i=0;
    tracesS.forEach(function(element) {
        var polylineid = 'polyline' + i;
        $("#" + polylineid + "").remove();

       // console.log(element);

        i++;
    })

    polygonS.forEach(function(element) {
        //draw.remove(element)
        element.remove()
    //    console.log(element)
    })

    tracesS=[];
    dblFlag = false;
    mouseMoveFlag = true;
}

// function clearPolyline() {
//     $("#polyline").remove();
//     mouseMoveFlag=true;
//     traces = [];
// }
//----------------------滚轮缩放------------------------
function scrollZoom(e,delta){
    //e=e || window.event;
    delta >0?zoom(1.1):zoom(0.9);
}
function zoom(num){
    // if(scale*num>min_scale){
    scale *= num;
    var svgPanel = document.getElementById("svgPanel");
    var str= svgPanel.getAttribute("transform");

    str=str.match(/translate\([^)]+\)/);
    if(scale>100){
        scale = 100;
    }
    var s=(str?str[0]:"")+" "+"scale("+scale+")";
    svgPanel.setAttribute("transform",s);

    // }
}
// function mousemove(){
//     $('#bgPic').mousedown(
//         function (event) {
//             this.setCapture && this.setCapture();
//             var isMove = true;
//             var abs_x = event.pageX - $('#svgPanel').offset().left;
//             var abs_y = event.pageY - $('#svgPanel').offset().top;
//             $(document).mousemove(function (event1) {
//                     if (isMove) {
//                         var svgPanel = document.getElementById("svgPanel");
//                         var str= svgPanel.getAttribute("transform");
//                         var idx = str.indexOf(",");
//                         if (  idx == -1) idx = str.indexOf(" ");
//                         var t = str.substring(str.indexOf("(")+1,idx);
//                         var m = str.substring(idx+1,str.indexOf(")"));
//                         var leftgap = $('#svgPanel').offset().left - parseInt(t);
//                         var topgap = $('#svgPanel').offset().top - parseInt(m);
//                         var obj = $('#svgPanel');
//                         var left =event1.pageX - abs_x;
//                         var top = event1.pageY - abs_y;
//                         var s="translate("+(Math.floor((event1.pageX - abs_x)*100)/100 - leftgap )+","+ (Math.floor((event1.pageY- abs_y)*100)/100 - topgap )+") "+" scale("+scale+")";
//                         svgPanel.setAttribute("transform",s);
//                     }
//                 }
//             ).mouseup(function () {
//                 document.onmousemove = document.onmouseup = null;
//                 isMove = false;
//             });
//         }
//     );
// }
function LoadPOI(result,floorId) {
    result=eval("("+result+")");
    if ( result.data != null &&  result.data.floorList != null ) {
        for ( var i=0; i<result.data.floorList.length;i++) {
            var data = result.data.floorList[i];
            if ( data.num ==  floorId ) {
                parintPOI(data.bizList);
            }
        }
    }
}
function parintPOI(result){
    poiArr=result;
    //-----取POI中心位置
    poiArr=getXY(poiArr);

    var step=0;
    var svgPanel = document.getElementById("svgPanel");

    if(poiArr && poiArr.length>0){
        if ( isIE() == false) {
            step=-6;
        }else {
            step=0;
        }
        var size = document.documentElement.style.fontSize.substring(0,document.documentElement.style.fontSize.length-2)*0.18;

        if ( size < 12) {
            size = 12;
        }

        for(var i=0;i<poiArr.length;i++){
            if(poiArr[i] && poiArr[i].x && poiArr[i].y){
                if ( size*poiArr[i].name.length > poiArr[i].width * scale + 80 ) {
                    continue;
                }
                var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.appendChild(document.createTextNode(poiArr[i].name));
                text.setAttribute("style","font-size:0.03rem;text-anchor: middle;font-family:'微软雅黑'");
                text.setAttribute("x",poiArr[i].x);
                text.setAttribute("y",poiArr[i].y);
                svgPanel.appendChild(text);
            }
        }

    }
}
//-----------------计算SVG各模块中心点-----------------
function getXY(poiArr){
    var arr=new Array();
    $.each(poiArr,function(i,item){
        //console.log(e.area);
        var mapareaid = item.mapAreaId.replace(/\//g, '-'), name = item.name,
            x, y, _ref;
        _ref = getAreaCenter($('#' + mapareaid));
        x = _ref.x;
        y = _ref.y;
        var _p;
        _p={"id":mapareaid, "x":x, "y":y,"width": getBytesWidth(name), "name":name, "type":item.bizType};
        arr.push(_p);
    });
    return arr;
}
/* 获取字符串字节数宽度 */
function getBytesWidth(str) {
    var span = document.createElement('span'),
        txt = document.createTextNode(str),
        w = 1;
    span.appendChild(txt);
    document.body.appendChild(span);
    w = span.offsetWidth;
    document.body.removeChild(span);
    return w;
}
function getAreaCenter(ele) {
    var cx, cy, height, rect, width, x, x1, x2, y, y1, y2, _ref, _ref1, _ref2;
    if ((ele.attr('cxy') != null) && ele.attr('cxy') !== '') {
        _ref = ele.attr('cxy').split(','), cx = _ref[0], cy = _ref[1];
    } else {
        rect = ele.find('rect');
        if (rect[0] != null) {
            _ref1 = [rect.attr('x'), rect.attr('y'), parseFloat(rect.attr('x')) + parseFloat(rect.attr('width')), parseFloat(rect.attr('y')) + parseFloat(rect.attr('height'))], x1 = _ref1[0], y1 = _ref1[1], x2 = _ref1[2], y2 = _ref1[3];
            cx = (parseFloat(x1) + parseFloat(x2)) / 2;
            cy = (parseFloat(y1) + parseFloat(y2)) / 2;
        } else {
            try{
                _ref2 = ele[0].getBBox(), x = _ref2.x, y = _ref2.y, width = _ref2.width, height = _ref2.height;
                cx = x + width / 2;
                cy = y + height / 2;
            }catch(e){}
        }
    }
    return {
        x: parseFloat(cx),
        y: parseFloat(cy)
    };
}
//------------------------计算中心点----------------------------
function getPointCenter(pointArr){
    var min_x,min_y,max_x,max_y;
    min_x=min_y=99999;
    max_x=max_y=-99999;
    for(var i=0;i<pointArr.length;i++){


        if(min_x>parseInt(pointArr[i].x)){
            min_x= parseInt(pointArr[i].x);
        }
        if(min_y>parseInt(pointArr[i].y)){
            min_y= parseInt(pointArr[i].y);
        }
        if(max_x<parseInt(pointArr[i].x)){
            max_x= parseInt(pointArr[i].x);
        }
        if(max_y<parseInt(pointArr[i].y)){
            max_y=parseInt(pointArr[i].y);
        }
    }



    var x=Math.floor((max_x+min_x)*100/2)/100;
    var y=Math.floor((max_y+min_y)*100/2)/100;
    var width=Math.floor((max_x-min_x)*100)/100;
    var height=Math.floor((max_y-min_y)*100)/100;
    return {'x':x,'y':y,'width':width,'height':height};
}
function isIE() { //ie?
    var userAgent = navigator.userAgent; //

    if (!!window.ActiveXObject || "ActiveXObject" in window){
        return true;
    }else
    if (userAgent.indexOf("Firefox") > -1)
        return false;
    return false;
}
