import React, { useEffect, useState, useRef } from 'react';
import dragula from 'react-dragula';
import classnames from 'classnames';
import noteStore from '../../../storages/NoteStore';
import NoteEdit from './NoteEdit';
import useVisible from '../../../hooks/useVisible';
import Confirm from '../../../components/Confirm';

const Note = () => {
  const [notes, setNotes] = useState({});
  const { visible, show, hide } = useVisible(false);
  const [target, setTarget] = useState(null);
  const listRef = useRef(null);

  const handleDeleteNote = (noteId) => {
    const cloned = { ...notes };
    delete cloned[noteId];
    setNotes(cloned);

    noteStore.delete(noteId);
  };

  const openConfirm = (noteId) => {
    setTarget(noteId);
    show();
  };

  const toggleBookmarkNote = (noteId) => {
    const updatedNote = { ...notes[noteId] };
    updatedNote.bookmarked = !updatedNote.bookmarked;
    setNotes({
      ...notes,
      [noteId]: updatedNote,
    });

    noteStore.update(updatedNote);
  };

  useEffect(() => {
    dragula([listRef.current], { ignoreInputTextSelection: false }).on('drop', (el, target) => {
      console.log(target);
    });
  }, []);

  const NoteEditContainer = ({ note }) => {
    return (
      <div className={classnames('edit', { bookmarked: note.bookmarked })}>
        <div className="edit-container">
          <NoteEdit note={note} />
          {!note.bookmarked && <span className={'icon-x note-icon close'} onClick={() => openConfirm(note.id)} />}
          <span
            className={classnames('icon-bookmark note-icon bookmark', { selected: note.bookmarked || false })}
            onClick={() => toggleBookmarkNote(note.id)}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    setNotes(noteStore.loadAll());
  }, []);

  return (
    <div className={'note-container'}>
      <Confirm
        visible={visible}
        hide={hide}
        confirmCallback={() => handleDeleteNote(target)}
        message={'Are you sure to delete this note?'}
      />
      <div className="note-list">
        <div className="note-random">
          {Object.keys(notes)
            .filter((id) => !notes[id].bookmarked)
            .map((noteKey) => (
              <NoteEditContainer key={noteKey} note={notes[noteKey]} />
            ))}
        </div>
        <div className="note-bookmarked" ref={listRef}>
          {Object.keys(notes)
            .filter((id) => notes[id].bookmarked)
            .map((noteKey) => (
              <NoteEditContainer key={noteKey} note={notes[noteKey]} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Note;
