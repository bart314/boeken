Promise.all([
    fetch('js/data/boekendata.json'),
    fetch('js/data/recommendations.json')
])
.then( resp => Promise.all(resp.map(r => r.json())) )
.then ( data => {
    const boeken = data[0]
    const recs = data[1]
    let drop_down = ''
    let recs_vals = ''
    boeken.forEach( boek => {
        drop_down += `<option value="${boek.nr}">
            <span><img src="${boek.cover}" alt=""></span>
            <span>${boek.titel}</span>
        </option>`
        recs_vals += `
            <label for="boek${boek.nr}">
                <p><img src="${boek.cover}"></p>
                <p><b>${boek.titel} (${boek.nr})</b></p>
                <p><input data-id="${boek.nr}" type="checkbox" name="boek${boek.nr}" id="boek${boek.nr}"></p>
            </label> `
    })
    document.querySelectorAll('input[type=checkbox]').forEach( el => el.checked = false )
    document.getElementById('labels').innerHTML = recs_vals
    document.getElementById('current').innerHTML = drop_down
    document.getElementById('current').addEventListener('change', current => {
        const foo = recs.filter( b => b.nr == current.target.value)
        if (foo.length == 1) {
            foo[0].recommendations.forEach( r => document.getElementById(`boek${r}`).checked = true )
        }
    })

    document.getElementById('sbmt').addEventListener('click', () => {
        const current = Number(document.getElementById('current').options[document.getElementById('current').selectedIndex].value)
        const selected_recs = [...document.querySelectorAll("input[type='checkbox']:checked")]
        const new_entry = {nr:current, recommendations:selected_recs.map( el => Number(el.dataset.id) )}
        const result = add_entry(recs, new_entry)
        console.log(JSON.stringify(result))
        document.querySelector('#result div').innerHTML = JSON.stringify(result)
        document.querySelector('form').style.display = 'none'
        document.querySelector('#result').style.display = 'flex'
    })
})

function add_entry(data, new_entry){
    console.log(JSON.stringify(data))
    const idx = new Map()
    const new_nr = new_entry.nr
    data.forEach( el => idx.set(el.nr, el) )

    // aanpassen van de gerefereerde boeken
    new_entry.recommendations.forEach( r => {
        if (idx.has(r)) {
            // dubbelingen voorkomen...
            if (!idx.get(r).recommendations.includes(new_nr)) idx.get(r).recommendations.push(new_nr)
        } else idx.set(r, {nr:r, recommendations:[new_nr]})
    })

    // aanpassen van het refererende boek
    if (idx.has(new_nr)) idx.get(new_nr).recommendations = new_entry.recommendations
    else idx.set(new_nr, {nr:new_nr, recommendations:new_entry.recommendations})

    return Array.from(idx.values())
}