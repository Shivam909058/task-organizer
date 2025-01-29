import React from "react";
import Plus from "../icons/Plus";
import { db } from "../supabase/database";
import { useNotes } from "../context/NotesContext";
import { getRandomColor } from "../utils/colors";

const AddButton = () => {
    const { notes, setNotes } = useNotes();

    const handleClick = async () => {
        try {
            const newNote = await db.notes.create({
                body: '',
                colors: getRandomColor(),
                position: {
                    x: Math.random() * (window.innerWidth - 300),
                    y: Math.random() * (window.innerHeight - 300)
                }
            });

            setNotes([newNote, ...notes]);
        } catch (error) {
            console.error('Error creating note:', error);
        }
    };

    return (
        <button
            onClick={handleClick}
            className="add-button"
            title="Add new note"
        >
            <Plus size="24" />
        </button>
    );
};

export default AddButton;
