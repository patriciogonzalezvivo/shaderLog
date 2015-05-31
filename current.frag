#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main(){
	vec2 st = gl_FragCoord.xy/u_resolution.xy;
	st.x *= u_resolution.x/u_resolution.y;

	vec3 color = vec3(st.x,st.y,0.0);

	gl_FragColor = vec4(color,1.0);
}