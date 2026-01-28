import React, { useState } from 'react'
import { CLAWD_BOARD } from '../supabase'

function TaskModal({ task, onClose, onUpdate, columns }) {
  const [editedTask, setEditedTask] = useState({ ...task })
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onUpdate(editedTask)
    setIsEditing(false)
  }

  const handleMove = (newListId) => {
    onUpdate({ ...editedTask, list_id: newListId })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex justify-between items-start">
            {isEditing ? (
              <input
                type="text"
                value={editedTask.title}
                onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
                className="text-xl font-bold text-white bg-slate-700 rounded px-3 py-2 w-full mr-4"
              />
            ) : (
              <h2 className="text-xl font-bold text-white">{task.title}</h2>
            )}
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-2">Description</h3>
            {isEditing ? (
              <textarea
                value={editedTask.description || ''}
                onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 min-h-[100px]"
                placeholder="Add a description..."
              />
            ) : (
              <p className="text-slate-300">
                {task.description || 'No description'}
              </p>
            )}
          </div>

          {/* Priority */}
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-2">Priority</h3>
            {isEditing ? (
              <select
                value={editedTask.priority || 'medium'}
                onChange={e => setEditedTask({ ...editedTask, priority: e.target.value })}
                className="bg-slate-700 text-white rounded-lg px-4 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            ) : (
              <span className={`inline-block px-3 py-1 rounded text-white capitalize ${
                task.priority === 'urgent' ? 'bg-red-500' :
                task.priority === 'high' ? 'bg-orange-500' :
                task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
              }`}>
                {task.priority || 'Medium'}
              </span>
            )}
          </div>

          {/* Due Date */}
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-2">Due Date</h3>
            {isEditing ? (
              <input
                type="datetime-local"
                value={editedTask.due_date ? new Date(editedTask.due_date).toISOString().slice(0, 16) : ''}
                onChange={e => setEditedTask({ ...editedTask, due_date: e.target.value ? new Date(e.target.value).toISOString() : null })}
                className="bg-slate-700 text-white rounded-lg px-4 py-2"
              />
            ) : (
              <p className="text-slate-300">{formatDate(task.due_date)}</p>
            )}
          </div>

          {/* Move to */}
          <div>
            <h3 className="text-slate-400 text-sm font-medium mb-2">Move to</h3>
            <div className="flex gap-2 flex-wrap">
              {columns.map(col => (
                <button
                  key={col.id}
                  onClick={() => handleMove(col.listId)}
                  disabled={task.list_id === col.listId}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    task.list_id === col.listId 
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  {col.icon} {col.title}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata */}
          <div className="text-slate-500 text-xs space-y-1 pt-4 border-t border-slate-700">
            <p>Created: {formatDate(task.created_at)}</p>
            <p>Updated: {formatDate(task.updated_at)}</p>
            {task.completed_at && <p>Completed: {formatDate(task.completed_at)}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex justify-between">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                Edit Task
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskModal
