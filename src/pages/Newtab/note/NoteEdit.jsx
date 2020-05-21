import React, {useRef, useState, useEffect} from 'react';
import noteStore from "../../../storages/NoteStore";

const NoteEdit = ({note}) => {
    const textRef = useRef();
    const [content, setContent] = useState(note.content || '');
    const [title, setTitle] = useState(note.title || (new Date()).toLocaleDateString());
    const [textRows, setTextRows] = useState(3);

    const handleSubmitNote = (event) => {
        if (content.length) {
            noteStore.update({...note, content: content, title: title});
        }
    };

    const handleChangeText = (event) => {
        setContent(event.target.value);
    };

    useEffect(() => {
        const rowsOfTextArea = Math.floor(textRef.current.scrollHeight / 20);
        setTextRows(rowsOfTextArea);
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
