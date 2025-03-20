import boolean from 'async-validator/dist-types/validator/boolean'

export interface Gateway {
    address:string,
    name:string,
    x:number,
    y:number,
    type:number
    proportion:number,
    show:boolean,
    online:number,
    last_time:number
    is_use:boolean,
    rssi:number,
    d:number
}

export interface Tag {
    address:string,
    x:number,
    y:number,
    proportion:number,
    show:boolean,
    online:number,
    last_time:number,
    sos:number,
    bt:string,

}
export interface Gateway_Tag {
   g_address:string,
    rssi:number,
    time:number,
    is_map:boolean,
    is_use:boolean,
}
export interface Point {
   x:number,
    y:number
}
// x,y,路径，缩放比例
export  function IsPtInPoly(aLat: any, aLon: any, pointList: string | any[], proportion: number) {
    /*
    :param aLon: double 经度
    :param aLat: double 纬度
    :param pointList: list [{latitude: 22.22, longitude: 113.113}...] 多边形点的顺序需根据顺时针或逆时针，不能乱
    */
    var iSum = 0
    var iCount = pointList.length

    if(iCount < 3) {
        return false
    }

    //  待判断的点(x, y) 为已知值
    var y = aLat
    var x = aLon
    var y2
    var x2
    for(var i = 0; i < iCount; i++) {
        //console.log("位置"+i+  "X="+pointList[i].x+"  Y="+pointList[i].y)
        var y1 = pointList[i].x/proportion
        var x1 = pointList[i].y/proportion
        if(i == iCount - 1) {
             y2 = pointList[0].x/proportion
             x2 = pointList[0].y/proportion
        } else {
             y2 = pointList[i + 1].x/proportion
             x2 = pointList[i + 1].y/proportion
        }
        // 当前边的 2 个端点分别为 已知值(x1, y1), (x2, y2)
        if (((y >= y1) && (y < y2)) || ((y >= y2) && (y < y1))) {
            //  y 界于 y1 和 y2 之间
            //  假设过待判断点(x, y)的水平直线和当前边的交点为(x_intersect, y_intersect)，有y_intersect = y
            // 则有（2个相似三角形，公用顶角，宽/宽 = 高/高）：|x1 - x2| / |x1 - x_intersect| = |y1 - y2| / |y1 - y|
            if (Math.abs(y1 - y2) > 0) {
                var x_intersect = x1 - ((x1 - x2) * (y1 - y)) / (y1 - y2);
                if(x_intersect < x) {
                    iSum += 1
                }
            }
        }
    }
    if(iSum % 2 != 0) {
        return true
    }else {
        return false
    }
}



