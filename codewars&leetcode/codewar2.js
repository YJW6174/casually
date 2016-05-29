function trickyDoubles(n){
 //insert your code here
 var str = n.toString();
 var strlen = str.length;
 var halflen = str.length / 2 ;
 if( strlen % 2 == 0 ){
 	console.log(halflen);
    var str1 = str.slice(0,halflen);
    var str2 = str.slice(halflen , strlen);
    console.log(str1+"=="+str2);
    if( str1 == str2){
        return n;
    } else {
        return n*2;
    }
    
 } else {
   return n*2;
 }
 
 
}

console.log(trickyDoubles(7777));