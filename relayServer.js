var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);
var glores;
var idtores = {};

app.use('/', function (req, res) {
    console.log('method: ' + req.method);
    console.log('url: ' + req.url);
    console.log('httpversion: ' + req.httpVersion);
    console.log('header: '+ JSON.stringify(req.headers));
    glores = res;
    
    var now = JSON.stringify(new Date());
    req.id = now + "&" + Math.random();
    // 保存res，为了之后收到请求后拿出来
    idtores[req.id] = res;
    console.log('recevice req from public! ready to forward, req.id = ' + req.id);

    var new_req = {
        httpVersion: req.httpVersion,
        headers:req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        id: req.id
    };
    
    var body = '';
    if (req.method == 'POST' || req.method == 'PUT'){
        req.on('data', function(data){
            body += data;
        });

        req.on('end', function(){
            new_req.body = body;
            io.emit('req', new_req);
            console.log('end of put or post, forward data: ' + body);
        });
    } else {
        io.emit('req', new_req);
    }

});

io.on('connection', function (socket) {
    console.log('new connecton');
    socket.on('testevent', function (data) {
        console.log(data);
    });
        
    socket.on('res', function (data){
        console.log('receive res from nat! res.id = ' + data.id);
        var res = idtores[data.id];
        res.write(data.result);
        res.end();
        delete idtores[data.id];
    });
});

io.on('disconnection', function (socket) {
    console.log('disconnect');
});

console.log('listening');
