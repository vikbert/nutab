import React, { useRef, useState, useEffect } from 'react';
import noteStore from '../../../storages/NoteStore';

const NoteEdit = ({ note }) => {
  const textRef = useRef();
  const [content, setContent] = useState(note.content || '');
  const [title, setTitle] = useState(note.title || '');
  const [textRows, setTextRows] = useState(1);

  const handleSubmitNote = (event) => {
    noteStore.update({ ...note, content: content, title: title });
  };

  const handleChangeText = (event) => {
    setContent(event.target.value);
  };

  useEffect(() => {
    if (content.trim().length > 0) {
      const rowsOfTextArea = Math.floor(textRef.current.scrollHeight / 20);
      setTextRows(rowsOfTextArea);
    }
  }, []);

  return (
    <>
      <input
        className={'note-input'}
        type="text"
        value={title}
        placeholder={'Title'}
        onChange={(event) => setTitle(event.target.value)}
        onBlur={handleSubmitNote}
      />

      <textarea
        className={'note-textarea'}
        ref={textRef}
        value={content}
        onChange={handleChangeText}
        onBlur={handleSubmitNote}
        rows={textRows}
      />
    </>
  );
};

export default NoteEdit;
