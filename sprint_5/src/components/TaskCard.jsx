import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const COL_LABELS = { todo: 'To Do', inprogress: 'In Progress', done: 'Done' }
const COL_ORDER = ['todo', 'inprogress', 'done']

export default function TaskCard({ task, col, onDelete, onEdit, onMove }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { col },
  })

  const saveEdit = () => {
    if (draft.trim()) onEdit(draft.trim())
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(task.text)
    setEditing(false)
  }

  const handleKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit() }
    if (e.key === 'Escape') cancelEdit()
  }

  const stop = e => e.stopPropagation()
  const idx = COL_ORDER.indexOf(col)
  const prev = COL_ORDER[idx - 1]
  const next = COL_ORDER[idx + 1]

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`task-card priority-${task.priority} ${isDragging ? 'is-dragging' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="task-card-top">
        {editing ? (
          <textarea
            className="task-edit-input"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={handleKey}
            autoFocus
          />
        ) : (
          <p className="task-text" onDoubleClick={() => setEditing(true)}>
            {task.text}
          </p>
        )}
        <span className={`priority-pill ${task.priority}`}>{task.priority}</span>
      </div>

      <div className="task-actions">
        {editing ? (
          <>
            <button className="btn-save" onPointerDown={stop} onClick={saveEdit}>Save</button>
            <button className="btn-cancel" onPointerDown={stop} onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn-icon" onPointerDown={stop} onClick={() => setEditing(true)}>✏️ Edit</button>
            {prev && <button className="btn-icon" onPointerDown={stop} onClick={() => onMove(prev)}>← {COL_LABELS[prev]}</button>}
            {next && <button className="btn-icon" onPointerDown={stop} onClick={() => onMove(next)}>{COL_LABELS[next]} →</button>}
            <button className="btn-delete" onPointerDown={stop} onClick={onDelete}>🗑</button>
          </>
        )}
      </div>
    </div>
  )
}
