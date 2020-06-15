import React from 'react';

const key_notes = 'nutab_notes';
const key_todos = 'nutab_todos';

const ExportOption = () => {
  const downloadFile = async () => {
    const nutabData = {
      [key_notes]: JSON.parse(localStorage.getItem(key_notes)),
      [key_todos]: JSON.parse(localStorage.getItem(key_todos)),
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
