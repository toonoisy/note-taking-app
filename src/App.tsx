import React, { useState, useRef, useEffect } from 'react';
import { NoteItem, NotesAPI } from './api';

const App = () => {
  const MAX_BODY_LENGTH = 60;
  const [notes, setNotes] = useState<NoteItem[]>(() => NotesAPI.getAllNotes());
  const [activeNote, setActiveNote] = useState<NoteItem>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeNote) {
      titleRef.current!.value = activeNote.title;
      bodyRef.current!.value = activeNote.body;
    }
  });

  const onNoteAdd = () => {
    const newNote = {
      id: Math.floor(Math.random() * 1000000),
      title: "新建笔记",
      body: "开始记录...",
      updated: new Date().toISOString()
    };

    NotesAPI.saveNote(newNote);
    setActiveNote(newNote);
    _refreshNotes();
  };

  const onNoteSelect = (noteId: number) => {
    const selectedNote = notes.find((note) => note.id === noteId);
    setActiveNote(selectedNote);    
  };

  const onNoteEdit = () => {
    const note = {
      id: activeNote!.id,
      updated: activeNote!.updated,
      title: titleRef.current!.value,
      body: bodyRef.current!.value
    }
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
      <div className="notes__sidebar">
        <button className="notes__add" type="button" onClick={onNoteAdd}>
          添加新的笔记 📒
        </button>
        <div className="notes__list">
          {notes.map(note => {
            const { id, title, body, updated } = note;

            return (<div className="notes__list-item" data-note-id={id} key={id} onClick={() => onNoteSelect(id)}>
              <div className="notes__small-title">{title}</div>
              <div className="notes__small-body">
                {body.substring(0, MAX_BODY_LENGTH)}
                {body.length > MAX_BODY_LENGTH ? "..." : ""}
              </div>
              <div className="notes__small-updated">
                {new Date(updated).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </div>
            </div>);
          })}
        </div>
      </div>
      {activeNote && <div className="notes__preview">
        <div className="notes__ops">
          <button className="notes__save" onClick={onNoteEdit}>💾</button>
          <button className="notes__del" onClick={() => {onNoteDelete(activeNote.id)}}>🗑</button>
        </div>
        <input ref={titleRef} className="notes__title" type="text" placeholder="新笔记..." />
        <textarea ref={bodyRef} className="notes__body" placeholder="编辑笔记..." />
      </div>}
    </>
  );
}

export default App;
