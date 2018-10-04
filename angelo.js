			// controllo che il browser supporti WebGL
			if ( ! Detector.webgl ) Detector.addGetWebGLMessage();  // se non lo supporta invio un messaggio
			
			// VARIABILI GLOBALI
			var container, stats, controls;
			var camera, scene, renderer;
			// VARIABILI GLOBALI PER LA GESTIONE DEI MATERIALI E DELLE CUBEMAP A RUN-TIME
			var materiale = "pietraDirectional";
			var materialeLocale = materiale;
			var materialeShader;  // variabile globale che corrisponde allo ShaderMaterial che contiene uniforms, vertexshader, fragmentshader ed estensioni
			var cubemap = "colosseo";
			var cubemapLocale = cubemap;
			var lucePuntuale2;
			// LARGHEZZA E ALTEZZA DEL CANVAS IN CUI INSERIRE IL MODELLO
			var larghezza, altezza;
			
			// CUBEMAP DA TEXTURE
			
			var loader = new THREE.CubeTextureLoader();
			loader.setPath( 'cubeMap/Colosseum/' );
			var textureCube1 = loader.load( [
				'posx.jpg', 'negx.jpg',
				'posy.jpg', 'negy.jpg',
				'posz.jpg', 'negz.jpg'
			] );
			textureCube1.minFilter = THREE.LinearMipMapLinearFilter;
			var textureCubeIrr1 = loader.load( [
				'posx_iem.jpg', 'negx_iem.jpg',
				'posy_iem.jpg', 'negy_iem.jpg',
				'posz_iem.jpg', 'negz_iem.jpg'
			] );
			textureCubeIrr1.minFilter = THREE.LinearMipMapLinearFilter;			
			
			loader.setPath( 'cubeMap/FishermansBastion/' );
			var textureCube2 = loader.load( [
				'posx.jpg', 'negx.jpg',
				'posy.jpg', 'negy.jpg',
				'posz.jpg', 'negz.jpg'
			] );
			textureCube2.minFilter = THREE.LinearMipMapLinearFilter;
			var textureCubeIrr2 = loader.load( [
				'posx_iem.jpg', 'negx_iem.jpg',
				'posy_iem.jpg', 'negy_iem.jpg',
				'posz_iem.jpg', 'negz_iem.jpg'
			] );
			textureCubeIrr2.minFilter = THREE.LinearMipMapLinearFilter;
			
			loader.setPath( 'cubeMap/FortPoint/' );
			var textureCube3 = loader.load( [
				'posx.jpg', 'negx.jpg',
				'posy.jpg', 'negy.jpg',
				'posz.jpg', 'negz.jpg'
			] );
			textureCube3.minFilter = THREE.LinearMipMapLinearFilter;
			var textureCubeIrr3 = loader.load( [
				'posx_iem.jpg', 'negx_iem.jpg',
				'posy_iem.jpg', 'negy_iem.jpg',
				'posz_iem.jpg', 'negz_iem.jpg'
			] );
			textureCubeIrr3.minFilter = THREE.LinearMipMapLinearFilter;
			
			// TEXTURE DA PASSARE AGLI SHADER
			// pietra.frag
			var specularMapPietra = new THREE.TextureLoader().load("textures/pietra_2048/Specular.png");
			specularMapPietra.needsUpdate = true;			
			var diffuseMapPietra = new THREE.TextureLoader().load("textures/pietra_2048/Diffuse.png");
			diffuseMapPietra.needsUpdate = true;
			var roughnessMapPietra = new THREE.TextureLoader().load("textures/pietra_2048/Roughness.png");
			roughnessMapPietra.needsUpdate = true;
			var normalMapPietra = new THREE.TextureLoader().load("textures/pietra_2048/Normal.png");
			normalMapPietra.needsUpdate = true;
			// fingerprint.frag
			var diffuseMapFingerprint = new THREE.TextureLoader().load("textures/fingerprint_1024/Base_Color.png");
			diffuseMapFingerprint.wrapS = diffuseMapFingerprint.wrapT = THREE.RepeatWrapping;
			diffuseMapFingerprint.needsUpdate = true;
 			var specularMapFingerprint = new THREE.TextureLoader().load("textures/fingerprint_1024/Specular.png");
			specularMapFingerprint.wrapS = specularMapFingerprint.wrapT = THREE.RepeatWrapping;
			specularMapFingerprint.needsUpdate = true;
			var roughnessMapFingerprint = new THREE.TextureLoader().load("textures/fingerprint_1024/Roughness.png");
			roughnessMapFingerprint.wrapS = roughnessMapFingerprint.wrapT = THREE.RepeatWrapping;		
			roughnessMapFingerprint.needsUpdate = true;
			var normalMapFingerprint = new THREE.TextureLoader().load("textures/fingerprint_1024/Normal.png");
			normalMapFingerprint.wrapS = normalMapFingerprint.wrapT = THREE.RepeatWrapping;	
			normalMapFingerprint.needsUpdate = true;
			var aoMapFingerprint = new THREE.TextureLoader().load("textures/fingerprint_1024/Ambient_Occlusion.png");
			aoMapFingerprint.wrapS = aoMapFingerprint.wrapT = THREE.RepeatWrapping;
			aoMapFingerprint.needsUpdate = true;
			
			// UNIFORMS DA PASSARE AGLI SHADER
			
			// uniform per il materiale pietra (da texture)
			var uniformsPietra = {
						pointLightPosition:	{ type: "v3", value: new THREE.Vector3(10.0, 10.0, -10.0) },
						clight:	{ type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
						pointLightPosition2:	{ type: "v3", value: new THREE.Vector3(-10.0, 10.0, 10.0) },
						clight2:	{ type: "v3", value: new THREE.Vector3(0.5, 0.5, 0.5) },
						ambientLight: { type: "v3", value: new THREE.Vector3(0.3, 0.3, 0.3) },
						normalScale: { type: "v2", value: new THREE.Vector2(0.0,0.0) },
						specularMap: {type: "t", value: specularMapPietra },
						diffuseMap: {type: "t", value: diffuseMapPietra },
						roughnessMap: {type: "t", value: roughnessMapPietra },
						normalMap: {type: "t", value: normalMapPietra }
			};
			
			// uniform per il materiale pietra (con luce direzionale)
			var uniformsPietraDirectional = {
						lightDirection:	{ type: "v3", value: new THREE.Vector3(10.0, 10.0, -10.0) },
						lightPower:	{ type: "v3", value: new THREE.Vector3(0.5, 0.5, 0.5) },
						ambientLight: { type: "v3", value: new THREE.Vector3(0.3, 0.3, 0.3) },
						normalScale: { type: "v2", value: new THREE.Vector2(0.0,0.0) },
						specularMap: {type: "t", value: specularMapPietra },
						diffuseMap: {type: "t", value: diffuseMapPietra },
						roughnessMap: {type: "t", value: roughnessMapPietra },
						normalMap: {type: "t", value: normalMapPietra }
			};
			
			// uniform per il materiale fingerprint (da texture)
			var uniformsFingerprint = {
						pointLightPosition:	{ type: "v3", value: new THREE.Vector3(10.0, 10.0, -10.0) },
						clight:	{ type: "v3", value: new THREE.Vector3(1.0, 1.0, 1.0) },
						ambientLight: { type: "v3", value: new THREE.Vector3(0.2, 0.2, 0.2) },
						normalScale: { type: "v2", value: new THREE.Vector2(0.0,0.0) },
						textureRepeat: { type: "v2", value: new THREE.Vector2(16,16) },
						specularMap: {type: "t", value: specularMapFingerprint },
						diffuseMap: {type: "t", value: diffuseMapFingerprint },
						roughnessMap: {type: "t", value: roughnessMapFingerprint },
						normalMap: {type: "t", value: normalMapFingerprint },
						aoMap: {type: "t", value: aoMapFingerprint },
						envMap: { type: "t", value: textureCube1 },
						IrrEnvMap: { type: "t", value: textureCubeIrr1 }
			};
			
			// uniforms per il materiale oro
			var uniformsOro = {
						pointLightPosition:	{ type: "v3", value: new THREE.Vector3(10.0, 10.0, -10.0) },
						clight:	{ type: "v3", value: new THREE.Vector3(0.8, 0.8, 0.8) },
						cdiff:	{ type: "v3", value: new THREE.Vector3(0.0, 0.0, 0.0) },
						cspec:	{ type: "v3", value: new THREE.Vector3(1.022, 0.782, 0.344) }, // oro
						roughness: { type: "f", value: 0.6 },
						envMap: { type: "t", value: textureCube1 }
			};
			
			// per utilizzare questi attributi dei materiali
			var materialExtensions = {
				derivatives: true, // set to use derivatives
				shaderTextureLOD: true // set to use shader texture LOD
			};
			
			// imposto il valore della variabile materialeShader per poi averlo pronto quando carico il modello
			scegliShader();
			
			function init() {
				container = document.getElementById( 'canvas' );
				larghezza = document.getElementById('canvas').clientWidth;
				altezza = document.getElementById('canvas').clientHeight;
				
				scene = new THREE.Scene();
				scene.background = new THREE.Color("white");
				
				// configurazione camera
				camera = new THREE.PerspectiveCamera(45, larghezza / altezza, 1, 400);
				camera.position.set(0, 3, -20);
				camera.lookAt(new THREE.Vector3(0,0,0));
				
				// aggiungo i controlli
				controls = new THREE.OrbitControls( camera );
				// imposto le distanze per lo zoom-in e zoom-out
				controls.minDistance = 12;
				controls.maxDistance = 28;
				controls.maxPolarAngle = Math.PI/2;
				controls.update();
				
				// rappresentazione geometrica luce puntuale (che ho gia aggiunto agli uniforms)
				var lucePuntuale = new THREE.Mesh( new THREE.SphereGeometry( 1, 16, 16), new THREE.MeshBasicMaterial ( {color: 0xffff00, wireframe:true} ) );
				lucePuntuale.position.set( 10.0, 10.0, -10.0 );
				scene.add(lucePuntuale);
				lucePuntuale2 = new THREE.Mesh( new THREE.SphereGeometry( 0.75, 16, 16), new THREE.MeshBasicMaterial ( {color: 0xffff00, wireframe:true} ) );
				lucePuntuale2.position.set( -10.0, 10.0, 10.0 );
				scene.add(lucePuntuale2);
				
				// carico il modello 3D
				caricaNuovoModello();

				// creo un oggetto per nascondere i difetti della base del modello
				var baseGeometry = new THREE.BoxGeometry(10,1,10); // Misure arbitrarie, che siano sufficientemente elevate
				var baseMaterial = new THREE.MeshBasicMaterial( {color: 0xFFFFFF}); // TEMP dovra' essere trasparente
				baseAngioletto = new THREE.Mesh(baseGeometry, baseMaterial);
				baseAngioletto.position.y = -5;
			    scene.add(baseAngioletto);
				
				// configuro il renderer
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( larghezza, altezza );
				renderer.gammaOutput = true;
				container.appendChild( renderer.domElement );
				window.addEventListener( 'resize', onWindowResize, false );
				
				// stats
				stats = new Stats();
				//container.appendChild( stats.dom );
				
			} // init()
			
			function caricaNuovoModello(){
				var loader = new THREE.GLTFLoader();
				loader.load( '3df_zephyr_example_0/scene.gltf', function ( gltf ) {
					gltf.scene.traverse( function ( child ) {
						if ( child.isMesh ) {
						// applico lo shader ad ogni figlio
						child.material = materialeShader;
						child.material.needsUpdate = true;
						}
					} );
					// l'oggetto e' molto grande quindi riduco le sue dimensioni per lavorare con valori "accettabili"
					gltf.scene.scale.multiplyScalar( 0.01 );
					gltf.scene.position.set(0,0,0);
					scene.add( gltf.scene );
					console.log(gltf.scene);
				} );
			}
			
			function rimuoviModello(){
				if(scene.children.length > 2){ // la luce puntuale, la base dell'oggetto e l'oggetto
					scene.remove(scene.getObjectByName("OSG_Scene"));
				}
			}
			
			function aggiornaCubeMap(){
				if(cubemap != cubemapLocale){
					// aggiorno l'environment map
					uniformsOro.envMap.value = scegliCubeMap();
					uniformsOro.envMap.needsUpdate = true;
					// aggiorno l'irradiance map
					uniformsFingerprint.IrrEnvMap.value = scegliIrradianceMap();
					uniformsFingerprint.IrrEnvMap.needsUpdate = true;
					// aggiorno la variabile locale dopo aver applicato le modifiche
					cubemapLocale = cubemap;
				}
			}
			
			function aggiornaMateriale(){
				if(materiale != materialeLocale){  // se il valore del materiale (globale) e' stato cambiato
					rimuoviModello();  // rimuovo il modello dalla scena
					caricaNuovoModello();  // carico un nuovo modello con il materiale aggiornato
					materialeLocale = materiale; // aggiorno la variabile locale dopo aver applicato le modifiche
				}
			}
			
			function onWindowResize() {
				camera.aspect = larghezza / altezza;
				camera.updateProjectionMatrix();
				renderer.setSize( larghezza, altezza );
			}

			function animate() {
				// controllo se devo modifcare le env map
				aggiornaCubeMap();
				// controllo se devo cambiare il materiale
				aggiornaMateriale();
				// controllo che si veda/non si veda la seconda luce
				if(materiale != "pietra"){
					lucePuntuale2.visible = false;
				}else{
					lucePuntuale2.visible = true;
				}
				
				requestAnimationFrame( animate );
				renderer.render( scene, camera );
				stats.update();
			} // animate()
			
			init();
			animate();
