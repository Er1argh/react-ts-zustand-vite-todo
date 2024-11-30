import { createRoot } from 'react-dom/client'

import './views/styles/reset.scss'
import './views/styles/common.scss'

import { App } from './views/App'

createRoot(document.getElementById('root')!).render(<App />)
