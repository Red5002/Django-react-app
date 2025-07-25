import { useState, useEffect } from "react";
import Note from "../components/Notes";
import api from "../api";
import "../styles/home.css";
import "../styles/note.css";
import LoadingIndicator from "../components/loadingIndicator";

function Home() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => getNotes(), []);

  const getNotes = () => {
    api
      .get("/api/notes/")
      .then((res) => res.data)
      .then((data) => {
        setNotes(data);
      })
      .catch((err) => alert(err));
  };

  const getDetails = (id) => {
    api
      .get(`/api/notes/${id}/`)
      .then((res) => res.data)
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setEditId(data.id); // <--- Start editing this note
      })
      .catch((err) => alert(err));
  };

  const deleteNote = (id) => {
    api
      .delete(`api/notes/delete/${id}/`)
      .then((res) => {
        if (res.status === 204) alert("Note deleted");
        else alert("failed to delete note");
        getNotes();
      })
      .catch((err) => alert(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { title, content };

    if (editId) {
      // Update existing note
      api
        .put(`/api/notes/${editId}/update/`, payload)
        .then((res) => {
          if (res.status === 200) alert("Note updated");
          else alert("Failed to update note");
          resetForm();
          getNotes();
        })
        .catch((err) => alert(err));
    } else {
      // Create new note
      api
        .post("/api/notes/", payload)
        .then((res) => {
          if (res.status === 201) alert("Note created");
          else alert("Failed to create note");
          resetForm();
          getNotes();
        })
        .catch((err) => alert(err));
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditId(null);
    setLoading(false);
  };

  return (
    <div className="app-container">
      <div className="notes-section">
        <h2>Notes</h2>

        <div className="note">
          {notes.map((note) => (
            <Note
              note={note}
              onDelete={deleteNote}
              onEdit={getDetails}
              key={note.id}
            />
          ))}
        </div>
      </div>
      <div>
        <h2>Create a Note</h2>
        <a
          href="/logout"
          style={{
            textDecoration: "none",
            fontSize: "1.2rem",
            fontFamily: "sans-serif",
            textAlign: "end",
            margin: "0 10px",
          }}
        >
          {" "}
          logout
        </a>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title: </label>
          <br />
          <input
            type="text"
            id="title"
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
          <label htmlFor="content">Content: </label>
          <br />
          <textarea
            id="content"
            name="content"
            rows="20"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <br />
          <div className="btn-container">
            <button type="submit">
              {loading ? (
                <LoadingIndicator />
              ) : editId ? (
                "Update Note"
              ) : (
                "Submit"
              )}
            </button>
            {editId && (
              <button type="button" onClick={resetForm}>
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default Home;
