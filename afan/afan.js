#!/usr/bin/env node

var http = require('http');

var words = process.argv.slice(2);

if (words.length <= 0) {
    console.log('Please input query(s)');
} else {
    var url = 'http://fanyi.youdao.com/openapi.do?keyfrom=YJW-home&key=17404186&type=data&doctype=json&version=1.1&q=' + encodeURIComponent(words);
    var request = http.get(url, function (response) {
            suresfnc(response)
        }).on('error', function(e){
        console.log('Got error: ${e.message} ')
});
    request.end();
}

function suresfnc(response) {
    var body = [];
    if (response.statusCode == 200) {
        response.on('data', function (chunk) {
            body.push(chunk);
        });
        response.on('end', function () {
            body = JSON.parse(Buffer.concat(body).toString());
            console.log(body.translation.toString());
            if (body.basic && body.basic.explains) {
                if (body.basic['us-phonetic'] || body.basic['uk-phonetic']) {
                    console.log("[美音:" + body.basic['us-phonetic'] + '    ' + '英音:' + body.basic['uk-phonetic'] + ']')
                }
                if (body.basic['phonetic']) {
                    console.log('phonetic:' + body.basic['phonetic']);
                }
                console.log(body.basic.explains.join('\n'));
            } else {
                console.log('Sorry,No Result!');
            }
            console.log('\n');
        });

    } else {
        console.log('error: ' + response.statusCode)
    }
}
