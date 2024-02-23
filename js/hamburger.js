
function change(id){ 
    const link = `${window.location.origin}${window.location.pathname}#${id}`
    const menu = document.getElementById('menu')
    menu.classList.remove('animate-open')
    menu.classList.add('animate-close')
    document.location = link
}


document.querySelectorAll('h2').forEach( h => h.addEventListener('click', evt => {
    let link = evt.target.innerHTML.toLocaleLowerCase().replace(/[,-]/g,'')
    link = link.replace(/  */g,'-')
    link = link.replace(/'/g,'')
    document.location = document.location.href.match(/(^[^#]*)/)[0] + `#${link}`
}))

document.querySelectorAll('section').forEach ( s => {
    const title = s.querySelector('h2').innerHTML
    document.getElementById('menu').innerHTML 
        += `<li onclick="change('${s.id}')">${title}</li>`
    
})

document.querySelector('#menu-container img').addEventListener('click', e => {
    const menu = document.getElementById('menu')
    const op = getComputedStyle(menu).getPropertyValue('opacity')
    if (op == 1) {
        menu.classList.remove('animate-open')
        menu.classList.add('animate-close')
    } else {
        menu.classList.remove('animate-close')
        menu.classList.add('animate-open')
    }
})