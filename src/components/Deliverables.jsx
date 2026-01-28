import React from 'react'

function Deliverables() {
  const folders = [
    { name: 'Daily Reports', icon: '📊', status: 'Automated', color: 'blue' },
    { name: 'Email Summaries', icon: '📧', status: 'On Request', color: 'yellow' },
    { name: 'Research Tasks', icon: '🔍', status: 'Ongoing', color: 'cyan' },
    { name: 'Security Audits', icon: '🔒', status: 'Scheduled', color: 'orange' },
  ]

  return (
    <div className="bg-[#161b22] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <span>📁</span>
        <h2 className="font-semibold">Deliverables</h2>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {folders.map((folder, index) => (
          <div
            key={index}
            className="bg-[#21262d] hover:bg-[#282e36] rounded-lg p-4 cursor-pointer transition-colors text-center"
          >
            <div className="text-3xl mb-2">{folder.icon}</div>
            <h3 className="text-sm font-medium mb-1">{folder.name}</h3>
            <span className="text-xs text-gray-500">{folder.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Deliverables
