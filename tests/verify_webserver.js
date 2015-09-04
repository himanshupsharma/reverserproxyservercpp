var http = require('http');

function checkRequest(method, uri, headers, body) {
    var options = {
        hostname: 'localhost',
        port: process.argv[2],
        method: method,
        path: uri,
        headers: headers
    };
    var req = http.request(options, function(res) {
        var response = '';
        if(200 != res.statusCode) {
            console.log("Test request failed. Error code: " + res.statusCode);
            process.exit(1);
        }
        if(headers) {
            //console.log('HEADERS: ' + JSON.stringify(res.headers));
            for (var entry in headers) {
                if(entry.indexOf("x-") === -1) //Check only custom headers
                    continue;
                if( (!res.headers[entry]) || (headers[entry] != res.headers[entry]) ) {
                    console.log("Header not found.");
                    process.exit(1);
                }
            }
        }
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            response += chunk;
        });
        res.on('end', function () {
            //console.log('BODY: ' + response);
            var jsonobj = JSON.parse(response);
            if( (jsonobj.method != method) || ("/test"+jsonobj.uri != uri) ) {
                console.log('Method or URI did not match');
                process.exit(1);
            }
            if(body && (jsonobj.body != body) ) {
                console.log('Body did not match');
                process.exit(1);
            }
        });
    });
    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
        process.exit(1);
    });

    // write data to request body
    if(body)
        req.write(body);
    req.end();
}

checkRequest("GET", "/test/first");
checkRequest("POST", "/test/first");
checkRequest("PUT", "/test/first");
checkRequest("DELETE", "/test/first");
checkRequest("OPTIONS", "/test/first");
checkRequest("GET", "/test/first/def");
checkRequest("GET", "/test/first?q=a");
checkRequest("POST", "/test/first?q=a&r=b");
checkRequest("GET", "/test/first", {'X-h1': 'v1'});
checkRequest("DELETE", "/test/first", {'X-h1': 'v1', 'X-h2': 'v2'});
checkRequest("POST", "/test/first", {'Content-Length': 4}, "Body");
var content = "{\"a\": \"b\", \"c\": \"d\"}";
checkRequest("GET", "/test/first", {'Content-Length': content.length, 'Content-Type': 'application/json'}, content);
checkRequest("POST", "/test/first.def");
checkRequest("POST", "/test/first!def?q=vv@ww&r=b");
checkRequest("GET", "/test/second/");

