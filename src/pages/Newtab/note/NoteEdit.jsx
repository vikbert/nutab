import React, { useRef, useState, useEffect } from 'react';

const NoteEdit = ({ note, updateCallback }) => {
  const textRef = useRef();
  const [content, setContent] = useState(note.content || '');
  const [title, setTitle] = useState(note.title || '');
  const [textRows, setTextRows] = useState(1);

  const handleChangeText = (event) => {
    setContent(event.target.value);
  };

  const handleKeyPressForSubmit = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      const updatedNote = { ...note, content: content, title: title };
      updateCallback(updatedNote);
    }
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
        onKeyPress={handleKeyPressForSubmit}
      />
      <textarea
        className={'note-textarea'}
        ref={textRef}
        value={content}
        rows={textRows}
        onChange={handleChangeText}
        onKeyPress={handleKeyPressForSubmit}
      />
    </>
  );
};

export default NoteEdit;
