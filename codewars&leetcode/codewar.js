function validateCode(code) {
    //your code here
    var o = code.toString();
    var flag;
    var o = o.slice(0, 1);
    console.log(o);
    if (["1", "2", "3"].indexOf(o) == -1) {
        return false;
    } else {
        return true;
    }
}

console.log(validateCode(1));
