Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "星期日",         
    "1" : "星期一",         
    "2" : "星期二",         
    "3" : "星期三",         
    "4" : "星期四",         
    "5" : "星期五",         
    "6" : "星期六"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}

//console.log(new Date().pattern('MM-dd hh:mm'));
var t1 = new Date('2016/08/07 10:00');
console.log(t1.pattern('E'));
var thirtymin = 30*1000*60;
var t2 = t1.getTime() + thirtymin;
console.log(t2);
console.log(new Date(t2).pattern('MM-dd hh:mm'))



