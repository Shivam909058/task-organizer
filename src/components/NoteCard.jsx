import { useRef, useState, useCallback, useEffect } from "react";
import { useNotes } from "../context/NotesContext";
import { db } from "../supabase/database";
import TrashIcon from "../icons/TrashIcon";
import Spinner from "./Spinner";

const NoteCard = ({ note }) => {
    const { notes, setNotes } = useNotes();
    const [saving, setSaving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(note.position || { x: 100, y: 100 });
    
    const cardRef = useRef(null);
    const saveTimeoutRef = useRef(null);

    const defaultColors = { background: '#ffffff', text: '#000000' };
    const colors = note.colors || defaultColors;

    const handleDelete = async () => {
        try {
            await db.notes.delete(note.id);
            setNotes(notes.filter(n => n.id !== note.id));
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const startDragging = (e) => {
        if (e.target.closest('.delete-button') || e.target.closest('.color-picker')) {
            return;
        }
        
        const rect = cardRef.current.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        
        const onMouseMove = (e) => {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            setPosition({ x, y });
            
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
            
            saveTimeoutRef.current = setTimeout(() => {
                db.notes.update(note.id, {
                    ...note,
                    position: { x, y }
                });
            }, 100);
        };
        
        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            setIsDragging(false);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        setIsDragging(true);
    };

    return (
        <div
            ref={cardRef}
            className="note-card"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
                left: position.x,
                top: position.y,
                cursor: isDragging ? 'grabbing' : 'grab',
                zIndex: isDragging ? 1000 : 1,
                position: 'absolute',
                userSelect: 'none',
                transform: isDragging ? 'scale(1.02)' : 'scale(1)',
                transition: isDragging ? 'none' : 'transform 0.2s ease'
            }}
            onMouseDown={startDragging}
        >
            <div 
                className="note-card-header"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px',
                    borderBottom: `1px solid ${colors.text}20`
                }}
            >
                <div style={{ flex: 1 }}>
                    {saving && (
                        <div 
                            className="saving-indicator"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                width: 'fit-content'
                            }}
                        >
                            <Spinner size={12} color={colors.text} />
                            <span style={{ 
                                color: colors.text, 
                                opacity: 0.6, 
                                fontSize: '12px',
                                userSelect: 'none'
                            }}>
                                Saving...
                            </span>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleDelete}
                    className="delete-button"
                    style={{
                        background: 'none',
                        border: 'none',
                        color: colors.text,
                        opacity: 0.6,
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'opacity 0.2s ease, background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <TrashIcon size={16} color={colors.text} />
                </button>
            </div>
            
            <div className="note-card-body">
                <textarea
                    style={{ 
                        color: colors.text,
                        width: '100%',
                        border: 'none',
                        background: 'transparent',
                        resize: 'none',
                        minHeight: '100px',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '14px'
                    }}
                    value={note.body || ''}
                    placeholder="Type your note here..."
                    onChange={(e) => {
                        const updatedNote = { ...note, body: e.target.value };
                        setNotes(notes.map(n => n.id === note.id ? updatedNote : n));
                        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
                        saveTimeoutRef.current = setTimeout(() => {
                            db.notes.update(note.id, updatedNote);
                        }, 1000);
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                />
            </div>

            <div 
                className="note-controls"
                style={{
                    padding: '8px',
                    display: 'flex',
                    gap: '8px',
                    borderTop: `1px solid ${colors.text}20`
                }}
            >
                <input
                    type="color"
                    value={colors.background}
                    onChange={(e) => {
                        const updatedNote = {
                            ...note,
                            colors: { ...colors, background: e.target.value }
                        };
                        setNotes(notes.map(n => n.id === note.id ? updatedNote : n));
                        db.notes.update(note.id, updatedNote);
                    }}
                    className="color-picker"
                    title="Background color"
                    onMouseDown={(e) => e.stopPropagation()}
                />
                <input
                    type="color"
                    value={colors.text}
                    onChange={(e) => {
                        const updatedNote = {
                            ...note,
                            colors: { ...colors, text: e.target.value }
                        };
                        setNotes(notes.map(n => n.id === note.id ? updatedNote : n));
                        db.notes.update(note.id, updatedNote);
                    }}
                    className="color-picker"
                    title="Text color"
                    onMouseDown={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    );
};

export default NoteCard;
