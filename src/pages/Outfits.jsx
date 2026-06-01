import { useState } from 'react'
import { Plus, Shuffle, Trash2 } from 'lucide-react'
import { useOutfits } from '../hooks/useOutfits'
import { usePrendas } from '../hooks/usePrendas'
import CreadorOutfit from '../components/CreadorOutfit'
import VisualizadorOutfit from '../components/VisualizadorOutfit'

function Outfits() {
  const { outfits, cargando, guardarOutfit, eliminarOutfit } = useOutfits()
  const { prendas } = usePrendas()
  const [mostrarCreador, setMostrarCreador] = useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#111111]">Mis Outfits</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">{outfits.length} outfits guardados</p>
        </div>
        <button
          onClick={() => setMostrarCreador(true)}
          className="flex items-center gap-2 bg-[#111111] hover:bg-[#333333] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200"
        >
          <Plus size={16} />
          Crear outfit
        </button>
      </div>

      {/* Loading */}
      {cargando && (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Estado vacío */}
      {!cargando && outfits.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 bg-[#F9F9F9] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mb-4">
            <Shuffle size={24} className="text-[#9CA3AF]" />
          </div>
          <p className="text-[#111111] font-medium">No hay outfits todavía</p>
          <p className="text-[#9CA3AF] text-sm mt-1">Crea tu primer outfit combinando prendas</p>
        </div>
      )}

      {/* Grid de outfits */}
      {!cargando && outfits.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {outfits.map(outfit => (
            <TarjetaOutfit
              key={outfit.id}
              outfit={outfit}
              onEliminar={eliminarOutfit}
            />
          ))}
        </div>
      )}

      {/* Modal creador */}
      {mostrarCreador && (
        <CreadorOutfit
          prendas={prendas}
          onCerrar={() => setMostrarCreador(false)}
          onGuardado={async (nombre, ocasion, notas, ids) => {
            const { error } = await guardarOutfit(nombre, ocasion, notas, ids)
            if (!error) setMostrarCreador(false)
            else alert('Error guardando outfit: ' + error.message)
          }}
        />
      )}

    </div>
  )
}

function TarjetaOutfit({ outfit, onEliminar }) {
  const prendas = outfit.outfit_prendas?.map(op => op.prendas).filter(Boolean) || []

  return (
    <div className="group bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden hover:border-[#D1D5DB] hover:shadow-sm transition-all duration-200">

      {/* Visualizador por capas */}
      <VisualizadorOutfit prendas={prendas} tipoManiqui="neutro" />

      {/* Info */}
      <div className="p-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-medium text-[#111111] text-sm truncate">{outfit.nombre}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            {outfit.ocasion && (
              <span className="text-xs text-[#9CA3AF]">{outfit.ocasion}</span>
            )}
            <span className="text-xs text-[#9CA3AF]">{prendas.length} prendas</span>
          </div>
          {/* Categorías utilizadas */}
          <div className="flex gap-1 mt-1.5 flex-wrap">
            {[...new Set(prendas.map(p => p.subcategoria || p.categoria))].map(cat => (
              <span key={cat} className="text-[10px] text-[#9CA3AF] border border-[#E5E7EB] rounded-full px-2 py-0.5">
                {cat}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={() => onEliminar(outfit.id)}
          className="flex-shrink-0 p-1.5 opacity-0 group-hover:opacity-100 hover:bg-[#FEF2F2] hover:text-red-500 text-[#9CA3AF] rounded-lg border border-transparent hover:border-red-100 transition-all duration-200"
        >
          <Trash2 size={13} />
        </button>
      </div>

    </div>
  )
}

export default Outfits