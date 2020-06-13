import React, { useEffect, useState, useRef } from 'react';
import dragula from 'react-dragula';
import classnames from 'classnames';
import NoteEdit from './NoteEdit';
import useVisible from '../../../hooks/useVisible';
import Confirm from '../../../components/Confirm';
import useLocalStorage from '../../../hooks/useLocalStorage';
import NoteManager from '../../../storages/NoteManager';
import { createEmptyNote } from '../../../storages/NoteCreator';
const initNotes = {
  notes: {
    byId: {},
    all: [],
    bookmarked: [],
  },
};
const Note = () => {
  const [noteData, setNoteData] = useLocalStorage('nutab_notes', initNotes);
  const noteManager = new NoteManager(noteData);
  const { notes } = noteData;

  const { visible, show, hide } = useVisible(false);
  const [target, setTarget] = useState(null);
  const listRef = useRef(null);

  const handleInsertEmptyNote = () => {
    noteManager.addNote(createEmptyNote());
    setNoteData(noteManager.getData());
  };

  const handleDeleteNote = (noteId) => {
    noteManager.deleteNote(noteId);
    setNoteData(noteManager.getData());
  };

  const handleUpdateNote = (note) => {
    noteManager.updateNoteContent(note.id, note.title, note.content);
    setNoteData(noteManager.getData());
  };

  const openConfirm = (noteId) => {
    setTarget(noteId);
    show();
  };

  const toggleBookmarkNote = (noteId) => {
    noteManager.toggleNoteBookmarked(noteId);
    setNoteData(noteManager.getData());
  };

  useEffect(() => {
    dragula([listRef.current], {
      ignoreInputTextSelection: true,
      moves: function (el, container, handle) {
        return handle.tagName !== 'INPUT';
      },
    }).on('drop', (el, target) => {
      const newOrder = Array.from(listRef.current.children).map((element) => parseInt(element.id));
      noteManager.setBookmarked(newOrder);
      setNoteData(noteManager.getData());
    });
  }, []);

  const NoteEditContainer = ({ note }) => {
    return (
      <div className={classnames('edit', { bookmarked: note.bookmarked })} id={note.id}>
        <div className="edit-container">
          <NoteEdit note={note} updateCallback={(note) => handleUpdateNote(note)} />
          {!note.bookmarked && <span className={'icon-x note-icon close'} onClick={() => openConfirm(note.id)} />}
          <span
            className={classnames('icon-bookmark note-icon bookmark', { selected: note.bookmarked || false })}
            onClick={() => toggleBookmarkNote(parseInt(note.id))}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={'note-container'}>
      <Confirm
        visible={visible}
        hide={hide}
        confirmCallback={() => handleDeleteNote(target)}
        message={'Are you sure to delete this note?'}
      />
      <div className="icon icon-plus1 note-insert" onClick={handleInsertEmptyNote} />
      <div className="note-list">
        <div className="note-random">
          {notes.all
            .filter((id) => !notes.byId[id].bookmarked)
            .map((noteKey) => (
              <NoteEditContainer key={noteKey} note={notes.byId[noteKey]} />
            ))}
        </div>
        <div className="note-bookmarked" ref={listRef}>
          {notes.bookmarked.map((noteKey) => (
            <NoteEditContainer key={noteKey} note={notes.byId[noteKey]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Note;
