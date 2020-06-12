export default function createEmptyNote() {
  return {
    id: Date.now(),
    title: '',
    content: '',
    bookmarked: false,
  };
}
