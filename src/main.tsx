import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Sidebar from './App.tsx'
const TestComponent = () => (
  <div className="bg-blue-500 text-white p-4">
    <h1>Welcome to my app!</h1>
  </div>
);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Sidebar/>
    <TestComponent/>

  </StrictMode>,
)
