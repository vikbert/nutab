const NoteFactory = {};
NoteFactory.create = (content) => {
    return {
        id: (new Date()).getTime(),
        content,
        title: (new Date()).toLocaleDateString(),
    };
};
export default NoteFactory;
