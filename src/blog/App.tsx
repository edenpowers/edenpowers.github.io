//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import pfp from '../assets/pfp.png'
import './App.css'

function App() {

  return  (
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
          <div className='blogContain'>
            <h2 className='postHeader'>September 2025:</h2>
            <div className='postContain'>
            <a href='/blog/rules-writeup/index.html'>
              <h3 className='postTitle'>
                corctf2025 crypto/rules
              </h3>
              <p className='postDescription'>
                My writeup for the crypto/rules problem in corctf2025.
              </p></a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
