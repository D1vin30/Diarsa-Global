import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { MediaConfigProvider } from './media/MediaConfigProvider.jsx'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}

const site = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// The framing editor is mounted only during `npm run dev`. In a production
// build `import.meta.env.DEV` is the literal `false`, so this whole block —
// including the dynamic imports — is dropped and its code never ships.
let tree = <MediaConfigProvider>{site}</MediaConfigProvider>
if (import.meta.env.DEV) {
  const [{ MediaEditorProvider }, { default: MediaStudio }] = await Promise.all([
    import('./media/MediaEditorContext.jsx'),
    import('./media/MediaStudio.jsx'),
  ])
  tree = (
    <MediaConfigProvider>
      <MediaEditorProvider>
        {site}
        <MediaStudio />
      </MediaEditorProvider>
    </MediaConfigProvider>
  )
}

createRoot(document.getElementById('root')).render(<StrictMode>{tree}</StrictMode>)
