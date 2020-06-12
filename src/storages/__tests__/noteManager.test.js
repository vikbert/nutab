import noteMock from './noteMock.json';
import NoteManager from '../NoteManager';
describe('NoteManager', () => {
  let manager;
  beforeEach(() => {
    manager = new NoteManager(noteMock);
  });

  it('countAll() ', () => {
    expect(manager.countAll()).toEqual(3);
  });

  it('countBookmarked() ', () => {
    expect(manager.countBookmarked()).toEqual(2);
  });

  it('getNotes()', () => {
    expect(typeof manager.getNotes()).toEqual('object');

    expect(Object.keys(manager.getNotes())).toContain('byId');
    expect(Object.keys(manager.getNotes())).toContain('bookmarked');
    expect(Object.keys(manager.getNotes())).toContain('all');
  });

  it('getNote()', () => {
    expect(manager.getNote('11').id).toEqual('11');
  });

  it('updateNoteContent()', () => {
    const newNote = {
      id: '11',
      content: 'content 99',
      title: 'title 11',
      bookmarked: true,
    };
    manager.updateNoteContent('11', 'title 11', 'content 99');
    expect(manager.getNote('11')).toEqual(newNote);
  });

  it('deleteNote()', () => {
    manager.deleteNote('11');

    // note is removed from byId
    expect(manager.getNote('11')).toEqual(undefined);

    // id is removed from all[]
    expect(manager.countAll()).toEqual(2);

    // id is remove from bookmarked[]
    expect(manager.countBookmarked()).toEqual(1);
  });

  it('toggleNoteBookmarked(ids)', () => {
    expect(manager.getNote('11').bookmarked).toBeTruthy();
    expect(manager.countBookmarked()).toEqual(2);

    // check bookmarked true => false
    manager.toggleNoteBookmarked('11');
    expect(manager.getNote('11').bookmarked).toBeFalsy();
    expect(manager.countBookmarked()).toEqual(1);
  });

  it('toggleNoteBookmarked(id)', () => {
    // check bookmarked false => true
    manager.toggleNoteBookmarked('33');
    expect(manager.countBookmarked()).toEqual(3);
    expect(manager.countAll()).toEqual(3);
    expect(manager.getNote('33').bookmarked).toEqual(true);
  });

  it('addNote(newNote)', () => {
    const note44 = {
      id: '44',
      title: 'title 44',
      content: 'content 44',
      bookmarked: false,
    };
    manager.addNote(note44);
    expect(manager.countBookmarked()).toEqual(2);
    expect(manager.countAll()).toEqual(4);
  });

  it('addNote(newNote)', () => {
    const note55 = {
      id: '55',
      title: 'title 55',
      content: 'content 55',
      bookmarked: true,
    };
    manager.addNote(note55);
    expect(manager.countBookmarked()).toEqual(3);
    expect(manager.countAll()).toEqual(4);
  });

  it('setAll(ids)', () => {
    const ids = ['11', '33', '22'];
    manager.setAll(ids);
  });

  it('setBookmarked(ids)', () => {
    const ids = ['11', '22'];
    manager.setBookmarked(ids);
  });

  it('getAll', () => {
    expect(manager.getAll().toString()).toEqual(['11', '22', '33'].toString());
  });

  it('getBookmarked', () => {
    expect(manager.getBookmarked().toString()).toEqual(['22', '11'].toString());
  });
});
