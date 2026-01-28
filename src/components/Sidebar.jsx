import React from 'react'

function Sidebar({ status }) {
  return (
    <div className="w-48 bg-[#0d1117] border-r border-gray-800 p-4 flex flex-col items-center">
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-4xl mb-3 shadow-lg">
        🦞
      </div>
      
      {/* Name */}
      <h2 className="text-lg font-semibold mb-1">Clawd</h2>
      
      {/* Status */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
        <span className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-green-500' : status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'}`}></span>
        <span className="capitalize">{status}</span>
      </div>

      {/* Ready Status */}
      <p className="text-xs text-gray-500 text-center">Ready for tasks</p>
    </div>
  )
}

export default Sidebar
