import NoteManager from '../NoteManager';

const noteDataInit = {
  notes: {
    byId: {},
    all: [],
    bookmarked: [],
  },
};
describe('feature test for NoteManager', () => {
  let noteManager = new NoteManager();

  it('should have the intial state', () => {
    expect(noteManager.countAll()).toEqual(0);
    expect(noteManager.countBookmarked()).toEqual(0);
    expect(noteManager.getData()).toEqual(noteDataInit);
  });

  it('should add 1. note with title "note1"', () => {
    noteManager.addNote({
      id: 1,
      title: 'note1',
      bookmarked: false,
    });
    expect(noteManager.countAll()).toEqual(1);
    expect(noteManager.countBookmarked()).toEqual(0);
    expect(noteManager.getNote(1).title).toEqual('note1');
  });

  it('should add 2. note with title "note2"', () => {
    noteManager.addNote({
      id: 2,
      title: 'note2',
      bookmarked: false,
    });
    expect(noteManager.countAll()).toEqual(2);
    expect(noteManager.countBookmarked()).toEqual(0);
    expect(noteManager.getNote(2).title).toEqual('note2');
  });

  it('should add 3. note with title "note3"', () => {
    noteManager.addNote({
      id: 3,
      title: 'note3',
      bookmarked: false,
    });
    expect(noteManager.countAll()).toEqual(3);
    expect(noteManager.countBookmarked()).toEqual(0);
    expect(noteManager.getNote(3).title).toEqual('note3');
  });

  it('should update the 1. note with new title "note11"', () => {
    noteManager.updateNoteContent(1, 'note11', 'note11 content');
    expect(noteManager.countAll()).toEqual(3);
    expect(noteManager.countBookmarked()).toEqual(0);
    expect(noteManager.getNote(1).title).toEqual('note11');
    expect(noteManager.getNote(1).content).toEqual('note11 content');
  });

  it('should toggle the 2. note to bookmarked: true', () => {
    noteManager.toggleNoteBookmarked(2);
    expect(noteManager.countAll()).toEqual(3);
    expect(noteManager.countBookmarked()).toEqual(1);
    expect(noteManager.getNote(2).bookmarked).toEqual(true);
  });

  it('should toggle the 2. note to bookmakred: false', () => {
    noteManager.toggleNoteBookmarked(2);
    expect(noteManager.countAll()).toEqual(3);
    expect(noteManager.countBookmarked()).toEqual(0);
    expect(noteManager.getNote(2).bookmarked).toEqual(false);
  });

  it('should toggle all note to bookmarked', () => {
    noteManager.toggleNoteBookmarked(1);
    noteManager.toggleNoteBookmarked(2);
    noteManager.toggleNoteBookmarked(3);
    expect(noteManager.countBookmarked()).toEqual(3);
  });

  it('should change the order of bookmarked', () => {
    const newOrder = [2, 3, 1];
    noteManager.setBookmarked(newOrder);
    expect(noteManager.countBookmarked()).toEqual(3);
    expect(noteManager.getBookmarked()).toEqual(newOrder);
  });

  it('should remove the 3. note', () => {
    noteManager.deleteNote(3);
    expect(noteManager.countAll()).toEqual(2);
  });

  it('should remove the 2. note', () => {
    noteManager.deleteNote(2);
    expect(noteManager.countAll()).toEqual(1);
  });

  it('should remove the 1. note', () => {
    noteManager.deleteNote(1);
    expect(noteManager.countAll()).toEqual(0);
  });

  it('should have the inital state', () => {
    expect(noteManager.getData()).toEqual(noteDataInit);
  });
});
