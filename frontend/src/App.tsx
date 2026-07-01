import './App.css'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Navbar from './components/Navbar'
import AnalysisPage from './pages/AnalysisPage'
import { AnimatePresence } from 'framer-motion'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path='/' element={<LandingPage />} />
        <Route path='/analysis/:id' element={<AnalysisPage />} />

        {/* Catch-all route for 404 Not Found */}
        <Route path='*' element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
            <h1 className="text-6xl font-black text-emerald-500 mb-4">404</h1>
            <p className="text-xl text-neutral-400">Page not found</p>
          </div>
        } />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App
