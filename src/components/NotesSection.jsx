import React, { useState } from 'react'

function NotesSection() {
  const [note, setNote] = useState('')

  return (
    <div className="bg-[#161b22] rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>📝</span>
        <h2 className="font-semibold">Notes for Clawd</h2>
      </div>
      
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add tasks here — Clawd checks on every heartbeat..."
        className="w-full bg-[#21262d] border border-gray-700 rounded-lg p-3 text-sm text-gray-300 placeholder-gray-500 resize-none h-20 focus:outline-none focus:border-gray-600"
      />
    </div>
  )
}

export default NotesSection
