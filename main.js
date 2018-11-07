var titleInput =  document.querySelector('.title-input');
var captionInput = document.querySelector('.caption-input');
var favoritesButton = document.querySelector('.num-of-favorites');
var faveCounter = 0;

document.querySelector('.add-to-album-button').addEventListener('click', fotoCardProperties);
document.querySelector('.add-to-album-button').disabled = true;
document.getElementById('card-article').addEventListener('click', removeFotoCard);
document.getElementById('card-article').addEventListener('click', favoriteFotoCard);
document.getElementById('card-article').addEventListener('focusout', updateCardInputs);
titleInput.addEventListener('keyup', disableButton);
captionInput.addEventListener('keyup', disableButton);
document.querySelector('.inputfile').addEventListener('change', disableButton);
document.getElementById('search-input').addEventListener('keyup', searchFilter);
// document.querySelector('.show-more-button').addEventListener('click', showAllCards)
document.querySelector('.favorite-and-all').addEventListener('click', viewFavsOrAll)


reloadCards();

function viewFavsOrAll(e) {
  e.preventDefault();
  if (e.target.classList.contains('favorites-button')) {
    viewOnlyFavorites(e)
  } else if (e.target.classList.contains('view-all-button')){
    viewAll(e)
  }
};

function viewAll(e) {
  document.querySelectorAll('.card').forEach(function(card) {
    card.remove();
  });
  reloadCards();
  e.target.innerText = `View ${faveCounter} Favorites`;
  e.target.classList.replace('view-all-button', 'favorites-button');
};

function viewOnlyFavorites(e) {
  document.querySelectorAll('.card').forEach(function(card) {
    card.remove();
  });
  faveCounter = 0;
  let favoriteFotos = Object.keys(localStorage).filter(function(key) {
    let parsedObj = JSON.parse(localStorage[key]);
    return parsedObj.favorite === true;
  });
  favoriteFotos.forEach(function(key) {
    populateFotoCard(JSON.parse(localStorage.getItem(key)))
  });
  e.target.innerText = "View All";
  e.target.classList.replace('favorites-button', 'view-all-button');
};

// function showAllCards(e) {
// }

function generateCards() {
  for (var i = 0; i < 20; i++) {
    let tempFoto = new Foto(`title ${i+1}`, `caption ${i+1}`, "https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg" , i+1)
    if (i % 2 === 0) {
      tempFoto.favorite = true;
    }
    tempFoto.saveToStorage();
  }
}

function searchFilter(event) {
  Object.keys(localStorage).forEach(function(fotoObj) {
    let foto = document.getElementById(`${JSON.parse(localStorage[fotoObj]).id}`);
    let localStorageTitle = JSON.parse(localStorage[fotoObj]).title;
    let localStorageCaption = JSON.parse(localStorage[fotoObj]).caption;
    let searchInput = document.getElementById('search-input').value.toLowerCase();
      if (!localStorageTitle.toLowerCase().includes(searchInput) && !localStorageCaption.toLowerCase().includes(searchInput)) {
        foto.classList.add('display-mode-none');
      } else if (localStorageTitle.toLowerCase().includes(searchInput) && localStorageCaption.toLowerCase().includes(searchInput)) {
        foto.classList.remove('display-mode-none');
      }
    })
};

function displayNoPhotosMessage() {
  if (!document.querySelector('.upload-photo-message').classList.contains('display-mode-none')) {
      document.querySelector('.upload-photo-message').classList.add('display-mode-none') 
  } 
};

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
      favoritesButton.innerText = faveCounter;
      return "images/favorite-active.svg";
    } else {
      faveCounter--;
      favoritesButton.innerText = faveCounter;
      return "images/favorite.svg";
    }
};

function reloadCards() {
  document.querySelector('.foto-form').reset();
    Object.keys(localStorage).forEach(function(key, index) {
      if (index >= Object.keys(localStorage).length - 10) {
      populateFotoCard(JSON.parse(localStorage.getItem(key)));
    }
  })
};

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
    document.querySelector('.add-to-album-button').disabled = true;
  }
};

function populateFotoCard(newFotoObj) {
  let card = document.createElement('section');
  let cardArticle = document.getElementById('card-article');
  card.className='card';
  card.id = newFotoObj.id;
  var favIcon = newFotoObj.favorite ? "images/favorite-active.svg" : "images/favorite.svg";
  newFotoObj.favorite && faveCounter++;
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
  displayNoPhotosMessage();
  cardArticle.prepend(card);
};

function removeFotoCard(e) {
  if (e.target.className === 'delete-icon') {
    let id = e.target.closest('.card').id;
    let isFavorite = JSON.parse(localStorage.getItem(id)).favorite;
    checkFavedOnDelete(isFavorite);
    let deleteMethodObj = new Foto('', '', '', id);
    deleteMethodObj.deleteFromStorage();
    e.target.closest('.card').remove();
  }
  toggleMessage();
};

function checkFavedOnDelete(isFavorite) {
    if (isFavorite) {
      faveCounter--; 
      favoritesButton.innerText = faveCounter;
  }
};

function toggleMessage() {
  if (Object.keys(localStorage).length === 0) {
    document.querySelector('.upload-photo-message').classList.remove('display-mode-none');
  }
};

function updateCardInputs(e) {
  let id = e.target.closest('.card').id;
  let parsedFoto = JSON.parse(localStorage.getItem(id));
  let foto = new Foto(parsedFoto.title, parsedFoto.caption, parsedFoto.file, id);
    if (e.target.className === 'card-title') {
      foto.updateFoto(e.target.innerText, 'title');
    }
    if (e.target.className === 'card-caption') {
      foto.updateFoto(e.target.innerText, 'caption');
    }
};
