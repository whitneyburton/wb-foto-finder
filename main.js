var titleInput =  document.querySelector('.title-input');
var captionInput = document.querySelector('.caption-input');
var favoritesButton = document.querySelector('.num-of-favorites');
var addToAlbumButton = document.querySelector('.add-to-album-button');
var entireCardArticle = document.getElementById('card-article');
var faveCounter = 0;

addToAlbumButton.disabled = true;
titleInput.addEventListener('keyup', disableButton);
captionInput.addEventListener('keyup', disableButton);
addToAlbumButton.addEventListener('click', fotoCardProperties);
entireCardArticle.addEventListener('click', removeFotoCard);
entireCardArticle.addEventListener('click', favoriteFotoCard);
entireCardArticle.addEventListener('focusout', updateCardInputs);
document.getElementById('search-input').addEventListener('keyup', searchFilter);
document.querySelector('.favorite-and-all').addEventListener('click', viewFavsOrAll);
document.querySelector('.inputfile').addEventListener('change', disableButton);

reloadCards();

function checkFavedOnDelete(isFavorite) {
  if (isFavorite) {
    faveCounter--; 
    favoritesButton.innerText = faveCounter;
  }
};

function generateCards() {
  for (var i = 0; i < 20; i++) {
    let tempFoto = new Foto(`title ${i+1}`, `caption ${i+1}`, "https://upload.wikimedia.org/wikipedia/commons/a/a1/Alan_Turing_Aged_16.jpg" , i+1)
    if (i % 2 === 0) {
      tempFoto.favorite = true;
    }
    tempFoto.saveToStorage();
  }
};

function disableButton() {
    if (!titleInput.value || !captionInput.value || !document.querySelector('.inputfile').value) {
      addToAlbumButton.disabled = true;
    } else {
     addToAlbumButton.disabled = false;
    }
};

function displayNoPhotosMessage() {
  let uploadFotoMessage = document.querySelector('.upload-photo-message');
  if (!uploadFotoMessage.classList.contains('display-mode-none')) {
      uploadFotoMessage.classList.add('display-mode-none') 
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

function fotoCardProperties(e) {
  e.preventDefault();
  let reader = new FileReader();
  reader.readAsDataURL(document.getElementById('file').files[0])
  reader.onload = function() {
    let output = document.getElementById('file');
    output.src = reader.result;
    let newFotoObj = new Foto(titleInput.value, captionInput.value, output.src);
    newFotoObj.saveToStorage();
    populateFotoCard(newFotoObj);
    document.querySelector('.foto-form').reset();
    addToAlbumButton.disabled = true;
  }
};

function populateFotoCard(newFotoObj) {
  let card = document.createElement('section');
  let cardArticle = document.getElementById('card-article');
  card.className='card';
  card.id = newFotoObj.id;
  let favIcon = newFotoObj.favorite ? "images/favorite-active.svg" : "images/favorite.svg";
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

function reloadCards() {
  document.querySelector('.foto-form').reset();
    Object.keys(localStorage).forEach(function(key, index) {
      if (index >= Object.keys(localStorage).length - 10) {
      populateFotoCard(JSON.parse(localStorage.getItem(key)));
    }
  })
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

function searchFilter(e) {
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
    } else if (e.target.className === 'card-caption') {
      foto.updateFoto(e.target.innerText, 'caption');
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

function viewFavsOrAll(e) {
  e.preventDefault();
  if (e.target.classList.contains('favorites-button')) {
    viewOnlyFavs(e)
  } else if (e.target.classList.contains('view-all-button')) {
    viewAll(e)
  }
};

function viewOnlyFavs(e) {
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

function viewAll(e) {
  document.querySelectorAll('.card').forEach(function(card) {
    card.remove();
  });
  faveCounter = 0;
  reloadCards();
  e.target.innerText = `View ${faveCounter} Favorites`;
  e.target.classList.replace('view-all-button', 'favorites-button');
};
