#!/usr/bin/env node

var http = require('http');
// var options = {
//         hostname: 'www.baidu.com',
//         port: 80,
//         path: '',
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded'
//         }
//     };

// var request = http.request(options, function (response) {
//     console.log(response);
// });

var words = process.argv.slice(2);

var url = 'http://fanyi.youdao.com/openapi.do?keyfrom=YJW-home&key=17404186&type=data&doctype=json&version=1.1&q=' + encodeURIComponent(words);
var request = http.get(url, function(response) {
    suresfnc(response)
});
request.end();

function suresfnc(response) {
    var body = [];
    if (response.statusCode == 200) {
        response.on('data', function(chunk) {
            body.push(chunk);
        });
        response.on('end', function() {
            body = JSON.parse(Buffer.concat(body).toString());
            console.log(body.translation.toString());
            if (body.basic && body.basic.explains) {
                console.log(body.basic.explains.join('\n'))
                console.log('\n');
            } else {
                console.log('\n');
            }
        });

    } else {
        console.log('error: ' + response.statusCode)
    }
}
