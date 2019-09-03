var http = require('http');
var server = http.createServer();

function HTTP_TratarRespuesta(request, response) {
    response.writeHead(200, {'Content-Type':'text/plain'});
    response.write('Hola a Todas y a Todos!\n');
    response.end();
}

server.on('request', HTTP_TratarRespuesta);
server.listen(8080);

console.log('Servidor ejecutándose en puerto 8080...');
