import React, { useState } from 'react';
import useVisible from '../../../hooks/useVisible';
import Dialog from '../../../components/Dialog';
import { Button } from 'react-weui';

const key_notes = 'nutab_notes';
const key_todos = 'nutab_todos';

const ImportOption = () => {
  const [data, setData] = useState(null);
  const { visible, show, hide } = useVisible(false);

  const handleOnChange = (event) => {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = onReaderLoad;
  };

  const onReaderLoad = (event) => {
    setData(JSON.parse(event.target.result));
  };

  const importToLocalStorage = () => {
    localStorage.setItem(key_notes, JSON.stringify(data[key_notes]));
    localStorage.setItem(key_todos, JSON.stringify(data[key_todos]));

    window.location.reload();
  };

  const Footer = () => {
    return (
      <Button onClick={importToLocalStorage} disabled={data === null}>
        {data === null ? 'No file selected' : 'I am sure to import the current file'}
      </Button>
    );
  };

  return (
    <>
      <Dialog hide={hide} visible={visible} footer={<Footer />}>
        <label htmlFor="import-file">Import data from export backup</label>
        <input name={'import-file'} type="file" className={'file-input'} onChange={handleOnChange} />
      </Dialog>
      <div className="option" onClick={show}>
        Import
      </div>
    </>
  );
};

export default ImportOption;
