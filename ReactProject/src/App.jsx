import { useState } from 'react'
import "./app.scss"
import Dock from './components/Dock'
import Nav from './components/Nav'
import Github from './components/windows/Github'
import Note from './components/windows/Note'
import Resume from './components/windows/Resume'
import Spotify from './components/windows/Spotify'
import Cli from './components/windows/Cli'




function App() {

  const [windowsState, setWindowsState] = useState({
    github: false,
    note: false,
    resume: false,
    spotify: false,
    cli: false
  })
  
  const hasOpenWindow = Object.values(windowsState).some(Boolean);

  return (
    <main>
      <Nav />

      {/* Desktop Widget */}
      <div className={`desktop-widget ${hasOpenWindow ? 'minimized-widget' : ''}`}>
        <div className="widget-header">
          <span className="widget-badge">macOS Sequoia</span>
          <h2>Ravi Kumar Pandit</h2>
          <p>Full-Stack Web Developer</p>
        </div>
        <div className="widget-quick-launch">
          <p className="widget-tip">✨ Click any icon in the Dock below to launch apps</p>
          <div className="widget-buttons">
            <button onClick={() => setWindowsState(s => ({ ...s, github: true }))}>📂 Projects</button>
            <button onClick={() => setWindowsState(s => ({ ...s, cli: true }))}>⚡ Terminal</button>
          </div>
        </div>
      </div>

      <Dock windowsState={windowsState} setWindowsState={setWindowsState} />
      { windowsState.github && <Github windowName="github" setWindowsState={setWindowsState} />}
      { windowsState.note && <Note windowName="note" setWindowsState={setWindowsState} />}
      { windowsState.resume && <Resume windowName="resume" setWindowsState={setWindowsState} />}
      { windowsState.spotify && <Spotify windowName="spotify" setWindowsState={setWindowsState} />}
      { windowsState.cli && <Cli windowName="cli" setWindowsState={setWindowsState} />}
    </main>
  )
}

export default App
