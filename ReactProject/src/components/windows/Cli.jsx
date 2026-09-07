import React from 'react'
import MacWindow from './MacWindow'
import Terminal from 'react-console-emulator'
import "./cli.scss"

const Cli = ({ windowName, setWindowsState }) => {
    const commands = {
        about: {
            description: 'About me',
            usage: 'about',
            fn: () => 'I am a full-stack web developer passionate about building modern web applications with React, Node.js, and cloud technologies.'
        },
        skills: {
            description: 'List technical skills',
            usage: 'skills',
            fn: () => `Frontend: React, Vue.js, Vanilla JS, Sass, HTML/CSS
Backend: Node.js, Express, Python, Django
Databases: MongoDB, PostgreSQL, MySQL
Tools: Git, Docker, Webpack, Vite
Cloud: AWS, Azure, Heroku`
        },
        projects: {
            description: 'View my projects',
            usage: 'projects',
            fn: () => `1. Portfolio Website - React + Vite
2. E-commerce Platform - MERN Stack
3. Task Management App - Next.js
4. Real-time Chat App - Socket.io
5. Data Dashboard - React + Chart.js`
        },
        experience: {
            description: 'Display work experience',
            usage: 'experience',
            fn: () => `Senior Developer @ Tech Corp (2022 - Present)
  - Led development of 5+ React applications
  - Mentored junior developers

Full Stack Developer @ Web Solutions (2020 - 2022)
  - Built scalable APIs with Node.js
  - Designed responsive UIs with React`
        },
        contact: {
            description: 'Get contact information',
            usage: 'contact',
            fn: () => `Email: ravikrp208@gmail.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA`
        },
        github: {
            description: 'Open GitHub profile',
            usage: 'github',
            fn: () => {
                window.open('https://github.com/Ravikrp208', '_blank')
                return 'Opening GitHub...'
            }
        },
        resume: {
            description: 'Download resume',
            usage: 'resume',
            fn: () => 'Resume download started...'
        },
        social: {
            description: 'View social media links',
            usage: 'social',
            fn: () => `LinkedIn: https://www.linkedin.com/in/ravi-kumar-pandit-13541132a/
GitHub: https://github.com/Ravikrp208`
        },
        echo: {
            description: 'Echo a passed string',
            usage: 'echo <string>',
            fn: (...args) => args.join(' ')
        }
    }

    const welcomeMessage = `
╔═══════════════════════════════════════════════════════╗
║    👋 Welcome to Ravi Kumar Pandit's macOS Terminal   ║
╚═══════════════════════════════════════════════════════╝

Type 'help' to view available commands:
  • about      - Full stack developer background
  • skills     - Tech stack & proficiency
  • projects   - Highlights & portfolio work
  • experience - Career history
  • contact    - Direct contact info & socials
`

    return (
        <MacWindow windowName={windowName} setWindowsState={setWindowsState} >
            <div className="cli-window">
                <div className="cli-toolbar">
                    <span className="cli-tag">Quick Commands:</span>
                    <span className="cli-badge">about</span>
                    <span className="cli-badge">skills</span>
                    <span className="cli-badge">projects</span>
                    <span className="cli-badge">contact</span>
                    <span className="cli-badge">github</span>
                </div>
                <Terminal
                    commands={commands}
                    welcomeMessage={welcomeMessage}
                    promptLabel={'ravikumar:~$'}
                    promptLabelStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                />
            </div>
        </MacWindow>
    )
}

export default Cli