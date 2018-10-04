// FUNZIONI AUSILIARIE PER CARICARE LO SHADER CORRETTO E GESTIRE IL MATERIALE DEL MODELLO 3D IN BASE AI CLICK SUI MATERIALI DEL SITO
/**
 * This is a basic asyncronous shader loader for THREE.js.
 * 
 * It uses the built-in THREE.js async loading capabilities to load shaders from files!
 * 
 * `onProgress` and `onError` are stadard TREE.js stuff. Look at 
 * https://threejs.org/examples/webgl_loader_obj.html for an example. 
 * 
 * @param {String} vertex_url URL to the vertex shader code.
 * @param {String} fragment_url URL to fragment shader code
 * @param {function(String, String)} onLoad Callback function(vertex, fragment) that take as input the loaded vertex and fragment contents.
 * @param {function} onProgress Callback for the `onProgress` event. 
 * @param {function} onError Callback for the `onError` event.
 */
function ShaderLoader(vertex_url, fragment_url, onLoad, onProgress, onError) {
  var vertex_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
  vertex_loader.setResponseType('text');
  vertex_loader.load(vertex_url, function (vertex_text) {
	var fragment_loader = new THREE.FileLoader(THREE.DefaultLoadingManager);
	fragment_loader.setResponseType('text');
	fragment_loader.load(fragment_url, function (fragment_text) {
	  onLoad(vertex_text, fragment_text);
	});
  }, onProgress, onError);
}
			
// Funzione chiamata dall'evento onClick passandogli il nome del materiale da impostare alla variabile globale materiale
function cambiaMateriale(nuovoMateriale){
	materiale = nuovoMateriale;  // cambio la variabile globale
	scegliShader(); // applico la modifica
}
			
// In base al valore della variabile globale materiale (una stringa che contiene il nome del materiale, modificata dal click sulla pagina html del sito)
// imposto il valore della variabile globale materialeShader che mi dice quale shader (compresi uniforms, vertex, fragment,...) utilizzare per il modello
function scegliShader(){
	switch(materiale){
		case "pietra":
			ShaderLoader("shader/base.vert", ("shader/pietra.frag"),
				function (vertex, fragment) {
					materialeShader = new THREE.ShaderMaterial({
					uniforms: uniformsPietra,
					vertexShader: vertex,
					fragmentShader: fragment,
					extensions: materialExtensions
					});
				}
			)
			break;
		case "oro":
			ShaderLoader("shader/base.vert", ("shader/oro.frag"),
				function (vertex, fragment) {
					materialeShader = new THREE.ShaderMaterial({
					uniforms: uniformsOro,
					vertexShader: vertex,
					fragmentShader: fragment,
					extensions: materialExtensions
					});
				}
			)
			break;
		case "fingerprint":
			ShaderLoader("shader/base.vert", ("shader/fingerprint.frag"),
				function (vertex, fragment) {
					materialeShader = new THREE.ShaderMaterial({
					uniforms: uniformsFingerprint,
					vertexShader: vertex,
					fragmentShader: fragment,
					extensions: materialExtensions
					});
				}
			)
			break;
		case "dinamico":
			ShaderLoader("shader/base.vert", ("shader/dinamico.frag"),
				function (vertex, fragment) {
					materialeShader = new THREE.ShaderMaterial({
					uniforms: uniformsDinamico,
					vertexShader: vertex,
					fragmentShader: fragment,
					extensions: materialExtensions
					});
				}
			)
			break;
		case "pietraDirectional":
			ShaderLoader("shader/base.vert", ("shader/directional.frag"),
				function (vertex, fragment) {
					materialeShader = new THREE.ShaderMaterial({
					uniforms: uniformsPietraDirectional,
					vertexShader: vertex,
					fragmentShader: fragment,
					extensions: materialExtensions
					});
				}
			)
			break;
		default:
			break;
	} // switch	
}

// Funzione chiamata dall'evento onClick passandogli il nome della cubemap da impostare alla variabile globale cubemap
function cambiaCubeMap(nuovaCubeMap){
	cubemap = nuovaCubeMap;
}

// In base al valore della variabile globale cubemap restituisco la texture corrispondente
function scegliCubeMap(){
	switch(cubemap){
		case "colosseo":
			return textureCube1;
		case "fisherman":
			return textureCube2;
		case "fortpoint":
			return textureCube3;
		default:
			break;
	}
}

// In base al valore della variabile globale cubemap restituisco la texture corrispondente
function scegliIrradianceMap(){
	switch(cubemap){
		case "colosseo":
			return textureCubeIrr1;
		case "fisherman":
			return textureCubeIrr2;
		case "fortpoint":
			return textureCubeIrr3;
		default:
			break;
	}
}

// Funzione chiamata dall'evento onClick passandogli stop/play per mettere in movimento oppure fermare l'animazione
function cambiaStatoLuce1(movimento) {
	if(movimento == 'stop'){
		luceMov = false;
	}else{
		luceMov = true;
	}
}
		
// Funzione chiamata dall'evento onClick passandogli stop/play per mettere in movimento oppure fermare l'animazione
function cambiaStatoLuce2(movimento) {
	if(movimento == 'stop'){
		luceMov2 = false;
	}else{
		luceMov2 = true;
	}
}

// Funzione chiamata dall'evento onClick passandogli stop/play per mettere in movimento oppure fermare l'animazione
function cambiaStatoAngioletto(movimento) {
	if(movimento == 'stop'){
		angiolettoMov = false;
	}else{
		angiolettoMov = true;
	}
}

// Funzione chiamata dall'evento onClick passandogli lo stato dell'interruttore della luce (on/off)
function interruttoreLuce1(stato){
	if(stato == 'off'){  // spengo la luce
		lucePuntuale.material.color = new THREE.Color(0.5,0.5,0.5);  // materiale grigio = luce spenta
		uniformsDinamico.clight.value = new THREE.Vector3(0.0,0.0,0.0); // azzero clight
		uniformsDinamico.clight.needsUpdate = true;
		animaRGB1 = false; // interrompo l'animazione
		luceAccesa = false; // spengo la luce
	}else{ // luce on
		if(!luceAccesa){ // solo se la luce e' spenta
			lucePuntuale.material.color = new THREE.Color(1,1,0); // materiale giallo = luce accesa
			uniformsDinamico.clight.value = new THREE.Vector3(1.0,1.0,1.0);
			uniformsDinamico.clight.needsUpdate = true;
			luceAccesa = true; // accendo la luce
		}
	}
}

// Funzione chiamata dall'evento onClick passandogli lo stato dell'interruttore della luce (on/off)
function interruttoreLuce2(stato){
	if(stato == 'off'){ // spengo la luce
		lucePuntuale2.material.color = new THREE.Color(0.5,0.5,0.5);  // materiale grigio = luce spenta
		uniformsDinamico.clight2.value = new THREE.Vector3(0.0,0.0,0.0); // azzero clight2
		uniformsDinamico.clight2.needsUpdate = true;
		animaRGB2 = false; // interrompo l'animazione
		luceAccesa2 = false; // spengo la luce
	}else{ // luce on
		if(!luceAccesa2){ // solo se la luce e' spenta
			lucePuntuale2.material.color = new THREE.Color(1,1,0); // materiale giallo = luce accesa
			uniformsDinamico.clight2.value = new THREE.Vector3(0.8,0.8,0.8);
			uniformsDinamico.clight2.needsUpdate = true;
			luceAccesa2 = true; // accendo la luce
		}
	}
}

// Restituisce numeri x tali che: min <= x <= max
function randomConRange(min, max){
	var range = (max - min) +1;
	return (Math.floor(Math.random() * range) + min);
}

// Funzione chiamata dall'evento onClick passandogli il numero della luce (1 o 2) di cui attivare/disattivare l'animazione RGB
function animaRGB(numeroLuce){
	if(numeroLuce == 1){  // scelgo su quale delle due luci attivare l'animazione
		if(luceAccesa){ // a condizione che la luce sia accesa
			animaRGB1 = !animaRGB1; // cambio lo stato da true a false e viceversa
		}
	}else{
		if(luceAccesa2){
			animaRGB2 = !animaRGB2;
		}
	}
}

// Funzione che modifica il valore di una delle tre componenti di clight
function modificaRGB1(){
		var componenteRGB = randomConRange(0,2); // scelgo quale delle tre componenti modificare
		var valoreComponente = randomConRange(0,1000) / 1000; // nuovo valore per la componente scelta; valore in [0,1] con tre cifre dopo la virgola 
		switch(componenteRGB){
			case 0:
				uniformsDinamico.clight.value.x = valoreComponente; // modifico clight
				uniformsDinamico.clight.needsUpdate = true;
				lucePuntuale.material.color.r = valoreComponente; // modifico il colore del materiale della sfera che rappresenta la luce
				break;
			case 1:
				uniformsDinamico.clight.value.y = valoreComponente;
				uniformsDinamico.clight.needsUpdate = true;
				lucePuntuale.material.color.g = valoreComponente;
				break;
			case 2:
				uniformsDinamico.clight.value.z = valoreComponente;
				uniformsDinamico.clight.needsUpdate = true;
				lucePuntuale.material.color.b = valoreComponente;
				break;		
		}
}

// Funzione che modifica il valore di una delle tre componenti di clight2
function modificaRGB2(){
		var componenteRGB = randomConRange(0,2); // scelgo quale delle tre componenti modificare
		var valoreComponente = randomConRange(0,1000) / 1000; // nuovo valore per la componente scelta; valore in [0,1]
		switch(componenteRGB){
			case 0:
				uniformsDinamico.clight2.value.x = valoreComponente; // modifico clight2
				uniformsDinamico.clight2.needsUpdate = true;
				lucePuntuale2.material.color.r = valoreComponente; // modifico il colore del materiale della sfera che rappresenta la luce
				break;
			case 1:
				uniformsDinamico.clight2.value.y = valoreComponente;
				uniformsDinamico.clight2.needsUpdate = true;
				lucePuntuale2.material.color.g = valoreComponente;
				break;
			case 2:
				uniformsDinamico.clight2.value.z = valoreComponente;
				uniformsDinamico.clight2.needsUpdate = true;
				lucePuntuale2.material.color.b = valoreComponente;
				break;		
		}
}