import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase'

export function usePrendas() {
  const [prendas, setPrendas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const obtenerPrendas = useCallback(async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('prendas')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setPrendas(data)
    setCargando(false)
  }, [])

  useEffect(() => {
    obtenerPrendas()
  }, [obtenerPrendas])

  async function eliminarPrenda(id, imagenUrl) {
    if (imagenUrl) {
      const path = imagenUrl.split('/prendas/')[1]
      await supabase.storage.from('prendas').remove([path])
    }
    const { error } = await supabase.from('prendas').delete().eq('id', id)
    if (!error) setPrendas(prev => prev.filter(p => p.id !== id))
  }

  async function actualizarPrenda(id, datos) {
    const { error } = await supabase
      .from('prendas')
      .update(datos)
      .eq('id', id)
    if (!error) {
      setPrendas(prev => prev.map(p => p.id === id ? { ...p, ...datos } : p))
    }
    return { error }
  }

  return { prendas, cargando, error, obtenerPrendas, eliminarPrenda, actualizarPrenda }
}