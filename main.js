// Consider where you can leverage parameters and arguments
// If there is no else, how could you leverage an else
// Grab the whole object from storage. Not individuals properties at once

// var addToAlbumButton = document.querySelector('.add-to-album-button');
var titleInput =  document.querySelector('.title-input');
var captionInput = document.querySelector('.caption-input');

document.querySelector('.add-to-album-button').addEventListener('click', fotoCardProperties);
document.getElementById('card-article').addEventListener('click', removeFotoCard);

reloadCards();

function reloadCards() {
  document.querySelector('.foto-form').reset();
    Object.keys(localStorage).forEach(function(key) {
      populateFotoCard(JSON.parse(localStorage.getItem(key)));
  })
};

function fotoCardProperties(e) {
  e.preventDefault();
  var newFotoObj = new Foto(titleInput.value, captionInput.value);
  newFotoObj.saveToStorage();
  populateFotoCard(newFotoObj);
  document.querySelector('.foto-form').reset();
}

function populateFotoCard(newFotoObj) {
  var card = document.createElement('section');
  var cardArticle = document.getElementById('card-article');
  card.className='card';
  card.id = newFotoObj.id;
  // dataset.index here for id
  card.innerHTML = 
    `<div class="card-wrapper">
      <h4 class="card-title" contenteditable="true">${newFotoObj.title}</h4>
      <div class="uploaded-image">
        <img class="uploaded-image" src="images/waterfall.jpg">
      </div>
      <h4 class="card-caption">${newFotoObj.caption}</h4>
      <section class="card-footer">
        <img class="delete-icon" src="images/delete.svg">
        <img class="favorite-icon" src="images/favorite.svg">
      </section>
    </div>`;
  cardArticle.append(card);
};

function removeFotoCard(e) {
  if (e.target.className === 'delete-icon') {
    var id = e.target.closest('.card'.id);
    var deleteMethodObj = new Foto('', '', id);
    // console.log(deleteMethodObj);
    deleteMethodObj.deleteFromStorage();
    e.target.closest('.card').remove();
  }
}