import React, { useRef, useEffect } from 'react';
import { NoteItem } from '../api';
type EditorProps = {
  activeNote: NoteItem,
  onNoteEdit: (note: NoteItem) => void,
  onNoteDelete: (id: number) => void
}

const Editor = (props: EditorProps) => {
  const { activeNote, onNoteEdit, onNoteDelete } = props;
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (activeNote) {
      titleRef.current!.value = activeNote.title;
      bodyRef.current!.value = activeNote.body;
    }
  });

  const handleNoteEdit = () => {
    const note = {
      id: activeNote!.id,
      updated: activeNote!.updated,
      title: titleRef.current!.value,
      body: bodyRef.current!.value
    }
    onNoteEdit(note);
  }

  return (
    <div className="notes__preview">
      <div className="notes__ops">
        <button className="notes__save" onClick={handleNoteEdit}>保存 💾</button>
        <button className="notes__del" onClick={() => { onNoteDelete(activeNote.id) }}>删除 🗑</button>
      </div>
      <input ref={titleRef} className="notes__title" type="text" placeholder="新笔记..." />
      <textarea ref={bodyRef} className="notes__body" placeholder="编辑笔记..." />
    </div>
  );
};

export default Editor;
