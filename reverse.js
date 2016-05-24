function revers(str) {
    var temp = "";
    //alert(str.length);
    for (var i = 0; i < str.length; i++) {
        temp += str[str.length - i - 1];

    }
    return temp;

}

function revervowelArr(s) {
    var len = s.len;
    var temp = [];
    var vowelArr = ['a', 'e', 'i', 'o', 'u'];
    for (var i = 0; i < len; i++) {
        if (vowelArr.indexOf(s[i]) != -1) {
            temp.unshift(s[i]);
            s[i] = '#';
        }
    }
    console.log(temp);
}
