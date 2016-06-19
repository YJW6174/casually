function zeros(n){
    var result = 0;
    while(n>0){
        n  = Math.floor(n/5);
        result += n;
    }
    return result;
}

// var n = parseInt(process.argv.slice(2));

for(var i=0;i<100;i++){
console.log(zeros(i));
}