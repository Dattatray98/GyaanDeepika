import { useEffect, useState } from 'react';
import axios from 'axios';

interface UseNotesOptions {
    courseId: string;
    contentId: string;
    token: string | null; 
}

interface UseNotesReturn {
    note: string;
    setNote: (val: string) => void;
    saveNote: () => Promise<void>;
    status: string;
}

const api = import.meta.env.VITE_API_URL;

const useNotes = ({ courseId, contentId, token }: UseNotesOptions): UseNotesReturn => {
    const [note, setNote] = useState('');
    const [status, setStatus] = useState('');

    const fetchUserNote = async () => {
        if (!token) return; 
        try {
            const res = await axios.get<{ note: string }>(
                `${api}/api/notes/${courseId}/${contentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNote(res.data.note);
        } catch (err) {
            console.error('Error fetching notes:', err);
        }
    };

    const saveNote = async () => {
        if (!token) {
            setStatus('User not authenticated ❌');
            return;
        }

        try {
            await axios.post(
                `${api}/api/notes/${courseId}/${contentId}`,
                { note },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus('Notes saved ✅');
        } catch (err) {
            console.error('Error saving note:', err);
            setStatus('Error saving note ❌');
        }
    };

    useEffect(() => {
        if (courseId && contentId && token) {
            fetchUserNote();
        }
    }, [courseId, contentId, token]);

    return { note, setNote, saveNote, status };
};

export default useNotes;
