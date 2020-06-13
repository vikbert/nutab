const NoteFactory = {};
NoteFactory.create = (content = null) => {
  return {
    id: new Date().getTime(),
    content: content || '',
    title: new Date().toLocaleDateString(),
    bookmarked: false,
  };
};
export default NoteFactory;
