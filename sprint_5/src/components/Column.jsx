import { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'

const DOT_COLOR = {
  todo: 'var(--col-todo)',
  inprogress: 'var(--col-progress)',
  done: 'var(--col-done)',
}

export default function Column({ colId, title, tasks, searchQuery, onAdd, onDelete, onEdit, onMove }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')

  const { setNodeRef, isOver } = useDroppable({ id: colId })

  const visible = tasks.filter(t =>
    t.text.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSubmit = e => {
    e.preventDefault()
    onAdd(text, priority)
    setText('')
    setPriority('medium')
  }

  return (
    <div className={`column ${isOver ? 'drag-over' : ''}`}>
      <div className="column-header">
        <span className="column-dot" style={{ background: DOT_COLOR[colId] }} />
        <h2 className="column-title">{title}</h2>
        <span className="column-badge">{tasks.length}</span>
      </div>

      <SortableContext items={visible.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="column-body" ref={setNodeRef}>
          {visible.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>{searchQuery ? 'No matching tasks' : 'Drop tasks here'}</p>
            </div>
          ) : (
            visible.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                col={colId}
                onDelete={() => onDelete(task.id)}
                onEdit={newText => onEdit(task.id, newText)}
                onMove={toCol => onMove(task.id, toCol)}
              />
            ))
          )}
        </div>
      </SortableContext>

      <form className="add-task-form" onSubmit={handleSubmit}>
        <input
          className="add-task-input"
          type="text"
          placeholder="Add a new task..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <div className="add-task-row">
          <select
            className="priority-select"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <button className="btn-add" type="submit">+ Add</button>
        </div>
      </form>
    </div>
  )
}
