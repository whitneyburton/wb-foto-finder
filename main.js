var titleInput =  document.querySelector('.title-input');
var captionInput = document.querySelector('.caption-input');
var favoritesButton = document.querySelector('.num-of-favorites');
var faveCounter = 0;

document.querySelector('.add-to-album-button').addEventListener('click', fotoCardProperties);
document.querySelector('.add-to-album-button').disabled = true;
document.querySelector('#card-article').addEventListener('click', removeFotoCard);
document.getElementById('card-article').addEventListener('click', favoriteFotoCard);
document.getElementById('card-article').addEventListener('focusout', updateCardInputs);
titleInput.addEventListener('keyup', disableButton);
captionInput.addEventListener('keyup', disableButton);
document.querySelector('.inputfile').addEventListener('change', disableButton)

reloadCards();

function disableButton() {
  var addToAlbumButton = document.querySelector('.add-to-album-button');
    if (!titleInput.value || !captionInput.value || !document.querySelector('.inputfile').value) {
      addToAlbumButton.disabled = true;
    } else {
     addToAlbumButton.disabled = false;
    }
};

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
  reader.readAsDataURL(document.getElementById('file').files[0])
  reader.onload = function() {
    var output = document.getElementById('file');
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
