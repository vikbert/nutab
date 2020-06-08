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
  const [order, setOrder] = useState([]);
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
    const previousState = updatedNote.bookmarked;
    // update notes
    updatedNote.bookmarked = !previousState;
    setNotes({
      ...notes,
      [noteId]: updatedNote,
    });
    noteStore.update(updatedNote);

    // update order
    let newOrder;
    if (previousState === false) {
      newOrder = [noteId, ...order];
    } else {
      newOrder = order.filter((id) => id !== noteId);
    }

    setOrder(newOrder);
    noteStore.saveOrder(newOrder);
  };

  useEffect(() => {
    dragula([listRef.current], { ignoreInputTextSelection: false }).on('drop', (el, target) => {
      noteStore.saveOrder(Array.from(listRef.current.children).map((element) => parseInt(element.id)));
    });
  }, []);

  const NoteEditContainer = ({ note }) => {
    return (
      <div className={classnames('edit', { bookmarked: note.bookmarked })} id={note.id}>
        <div className="edit-container">
          <NoteEdit note={note} />
          {!note.bookmarked && <span className={'icon-x note-icon close'} onClick={() => openConfirm(note.id)} />}
          <span
            className={classnames('icon-bookmark note-icon bookmark', { selected: note.bookmarked || false })}
            onClick={() => toggleBookmarkNote(parseInt(note.id))}
          />
        </div>
      </div>
    );
  };

  useEffect(() => {
    setNotes(noteStore.loadAll());
    setOrder(noteStore.loadOrder());
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
          {order.map((noteKey) => (
            <NoteEditContainer key={noteKey} note={notes[noteKey]} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Note;
