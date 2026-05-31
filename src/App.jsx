import { useEffect, useState } from 'react'
import { supabase } from './supabase'

function App() {
  const [conexion, setConexion] = useState('Verificando conexión...')

  useEffect(() => {
    async function verificar() {
      const { data, error } = await supabase.from('prendas').select('*')
      if (error) {
        setConexion('Error: ' + error.message)
      } else {
        setConexion('Conexión con Supabase exitosa')
      }
    }
    verificar()
  }, [])

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow text-center">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">Vesti ✨</h1>
        <p className="text-gray-600">{conexion}</p>
      </div>
    </div>
  )
}

export default App