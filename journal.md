# Journal

*29 maggio*

Ricerca di possibili file 3D per lo svolgimento del progetto dal sito SketchFab.

*1 giugno*

Test del corretto funzionamento dei file e del giusto rapporto qualità/complessità degli oggetti trovati.

*4 giugno*

Aggiunti file html e CSS per la visiualizzazione di un prodotto in un sito generico, è stato creato un sito di prova in modo da rispecchiare un possibile layout e una possibile applicazione reale.

*20 giugno*

Applicati alcuni semplici shader al modello

*21 giugno*

* Inserito uno shader che carica la texture al modello e un paio di luci
* Trovate alcune environment map per il modello
* Inserito lo shader per materiale metallico (primo tentativo con l'oro)

*22 giugno*

* Fix alla pagina html del sito
* Shader in file separati

*23 giugno*

* Aggiunta la possibilità di cambiare materiale tramite click sul sito
* Spostata la scena da file html a file js per gestirla più comodamente
* Inserito file js esterno con funzioni ausiliarie per gestire il cambio dei materiali

*27 giugno*

* Aggiunta la possibilità di cambiare cubemap dal sito
* Sistemata applicazione della texture pietra (errore nel valore del parametro normalScale negli uniform)

*28 giugno*

* Spostato il file ausiliarie.js nella cartella lib
* Limitati gli OrbitControls in modo che non si veda la parte inferiore (la base) della scultura

*29 giugno*

* Aggiunto piano per mascherare gli errori della base del modello
* Creata pagina secondaria per la visualizzazione del prodotto con luci dinamiche
* Aggiunta mini-sezione acquisto
* Aggiunta irradiance map allo shader pietra.frag

*30 giugno*

* Inserita scena dinamica con possibilita di mettere in pausa singolarmente i vari elementi che compongono l'animazione
* Inserito nuovo shader per la scena
* Fix agli altri shader

*1 luglio*

Aggiunta la possibilità di accendere e spegnere le luci durante l'animazione presente sul sito 

*4 luglio*

* Aggiunto shader per il materiale plastica
* Rimossa environment map per il materiale pietra, dava un contributo troppo forte; sostituita dalla corrispondente irradiance map

*8 luglio*

Aggiunta la possibilita di attivare un'animazione che modifica il valore delle componenti RGB delle luci accese nella scena

*11 luglio*

Aggiunti commenti e rimossi dati non utilizzati negli shader

*12 luglio*

Scelto nuovo shader (fingerprint) e rivisti shader precedenti (modificato calcolo dell'irradianza da texture)

*15 luglio*

Ultime correzioni e testing finale

*26 luglio (post consegna)*

* Varie cubemap e texture raggruppate in due cartelle
* Migliorato main.css per la scena dinamica
* Inserito shader con luce direzionale (impostato come default all'avvio del progetto dal sito, poi si può scegliere fra gli altri tre onClick dal sito: pietra, fingerprint e oro)

## Situazione Shader:

* base.vert = vertex shader uguale per tutti i fragment shader (calcola la posizione in clip space e passa le coordinate uv per l'applicazione delle texture)
* oro.frag = luce puntuale, environment map
* pietra.frag = applicazione texture, luce puntuale, luce ambientale, irradiance map
* fingerprint.frag = applicazione texture, luce puntuale, luce ambientale, irradiance map
* dinamico.frag = due luci puntuali, environment map
* directional.frag = luce direzionale, luce ambientale, applicazione texture pietra (post consegna)

## Difficoltà incontrate

* Gestire gli shader in file separati
* Gestire il cambiamento dei materiali del modello tramite "click" sul logo del materiale sulla pagina html
* Ottenere irradiance map dalle texture

## Browser utilizzati per i test

* Chrome
* Firefox

## Altri software utilizzati

* Bitmap2material per generare le varie texture da utilizzare negli shader
* cmftStudio per ottenere l'irradiance map a partire da una cubemap

## Fonti

* https://sketchfab.com/
* http://www.davideaversa.it/2016/10/three-js-shader-loading-external-file/
* https://stackoverflow.com/questions/29928973/how-do-you-update-a-uniform-in-three-js
