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