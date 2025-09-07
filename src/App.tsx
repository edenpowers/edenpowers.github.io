import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import pfp from './assets/pfp.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='container'>
        <div className='sidebarContain'>
          <div className = "sidebar">
          <div className='nameplateContain'>
            <img src={pfp} className='pfp' alt='Profile Picture'></img>
            <div>
              <p className='nameplate'>&gt; <b>Eden Powers</b></p>
            </div>
            <div>
              <a className='homeplate' href="/index.html"> &gt; <b>Home</b> </a>
            </div>
            <div>
              <a className='homeplate' href="/blog/index.html"> &gt; <b>Blog</b> </a>
            </div>
          </div>
          </div>
        </div>
        <div className='maincontent'>
          <h1>
            This is my website
          </h1>
          <h3>
            It's pretty empty right now, <br/>
            but you can go over to my "blog" 
          </h3>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
             {count == 0 ? "Click me!" : `Clicks: ${count}`}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
