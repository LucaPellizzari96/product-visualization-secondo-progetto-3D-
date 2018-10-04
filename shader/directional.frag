			#extension GL_OES_standard_derivatives : enable
			varying vec3 vNormal;
			varying vec3 vPosition;
			varying vec3 wPosition;
			varying vec2 uVv;
			uniform vec3 lightDirection; // in eye space
			uniform vec3 lightPower; // uguale in tutta la scena
			uniform vec3 ambientLight;
			uniform sampler2D specularMap;
			uniform sampler2D diffuseMap;
			uniform sampler2D roughnessMap;
			uniform sampler2D normalMap;
			uniform vec2 normalScale;
			vec3 cdiff;
			vec3 cspec;
			float roughness;
			const float PI = 3.14159;
			
			// Frazione della luce in ingresso che viene riflessa da una superficie ideale a partire dalla direzione della luce e la normale alla superficie
			// Buona approssimazione di Fresnel, + semplice da calcolare e con risultati simili
			vec3 FSchlick(float lDoth) {
				return (cspec + (vec3(1.0)-cspec)*pow(1.0 - lDoth,5.0));
			}
			
			// Concentrazione di microfaccette la cui normale e' in direzione h, e' uno scalare;
			// alpha = 0 materiale perfettamente liscio, alpha = 1 materiale molto ruvido
			float DGGX(float nDoth, float alpha) {
				float alpha2 = alpha*alpha;
				float d = nDoth*nDoth*(alpha2-1.0)+1.0;
				return (  alpha2 / (PI*d*d));
			}

			float G1(float dotProduct, float k) {
				return (dotProduct / (dotProduct*(1.0-k) + k) );
			}
			
			// Probabilita che una microfaccetta possa essere illuminata => non sia ne shadowed ne masked
			float GSmith(float nDotv, float nDotl) {
				float k = roughness*roughness;
				return G1(nDotl,k)*G1(nDotv,k);
			}

			vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
				return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
			}

			vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {
				// dFdx, dFdy restituiscono il cambiamento in valore di un'espressione su un pixel dello schermo orizzontalmente e verticalmente
				vec3 q0 = dFdx( eye_pos.xyz );
				vec3 q1 = dFdy( eye_pos.xyz );
				vec2 st0 = dFdx( uVv.st );
				vec2 st1 = dFdy( uVv.st );
				vec3 S = normalize(  q0 * st1.t - q1 * st0.t );
				vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
				vec3 N =  surf_norm;
				vec3 mapN = normalize(texture2D( normalMap, uVv ).xyz * 2.0 - 1.0);
				mapN.xy = normalScale * mapN.xy;
				// S, T, N mappano dalle coordinate uv alle coordinate in eye space
				mat3 tsn = mat3( S, T, N );
				return normalize( tsn * mapN );
			}
			
			vec3 BRDF_Specular_GGX_Environment( vec3 normal, vec3 viewDir, const in vec3 cspec, const in float roughness ) {
				float dotNV = saturate( dot( normal, viewDir ) );
				const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
				const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
				vec4 r = roughness * c0 + c1;
				float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
				vec2 AB = vec2( -1.04, 1.04 ) * a004 + r.zw;
				return cspec * AB.x + AB.y;
			}

			void main() {
				vec3 n = perturbNormal2Arb( vPosition, normalize( vNormal )); // normale della superficie di p
				//vec3 v = normalize( -vPosition); // direzione da p alla camera
				//vec3 h = normalize( v + l); // half-way direction fra l e v
				//vec3 worldN = inverseTransformDirection( n, viewMatrix );  // la cubemap e' uno sfondo in world space quindi devo accedervi da li
				//vec3 worldV = cameraPosition - wPosition;
				//vec3 r = normalize( reflect(-worldV,worldN)); // r = direzione dal pixel sulla superficie al texel della cubemap
				// small quantity to prevent divisions by 0
				float nDotl = max(dot( n, -lightDirection ),0.000001); // prodotto scalare fra normale e direzione della luce
				//float lDoth = max(dot( l, h ),0.000001);
				//float nDoth = max(dot( n, h ),0.000001);
				//float nDotv = max(dot( n, v ),0.000001);
				
				//cspec = texture2D( specularMap, uVv).rgb;				
				cdiff = texture2D( diffuseMap, uVv).rgb*0.5;
				// texture in sRGB, linearize
				//cspec = pow( cspec, vec3(2.2));
				cdiff = pow(cdiff, vec3(2.2));
				roughness = texture2D( roughnessMap, uVv).r; // no need to linearize roughness map

				// BRDF Lambertiana
				vec3 BRDF = cdiff/PI;

				vec3 outRadiance = PI * lightPower * nDotl * BRDF + ambientLight*cdiff;
				// gamma encode the final value
				gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1.0);
			}
