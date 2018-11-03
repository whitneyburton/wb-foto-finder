class Foto {
  constructor(title, caption, id, file, favorite) {
    this.title = title;
    this.caption = caption;
    this.id = id || Date.now();
    // this.file = file;
    this.favorite = false;
  };

  saveToStorage() {
    localStorage.setItem(this.id, JSON.stringify(this));
  };

  deleteFromStorage() {
    localStorage.removeItem(this.id);
  };

  updateFoto() {

  };

};