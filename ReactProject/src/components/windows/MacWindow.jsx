import React, { useState } from 'react'
import { Rnd } from 'react-rnd'
import "./window.scss"

const MacWindow = ({ children, width = "45vw", height = "48vh", windowName, setWindowsState }) => {
    const [isMaximized, setIsMaximized] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    const toggleMaximize = () => {
        setIsMaximized(!isMaximized);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    if (isMinimized) {
        return null; // Minimized state
    }

    return (
        <Rnd
            size={isMaximized ? { width: '96vw', height: '88vh' } : undefined}
            position={isMaximized ? { x: 20, y: 45 } : undefined}
            default={{
                width: width,
                height: height,
                x: window.innerWidth > 900 ? 320 : 40,
                y: 120
            }}
            minWidth={320}
            minHeight={240}
            bounds="main"
            enableResizing={!isMaximized}
            disableDragging={isMaximized}
        >
            <div className={`window ${isMaximized ? 'maximized' : ''}`}>
                <div className="nav">
                    <div className="dots">
                        <div 
                            onClick={() => setWindowsState(state => ({ ...state, [windowName]: false }))} 
                            className="dot red" 
                            title="Close"
                        >
                            <span>×</span>
                        </div>
                        <div 
                            onClick={toggleMinimize} 
                            className="dot yellow" 
                            title="Minimize"
                        >
                            <span>-</span>
                        </div>
                        <div 
                            onClick={toggleMaximize} 
                            className="dot green" 
                            title={isMaximized ? "Restore" : "Maximize"}
                        >
                            <span>+</span>
                        </div>
                    </div>

                    <div className="title">
                        <p>{windowName === 'cli' ? 'ravikumar - zsh' : `Ravi Kumar Pandit — ${windowName.toUpperCase()}`}</p>
                    </div>
                </div>
                <div className="main-content">
                    {children}
                </div>
            </div>
        </Rnd>
    )
}

export default MacWindow