//  Modules
//
var http = require('http'),   // http server
    fs = require('fs'),       // filesystem.
    path = require('path'),   // used for traversing your OS.
    url = require('url'),
    formidable = require('formidable');  // uploading files

// Settings
//
var LOG_PATH = './log/';
var HTTP_PORT = 8080;
var ADMIN_SLACK_USER = 'U0AU1E1QU';

// SLACK integration
//
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var RtmClient = require('@slack/client').RtmClient;
var token = process.env.SLACK_API_TOKEN || '';
var rtm = new RtmClient(token);
rtm.start();

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

function deleteEntry(logNumber) {
    var user = rtm.dataStore.getUserById(ADMIN_SLACK_USER);
    var dm = rtm.dataStore.getDMByName(user.name);
    fs.exists(LOG_PATH+logNumber+'.frag', function(exists) {
        if (exists) {
            console.log('Deleting '+logNumber+'.frag');
            fs.unlink(LOG_PATH+logNumber+'.frag');
            rtm.sendMessage('Deleting ' + logNumber+'.frag', dm.id);
        }
        else {
            rtm.sendMessage(logNumber+'.frag not found', dm.id);
        }
    });
    fs.exists(LOG_PATH+logNumber+'.png', function(exists) {
        if (exists) {
            console.log('Deleting '+logNumber+'.png');
            fs.unlink(LOG_PATH+logNumber+'.png');
            rtm.sendMessage('Deleting ' + logNumber+'.png', dm.id);
        }
        else {
            rtm.sendMessage(logNumber+'.png not found', dm.id);
        }
    });
} 

rtm.on(RTM_EVENTS.MESSAGE, function (message) {
    console.log(message);
    if (message.user === ADMIN_SLACK_USER ) {
        console.log(message.text.match(/del(\s*\d{12})*/gm))
        if (message.text.match(/del(\s*\d{12})*/m)) {
            var entries = message.text.split(' ');
            for (var i = 1; i < entries.length; i++) {
                deleteEntry(entries[i]);
            }
        }
    }
  // Listens to all `message` events from the team
});

// WEB SERVER
//
var server = http.createServer( function(req , res) {
    var parsedReq = url.parse(req.url);

    // SAVE 
    if (parsedReq.pathname == '/save' && req.method.toLowerCase() == 'post') {
        var form = new formidable.IncomingForm(),
            files = [],
            fields = [];

        form.uploadDir = LOG_PATH;
        form.keepExtensions = true;

        var filename = fDate(Date.now(),'yymmddhhmnss');
        form
            .on('field', function(field, value) {
                // console.log(field, value);
                fields.push([field, value]);
                if (field === 'code') {
                    fs.writeFile(LOG_PATH+filename+'.frag', value, function(err) {
                        if (err) return console.log(err);
                    });
                    fs.writeFile(LOG_PATH+'last.frag', value, function(err) {
                        if (err) return console.log(err);
                    });
                }
            })
            .on('fileBegin', function(name, file) {
                file.path = form.uploadDir + filename + '.png';
            })
            .on('end', function() {
                console.log('-> upload ' + LOG_PATH+filename+'.frag');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.writeHead(200, {'content-type': 'text/plain'});
                res.write(filename);
                res.end();

                var user = rtm.dataStore.getUserById(ADMIN_SLACK_USER);
                var dm = rtm.dataStore.getDMByName(user.name);
                rtm.sendMessage('New log created at: http://editor.thebookofshaders.com/?log='+filename+' https://thebookofshaders.com/log/'+filename+'.png' , dm.id);
            });
        form.parse(req);

        
    }
}).listen(HTTP_PORT);
console.log('Server started at http://localhost:' + HTTP_PORT);
