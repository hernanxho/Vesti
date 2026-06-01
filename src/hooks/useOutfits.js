import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabase'

export function useOutfits() {
  const [outfits, setOutfits] = useState([])
  const [cargando, setCargando] = useState(true)

  const obtenerOutfits = useCallback(async () => {
    setCargando(true)
    const { data, error } = await supabase
      .from('outfits')
      .select(`
        *,
        outfit_prendas (
          prenda_id,
          prendas (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (!error) setOutfits(data)
    setCargando(false)
  }, [])

  useEffect(() => {
    obtenerOutfits()
  }, [obtenerOutfits])

  async function guardarOutfit(nombre, ocasion, notas, prendasIds) {
    const { data, error } = await supabase
      .from('outfits')
      .insert([{ nombre, ocasion, notas }])
      .select()
      .single()

    if (error) return { error }

    const relaciones = prendasIds.map(prenda_id => ({
      outfit_id: data.id,
      prenda_id,
    }))

    const { error: errorRel } = await supabase
      .from('outfit_prendas')
      .insert(relaciones)

    if (!errorRel) await obtenerOutfits()
    return { error: errorRel }
  }

  async function eliminarOutfit(id) {
    const { error } = await supabase.from('outfits').delete().eq('id', id)
    if (!error) setOutfits(prev => prev.filter(o => o.id !== id))
  }

  return { outfits, cargando, obtenerOutfits, guardarOutfit, eliminarOutfit }
}