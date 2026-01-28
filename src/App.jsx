import React, { useState, useEffect } from 'react'
import { supabase, CLAWD_BOARD } from './supabase'

function App() {
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
    archived: []
  })
  const [loading, setLoading] = useState(true)
  const [lastSync, setLastSync] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      console.log('Fetching tasks...')
      const { data, error } = await supabase
        .from('kanban_cards')
        .select('*')
        .in('list_id', Object.values(CLAWD_BOARD.lists))
        .order('position', { ascending: true })

      console.log('Data:', data, 'Error:', error)

      if (error) throw error

      const grouped = {
        todo: data.filter(t => t.list_id === CLAWD_BOARD.lists.todo && !t.archived),
        inProgress: data.filter(t => t.list_id === CLAWD_BOARD.lists.inProgress && !t.archived),
        done: data.filter(t => t.list_id === CLAWD_BOARD.lists.done && !t.archived),
        archived: data.filter(t => t.archived || t.list_id === CLAWD_BOARD.lists.archived)
      }

      setTasks(grouped)
      setLastSync(new Date().toLocaleTimeString())
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const columns = [
    { id: 'todo', title: 'To Do', icon: '📋' },
    { id: 'inProgress', title: 'In Progress', icon: '⚡' },
    { id: 'done', title: 'Done', icon: '✅' },
    { id: 'archived', title: 'Archived', icon: '📁' }
  ]

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-xl">
            🦞
          </div>
          <div>
            <h1 className="text-lg font-semibold">Clawd Dashboard</h1>
            <span className="flex items-center gap-1.5 text-green-400 text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
              Online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Last sync: {lastSync || '--:--:--'}</span>
          <button
            onClick={fetchTasks}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm"
          >
            ↻ Refresh
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="p-4 grid grid-cols-4 gap-4">
        {columns.map(column => (
          <div key={column.id} className="bg-[#161b22] rounded-lg">
            <div className="px-3 py-2 border-b border-gray-800 flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                {column.icon} {column.title}
              </span>
              <span className="bg-gray-700 text-xs px-2 py-0.5 rounded-full">
                {tasks[column.id].length}
              </span>
            </div>
            <div className="p-2 space-y-2 max-h-[60vh] overflow-y-auto">
              {tasks[column.id].map(task => (
                <div
                  key={task.id}
                  onClick={() => setSelectedTask(task)}
                  className="bg-[#21262d] hover:bg-[#2d333b] p-3 rounded cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="mt-1"
                    />
                    <div>
                      <p className={`text-sm ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(task.created_at)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
          <div className="bg-[#161b22] rounded-lg p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">{selectedTask.title}</h2>
            <p className="text-gray-400 mb-4">{selectedTask.description || 'No description'}</p>
            <div className="text-sm text-gray-500">
              <p>Created: {formatDate(selectedTask.created_at)}</p>
              <p>Priority: {selectedTask.priority || 'medium'}</p>
            </div>
            <button
              onClick={() => setSelectedTask(null)}
              className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
