import React, { useState } from 'react';
import { NoteItem, NotesAPI } from './api';
import Editor from './components/Editor';
import Sidebar from './components/Sidebar';

const App = () => {
  const [notes, setNotes] = useState<NoteItem[]>(() => NotesAPI.getAllNotes());
  const [activeNote, setActiveNote] = useState<NoteItem>();

  const onNoteAdd = () => {
    const newNote = {
      id: -1,
      title: "新建笔记",
      body: "开始记录...",
      updated: ''
    };

    NotesAPI.saveNote(newNote);
    setActiveNote(newNote);
    _refreshNotes();
  };

  const onNoteSelect = (noteId: number) => {
    const selectedNote = notes.find((note) => note.id === noteId);
    setActiveNote(selectedNote);    
  };

  const onNoteEdit = (note: NoteItem) => {
    NotesAPI.saveNote(note);
    setActiveNote(note);
    _refreshNotes();    
  };

  const onNoteDelete = (noteId: number) => {
    const doDelete = confirm("确认要删除该笔记吗?");
    if (doDelete) {
      NotesAPI.deleteNote(noteId);
      setActiveNote(undefined);
      _refreshNotes();
    }
  }

  const _refreshNotes = () => {
    const notes = NotesAPI.getAllNotes();
    setNotes(notes);
  };

  return (
    <>
      <Sidebar 
        notes={notes}
        onNoteAdd={onNoteAdd}
        onNoteSelect={onNoteSelect}
        _refreshNotes={_refreshNotes}
      />
      {activeNote &&
        <Editor
          activeNote={activeNote}
          onNoteEdit={onNoteEdit}
          onNoteDelete={onNoteDelete}
        />
      }
    </>
  );
}

export default App;
