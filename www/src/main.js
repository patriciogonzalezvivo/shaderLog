var editor, canvas;
var imgs = [];

function newContent(){
	console.log("New Content");
	window.location.href = ".";
}

function openContent(input){
	var reader = new FileReader();
    reader.onload = function(e) {
        editor.setValue(e.target.result);
    }
    reader.readAsText(input.files[0]);
}

function save( _string) {
	var url = '/save';
	var data = new FormData();

	// code
	data.append('code', _string);

	// image
	var dataURL = canvas.toDataURL("image/png");
	var blobBin = atob(dataURL.split(',')[1]);
	var array = [];
	for(var i = 0; i < blobBin.length; i++) {
	    array.push(blobBin.charCodeAt(i));
	}
	var file=new Blob([new Uint8Array(array)], {type: 'image/png'});

	data.append("image", file);

	// data.append('image', );
	var xhr = new XMLHttpRequest();
	xhr.open('POST', url, true);
	xhr.onload = function () {
		window.location.href = ".#"+this.responseText;
	};
	xhr.send(data);
}

function saveContent(){
	var demoEditor = document.getElementById("editor");
	if (demoEditor) {
		save( editor.getValue() );
	}
}

window.addEventListener("hashchange", function () {
	loadTag()
}, false);

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function loadTag(){
	var fragShader = "";
	var fragFile = "";

	while(imgs.length > 0) {
    	imgs.pop();
	}

	removeElementsByClass("CodeMirror");

	if( window.location.hash === "" ){
		fragShader = "#ifdef GL_ES\n\
precision mediump float;\n\
#endif\n\
\n\
uniform vec2 u_resolution;\n\
\n\
void main(){\n\
	vec2 st = gl_FragCoord.xy/u_resolution.xy;\n\
	st.x *= u_resolution.x/u_resolution.y;\n\
\n\
	vec3 color = vec3(st.x,st.y,0.0);\n\
\n\
	gl_FragColor = vec4(color,1.0);\n\
}";
	} else {
		var hashes = location.hash.split('&');

		for(i in hashes){
			var ext = hashes[i].substr(hashes[i].lastIndexOf('.') + 1);
			var name = hashes[i];

			// Extract hash if is present
			if(name.search("#") === 0){
				name = name.substr(1);
			}

			if(ext == "frag"){
				fragFile = name;
				fragShader = fetchHTTP(fragFile);
			} else if (ext == "png" || ext == "jpg" || ext == "PNG" || ext == "JPG" ){
				imgs.push(hashes[i]);
			}
		}
	}

	canvas = document.getElementById("canvas");
	if(canvas && fragShader !== ""){
		canvas.setAttribute("data-fragment", fragShader);
		console.log("data-fragment: " + fragFile);

		if(imgs.length > 0){
			var textureList = "";
			for(i in imgs){
				textureList += imgs[i];
				textureList += (i < imgs.length-1)?",":"";
			}
			canvas.setAttribute("data-textures",textureList);
			console.log("data-textures: " + textureList);
		}
		loadShaders();
	}

	var demoEditor = document.getElementById("editor");
	if(demoEditor){
		editor = CodeMirror(demoEditor,{
			value: fragShader,
			lineNumbers: true,
			matchBrackets: true,
			mode: "x-shader/x-fragment",
			keyMap: "sublime",
			autoCloseBrackets: true,
			extraKeys: {"Ctrl-Space": "autocomplete"},
			showCursorWhenSelecting: true,
			theme: "monokai",
			indentUnit: 4
		});

		editor.on("change", function() {
			canvas.setAttribute("data-fragment", editor.getValue());
			loadShaders();
		});
	}
}

window.onload = function () { 
	loadTag();
	renderShaders(); 
};