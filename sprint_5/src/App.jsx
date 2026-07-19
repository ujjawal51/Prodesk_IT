import { useState } from 'react'
import { DndContext, PointerSensor, useSensor, useSensors, DragOverlay, closestCorners } from '@dnd-kit/core'
import { useBoard } from './hooks/useBoard'
import Column from './components/Column'
import TaskCard from './components/TaskCard'

const COLUMNS = [
  { id: 'todo',       title: '📋 To Do'      },
  { id: 'inprogress', title: '⚡ In Progress' },
  { id: 'done',       title: '✅ Done'        },
]

export default function App() {
  const { tasks, addTask, deleteTask, editTask, moveTask, reorder } = useBoard()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const findCol = id => Object.keys(tasks).find(col => tasks[col].some(t => t.id === id))

  const onDragStart = ({ active: a }) => {
    const col = findCol(a.id)
    setActive({ task: tasks[col]?.find(t => t.id === a.id), col })
  }

  const onDragOver = ({ active: a, over }) => {
    if (!over) return
    const fromCol = findCol(a.id)
    const toCol = COLUMNS.some(c => c.id === over.id) ? over.id : findCol(over.id)
    if (fromCol && toCol && fromCol !== toCol) moveTask(fromCol, a.id, toCol)
  }

  const onDragEnd = ({ active: a, over }) => {
    setActive(null)
    if (!over) return
    const fromCol = findCol(a.id)
    const toCol = findCol(over.id)
    if (fromCol && toCol && fromCol === toCol && a.id !== over.id) {
      reorder(fromCol, a.id, over.id)
    }
  }

  const total = Object.values(tasks).flat().length

  return (
    <div id="app-root">
      <header className="app-header">
        <div className="app-logo">
          <div className="app-logo-icon">🗂</div>
          <div>
            <h1>ProDesk Kanban</h1>
            <p>Sprint 5 — Task Management Board</p>
          </div>
        </div>

        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="search-input"
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        <div className="task-count-badge">
          <span>{tasks.done.length}</span> / {total} done
        </div>
      </header>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
        <main className="board-container">
          {COLUMNS.map(({ id, title }) => (
            <Column
              key={id}
              colId={id}
              title={title}
              tasks={tasks[id]}
              searchQuery={query}
              onAdd={(text, priority) => addTask(id, text, priority)}
              onDelete={taskId => deleteTask(id, taskId)}
              onEdit={(taskId, text) => editTask(id, taskId, text)}
              onMove={(taskId, toCol) => moveTask(id, taskId, toCol)}
            />
          ))}
        </main>

        <DragOverlay>
          {active && (
            <div className={`task-card priority-${active.task.priority}`} style={{ opacity: 0.9, cursor: 'grabbing' }}>
              <p className="task-text">{active.task.text}</p>
              <span className={`priority-pill ${active.task.priority}`}>{active.task.priority}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
