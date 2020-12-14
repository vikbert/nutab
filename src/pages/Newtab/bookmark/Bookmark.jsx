import React, { useEffect, useState, useRef } from 'react';
import { Cells, CellsTitle, Cell, CellBody, CellFooter } from 'react-weui';
import BookmarkStore from '../../../storages/BookmarkStore';
import useResize from '../../../hooks/useResize';
import Search from '../../../components/Search/Search';

const Bookmark = ({ active }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const bookmarkRootRef = useRef();
  const { width } = useResize(bookmarkRootRef);

  const handleChangeSearch = (searchString) => {
    if (searchString.length >= 2) {
      BookmarkStore.filterBookmarks(searchString, setBookmarks);
    } else {
      setBookmarks([]);
    }
  };

  const handlePressEnter = (searchString) => {
    const googleQuery = searchString.split(' ').join('+');
    loadUrl(`https://www.google.de/search?q=${googleQuery}`);
  };

  const loadUrl = (url) => {
    window.open(url);
  };

  useEffect(() => {
    chrome.runtime.sendMessage({ importBookmarks: true });
  }, []);

  return (
    <div className="bookmark-container" ref={bookmarkRootRef}>
      <Search changeCallback={(text) => handleChangeSearch(text)} submitCallback={(text) => handlePressEnter(text)} />

      <div
        className="list-container"
        style={{
          display: bookmarks.length ? 'block' : 'none',
          width: `${width - 28}px`,
        }}
      >
        <CellsTitle>
          <span>Found</span>
          <span className="result-amount">{bookmarks.length}</span>
          <span>Entries</span>
        </CellsTitle>
        <Cells>
          {bookmarks.map((element, index) => (
            <Cell onClick={() => loadUrl(element.url)} key={index} access>
              <CellBody>{element.title}</CellBody>
              <CellFooter />
            </Cell>
          ))}
        </Cells>
      </div>
    </div>
  );
};

export default Bookmark;
