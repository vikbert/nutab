import React, { useState, useRef, useEffect } from 'react';
import NoteFactory from './NoteFactory';
import useLocalStorage from '../../../hooks/useLocalStorage';
import NoteManager from '../../../storages/NoteManager';
import classnames from 'classnames';
import { logPopup } from '../../../helpers/Logger';

const moveCursorToEnd = (el) => {
  if (typeof el.selectionStart == 'number') {
    el.selectionStart = el.selectionEnd = el.value.length;
  } else if (typeof el.createTextRange != 'undefined') {
    el.focus();
    var range = el.createTextRange();
    range.collapse(false);
    range.select();
  }
};

const NoteForm = () => {
  const [noteData, setNoteData] = useLocalStorage('nutab_notes', {});
  const noteManager = new NoteManager(noteData);

  const lastNote = noteManager.getLastestNote();

  console.log('lastNote', lastNote);

  const [isNew, setIsNew] = useState(lastNote === null);
  const [note, setNote] = useState(() => {
    return lastNote ? lastNote : NoteFactory.create();
  });

  const textRef = useRef();

  const handleChangeText = (event) => {
    setNote({
      ...note,
      content: event.target.value,
    });
  };

  const handleSubmitNote = () => {
    if (note.content.trim().length === 0) {
      return;
    }

    if (isNew || lastNote === null) {
      noteManager.addNote(note);
    } else {
      noteManager.updateNoteContent(note.id, note.title, note.content);
    }

    setNoteData(noteManager.getData());
    window.close();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      handleSubmitNote();
    }
  };

  useEffect(() => {
    moveCursorToEnd(textRef);
  }, []);

  useEffect(() => {
    if (isNew || lastNote === null) {
      setNote(NoteFactory.create(''));
    } else {
      setNote(lastNote);
    }
  }, [isNew]); // ⚠️Don't add lastNote as Depencency because of infinit loop

  return (
    <div className="popup-form">
      <div className="popup-header">
        <div onClick={() => setIsNew(false)} className={classnames('item', { active: !isNew })}>
          Latest One
        </div>
        <div onClick={() => setIsNew(true)} className={classnames('item', { active: isNew })}>
          New One
        </div>
      </div>
      <div className="popup-body">
        <textarea
          ref={textRef}
          value={note.content || ''}
          onChange={handleChangeText}
          onKeyPress={handleKeyPress}
          placeholder="Enter your note"
          rows="20"
        />
      </div>
      <div className="popup-footer" onClick={handleSubmitNote}>
        <div>{'Save Note'}</div>
      </div>
    </div>
  );
};

export default NoteForm;
