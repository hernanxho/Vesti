import { Trash2, Pencil } from 'lucide-react'

function TarjetaPrenda({ prenda, onEliminar, onEditar }) {
  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#D1D5DB] transition-all duration-200 hover:shadow-sm">
      <div className="aspect-[3/4] bg-[#F9F9F9] overflow-hidden">
        {prenda.imagen_url ? (
          <img
            src={prenda.imagen_url}
            alt={prenda.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#D1D5DB]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
            </svg>
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="font-medium text-[#111111] text-sm truncate">{prenda.nombre}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-[#9CA3AF]">
            {prenda.subcategoria || prenda.categoria}
          </span>
          {prenda.color && <span className="text-xs text-[#9CA3AF]">{prenda.color}</span>}
        </div>
        {prenda.genero && prenda.genero !== 'Unisex' && (
          <span className="inline-block mt-1.5 text-[10px] text-[#9CA3AF] border border-[#E5E7EB] rounded-full px-2 py-0.5">
            {prenda.genero}
          </span>
        )}
      </div>

      {/* Botones — aparecen al hacer hover */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={() => onEditar(prenda)}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-[#F5F5F5] text-[#6B7280] border border-[#E5E7EB] transition-colors"
        >
          <Pencil size={13} />
        </button>
        <button
          onClick={() => onEliminar(prenda.id, prenda.imagen_url)}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-[#FEF2F2] hover:text-red-500 text-[#9CA3AF] border border-[#E5E7EB] transition-colors"
        >
          <Trash2 size={13} />
        </button>
      </div>

    </div>
  )
}

export default TarjetaPrenda