const fs = require("fs");
const jsdom = require("jsdom")
const { JSDOM } = jsdom;
const crypto = require('crypto')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.resolve('./.env') });
const secret = process.env.SECRET_KEY;

console.log('Checken van alle waarden en dergelijke...')
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

console.log('Waarden samenstellen...')
const link = `${dir}/${titel_intern}.html`
const vandaag = new Intl.DateTimeFormat("nl-NL", {dateStyle:"full"}).format(new Date())
const boekendata = JSON.parse(fs.readFileSync('js/data/boekendata.json', 'utf8'));
const prev = boekendata[boekendata.length - 1]
const id = prev.nr + 1
const nieuwe_data = {
        "nr": id,
        "titel": titel,
        "cover": `${dir}/imgs/${titel_intern}.jpeg`,
        "link": link,
        "auteur": "NOG INVULLEN",
        "taal": "NOG INVULLEN"
}
const signature = crypto
  .createHmac("sha256", secret)
  .update(`${titel_intern}.html`)
  .digest("hex");

boekendata.push(nieuwe_data)
fs.writeFileSync('js/data/boekendata.json', JSON.stringify(boekendata), 'utf8')

console.log('Nieuw bestand maken')
const template = `
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boeken – ${titel}</title>
    <link rel="stylesheet" href="../styles/newstyle.css">
    <link rel="stylesheet" href="../styles/2026.css">
</head>
<body>

<section id="${titel_intern}">
  <div class="content" id="content">
    <div class="info" data-nr="${id}">
      <img class="img-beacon" src="../php/teller.php?file=${titel_intern}.html&sig=${signature}" alt="">
      <p>Verslag nummer ${id}</p>
      <p>Toegevoegd op ${vandaag}</p>
      <p id="word-count">AANTAL WOORDEN</p>
    </div>
    <h1>${titel}</h1>
    CONTENT HIER
  </div><!-- content -->

<div class="sidebar" id="sidebar">
    <div class="data">
        <p><img src="imgs/${titel_intern}.jpeg" alt="Cover van het boek"></p>
        <p id="rating" data-rating="3"></p>
        <p>${titel}</p>
        <p>UITGEVERIJ EN JAARTAL</p>
        <p>AANTAL PAGINA'S</p>
        <p>Uitgelezen: </p>
    </div>

    <div class="auteur">
        <h3>Over de Auteur</h3>
        <p>OVER DE AUTEUR</p>
    </div>

    <div id="toc">
      <div id="prev" onclick="document.location='${prev.link.replaceAll(`${dir}/`, '')}'">
        <h4>Vorig boek</h4>
        <img src="${prev.cover.replaceAll(`${dir}/`, '')}">
      </div>
      <div id="next">
        <h4>Volgend boek</h4>
      </div>
    </div><!-- toc -->

    <div id="subnav"> <a href="../">2026</a> <a href="../overzicht.html">Alle boeken</a> </div>
</div><!-- sidebar -->
</section>

<div id="see-also" data-nummer="${id}"> </div><!-- see-also -->

<script src="../js/inject-see-also.js"></script>
<script src="../js/scroll.js"></script>
    
</body>
</html>
`
fs.writeFileSync(link, template)

console.log('Link naar volgend boek in vorig boek zetten...')
const doc = fs.readFileSync(prev.link, 'utf8')
const dom = new JSDOM(doc.toString())

// Uitgaande van dezelfde directory...
dom.window.document.getElementById('next').outerHTML = `
  <!-- gegenereerde code... -->
  <div id="next" onclick="document.location='${titel_intern}.html'">
    <h4>Volgend boek</h4> 
    <img src="imgs/${titel_intern}.jpeg">
  </div>
`
fs.writeFileSync(prev.link, dom.serialize(), 'utf8')
console.log('klaar.')
