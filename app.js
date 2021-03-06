const http = require('http')
var fs = require('fs');
var path = require('path');
var { parse } = require('querystring')
var parser = require('xml2json');

http.createServer(function (request, response) {
    // console.log('request ', request.url);
    
    var filePath = '.' + request.url;
    if (filePath == './') {
        filePath = './index.html';
    }

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {

        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }

          
        
    });

    if(request.method==='POST') {
        let body = '';
        request.on('data', (data) => {
            body += data.toString();
        })   

         fs.readFile('./data.xml', function(err,data) {
            var json = JSON.parse(parser.toJson(data, {reversible: true}));
            var users = json["data"]["continent"];

            // console.log(users);
        });
    }

    if(request.method==='GET') {
        fs.readFile('./data.xml', function(err,data) {
            var json = JSON.parse(parser.toJson(data, {reversible: true}));
            var dataArr = json["data"]["continent"];
       
        });
      
    }

}).listen(8000);
console.log('Server running at http://127.0.0.1:8000/');
