import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePrendas } from '../hooks/usePrendas'
import TarjetaPrenda from '../components/TarjetaPrenda'
import FormularioPrenda from '../components/FormularioPrenda'
import { CATEGORIAS_PRINCIPALES } from '../data/categorias'

function Closet() {
  const { prendas, cargando, eliminarPrenda, obtenerPrendas, actualizarPrenda } = usePrendas()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [prendaEditando, setPrendaEditando] = useState(null)
  const [categoriaActiva, setCategoriaActiva] = useState('todas')

  const categoriasConPrendas = ['todas', ...CATEGORIAS_PRINCIPALES.filter(
    cat => prendas.some(p => p.categoria === cat)
  )]

  const prendasFiltradas = categoriaActiva === 'todas'
    ? prendas
    : prendas.filter(p => p.categoria === categoriaActiva)

  function handleEditar(prenda) {
    setPrendaEditando(prenda)
    setMostrarFormulario(true)
  }

  function handleCerrarFormulario() {
    setMostrarFormulario(false)
    setPrendaEditando(null)
  }

  async function handleGuardado() {
    await obtenerPrendas()
    handleCerrarFormulario()
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#111111]">Mi Closet</h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">{prendas.length} prendas</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-[#111111] hover:bg-[#333333] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors duration-200"
        >
          <Plus size={16} />
          Añadir prenda
        </button>
      </div>

      {categoriasConPrendas.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {categoriasConPrendas.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoriaActiva(cat)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                categoriaActiva === cat
                  ? 'bg-[#111111] text-white'
                  : 'bg-white text-[#6B7280] border border-[#E5E7EB] hover:bg-[#F5F5F5]'
              }`}
            >
              {cat === 'todas' ? 'Todas' : cat}
            </button>
          ))}
        </div>
      )}

      {cargando && (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!cargando && prendas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 bg-[#F9F9F9] border border-[#E5E7EB] rounded-2xl flex items-center justify-center mb-4">
            <Plus size={24} className="text-[#9CA3AF]" />
          </div>
          <p className="text-[#111111] font-medium">Tu closet está vacío</p>
          <p className="text-[#9CA3AF] text-sm mt-1">Añade tu primera prenda para empezar</p>
        </div>
      )}

      {!cargando && prendasFiltradas.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {prendasFiltradas.map(prenda => (
            <TarjetaPrenda
              key={prenda.id}
              prenda={prenda}
              onEliminar={eliminarPrenda}
              onEditar={handleEditar}
            />
          ))}
        </div>
      )}

      {mostrarFormulario && (
        <FormularioPrenda
          prenda={prendaEditando}
          onCerrar={handleCerrarFormulario}
          onGuardado={handleGuardado}
          actualizarPrenda={actualizarPrenda}
        />
      )}

    </div>
  )
}

export default Closet