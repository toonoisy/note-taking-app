import React from 'react';
import { NoteItem, NotesAPI } from '../api';
import Note from './Note';
import { xml2json } from 'xml-js';
import { saveAs } from 'file-saver';
type SidebarProps = {
  notes: NoteItem[],
  onNoteAdd: () => void,
  onNoteSelect: (id: number) => void,
  _refreshNotes: () => void
}

const Sidebar = (props: SidebarProps) => {
  const { notes, onNoteAdd, onNoteSelect, _refreshNotes } = props;

  const importNotes = (event: React.BaseSyntheticEvent) => {
    const reader = new FileReader();
    reader.readAsText(event.target.files[0]);
    reader.onload = function() {
        try {
          const result = reader.result as string;
          const arrOrObj = JSON.parse(xml2json(result, {compact: true, spaces: 2})).notes?.note || [];
          const arr = arrOrObj instanceof Array ? arrOrObj : [arrOrObj];
          arr.forEach((el: { title: { _text: string; }; body: { _text: string; }; }) => {
            const newNote = {
              id: -1,
              title: el.title?._text,
              body: el.body?._text,
              updated: ''
            };
            NotesAPI.saveNote(newNote);
          });
          _refreshNotes();
          event.target.value = null;
          alert(`成功导入${arr.length}条笔记`);
        } catch (error) {
          alert('导入笔记失败，请检查文件格式');
        }
    };
  };

  const exportNotes = () => {
    const notes = JSON.parse(localStorage.getItem("notesapp-notes") as string);
    if (!notes || !notes.length) {
      alert('没有可以导出的笔记');
      return;
    }
    const result = notes.reduce((acc: NoteItem, cur: NoteItem) => {
      return acc + `<note>\n  <id>${cur.id}</id>\n  <title>${cur.title}</title>\n  <body>${cur.body}</body>\n  <updated>${cur.updated}</updated>\n</note>\n`
    }, '');
    const xml = '<notes>\n' + result + '</notes>';
    const blob = new Blob([xml], { type: "text/xml" });
    saveAs(blob, "notes.xml");
  };

  return (
    <div className="notes__sidebar">
      <div className="notes__list-ops">
        <button className="notes__add" type="button" onClick={onNoteAdd}>
          添加新的笔记 📒
        </button>
        <div className="notes__template">
          <a href="/src/assets/import-template.xml" download>下载导入模板</a>
        </div>
        <div>
          <label>导入 xml：</label>
          <input className="notes__import" type="file" accept="text/xml" onChange={importNotes}/>
        </div>
        <div>
          <label>导出 xml：</label>
          <button className="notes__export" onClick={exportNotes}>一键导出</button>
        </div>
      </div>
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
