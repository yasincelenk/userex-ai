import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isRecording, setIsRecording] = useState(false)
  const [eventCount, setEventCount] = useState(0)

  useEffect(() => {
    // Check current state
    chrome.storage.local.get(['isRecording'], (result) => {
      if (result.isRecording) setIsRecording(true)
      // We can't synchronously get count from IDB easily here without messaging background
      // So we just wait for the first update or user interaction for now
      // Or we could request it.
      chrome.runtime.sendMessage({ type: 'GET_COUNT' }, (response) => {
        if (response && response.count) setEventCount(response.count);
      });
    })

    // Listen for updates
    chrome.runtime.onMessage.addListener((request: any) => {
      if (request.type === 'UPDATE_COUNT') {
        setEventCount(request.count)
      }
    });
  }, [])

  const toggleRecording = () => {
    const newState = !isRecording
    setIsRecording(newState)
    chrome.storage.local.set({ isRecording: newState })

    // Notify background script
    chrome.runtime.sendMessage({
      type: newState ? 'START_RECORDING' : 'STOP_RECORDING'
    })
  }

  const exportData = () => {
    chrome.runtime.sendMessage({ type: 'EXPORT_DATA' })
  }

  return (
    <div className="w-[300px] p-4 bg-background text-foreground">
      <h1 className="text-lg font-bold mb-4">Userex Companion</h1>

      <div className="flex flex-col gap-4">
        <div className="p-4 rounded-lg bg-gray-100 flex flex-col items-center">
          <div className={`w-3 h-3 rounded-full mb-2 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm font-medium">
            {isRecording ? 'Recording Active' : 'Ready to Record'}
          </span>
          <span className="text-xs text-gray-500 mt-1">
            {eventCount} events captured
          </span>
        </div>

        <button
          onClick={toggleRecording}
          className={`px-4 py-2 rounded-md font-medium text-white transition-colors
            ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>

        {!isRecording && eventCount > 0 && (
          <button
            onClick={exportData}
            className="px-4 py-2 rounded-md font-medium bg-green-600 text-white hover:bg-green-700"
          >
            Analyze Flow
          </button>
        )}
      </div>
    </div>
  )
}

export default App
