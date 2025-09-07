import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkLint from 'remark-lint'
import 'katex/dist/katex.min.css'

//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import pfp from '../../assets/pfp.png'
import './App.css'

import post from './post.tsx';

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
          <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkLint]} rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}>{post}</Markdown>
        </div>
      </div>
    </>
  )
}

export default App
