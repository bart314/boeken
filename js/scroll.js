const mq = window.matchMedia('(min-width: 768px)')

if(mq.matches) {
  const el = document.getElementById('content')
  const data = document.getElementById('sidebar')
  const factor = data.clientHeight / el.clientHeight

  document.addEventListener('scroll', () => {
    data.style.top = 0-factor * document.scrollingElement.scrollTop
  })
}

//rating
const rating_el = document.getElementById('rating')
if (rating_el) {
  const rating = Number(rating_el.dataset.rating)
  let html = '🍊'.repeat(rating)
  html += '<span>' + '🍊'.repeat(5-rating) + '</span>'
  rating_el.innerHTML = html
}

//views
const el = document.querySelector('div.info')
if (el) {
  el.innerHTML += '<p id="tmp"><img style="width:30px; box-shadow:none;" src="../imgs/spinner.gif"></p>'
  const fn = document.location.pathname.split('/').at(-1)
  
  fetch(`../php/views.php?file=${fn}`)
  .then( r => r.json() )
  .then( json => {
    const aantal = json.total
    const nr = el.dataset.nr
    adding = (nr<77) ? ' (sinds 17 augustus 2025)' : ''
    if (aantal > 0) {
      el.innerHTML += `<p>${aantal} &times; getoond${adding}</p>`
    }
    document.getElementById('tmp').style.display = 'none'
  })
}