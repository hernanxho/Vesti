import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Closet from './pages/Closet'
import Outfits from './pages/Outfits'
import DetallePrenda from './pages/DetallePrenda'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pb-20 md:pt-16 md:pb-0">
          <Routes>
            <Route path="/" element={<Closet />} />
            <Route path="/outfits" element={<Outfits />} />
            <Route path="/prenda/:id" element={<DetallePrenda />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App