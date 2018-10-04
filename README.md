# ProductVisualization

## Progetto a cura di Pellizzari Luca e Baradel Luca

### Idea Generale

Lo scopo del progetto è creare un sito sperimentale di visualizzazione di un ipotetico prodotto, all'interno di un canvas nella pagina tramite l'utilizzo di Three.js e la possibilità, attraverso comandi situati nella pagina del browser, di modificare la scena e i materiali dell'oggetto visualizzato, così come di poter vedere l'oggetto in una scena dinamica con due luci puntuali rotanti attorno al modello di colore variabile.
Si è pensato di utilizzare una statuina di un angioletto come soggetto del progetto. La scelta è stata fatta in quanto una statuina di angioletto è un oggetto semplice ma che può essere presentato in molti materiali differenti, pertanto si prestava esattamente alle nostre richieste.

### Realizzazione

Il progetto è stato realizzato in una pagina web completa, attraverso la quale è possibile interagire con il modello, in essa sono presenti alcune sezione di descrizione del prodotto, e una sezione laterale attraverso la quale interagire con il modello e la scena. Nella pagina principale è presente una scena che chiamermo *statica* nella quale è possibile cambiare i materiali del modello. E' possibile inoltre cambiare la **environment map** che varia i riflessi nel modello, molto evidente nel caso dell'oro. Da questa sezione è presente un link alla pagina che chiameremo *dinamica*. In quest'ultima la struttura è la stessa di quella *statica*, le differenze sono nella sezione laterale e nella scena. In questa pagina il modello avrà una lenta rotazione e attorno ad esso ruoteranno a velocità diverse due luci. Modello e luci possono essere fermati attraverso la barra dei comandi laterale, è possibile inoltre far variare la tonalità delle luci o disabilitarle.

### Scelte progettuali e svolgimento

#### Shader

Nella realizzazione di alcuni shader si è scelto di utilizzare:
* BRDF Lambertiana per il calcolo della riflessione diffusiva.
* BRDF Specular (Fresnel, Gemoetry, Normal Distribution Function).
* Environment Map per la riflessione di un ipotetico ambiente esterno.
* Shader materiale oro:
    * Luce puntuale
    * Environment Map
* Shader materiale pietra:
    * Applicazione delle texture
    * Due luci puntuali
    * Luce ambientale 
* Shader materiale fingerprint: 
    * Applicazione delle texture 
    * Luce puntuale
    * Luce ambientale
    * Irradiance map
* Shader per la scena dinamica:
    * Due luci puntuali
    * Environment map

Ogni shader è stato gestito in file separati per semplificarne la comprensione e migliorare l'ordine generale del progetto.

#### Svolgimento

1. Per lo sviluppo del progetto si è proceduto innanzitutto con la ricerca del modello che ha portato alla scelta dell'angioletto dal sito https://sketchfab.com/, e relativa verifica del rispetto delle richieste di progetto.

2. Creazione della pagina HTML con un primitivo layout in CSS e verifica del corretto funzionamento del canvas nella pagina.

3. Test di alcuni shader semplici che rispecchino le caratteristiche dei materiali scelti per il modello. Ricerca delle Environment Maps.

4. Implementazione delle funzionalità di interazione con il modello dalla pagina HTML, creazione della pagina *dinamica* e creazione della scena dinamica.

5. Correzioni e aggiunte agli shader, testing e organizzazione del codice.

### Screenshots del progetto

 ![Screenshot 1](/screenshots/Screenshot1.jpg)
 ![Screenshot 2](/screenshots/Screenshot2.jpg)
 ![Screenshot 3](/screenshots/Screenshot3.jpg)
 ![Screenshot 4](/screenshots/Screenshot4.jpg) 

### Fonti e Software

* https://sketchfab.com/
* http://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/
* https://stackoverflow.com/questions/29928973/how-do-you-update-a-uniform-in-three-js
* Bitmap2Material (Generazione texture)
* cmftStudio (Generazione Irradiance Map da Cube Map)
* Firefox, Chrome (Browser per i tests)
