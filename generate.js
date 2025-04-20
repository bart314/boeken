const fs = require("fs");

const args = process.argv.slice(2) 
const titel = args[0]
if (titel==null) {
    console.error('ERROR: er is geen titel opgegeven')
    process.exit()
}

const titel_intern = titel.toLowerCase().replaceAll(' ', '-')
const dir = args[1] == null ? new Date().getFullYear() : args[1]

if (!fs.existsSync(`${dir}/`)) {
    console.error(`ERROR: directory ${dir} bestaat niet`)
    process.exit()
}
if (fs.existsSync(`${dir}/${titel_intern}.html`)) {
    console.log(`ERROR: bestand ${titel_intern}.html bestaat al in ${dir}`)
    process.exit()
}

const vandaag = new Intl.DateTimeFormat("nl-NL", {dateStyle:"full"}).format(new Date())

const template = `
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boeken – ${titel}</title>
    <link rel="stylesheet" href="../newstyle.css">
</head>
<body>

<section id="${titel_intern}">
  <div class="content" id="content">
    <div class="info">
      <p>Verslag nummer 67</p>
      <p>Toegevoegd op ${vandaag}</p>
      <p>AANTAL WOORDEN</p>
    </div>
    <h1>${titel}</h1>
    CONTENT HIER
  </div><!-- content -->

<div class="sidebar" id="sidebar">
    <div class="data">
        <p><img src="imgs/${titel_intern}.jpeg" alt="Cover van het boek"></p>
        <p id="rating" data-rating="3"></p>
        <p>TITEL HIER</p>
        <p>UITGEVERIJ EN JAARTAL</p>
        <p>AANTAL PAGINA'S</p>
        <p>UITGELEZEN</p>
    </div>

    <div class="auteur">
        <h3>Over de Auteur</h3>
        <p>OVER DE AUTEUR</p>
    </div>

    <div id="toc">
      <div id="prev" onclick="document.location='ripetta.html'">
        <h4>Vorig boek</h4>
        <img src="imgs/ripetta.jpeg">
      </div>
      <div id="next">
        <h4>Volgend boek</h4>
      </div>
    </div><!-- toc -->

    <div id="subnav"> <a href="../">2025</a> <a href="../overzicht.html">Alle boeken</a> </div>
</div><!-- sidebar -->
</section>

<div id="see-also" data-nummer="67"> </div><!-- see-also -->

<script src="../js/inject-see-also.js"></script>
<script src="../js/scroll.js"></script>
    
</body>
</html>
`

fs.writeFileSync(`${dir}/${titel_intern}.html`, template)