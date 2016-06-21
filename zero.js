function zeros(n) {
    var result = 0;
    while (n > 0) {
        n = Math.floor(n / 5);
        console.log(n);
        result += n;
    }
 }

var fs = require('fs');
fs.unlink('a121',(err) => {
    // if(err) throw err;
    console.log('a');
    console.log('success a121');
})
