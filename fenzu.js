var n = 31;
var girl = 11;
var boy = 20;
var girlEachGroup = 2;
var boyEachGroup = 3;
function random() {
    var g = [];
    var b = [];
    //for (var m = 0; m < n; m++) {
    //    g.push(m);
    //    b.push(m);
    //}
    for (var i = 0; i < girlEachGroup; i++) {
        var gtemp = Math.floor(Math.random() * girl + 1);
        if(check(g,gtemp)){
            g.push(gtemp.toString())
        }

    }
    //for (var j = 0; j < boyEachGroup; j++) {
    //    var btemp = Math.floor(Math.random() * boy + 1);
    //    while (btemp.toString.indexOf(b) != -1) {
    //        btemp = Math.floor(Math.random() * boy + 1)
    //    }
    //    b.push(btemp.toString);
    //}
    console.log(a);
    console.log(b);
}


random();

function check(arr,temp){

    arr.forEach(function(item,index){
        if(item == arr){
            return false
        }});
    return true;
}

