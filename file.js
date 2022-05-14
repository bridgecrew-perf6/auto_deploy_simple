var http = require('http'),
    querystring = require('querystring'),
    exec = require('child_process').exec;

process.on("uncaughtException", function (error) {
    console.error("Uncaught exception: " + error.message);
    console.trace();
});

var last_payload = {};

http.createServer(function (request, response) {
    if (request.method == 'GET') {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write("<html><body><pre>");
        response.write(JSON.stringify(last_payload, null, '\t'));
        response.write("</pre></body></html>");
        response.end();
    } else {
        var body = '';
        request.on('data', function (chunk) {
            body += chunk.toString();
        });

        request.on('end', function () {
            last_payload = JSON.parse(querystring.parse(body).payload);
            console.log(new Date(), request.method, request.url, last_payload);
            // check merge request 
            if (last_payload.action === 'closed' && last_payload.number > 0 && last_payload?.pull_request?.merged === true && last_payload?.pull_request?.base?.ref === 'develop') {
                exec("./restart_honest.sh", function (error, stdout, stderr) {
                    response.writeHead(200, { 'Content-Type': 'text/plain' });
                    response.end(error ? stderr : stdout);
                });
                console.log('Start auto deploy')
                return
            }
            console.log('Wrong action, Ignore')
            return


        });
    }
}).listen(7999);

console.log('Server running at http://*:7999/');