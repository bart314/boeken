const mq = window.matchMedia('(min-width: 768px)')
console.log(mq.matches)

if(mq.matches) {
  const el = document.getElementById('content')
  const data = document.getElementById('sidebar')
  const factor = data.clientHeight / el.clientHeight

  document.addEventListener('scroll', () => {
    data.style.top = 0-factor * document.scrollingElement.scrollTop
  })
}