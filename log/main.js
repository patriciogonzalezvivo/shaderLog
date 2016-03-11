var canvas = document.createElement("canvas");
canvas.setAttribute('class','sandbox');
canvas.style.width = '250px';
canvas.style.height = '250px';
canvas.width = '250px';
canvas.height = '250px';
var sandbox = new GlslCanvas(canvas);

function mouseIn (el) {
	var url = './' + el.getAttribute('data') + '.frag';
    getHttp(url, function(err, res) {
        if (err) {
            console.error(err);
        }
        sandbox.load(res);
    });
	
	el.appendChild(canvas);
} 


function mouseOut (el) {
	el.removeChild(canvas);
}

function getHttp (url, callback) {
    var request = new XMLHttpRequest();
    var method = 'GET';

    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = request.responseText;

            // TODO: Actual error handling
            var error = null;
            callback(error, response);
        }
    };
    request.open(method, url, true);
    request.send();
}
