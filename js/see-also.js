const els = document.querySelectorAll('#see-also li')
els.forEach( book => {
  let html = `<a href="${book.dataset.link}">`
  html += `<img src="${book.dataset.cover}" alt="Cover van het boek">`
  html += `<p>${book.dataset.titel}</p>`
  book.innerHTML = html
})
