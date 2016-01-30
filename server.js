//  Modules
//
var http = require('http'),   // http server
    fs = require('fs'),       // filesystem.
    path = require('path'),   // used for traversing your OS.
    url = require('url'),
    formidable = require('formidable');  // uploading files;

// Settings
//
var WWW_ROOT = './www/';
var LOG_PATH = 'data/';
var HTTP_PORT = 8080;

function fDate(epoch, format, locale) {
    var date = new Date(epoch),
        format = format || 'dd/mm/YY',
        locale = locale || 'en'
        dow = {};

    dow.en = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    var formatted = format
        .replace('D', dow[locale][date.getDay()])
        .replace('dd', ('0' + date.getDate()).slice(-2))
        .replace('mm', ('0' + (date.getMonth() + 1)).slice(-2))
        .replace('yyyy', date.getFullYear())
        .replace('yy', (''+date.getFullYear()).slice(-2))
        .replace('hh', ('0' + (date.getHours())).slice(-2))
        .replace('mn', ('0' + (date.getMinutes())).slice(-2) )
        .replace('ss', ('0' + (date.getSeconds())).slice(-2) );

    return formatted;
}

// WEB SERVER
//
var server = http.createServer( function( req , res ) {
    var parsedReq = url.parse(req.url);

    // SAVE 
    if (parsedReq.pathname == '/save' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm(),
            files = [],
            fields = [];

            form.uploadDir = WWW_ROOT + LOG_PATH;
            form.keepExtensions = true;

            var filename = fDate(Date.now(),'yymmddhhmnss');
            form
                .on('field', function(field, value) {
                    // console.log(field, value);
                    fields.push([field, value]);
                    if (field === 'code') {
                        fs.writeFile(WWW_ROOT+LOG_PATH+filename+'.frag', value, function(err) {
                            if (err) return console.log(err);
                        });
                    }
                })
                .on('fileBegin', function(name, file) {
                    if (name == 'image') {
                        file.path = form.uploadDir + filename + '.png';
                    }
                })
                .on('file', function(field, file) {
                    // console.log(field, file);
                    files.push([field, file]);
                })
                .on('end', function() {
                    console.log('-> upload ' + LOG_PATH+filename+'.frag');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.writeHead(200, {'content-type': 'text/plain'});
                    res.write(LOG_PATH+filename+'.frag');
                    res.end();
                });
            form.parse(req);
    } else {
        //  REGULAR WEB SERVER
        //
        var mimeTypes = {
            'html':  'text/html',
            'jpeg':  'image/jpeg',
            'jpg':   'image/jpeg',
            'png':   'image/png',
            'svg':   'image/svg+xml',
            'svgz':  'image/svg+xml',
            'js':    'text/javascript',
            'css':   'text/css'
        };

        var fileToLoad;

        if(req.url == '/') {
          fileToLoad = 'index.html';
        } else {
          fileToLoad = url.parse(req.url).pathname.substr(1);
        }

        console.log('[HTTP] :: Loading :: ' + WWW_ROOT + fileToLoad);

        var fileBytes;
        var httpStatusCode = 200;

        // check to make sure a file exists...
        fs.exists(WWW_ROOT + fileToLoad,function(doesItExist) {

            // if it doesn't exist lets make sure we load error404.html
            if(!doesItExist) {
                console.log('[HTTP] :: Error loading :: ' + WWW_ROOT + fileToLoad);

                httpStatusCode = 404;
                fileToLoad = 'error404.html';
            }

            var fileBytes = fs.readFileSync(WWW_ROOT + fileToLoad);
            var mimeType = mimeTypes[path.extname(fileToLoad).split('.')[1]]; // complicated, eh?

            // res.setHeader('Access-Control-Allow-Origin', '*');
            res.writeHead(httpStatusCode, {  
                                            'Access-Control-Allow-Origin' : '*',
                                            'Content-type':mimeType
                                        });
            res.end(fileBytes);
        });
	}
}).listen(HTTP_PORT);
console.log('Server started at http://localhost:' + HTTP_PORT);
