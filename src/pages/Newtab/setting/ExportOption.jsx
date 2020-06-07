import React from 'react';
import noteStore from '../../../storages/NoteStore';
import todoStore, { loadTodos } from '../../../storages/TodoStore';

const ExportOption = () => {
  const downloadFile = async () => {
    const nutabData = {
      [noteStore.key]: noteStore.loadAll(),
      [todoStore.key]: loadTodos(),
    };
    const current = new Date();
    const fileName = `nubtab_export_${current.toLocaleDateString()}_${current.toLocaleTimeString()}`;
    const json = JSON.stringify(nutabData);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + '.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="option" onClick={downloadFile}>
      Export
    </div>
  );
};

export default ExportOption;
