import { createContext, useState, useContext, useEffect } from "react";
import { db } from "../supabase/database";
import Spinner from "../icons/Spinner";

// Export the context itself
export const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
    const [notes, setNotes] = useState([]);  // Initialize as empty array
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const data = await db.notes.list();
            setNotes(data || []); // Ensure we always set an array
        } catch (err) {
            console.error("Error fetching notes:", err);
            setError(err.message);
            setNotes([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <NotesContext.Provider value={{ notes, setNotes, loading, error, fetchNotes }}>
            {loading ? (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100vh",
                    }}
                >
                    <Spinner size="100" />
                </div>
            ) : (
                children
            )}
        </NotesContext.Provider>
    );
};

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error("useNotes must be used within a NotesProvider");
    }
    return context;
};

// Add default export
export default NotesProvider;
