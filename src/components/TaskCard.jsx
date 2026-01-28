import React from 'react'

function TaskCard({ task, onClick, onToggleComplete }) {
  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleCheckbox = (e) => {
    e.stopPropagation()
    onToggleComplete(!task.completed)
  }

  return (
    <div
      onClick={onClick}
      className="bg-[#21262d] hover:bg-[#282e36] rounded-lg p-3 cursor-pointer transition-all border border-transparent hover:border-gray-700 group"
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={handleCheckbox}
          className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-600 hover:border-gray-500'
          }`}
        >
          {task.completed && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium leading-snug ${task.completed ? 'text-gray-500 line-through' : 'text-white'}`}>
            {task.title}
          </h3>
          {task.created_at && (
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(task.created_at)}
            </p>
          )}
        </div>

        {/* Status indicator */}
        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
          task.completed ? 'bg-green-500' : 
          task.priority === 'urgent' ? 'bg-red-500' :
          task.priority === 'high' ? 'bg-orange-500' :
          'bg-yellow-500'
        }`}></div>
      </div>
    </div>
  )
}

export default TaskCard
