var socket = require('socket.io-client')('http://localhost:8080');
var http = require('http');


socket.on('connect', function(){
    console.log('connected');
    
    socket.on('disconnect', function(){
        console.log('disconnect');
    });
    
    socket.on('req', function(req){
        console.log('receive req');
        console.log('method: ' + req.method);
        
        //http request start
        var options = {
          host: 'localhost',
          port: 8088,
          path: req.url,
          method: req.method,
          headers: req.headers 
        };
        
        var forwardreq = http.request(options, function(res){
            console.log('in request callback');
            var str = '';

            res.on('data', function(chunk){
                str += chunk;
            });

            res.on('end', function(){
                console.log('str = ' + str);
                console.log('typeof str = ' + typeof(str));

                socket.emit('res', {
                    result: str,
                    id:req.id
                });
            });
        });
        
        if (req.method == "PUT" || req.method == "POST") {
            forwardreq.write(req.body); 
        }

        forwardreq.end();
        //http request end
        
    })
});
