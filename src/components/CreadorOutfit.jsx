import { useState } from 'react'
import { X, Shuffle, Check } from 'lucide-react'
import { CATEGORIAS_PRINCIPALES } from '../data/categorias'

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#111111] transition-colors bg-white"

function CreadorOutfit({ prendas, onCerrar, onGuardado }) {
  const [seleccionadas, setSeleccionadas] = useState([])
  const [nombre, setNombre] = useState('')
  const [ocasion, setOcasion] = useState('')
  const [notas, setNotas] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [categoriaActiva, setCategoriaActiva] = useState('todas')
  const [paso, setPaso] = useState(1)

  const categoriasFiltro = ['todas', ...CATEGORIAS_PRINCIPALES.filter(
    cat => prendas.some(p => p.categoria === cat)
  )]

  const prendasFiltradas = categoriaActiva === 'todas'
    ? prendas
    : prendas.filter(p => p.categoria === categoriaActiva)

  function togglePrenda(prenda) {
    setSeleccionadas(prev =>
      prev.find(p => p.id === prenda.id)
        ? prev.filter(p => p.id !== prenda.id)
        : [...prev, prenda]
    )
  }

  function generarAleatorio() {
    const categorias = ['Parte superior', 'Parte inferior', 'Calzado']
    const resultado = []
    categorias.forEach(cat => {
      const disponibles = prendas.filter(p => p.categoria === cat)
      if (disponibles.length > 0) {
        resultado.push(disponibles[Math.floor(Math.random() * disponibles.length)])
      }
    })
    const accesorios = prendas.filter(p => p.categoria === 'Accesorios')
    if (accesorios.length > 0) {
      resultado.push(accesorios[Math.floor(Math.random() * accesorios.length)])
    }
    setSeleccionadas(resultado)
  }

  async function handleGuardar() {
    if (!nombre.trim()) return alert('El outfit necesita un nombre')
    if (seleccionadas.length === 0) return alert('Selecciona al menos una prenda')
    setGuardando(true)
    await onGuardado(nombre, ocasion, notas, seleccionadas.map(p => p.id))
    setGuardando(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="bg-white rounded-2xl shadow-xl border border-[#E5E7EB] flex flex-col"
        style={{ width: '100%', maxWidth: '480px', maxHeight: '90vh' }}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]" style={{ flexShrink: 0 }}>
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-[#111111]">Crear outfit</h2>
            <div className="flex items-center gap-1">
              <span style={{
                width: 24, height: 24, borderRadius: '50%', fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500,
                backgroundColor: paso === 1 ? '#111111' : '#F3F4F6',
                color: paso === 1 ? '#fff' : '#9CA3AF'
              }}>1</span>
              <div style={{ width: 16, height: 1, backgroundColor: '#E5E7EB' }} />
              <span style={{
                width: 24, height: 24, borderRadius: '50%', fontSize: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500,
                backgroundColor: paso === 2 ? '#111111' : '#F3F4F6',
                color: paso === 2 ? '#fff' : '#9CA3AF'
              }}>2</span>
            </div>
          </div>
          <button onClick={onCerrar} className="p-1.5 hover:bg-[#F5F5F5] rounded-lg transition-colors">
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>

        {paso === 1 && (
          <>
            {/* Controles */}
            <div className="px-5 pt-4 pb-2" style={{ flexShrink: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-[#6B7280]">
                  {seleccionadas.length > 0
                    ? `${seleccionadas.length} prenda${seleccionadas.length > 1 ? 's' : ''} seleccionada${seleccionadas.length > 1 ? 's' : ''}`
                    : 'Selecciona las prendas'}
                </p>
                <button
                  onClick={generarAleatorio}
                  className="flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111111] border border-[#E5E7EB] hover:border-[#D1D5DB] px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Shuffle size={13} />
                  Aleatorio
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categoriasFiltro.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoriaActiva(cat)}
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      categoriaActiva === cat
                        ? 'bg-[#111111] text-white'
                        : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F5F5F5]'
                    }`}
                  >
                    {cat === 'todas' ? 'Todas' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de prendas */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 16px' }}>
              {prendas.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-[#9CA3AF] text-sm">No hay prendas en tu closet</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: 8
                }}>
                  {prendasFiltradas.map(prenda => {
                    const estaSeleccionada = !!seleccionadas.find(p => p.id === prenda.id)
                    return (
                      <button
                        key={prenda.id}
                        onClick={() => togglePrenda(prenda)}
                        style={{
                          position: 'relative',
                          borderRadius: 12,
                          overflow: 'hidden',
                          border: estaSeleccionada ? '2px solid #111111' : '2px solid transparent',
                          transform: estaSeleccionada ? 'scale(0.97)' : 'scale(1)',
                          transition: 'all 0.15s',
                          cursor: 'pointer',
                          background: 'none',
                          padding: 0,
                          textAlign: 'left',
                        }}
                      >
                        {/* Imagen */}
                        <div style={{
                          width: '100%',
                          paddingBottom: '133%',
                          position: 'relative',
                          backgroundColor: '#F9F9F9',
                          overflow: 'hidden'
                        }}>
                          {prenda.imagen_url ? (
                            <img
                              src={prenda.imagen_url}
                              alt={prenda.nombre}
                              style={{
                                position: 'absolute',
                                inset: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                              }}
                            />
                          ) : (
                            <div style={{
                              position: 'absolute', inset: 0,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, color: '#9CA3AF', padding: 8, textAlign: 'center'
                            }}>
                              {prenda.nombre}
                            </div>
                          )}
                        </div>

                        {/* Texto */}
                        <div style={{ padding: '6px 8px', backgroundColor: 'white' }}>
                          <p style={{ fontSize: 11, fontWeight: 500, color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {prenda.nombre}
                          </p>
                          <p style={{ fontSize: 10, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {prenda.subcategoria}
                          </p>
                        </div>

                        {/* Check */}
                        {estaSeleccionada && (
                          <div style={{
                            position: 'absolute', top: 6, right: 6,
                            width: 20, height: 20, borderRadius: '50%',
                            backgroundColor: '#111111',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                          }}>
                            <Check size={11} color="white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {paso === 2 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

            {/* Preview */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
              {seleccionadas.map(prenda => (
                <div key={prenda.id} style={{ flexShrink: 0, width: 60 }}>
                  <div style={{
                    width: 60, paddingBottom: '133%', position: 'relative',
                    borderRadius: 8, overflow: 'hidden',
                    backgroundColor: '#F9F9F9', border: '1px solid #E5E7EB'
                  }}>
                    {prenda.imagen_url ? (
                      <img
                        src={prenda.imagen_url}
                        alt={prenda.nombre}
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, color: '#9CA3AF', padding: 4, textAlign: 'center'
                      }}>
                        {prenda.nombre}
                      </div>
                    )}
                  </div>
                  <p style={{ fontSize: 9, color: '#9CA3AF', marginTop: 4, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {prenda.subcategoria}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input placeholder="Nombre del outfit *" value={nombre} onChange={e => setNombre(e.target.value)} className={inputClass} />
              <input placeholder="Ocasión (casual, trabajo, fiesta...)" value={ocasion} onChange={e => setOcasion(e.target.value)} className={inputClass} />
              <textarea placeholder="Notas adicionales" value={notas} onChange={e => setNotas(e.target.value)} rows={2} className={inputClass + ' resize-none'} />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#E5E7EB] flex gap-3" style={{ flexShrink: 0 }}>
          {paso === 1 ? (
            <>
              <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] transition-colors">
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (seleccionadas.length === 0) return alert('Selecciona al menos una prenda')
                  setPaso(2)
                }}
                className="flex-1 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] text-white text-sm font-medium transition-colors"
              >
                Continuar ({seleccionadas.length})
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setPaso(1)} className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] transition-colors">
                Atrás
              </button>
              <button
                onClick={handleGuardar}
                disabled={guardando}
                className="flex-1 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {guardando ? 'Guardando...' : 'Guardar outfit'}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default CreadorOutfit