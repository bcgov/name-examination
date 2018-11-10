import http from 'http';
import fs from 'fs';

let server = http.createServer((request, response)=>{
    console.log(request.method, request.url);
    response.setHeader('Access-Control-Allow-Origin', '*')
    if ('/static/config/configuration.json' == request.url) {
        response.write(JSON.stringify([{ URL:'' }]))
    }
    else {
        if (request.url.indexOf('/static/') == 0) {
            let content = fs.readFileSync(decodeURIComponent('.'+request.url)).toString();
            response.write(content);
        }
    }
    response.end();
});
let serverPort = 5002;

module.exports = {
    start:function(done) { server.listen(serverPort, done); },
    stop: function(done) { server.close(done); },
    port:serverPort
};
