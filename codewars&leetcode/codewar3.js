function amIWilson(p) {
  // check if prime is Wilson
  var p2 = (factorial(p-1) + 1 ) / ( p * p); 
  if(/[.]/g.test(p2) ){
    return false
    } else {
    return true 
    }
}

 
function factorial(num){
  if( num <= 1 ){
    return num;
  }
  else{
    return num * arguments.callee.call(null, num-1);
  }
}



console.log(amIWilson(5));