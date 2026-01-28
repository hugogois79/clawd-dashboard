import React from 'react'

const priorityColors = {
  low: 'bg-blue-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  urgent: 'bg-red-500'
}

function TaskCard({ task, onClick, onMove, columns, currentColumn }) {
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  return (
    <div 
      onClick={onClick}
      className="bg-slate-700/50 hover:bg-slate-700 rounded-lg p-3 cursor-pointer transition-all hover:shadow-lg border border-transparent hover:border-slate-600"
    >
      <h3 className="text-white font-medium mb-2">{task.title}</h3>
      
      {task.created_at && (
        <p className="text-slate-400 text-xs mb-2">
          {formatDate(task.created_at)}
        </p>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {task.priority && (
          <span className={`${priorityColors[task.priority] || 'bg-slate-500'} text-white text-xs px-2 py-0.5 rounded capitalize`}>
            {task.priority}
          </span>
        )}
        
        {task.due_date && (
          <span className="bg-slate-600 text-slate-300 text-xs px-2 py-0.5 rounded">
            Due: {formatDate(task.due_date)}
          </span>
        )}

        {task.tags && task.tags.length > 0 && task.tags.map((tag, i) => (
          <span key={i} className="bg-purple-500/30 text-purple-300 text-xs px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default TaskCard
