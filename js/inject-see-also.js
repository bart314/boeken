Promise.all([
    fetch('../js/data/boekendata.json'),
    fetch('../js/data/recommendations.json')
])
.then( resp => Promise.all(resp.map(r => r.json())) )
.then ( data => {
    const see_also = document.getElementById('see-also')
    const boeken = data[0]
    const recs = data[1].filter(el => el.nr == see_also.dataset['nummer'])
    if (recs.length > 0) {
        const api_url = (document.location.href.indexOf('localhost') < 0) 
            ? 'https://mandarin.nl/boeken/' 
            : 'http://localhost:8008/'

        let html = '<h2>Bekijk ook eens</h2><ul class="books">'
        recs[0]['recommendations'].forEach( r => {
            const book = boeken.filter ( b => b.nr == r)[0]
            html += `<li><a href="${api_url}${book.link}">`
            html += `<img src="${api_url}${book.cover}" alt="Cover van het boek">`
            html += `<p>${book.titel}</p>`
        })
        html += '</ul>'
        see_also.innerHTML = html
    }
})
