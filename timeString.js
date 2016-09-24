// 09:00-10:00 -> 09:00-09:30 + 09:30-10:00;

var rtime = /((\d{2}):(\d{2}))/g;//item
var ltime = /(\d{2}:\d{2})-(\d{2}:\d{2})/;
function divTime(str){
    if(/\d{2}:\d{2}-\d{2}:\d{2}/g.test(str)){
    var timeArr = str.split("-");

    }
}
// divTime("09:00-10:00");

// 09:00 -> 09:00-09:30;
// 09:30 -> 09:30-10:00;
function fillTime(str){
    if(/\d{2}:00/g.test(str)){
        return str.replace(rtime,"$1-$2:30")
    }
    if(/\d{2}:30/g.test(str)){
        return str.replace(rtime,"$1-($2+1):00")   
    }
}
// console.log(fillTime("09:30"))

 //09:00-09:30 + 09:30-10:00 -> 09:00-10:00;
 //09:30-10:00 + 10:00-10:30 -> 09:30-10:30;

function mergeTime(t1,t2){ //t1<=t2
    console.log(ltime);
    if(ltime.test(t1) && ltime.test(t2)){
         return t1.replace(ltime,"$1") + "-" + t2.replace(ltime,"$2") 
    }
}
console.log(mergeTime("09:00-09:30","09:30-10:00"))