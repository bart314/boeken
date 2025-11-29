const summary = document.querySelector('summary')
summary.style.display = 'none'
document.querySelector('h2 span').addEventListener('click', el => {
  if (summary.style.display == 'none') { 
    summary.style.display = 'block'
    el.target.innerHTML = '(verbergen)'
  } else {
    summary.style.display = 'none'
    el.target.innerHTML = '(tonen)'
  }
})