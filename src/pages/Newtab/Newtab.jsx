import React from 'react';
import Bookmark from './bookmark';
import Todo from './todo';
import Alert from './alert';
import Clock from './clock';
import Note from './note';
import Setting from './setting';

const NewTab = () => {
  console.log('rerender: ' + Date.now());
  return (
    <div className={'newTab fade-in'}>
      <div className="left">
        <Bookmark active={true} />
        <div className="clock-container">
          <Alert />
          <Clock />
        </div>
        <Note />
        <Setting />
      </div>
      <div className="right">
        <Todo />
      </div>
    </div>
  );
};

export default NewTab;
