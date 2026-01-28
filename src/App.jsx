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
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [activeColumn, setActiveColumn] = useState('todo')
  const [notes, setNotes] = useState('')
  const [actionLog, setActionLog] = useState([])

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('kanban_cards')
        .select('*')
        .in('list_id', Object.values(CLAWD_BOARD.lists))
        .order('position', { ascending: true })

      if (error) throw error

      const grouped = {
        todo: data.filter(t => t.list_id === CLAWD_BOARD.lists.todo && !t.archived),
        inProgress: data.filter(t => t.list_id === CLAWD_BOARD.lists.inProgress && !t.archived),
        done: data.filter(t => t.list_id === CLAWD_BOARD.lists.done && !t.archived),
        archived: data.filter(t => t.archived || t.list_id === CLAWD_BOARD.lists.archived)
      }

      setTasks(grouped)
      setLastSync(new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
      
      // Add to action log
      setActionLog(prev => [{
        time: new Date().toLocaleString('pt-PT', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        action: 'Synced Kanban board'
      }, ...prev.slice(0, 9)])
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTaskTitle.trim()) return
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .insert({
          title: newTaskTitle,
          board_id: CLAWD_BOARD.id,
          list_id: CLAWD_BOARD.lists[activeColumn],
          position: tasks[activeColumn].length
        })
      if (error) throw error
      setNewTaskTitle('')
      setShowAddModal(false)
      fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const moveTask = async (task, newListId) => {
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .update({ list_id: newListId })
        .eq('id', task.id)
      if (error) throw error
      fetchTasks()
      setSelectedTask(null)
    } catch (error) {
      console.error('Error moving task:', error)
    }
  }

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .delete()
        .eq('id', taskId)
      if (error) throw error
      fetchTasks()
      setSelectedTask(null)
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 60000)
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const columns = [
    { id: 'todo', title: 'To Do', icon: '📋', color: 'border-gray-500' },
    { id: 'inProgress', title: 'In Progress', icon: '⚡', color: 'border-yellow-500' },
    { id: 'done', title: 'Done', icon: '✅', color: 'border-green-500' },
    { id: 'archived', title: 'Archived', icon: '📁', color: 'border-gray-600' }
  ]

  const deliverables = [
    { icon: '📺', title: 'YouTube Audits', date: 'Jan 27, 2026', type: 'Folder' },
    { icon: '⚡', title: 'Daily AI Pulse', date: 'Jan 27, 2026', type: 'Folder' },
    { icon: '📊', title: 'Daily SWOT Analysis', date: 'Jan 27, 2026', type: 'Folder' },
    { icon: '🔒', title: 'Security Audits', date: 'Jan 27, 2026', type: 'Folder' },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex">
      {/* Sidebar */}
      <aside className="w-48 bg-[#1a1a1a] border-r border-gray-800 flex flex-col items-center py-6 px-4">
        <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-5xl mb-4 shadow-lg">
          🦞
        </div>
        <h2 className="text-lg font-semibold">Clawd</h2>
        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          Idle
        </div>
        <p className="text-xs text-gray-600 mt-4">Ready for tasks</p>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🦞</span>
            <h1 className="text-xl font-semibold">Clawd Dashboard</h1>
            <span className="flex items-center gap-1.5 text-green-400 text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Online
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Last sync: {lastSync || '--:--:--'}</span>
            <button
              onClick={fetchTasks}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-sm transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Kanban Board */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {columns.map(column => (
              <div key={column.id} className="bg-[#252525] rounded-lg overflow-hidden">
                <div className={`px-4 py-3 border-l-4 ${column.color} flex items-center gap-2`}>
                  <span>{column.icon}</span>
                  <span className="font-medium">{column.title}</span>
                </div>
                <div className="p-2 space-y-2 max-h-[400px] overflow-y-auto">
                  {tasks[column.id].map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`p-3 rounded-lg cursor-pointer transition hover:brightness-110 ${
                        column.id === 'todo' ? 'bg-gray-700/50' :
                        column.id === 'inProgress' ? 'bg-yellow-900/30' :
                        column.id === 'done' ? 'bg-green-900/30' :
                        'bg-gray-800/50'
                      }`}
                    >
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(task.created_at)}</p>
                    </div>
                  ))}
                  <button 
                    onClick={() => { setActiveColumn(column.id); setShowAddModal(true); }}
                    className="w-full py-2 text-gray-500 hover:text-gray-300 hover:bg-gray-700/30 rounded-lg text-sm transition"
                  >
                    + Add task
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Deliverables Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span>📁</span>
              <h3 className="font-semibold">Deliverables</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {deliverables.map((item, idx) => (
                <div key={idx} className="bg-[#252525] rounded-lg p-4 hover:bg-[#2a2a2a] cursor-pointer transition">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-medium text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <span className="inline-block mt-2 text-xs bg-gray-700 px-2 py-0.5 rounded">{item.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-4">
            {/* Notes */}
            <div className="bg-[#252525] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span>📝</span>
                <h3 className="font-semibold">Notes for Clawd</h3>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add tasks here — Clawd checks on every heartbeat"
                className="w-full h-24 bg-transparent text-sm text-gray-400 placeholder-gray-600 resize-none focus:outline-none"
              />
            </div>

            {/* Action Log */}
            <div className="bg-[#252525] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <span>📋</span>
                <h3 className="font-semibold">Action Log</h3>
              </div>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {actionLog.length === 0 ? (
                  <p className="text-sm text-gray-500">No actions yet</p>
                ) : (
                  actionLog.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <span className="text-green-400 whitespace-nowrap">{log.time}</span>
                      <span className="text-gray-400">{log.action}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#252525] rounded-xl p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">New Task</h2>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Task title..."
              className="w-full bg-[#1a1a1a] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
              autoFocus
            />
            <div className="flex gap-2 mt-4">
              {columns.slice(0, 3).map(col => (
                <button
                  key={col.id}
                  onClick={() => setActiveColumn(col.id)}
                  className={`flex-1 py-2 rounded-lg text-sm transition ${
                    activeColumn === col.id 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  {col.icon} {col.title}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 rounded-lg font-medium transition"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
          <div className="bg-[#252525] rounded-xl p-6 max-w-lg w-full mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} className="text-gray-500 hover:text-white text-xl">×</button>
            </div>
            <p className="text-gray-400 mb-6">{selectedTask.description || 'No description'}</p>
            
            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-500">Created</span>
                <span>{formatDate(selectedTask.created_at)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-500">Priority</span>
                <span>{selectedTask.priority || 'medium'}</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mb-2">Move to:</p>
            <div className="flex gap-2 mb-6">
              {columns.slice(0, 3).map(col => (
                <button
                  key={col.id}
                  onClick={() => moveTask(selectedTask, CLAWD_BOARD.lists[col.id])}
                  disabled={selectedTask.list_id === CLAWD_BOARD.lists[col.id]}
                  className="flex-1 py-2 rounded-lg text-sm bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  {col.icon} {col.title}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => deleteTask(selectedTask.id)}
                className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
              >
                🗑 Delete
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
