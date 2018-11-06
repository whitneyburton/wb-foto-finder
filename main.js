var titleInput =  document.querySelector('.title-input');
var captionInput = document.querySelector('.caption-input');
var photoAlbum = document.getElementById('card-article');
var favoritesButton = document.querySelector('.num-of-favorites');
var addToAlbumButton = document.querySelector('.add-to-album-button');
var faveCounter = 0;

addToAlbumButton.addEventListener('click', fotoCardProperties);
select('#card-article').addEventListener('click', removeFotoCard);
photoAlbum.addEventListener('click', favoriteFotoCard);
photoAlbum.addEventListener('focusout', updateCardInputs);

reloadCards();

function select(field) {
  return document.querySelector(field);
}

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
      faveCounter++;
      console.log(faveCounter);
      favoritesButton.innerText = faveCounter;
      return "images/favorite-active.svg";
    } else {
      faveCounter--;
      console.log(faveCounter);
      favoritesButton.innerText = faveCounter;
      return "images/favorite.svg";
    }
};

function reloadCards() {
  document.querySelector('.foto-form').reset();
    Object.keys(localStorage).forEach(function(key) {
      populateFotoCard(JSON.parse(localStorage.getItem(key)));
  })
};
// map through (instead of forEach) to go through array and splice to take out ten for 
// the 

function fotoCardProperties(e) {
  e.preventDefault();
  var reader = new FileReader();
  reader.readAsDataURL(select('#choose-file-input').files[0])
  reader.onload = function() {
    var output = select('#choose-file-input');
    output.src = reader.result;
    let newFotoObj = new Foto(titleInput.value, captionInput.value, output.src);
    newFotoObj.saveToStorage();
    populateFotoCard(newFotoObj);
    document.querySelector('.foto-form').reset();
  }
}

function populateFotoCard(newFotoObj) {
  let card = document.createElement('section');
  let cardArticle = document.getElementById('card-article');
  card.className='card';
  card.id = newFotoObj.id;
  var favIcon = newFotoObj.favorite ? "images/favorite-active.svg" : "images/favorite.svg";
  newFotoObj.favorite && faveCounter++
  favoritesButton.innerText = faveCounter;
  card.innerHTML = 
    `<div class="card-wrapper">
      <h4 class="card-title" contenteditable="true">${newFotoObj.title}</h4>
      <div class="uploaded-image">
        <img class="uploaded-image" src="${newFotoObj.file}">
      </div>
      <h4 class="card-caption" contenteditable="true">${newFotoObj.caption}</h4>
      <section class="card-footer">
        <img class="delete-icon" src="images/delete.svg">
        <img class="favorite-icon" src="${favIcon}">
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
      foto.updateFoto('title', e.target.innerText);
    }
    if (e.target.className === 'card-caption') {
      foto.updateFoto(e.target.innerText, 'caption');
    }
};
