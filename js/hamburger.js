
function change(id){ 
    const link = `${window.location.origin}${window.location.pathname}#${id}`
    close_menu()
    document.location = link
}

function close_menu() {
    const menu = document.getElementById('menu')
    menu.classList.remove('animate-open')
    menu.classList.add('animate-close')
}


document.querySelectorAll('h2').forEach( h => h.addEventListener('click', evt => {
    let link = evt.target.innerHTML.toLocaleLowerCase().replace(/[,-]/g,'')
    link = link.replace(/  */g,'-')
    link = link.replace(/'/g,'')
    document.location = document.location.href.match(/(^[^#]*)/)[0] + `#${link}`
}))

document.querySelectorAll('section').forEach ( s => {
    const title = s.querySelector('h2').innerHTML
    const link = `${window.location.origin}${window.location.pathname}#${s.id}`

    document.getElementById('menu').innerHTML 
        += `<li><a href="${link}">${title}</a></li>`
        
    s.addEventListener('click', close_menu)
})

document.getElementById('menu-container').addEventListener('click', e => {
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