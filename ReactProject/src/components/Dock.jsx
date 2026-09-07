import React from 'react'
import "./dock.scss"

const Dock = ({ windowsState, setWindowsState }) => {
    return (
        <footer className='dock'>
            <div className="dock-item-wrapper">
                <div className="dock-tooltip">GitHub Projects</div>
                <div
                    onClick={() => { setWindowsState(state => ({ ...state, github: !state.github })) }}
                    className="icon github"
                >
                    <img src="/doc-icons/github.svg" alt="GitHub" />
                </div>
                {windowsState.github && <div className="active-dot"></div>}
            </div>

            <div className="dock-item-wrapper">
                <div className="dock-tooltip">Notes</div>
                <div
                    onClick={() => { setWindowsState(state => ({ ...state, note: !state.note })) }}
                    className="icon note"
                >
                    <img src="/doc-icons/note.svg" alt="Note" />
                </div>
                {windowsState.note && <div className="active-dot"></div>}
            </div>

            <div className="dock-item-wrapper">
                <div className="dock-tooltip">Resume</div>
                <div
                    onClick={() => { setWindowsState(state => ({ ...state, resume: !state.resume })) }}
                    className="icon pdf"
                >
                    <img src="/doc-icons/pdf.svg" alt="Resume" />
                </div>
                {windowsState.resume && <div className="active-dot"></div>}
            </div>

            <div className="dock-item-wrapper">
                <div className="dock-tooltip">Calendar</div>
                <div
                    onClick={() => { window.open("https://calendar.google.com/", "_blank") }}
                    className="icon calender"
                >
                    <img src="/doc-icons/calender.svg" alt="Calendar" />
                </div>
            </div>

            <div className="dock-item-wrapper">
                <div className="dock-tooltip">Spotify</div>
                <div
                    onClick={() => { setWindowsState(state => ({ ...state, spotify: !state.spotify })) }}
                    className="icon spotify"
                >
                    <img src="/doc-icons/spotify.svg" alt="Spotify" />
                </div>
                {windowsState.spotify && <div className="active-dot"></div>}
            </div>

            <div className="dock-item-wrapper">
                <div className="dock-tooltip">Email</div>
                <div
                    onClick={() => { window.open("mailto:ravikrp208@gmail.com", "_blank") }}
                    className="icon mail"
                >
                    <img src="/doc-icons/mail.svg" alt="Mail" />
                </div>
            </div>

            <div className="dock-item-wrapper">
                <div className="dock-tooltip">LinkedIn</div>
                <div
                    onClick={() => { window.open("https://www.linkedin.com/in/ravi-kumar-pandit-13541132a/", "_blank") }}
                    className="icon link"
                >
                    <img src="/doc-icons/link.svg" alt="LinkedIn" />
                </div>
            </div>

            <div className="dock-item-wrapper">
                <div className="dock-tooltip">Terminal CLI</div>
                <div
                    onClick={() => { setWindowsState(state => ({ ...state, cli: !state.cli })) }}
                    className="icon cli"
                >
                    <img src="/doc-icons/cli.svg" alt="Terminal" />
                </div>
                {windowsState.cli && <div className="active-dot"></div>}
            </div>
        </footer>
    )
}

export default Dock