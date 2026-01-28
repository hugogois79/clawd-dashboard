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
      setLastSync(new Date().toLocaleTimeString())
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
    const interval = setInterval(fetchTasks, 60000) // Auto-refresh every minute
    return () => clearInterval(interval)
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
  }

  const totalTasks = tasks.todo.length + tasks.inProgress.length + tasks.done.length
  const completionRate = totalTasks > 0 ? Math.round((tasks.done.length / totalTasks) * 100) : 0

  const columns = [
    { id: 'todo', title: 'To Do', icon: '📋', color: 'bg-slate-500' },
    { id: 'inProgress', title: 'In Progress', icon: '⚡', color: 'bg-amber-500' },
    { id: 'done', title: 'Done', icon: '✅', color: 'bg-emerald-500' },
    { id: 'archived', title: 'Archived', icon: '📁', color: 'bg-gray-600' }
  ]

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-amber-500'
      case 'low': return 'border-l-blue-500'
      default: return 'border-l-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1a] via-[#0d1424] to-[#111827] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-16 bg-[#0d1117]/80 backdrop-blur border-r border-gray-800/50 flex flex-col items-center py-4 z-40">
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
          🦞
        </div>
        <nav className="mt-8 flex flex-col gap-4">
          <button className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition" title="Dashboard">
            📊
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition" title="Tasks">
            ✓
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition" title="Calendar">
            📅
          </button>
          <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition" title="Notes">
            📝
          </button>
        </nav>
        <div className="mt-auto">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-white/10 transition" title="Settings">
            ⚙️
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-16">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur bg-[#0d1117]/70 border-b border-gray-800/50">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Clawd Dashboard
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Synced {lastSync || '--:--'}
              </span>
              <button
                onClick={fetchTasks}
                disabled={loading}
                className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg transition disabled:opacity-50"
              >
                <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg font-medium transition shadow-lg shadow-orange-500/20"
              >
                + Add Task
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="px-6 py-4 grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-400 text-2xl">📋</span>
              <span className="text-3xl font-bold">{tasks.todo.length}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">To Do</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 text-2xl">⚡</span>
              <span className="text-3xl font-bold">{tasks.inProgress.length}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">In Progress</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-emerald-400 text-2xl">✅</span>
              <span className="text-3xl font-bold">{tasks.done.length}</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Completed</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-purple-400 text-2xl">📈</span>
              <span className="text-3xl font-bold">{completionRate}%</span>
            </div>
            <p className="text-sm text-gray-400 mt-2">Completion Rate</p>
            <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="px-6 pb-6 grid grid-cols-4 gap-4">
          {columns.map(column => (
            <div key={column.id} className="bg-[#161b22]/50 backdrop-blur border border-gray-800/50 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-800/50 flex items-center justify-between">
                <span className="flex items-center gap-2 font-semibold">
                  <span className={`w-2 h-2 rounded-full ${column.color}`}></span>
                  {column.title}
                </span>
                <span className="bg-gray-700/50 text-xs px-2 py-1 rounded-full font-medium">
                  {tasks[column.id].length}
                </span>
              </div>
              <div className="p-3 space-y-2 max-h-[50vh] overflow-y-auto scrollbar-thin">
                {tasks[column.id].length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No tasks here
                  </div>
                ) : (
                  tasks[column.id].map(task => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`bg-[#21262d]/80 hover:bg-[#2d333b] p-3 rounded-lg cursor-pointer border-l-2 ${getPriorityColor(task.priority)} transition-all hover:translate-x-1`}
                    >
                      <p className={`text-sm font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">{formatDate(task.created_at)}</span>
                        {task.priority && (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            task.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <button 
                  onClick={() => { setActiveColumn(column.id); setShowAddModal(true); }}
                  className="w-full py-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800/50 rounded-lg text-sm transition"
                >
                  + Add task
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">New Task</h2>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Task title..."
              className="w-full bg-[#21262d] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500 transition"
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
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                >
                  {col.icon} {col.title}
                </button>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                className="flex-1 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 rounded-lg font-medium transition"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedTask(null)}>
          <div className="bg-[#161b22] border border-gray-700 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold">{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <p className="text-gray-400 mb-6">{selectedTask.description || 'No description'}</p>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-500">Created</span>
                <span>{formatDate(selectedTask.created_at)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-gray-500">Priority</span>
                <span className={`px-2 py-0.5 rounded ${
                  selectedTask.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                  selectedTask.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {selectedTask.priority || 'medium'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500 mb-2">Move to:</p>
              <div className="flex gap-2">
                {columns.slice(0, 3).map(col => (
                  <button
                    key={col.id}
                    onClick={() => moveTask(selectedTask, CLAWD_BOARD.lists[col.id])}
                    disabled={selectedTask.list_id === CLAWD_BOARD.lists[col.id]}
                    className="flex-1 py-2 rounded-lg text-sm bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    {col.icon} {col.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => deleteTask(selectedTask.id)}
                className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
              >
                🗑 Delete
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="flex-1 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
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
