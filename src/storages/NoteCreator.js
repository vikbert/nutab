export function createEmptyNote() {
  return {
    id: Date.now(),
    title: '',
    content: '',
    bookmarked: false,
  };
}

export function createNoteFromContent(content) {
  return {
    id: new Date().getTime(),
    content,
    title: new Date().toLocaleDateString(),
  };
}
