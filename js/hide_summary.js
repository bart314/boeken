const summary = document.querySelector('summary')
summary.style.display = 'none'
document.querySelector('h2 span').addEventListener('click', el => {
  if (summary.style.display == 'none') { 
    summary.style.display = 'block'
    el.target.innerHTML = '(verbergen)'
    document.getElementById('word-count').innerHTML = `${summary.dataset['with']} woorden`
  } else {
    summary.style.display = 'none'
    el.target.innerHTML = '(tonen)'
    document.getElementById('word-count').innerHTML = `${summary.dataset['without']} woorden`
  }
})