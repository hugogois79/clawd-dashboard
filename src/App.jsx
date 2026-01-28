import React, { useState, useEffect } from 'react'
import { supabase, CLAWD_BOARD } from './supabase'
import TaskCard from './components/TaskCard'
import TaskModal from './components/TaskModal'
import Header from './components/Header'

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
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedTask(null)
  }

  const handleUpdateTask = async (updatedTask) => {
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .update(updatedTask)
        .eq('id', updatedTask.id)

      if (error) throw error
      
      await fetchTasks()
      handleCloseModal()
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleMoveTask = async (taskId, newListId) => {
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .update({ list_id: newListId, updated_at: new Date().toISOString() })
        .eq('id', taskId)

      if (error) throw error
      await fetchTasks()
    } catch (error) {
      console.error('Error moving task:', error)
    }
  }

  const handleAddTask = async (title) => {
    try {
      const { error } = await supabase
        .from('kanban_cards')
        .insert({
          list_id: CLAWD_BOARD.lists.todo,
          title,
          position: tasks.todo.length,
          priority: 'medium'
        })

      if (error) throw error
      await fetchTasks()
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  const columns = [
    { id: 'todo', title: 'TO DO', color: 'red', listId: CLAWD_BOARD.lists.todo, icon: '📋' },
    { id: 'inProgress', title: 'IN PROGRESS', color: 'yellow', listId: CLAWD_BOARD.lists.inProgress, icon: '⚡' },
    { id: 'done', title: 'DONE', color: 'green', listId: CLAWD_BOARD.lists.done, icon: '✅' },
    { id: 'archived', title: 'ARCHIVED', color: 'gray', listId: CLAWD_BOARD.lists.archived, icon: '📁' }
  ]

  return (
    <div className="min-h-screen p-6">
      <Header 
        lastSync={lastSync} 
        onRefresh={fetchTasks} 
        onAddTask={handleAddTask}
        loading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {columns.map(column => (
          <div key={column.id} className="bg-slate-800/50 rounded-lg p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-${column.color}-400 font-semibold flex items-center gap-2`}>
                <span>{column.icon}</span>
                {column.title}
              </h2>
              <span className="bg-slate-700 text-white text-xs px-2 py-1 rounded-full">
                {tasks[column.id].length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks[column.id].map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onClick={() => handleTaskClick(task)}
                  onMove={(newListId) => handleMoveTask(task.id, newListId)}
                  columns={columns}
                  currentColumn={column.id}
                />
              ))}
              
              {column.id !== 'archived' && (
                <button 
                  onClick={() => {
                    const title = prompt('Task title:')
                    if (title) handleAddTask(title)
                  }}
                  className="w-full py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors text-sm"
                >
                  + Add task
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && selectedTask && (
        <TaskModal 
          task={selectedTask}
          onClose={handleCloseModal}
          onUpdate={handleUpdateTask}
          columns={columns}
        />
      )}
    </div>
  )
}

export default App
