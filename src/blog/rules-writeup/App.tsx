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
import rulesgui1 from '../../assets/rulesgui1.png'
import rulesgraph2 from '../../assets/rulesgraph2.png'
import './App.css'

import post1 from './post1.tsx';
import post2 from './post2.tsx';
import post3 from './post3.tsx';

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
          <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkLint]} rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}>{post1}</Markdown>
          <img src={rulesgui1} className="postimage"  alt="Image showing the CLI of the rules challenge" width="400"/>
          <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkLint]} rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}>{post2}</Markdown>
          <img src={rulesgraph2} className="postimage" alt="Image showing a directional graph of the byte arrays" width="600"/>          
          <Markdown remarkPlugins={[remarkGfm, remarkMath, remarkLint]} rehypePlugins={[rehypeKatex, rehypeRaw, rehypeHighlight]}>{post3}</Markdown>
        </div>
      </div>
    </>
  )
}

export default App
