import React from 'react';
import { NoteItem } from '../api';
type NoteProps = {
  note: NoteItem
  onNoteSelect: (id: number) => void
}
const MAX_BODY_LENGTH = 60;

const Note = ({ note, onNoteSelect }: NoteProps) => {
  const { id, title, body, updated } = note;

  return (
    <div className="notes__list-item" data-note-id={id} onClick={() => onNoteSelect(id)}>
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
    </div>
  );
}

export default Note;
