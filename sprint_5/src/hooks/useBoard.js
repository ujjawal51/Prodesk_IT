import { useState, useEffect } from 'react'

const STORAGE_KEY = 'kanban_board_v1'

const seed = () => ({
  todo: [
    { id: crypto.randomUUID(), text: 'Design system architecture', priority: 'high' },
    { id: crypto.randomUUID(), text: 'Set up CI/CD pipeline', priority: 'medium' },
  ],
  inprogress: [
    { id: crypto.randomUUID(), text: 'Build React components', priority: 'high' },
  ],
  done: [
    { id: crypto.randomUUID(), text: 'Project kickoff meeting', priority: 'low' },
  ],
})

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : seed()
  } catch {
    return seed()
  }
}

export function useBoard() {
  const [tasks, setTasks] = useState(load)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const update = (col, fn) =>
    setTasks(prev => ({ ...prev, [col]: fn(prev[col]) }))

  const addTask = (col, text, priority) => {
    if (!text.trim()) return
    update(col, list => [...list, { id: crypto.randomUUID(), text: text.trim(), priority }])
  }

  const deleteTask = (col, id) =>
    update(col, list => list.filter(t => t.id !== id))

  const editTask = (col, id, text) =>
    update(col, list => list.map(t => (t.id === id ? { ...t, text } : t)))

  const moveTask = (fromCol, id, toCol) => {
    setTasks(prev => {
      const task = prev[fromCol].find(t => t.id === id)
      if (!task) return prev
      return {
        ...prev,
        [fromCol]: prev[fromCol].filter(t => t.id !== id),
        [toCol]: [...prev[toCol], task],
      }
    })
  }

  const reorder = (col, activeId, overId) => {
    update(col, list => {
      const next = [...list]
      const from = next.findIndex(t => t.id === activeId)
      const to = next.findIndex(t => t.id === overId)
      if (from === -1 || to === -1) return list
      next.splice(to, 0, next.splice(from, 1)[0])
      return next
    })
  }

  return { tasks, addTask, deleteTask, editTask, moveTask, reorder }
}
