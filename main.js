// Consider where you can leverage parameters and arguments
// If there is no else, how could you leverage an else
// Grab the whole object from storage. Not individuals properties at once

// var addToAlbumButton = document.querySelector('.add-to-album-button');
var titleInput =  document.querySelector('.title-input');
var captionInput = document.querySelector('.caption-input');

document.querySelector('.add-to-album-button').addEventListener('click', fotoCardProperties);
document.getElementById('card-article').addEventListener('click', removeFotoCard);
document.getElementById('card-article').addEventListener('click', favoriteFotoCard);
document.getElementById('card-article').addEventListener('focusout', updateCardInputs);


reloadCards();

function favoriteFotoCard(e) {
  if (e.target.className === 'favorite-icon') {
    let id = e.target.closest('.card').id;
    let parsedFoto = JSON.parse(localStorage.getItem(id));
    let faveFotoObj = new Foto(parsedFoto.title, parsedFoto.caption, parsedFoto.file, parsedFoto.id, parsedFoto.favorite);
    faveFotoObj.updateFavorite();
    e.target.src = updateFaveIcon(faveFotoObj);
    faveFotoObj.saveToStorage();
  }
};

function updateFaveIcon(faveFotoObj) {
  if (faveFotoObj.favorite) {
    return "images/favorite-active.svg";
  } else {
    return "images/favorite.svg";
  }
};


function reloadCards() {
  document.querySelector('.foto-form').reset();
    Object.keys(localStorage).forEach(function(key) {
      populateFotoCard(JSON.parse(localStorage.getItem(key)));
  })
};

function fotoCardProperties(e) {
  e.preventDefault();
  let fotoUpload = URL.createObjectURL(document.getElementById('choose-file-input').files[0]);
  let newFotoObj = new Foto(titleInput.value, captionInput.value, fotoUpload);
  newFotoObj.saveToStorage();
  populateFotoCard(newFotoObj);
  document.querySelector('.foto-form').reset();
}

function populateFotoCard(newFotoObj) {
  let card = document.createElement('section');
  let cardArticle = document.getElementById('card-article');
  card.className='card';
  card.id = newFotoObj.id;
  card.innerHTML = 
    `<div class="card-wrapper">
      <h4 class="card-title" contenteditable="true">${newFotoObj.title}</h4>
      <div class="uploaded-image">
        <img class="uploaded-image" src="${newFotoObj.file}">
      </div>
      <h4 class="card-caption" contenteditable="true">${newFotoObj.caption}</h4>
      <section class="card-footer">
        <img class="delete-icon" src="images/delete.svg">
        <img class="favorite-icon" src="${updateFaveIcon(newFotoObj)}">
      </section>
    </div>`;
  cardArticle.prepend(card);
};

function removeFotoCard(e) {
  if (e.target.className === 'delete-icon') {
    let id = e.target.closest('.card').id;
    let deleteMethodObj = new Foto('', '', '', id);
    deleteMethodObj.deleteFromStorage();
    e.target.closest('.card').remove();
  }
};

function updateCardInputs(e) {
  let id = e.target.closest('.card').id;
  let parsedFoto = JSON.parse(localStorage.getItem(id));
  let foto = new Foto(parsedFoto.title, parsedFoto.body, '', id);
    if (e.target.className === 'card-title') {
      foto.updateFoto(e.target.innerText, 'title');
    }
    if (e.target.className === 'card-caption') {
      foto.updateFoto(e.target.innerText, 'caption');
    }
};














