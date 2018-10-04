varying vec3 vNormal;
varying vec3 vPosition;
varying vec3 wPosition; // world position
varying vec2 uVv;  // coordinate delle texture 

void main() {
	vec4 vPos = modelViewMatrix * vec4( position, 1.0 );
	vPosition = vPos.xyz;
	vNormal = normalMatrix * normal;
	wPosition = (modelMatrix * vec4( position, 1.0 )).xyz;
	uVv = uv;
	gl_Position = projectionMatrix * vPos;
}