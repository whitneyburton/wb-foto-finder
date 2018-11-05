class Foto {
  constructor(title, caption, file, id, favorite) {
    this.title = title;
    this.caption = caption;
    this.id = id || Date.now();
    this.file = file;
    this.favorite = favorite || false;
  };

  saveToStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  };

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  };

  updateFoto(text, type) {
    this[type] = text;
    this.saveToStorage();
  };

  updateFavorite() {
    this.favorite = !this.favorite;
  };

};