import React from 'react'

function Header({ lastSync, onRefresh, onAddTask, loading }) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
          🦞
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Clawd Dashboard</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 text-sm">Online</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-slate-400 text-sm">
          Last sync: {lastSync || '--:--:--'}
        </span>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <span className={loading ? 'animate-spin' : ''}>↻</span>
          Refresh
        </button>
        <button
          onClick={() => {
            const title = prompt('Task title:')
            if (title) onAddTask(title)
          }}
          className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
        >
          + Add Task
        </button>
      </div>
    </header>
  )
}

export default Header
