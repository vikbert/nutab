const NoteFactory = {};
NoteFactory.create = (content) => {
  return {
    id: new Date().getTime(),
    content,
    title: new Date().toLocaleDateString(),
    bookmarked: false,
  };
};
export default NoteFactory;
