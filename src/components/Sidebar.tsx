import React from 'react';
import { NoteItem } from '../api';
import Note from './Note';
type SidebarProps = {
  notes: NoteItem[],
  onNoteAdd: () => void,
  onNoteSelect: (id: number) => void
}

const Sidebar = (props: SidebarProps) => {
  const { notes, onNoteAdd, onNoteSelect } = props;

  return (
    <div className="notes__sidebar">
      <button className="notes__add" type="button" onClick={onNoteAdd}>
        添加新的笔记 📒
      </button>
      <div className="notes__list">
        {notes.map(note => {
          return (
            <Note
              key={note.id}
              note={note}
              onNoteSelect={onNoteSelect}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
