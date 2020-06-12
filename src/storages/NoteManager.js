class NoteManager {
  constructor(initData) {
    let noteData = { ...initData };
    if (Object.keys(noteData).length === 0) {
      noteData = {
        notes: {
          byId: {},
          all: [],
          bookmarked: [],
        },
      };
    }
    if (!noteData.hasOwnProperty('notes')) {
      throw new Error('note data has no propery: [notes]');
    }

    if (!noteData.notes.hasOwnProperty('byId')) {
      throw new Error('note data has no propery: [byId]');
    }

    if (!noteData.notes.hasOwnProperty('bookmarked')) {
      throw new Error('note data has no propery: [bookmarked]');
    }

    if (!noteData.notes.hasOwnProperty('all')) {
      throw new Error('note data has no propery: [all]');
    }

    this.data = JSON.parse(JSON.stringify(noteData));
  }

  getData() {
    return this.data;
  }

  countBookmarked() {
    return this.data.notes.bookmarked.length;
  }

  countAll() {
    return this.data.notes.all.length;
  }

  getNotes() {
    return this.data.notes;
  }

  getNote(id) {
    return this.data.notes.byId[id];
  }

  _updateNote(note) {
    this.data.notes.byId[note.id] = note;
  }

  updateNoteContent(id, title, content) {
    const previousNote = this.getNote(id);
    this._updateNote({
      ...previousNote,
      title,
      content,
    });
  }

  _removeIdFromAll(id) {
    const all = this.data.notes.all;
    this.data.notes.all = all.filter((key) => key.toString() !== id.toString());
  }

  _removeIdFromBookmarked(id) {
    const bookmarked = this.data.notes.bookmarked;
    this.data.notes.bookmarked = bookmarked.filter((key) => key.toString() !== id.toString());
  }

  _addIdToAll(id) {
    const all = this.data.notes.all;
    this.data.notes.all = [id, ...all];
  }

  _addIdToBookmarked(id) {
    const bookmarked = this.data.notes.bookmarked;
    this.data.notes.bookmarked = [id, ...bookmarked];
  }

  toggleNoteBookmarked(id) {
    const note = this.getNote(id);
    if (!note) {
      throw new Error(`Target Note not found: ${id}`);
    }

    this._updateNote({
      ...note,
      bookmarked: !note.bookmarked,
    });

    if (note.bookmarked) {
      this._removeIdFromBookmarked(id);
    } else {
      this._addIdToBookmarked(id);
    }
  }

  deleteNote(id) {
    delete this.data.notes.byId[id];

    this._removeIdFromAll(id);
    this._removeIdFromBookmarked(id);
  }

  addNote(note) {
    // add note to byId {}
    const idString = note.id;
    this.data.notes.byId[idString] = note;

    // add ID to all[]
    this._addIdToAll(idString);

    // if note.bookmarked:true, add ID to bookmarked[]
    if (note.bookmarked) {
      this._addIdToBookmarked(idString);
    }
  }

  setBookmarked(ids) {
    console.log('setBookmarked', ids);
    // be sure keys is an Array
    if (!Array.isArray(ids)) {
      throw new Error('Given Keys is not an Array!');
    }

    this.data.notes.bookmarked = ids;
  }

  setAll(ids) {
    // be sure keys is an Array
    if (!Array.isArray(ids)) {
      throw new Error('Given Keys is not an Array!');
    }

    const existingAll = [...this.data.notes.all];
    if (existingAll.sort().toString() !== [...ids].sort().toString()) {
      throw new Error(`IDs should not be changed, exclude their order`);
    }

    this.data.notes.all = ids;
  }

  getBookmarked() {
    return this.data.notes.bookmarked;
  }

  getAll() {
    return this.data.notes.all;
  }
}

export default NoteManager;
