import { useNotes } from "../context/NotesContext";
import NoteCard from "../components/NoteCard";
import AddButton from "../components/AddButton";

const NotesPage = () => {
    const { notes, loading, error } = useNotes();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="relative h-screen">
            {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
            ))}
            <AddButton />
        </div>
    );
};

export default NotesPage;
