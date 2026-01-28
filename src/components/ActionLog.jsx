import React from 'react'

function ActionLog() {
  const [logs, setLogs] = React.useState([])

  return (
    <div className="bg-[#161b22] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>📋</span>
        <h2 className="font-semibold">Action Log</h2>
      </div>
      
      {logs.length === 0 ? (
        <p className="text-gray-500 text-sm">No completed tasks yet.</p>
      ) : (
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="text-blue-400 text-xs">{log.time}</span>
              <span className="text-gray-300">{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActionLog
