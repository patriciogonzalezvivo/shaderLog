//  Modules
//
var http = require("http");   // http server
var fs = require('fs');       // filesystem.
var path = require('path');   // used for traversing your OS.
var url = require('url');     // utility for URLs
var spawn = require('child_process').spawn; // running cmd
var formidable = require('formidable');  // uploading files;

// Settings
//
var WWW_ROOT = "./www/";
var LOG_PATH = "log/";
var HTTP_PORT = 8080;

var status = {'printing' : false,
              'queue': [],
             };

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
        .replace('dd', ("0" + date.getDate()).slice(-2))
        .replace('mm', ("0" + (date.getMonth() + 1)).slice(-2))
        .replace('yyyy', date.getFullYear())
        .replace('yy', (''+date.getFullYear()).slice(-2))
        .replace('hh', ("0" + (date.getHours())).slice(-2))
        .replace('mn', ("0" + (date.getMinutes())).slice(-2) )
        .replace('ss', ("0" + (date.getSeconds())).slice(-2) );

    return formatted;
}

function printQueue() {
    console.log('There are ' + status.queue.length + ' objects on the queue');
    console.log('Printer is ' + status.printing);

    if (status.printing === false && status.queue.length > 0) {
        var actualFile = status.queue[0],
        command = './print.sh ' + actualFile.filename;
        status.printing = true;

        var prc = spawn('./print.sh', [actualFile.filename]);
        prc.stdout.setEncoding('utf8');
        prc.stdout.on('data', function (data) {
            var str = data.toString()
            var lines = str.split(/(\r?\n)/g);
            console.log(lines.join(""));
        });

        prc.on('close', function (code) {
            console.log('process exit code ' + code);

            status.printing = false;
            status.queue.shift();

            if (status.queue.length > 0) {
                printQueue();
            }
        });
    }
}

function saveFile( filename, content ){
    fs.writeFile(filename, content, function(err) {
        if(err) {
            return console.log(err);
        }
    });
}


// WEB SERVER
//
var server = http.createServer( function( req , res ) {
    var parsedReq = url.parse(req.url);

    if(parsedReq.pathname == "/save" && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm();
        var files = [];
        var fields = [];

        form.uploadDir = WWW_ROOT + LOG_PATH;
        form.keepExtensions = true;

        var filename = fDate(Date.now(),'yy-mm-dd-hh-mn-ss');

        form.on('fileBegin', function(name, file) {
            file.path = form.uploadDir + filename + '.png';
        })

        form.parse(req, function(err, fields, files) {
            fs.writeFile(WWW_ROOT+LOG_PATH+filename+".frag", fields['code'], function(err) {
                if(err) {
                    return console.log(err);
                }
                res.write(LOG_PATH+filename+".frag");
                res.end();

                var queue_obj = {
                    'image': WWW_ROOT + LOG_PATH + filename + '.png',
                    'code': WWW_ROOT + LOG_PATH + filename + '.frag',
                    'filename': filename
                }
                status.queue.push(queue_obj);

                printQueue();
            });
        });

    } else {
        //  REGULAR WEB SERVER
        //
        var mimeTypes = {
            "html":  "text/html",
            "jpeg":  "image/jpeg",
            "jpg":   "image/jpeg",
            "png":   "image/png",
            "svg":   "image/svg+xml",
            "svgz":  "image/svg+xml",
            "js":    "text/javascript",
            "css":   "text/css"
        };

        var fileToLoad;

        if(req.url == "/") {
          fileToLoad = "index.html";
        } else {
          fileToLoad = url.parse(req.url).pathname.substr(1);
        }

        console.log("[HTTP] :: Loading :: " + WWW_ROOT + fileToLoad);

        var fileBytes;
        var httpStatusCode = 200;

        // check to make sure a file exists...
        fs.exists(WWW_ROOT + fileToLoad,function(doesItExist) {

            // if it doesn't exist lets make sure we load error404.html
            if(!doesItExist) {
                console.log("[HTTP] :: Error loading :: " + WWW_ROOT + fileToLoad);

                httpStatusCode = 404;
                fileToLoad = "error404.html";
            }

            var fileBytes = fs.readFileSync(WWW_ROOT + fileToLoad);
            var mimeType = mimeTypes[path.extname(fileToLoad).split(".")[1]]; // complicated, eh?

            res.writeHead(httpStatusCode,{'Content-type':mimeType});
            res.end(fileBytes);
        });
	}
}).listen(HTTP_PORT);
console.log("Server started at http://localhost:" + HTTP_PORT);
