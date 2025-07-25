function Note({ note, onDelete, onEdit }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");

  return (
    <div className="note-container">
      <p className="note-title">{note.title}</p>
      <p className="note-content">{note.content}</p>
      <p className="note-date">{formattedDate}</p>
      <button className="delete-button" onClick={() => onDelete(note.id)}>
        Delete
      </button>
      <button className="delete-button edit" onClick={() => onEdit(note.id)}>
        Edit
      </button>
    </div>
  );
}

export default Note;
