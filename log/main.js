var canvas = document.createElement("canvas");
canvas.setAttribute('class','sandbox');
canvas.style.width = '250px';
canvas.style.height = '250px';
canvas.width = '250px';
canvas.height = '250px';

var sandbox = new GlslCanvas(canvas);

function mouseIn (el) {
	var url = './' + el.getAttribute('data') + '.frag';
	console.log('IN', url);

	// Make the request and wait for the reply
    fetch(url)
        .then(function (response) {
        	// If we get a positive response...
            if (response.status !== 200) {
                console.log('Error getting frag shader. Status code: ' + response.status);
                return;
            }
            console.log('1', response);
            // sandbox.load();
        })
        .then(function(response) {
        	console.log('2', response);
        })
        .catch(function(error) {
            console.log('Error parsing the JSON', error)
        })
	
	el.appendChild(canvas);
} 


function mouseOut (el) {
	console.log('OUT', el.getAttribute('data'));
	el.removeChild(canvas);
}