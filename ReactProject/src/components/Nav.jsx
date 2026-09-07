import React, { useState } from 'react'
import "./nav.scss"
import DateTime from './DateTime'

const Nav = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <nav className="mac-nav">
      <div className="left">
        <div 
          className={`nav-item apple-icon ${activeMenu === 'apple' ? 'active' : ''}`}
          onClick={() => setActiveMenu(activeMenu === 'apple' ? null : 'apple')}
        >
          <img src="./navbar-icons/apple.svg" alt="Apple" />
        </div>

        <div className="nav-item user-name">
          <p>Ravi Kumar Pandit</p>
        </div>

        <div className="nav-item">
          <p>File</p>
        </div>
        <div className="nav-item">
          <p>Window</p>
        </div>
        <div className="nav-item">
          <p>Terminal</p>
        </div>
      </div>

      <div className="right">
        <div className="nav-icon-group">
          {/* Spotlight Search Icon */}
          <div className="nav-icon" title="Search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>

          {/* Control Center Icon */}
          <div className="nav-icon" title="Control Center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"></rect>
              <rect x="14" y="3" width="7" height="7" rx="1.5"></rect>
              <rect x="14" y="14" width="7" height="7" rx="1.5"></rect>
              <rect x="3" y="14" width="7" height="7" rx="1.5"></rect>
            </svg>
          </div>

          {/* Battery Icon */}
          <div className="nav-icon" title="100% Battery">
            <svg width="18" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="6" width="18" height="12" rx="2" ry="2"></rect>
              <line x1="23" y1="10" x2="23" y2="14"></line>
              <rect x="3" y="8" width="12" height="8" fill="currentColor" opacity="0.9"></rect>
            </svg>
          </div>

          {/* Wi-Fi Icon */}
          <div className="nav-icon" title="Wi-Fi Connected">
            <img src="/navbar-icons/wifi.svg" alt="Wi-Fi" />
          </div>
        </div>

        <div className="nav-item datetime-item">
          <DateTime />
        </div>
      </div>
    </nav>
  )
}

export default Nav