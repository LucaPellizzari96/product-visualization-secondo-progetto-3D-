			#define saturate(a) clamp( a, 0.0, 1.0 )
			varying vec3 vNormal;
			varying vec3 vPosition;
			varying vec3 wPosition;
			//varying vec2 uVv;
			uniform vec3 pointLightPosition; // in world space
			uniform vec3 clight;
			uniform vec3 cspec;
			uniform vec3 cdiff;
			precision highp float;
			precision highp int;
			uniform samplerCube envMap;
			uniform float roughness;
			const float PI = 3.14159;

			float pow2( const in float x ) { return x*x; }

			// Calcolo dell'environment map speculare utilizzando la EM e scegliendo un MIP level che dipende dalla roughness
			float getSpecularMIPLevel( const in float blinnShininessExponent, const in int maxMIPLevel ) {
				float maxMIPLevelScalar = float( maxMIPLevel );
				float desiredMIPLevel = maxMIPLevelScalar - 0.79248 - 0.5 * log2( pow2( blinnShininessExponent ) + 1.0 );
				return clamp( desiredMIPLevel, 0.0, maxMIPLevelScalar );
			}

			float GGXRoughnessToBlinnExponent( const in float ggxRoughness ) {
				return ( 2.0 / pow2( ggxRoughness + 0.0001 ) - 2.0 );
			}
			
			// Frazione della luce in ingresso che viene riflessa da una superficie ideale a partire dalla direzione della luce e
			// la normale alla superficie, cspec = indice di rifrazione
			// Buona approssimazione di Fresnel, + semplice da calcolare e con risultati simili
			vec3 FSchlick(float lDoth) {
				return (cspec + (vec3(1.0)-cspec)*pow(1.0 - lDoth,5.0));
			}

			// Concentrazione di microfaccette la cui normale e' in direzione h (tengo conto solo di queste nei calcoli), e' uno scalare;
			// alpha = 0 materiale perfettamente liscio, alpha = 1 materiale molto ruvido
			float DGGX(float nDoth, float alpha) {
				float alpha2 = alpha*alpha;
				float d = nDoth*nDoth*(alpha2-1.0)+1.0;
				return ( alpha2 / (PI*d*d));
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
				vec4 lPosition = viewMatrix * vec4( pointLightPosition, 1.0 );
				vec3 l = normalize(lPosition.xyz - vPosition.xyz); // direzione da p (pixel per il quale stiamo facendo lo shading) alla luce
				vec3 n = normalize( vNormal );  // interpolation destroys normalization, so we have to normalize; normale della superficie di p
				vec3 v = normalize( -vPosition); // direzione da p alla camera
				vec3 h = normalize( v + l); // half-way direction fra l e v
				vec3 worldN = inverseTransformDirection( n, viewMatrix );  // la cubemap e' uno sfondo in world space quindi devo accedervi da li
				vec3 worldV = cameraPosition - wPosition ;
				vec3 r = normalize( reflect(-worldV,worldN)); // r = direzione dal pixel sulla superficie al texel della cubemap
				// small quantity to prevent divisions by 0
				float nDotl = max(dot( n, l),0.000001);
				float lDoth = max(dot( l , h ),0.000001);
				float nDoth = max(dot( n, h ),0.000001);
				//float vDoth = max(dot( v, h ),0.000001);
				float nDotv = max(dot( n, v ),0.000001);
				vec3 fresnel = FSchlick(lDoth);

				float blinnShininessExponent = GGXRoughnessToBlinnExponent(roughness);
				float specularMIPLevel = getSpecularMIPLevel(blinnShininessExponent ,8 );

				// La BRDF dipende dalle caratteristiche del materiale: e' la somma fra il termine diffusivo e quello speculare
				// Per rispettare la conservazione dell'energia moltiplico il termine diffusivo = colore diffuso = albedo = (cdiff/PI) per (1 - Fresnel)
				// mentre quello speculare = GSmith(nDotv,nDotl)*DGGX(nDoth,roughness*roughness) per Fresnel
				vec3 BRDF = (vec3(1.0)-fresnel)*cdiff/PI + fresnel*GSmith(nDotv,nDotl)*DGGX(nDoth,roughness*roughness)/
				(4.0*nDotl*nDotv);  
				// textureCubeLodEXT ci permette di accedere al MIP level che abbiamo calcolato e derivarne il valore di luminosita
				vec3 envLight = textureCubeLodEXT( envMap, vec3(-r.x, r.yz), specularMIPLevel ).rgb;
				envLight = pow(envLight, vec3(2.2));
				// BRDF_Specular_GGX_Environment: usiamo un environment BRDF (invece che microfaccette)
				// PI * clight * nDotl * BRDF = radianza uscente con una luce puntuale
				vec3 outRadiance = PI * clight * nDotl * BRDF + envLight * BRDF_Specular_GGX_Environment(n, v, cspec, roughness);
				// gamma encode the final value
				gl_FragColor = vec4(pow( outRadiance, vec3(1.0/2.2)), 1.0);
			}
