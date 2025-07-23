let links = [
    fetch('../js/data/boekendata.json'),
    fetch('../js/data/recommendations.json')
]
const see_also = document.getElementById('see-also')
if ([61].includes(Number(see_also.dataset.nummer))) links.push(fetch('../js/data/externals.json')) 


Promise.all(links)
.then( resp => Promise.all(resp.map(r => r.json())) )
.then ( data => {
    const boeken = data[0]
    const recs = data[1].filter(el => el.nr == see_also.dataset['nummer'])
    if (recs.length > 0) {
        const api_url = (document.location.href.indexOf('localhost') < 0) 
            ? 'https://mandarin.nl/boeken/' 
            : 'http://localhost:8008/'

        let html = '<h2>Bekijk ook eens</h2><ul class="books">'
        recs[0]['recommendations'].forEach( r => {
            const book = boeken.filter ( b => b.nr == r)[0]
            html += `<li><a href="${api_url}${book.link}">
                <img src="${api_url}${book.cover}" alt="Cover van het boek">
                <p>${book.titel}</p></li>`
        })

        // beetje gekut, maar ik wil toch ook de optie hebben om naar externe pagina's te verwijzen
        if (data[2]) {
            data[2].filter( el => el.nr == see_also.dataset['nummer'])[0].recommendations.forEach( book => {
                html += `<li><a href="${book.link}">
                    <img src="${book.cover}" alt="Cover van het boek">
                    <p>${book.titel}</p></li>
                `
            })
        }
        html += '</ul>'
        see_also.innerHTML = html
    }
})
