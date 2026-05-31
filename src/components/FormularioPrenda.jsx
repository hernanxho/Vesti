import { useState } from 'react'
import { X, Upload, ChevronDown } from 'lucide-react'
import { supabase } from '../supabase'
import { CATEGORIAS, GENEROS } from '../data/categorias'

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#111111] transition-colors bg-white"

function FormularioPrenda({ onCerrar, onGuardado }) {
  const [form, setForm] = useState({
    nombre: '',
    categoria: '',
    subcategoria: '',
    genero: 'Unisex',
    color: '',
    marca: '',
    talla: '',
    notas: '',
  })
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [guardando, setGuardando] = useState(false)

  const subcategorias = form.categoria ? CATEGORIAS[form.categoria] : []

  function handleCambio(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'categoria' ? { subcategoria: '' } : {}),
    }))
  }

  function handleImagen(e) {
    const archivo = e.target.files[0]
    if (!archivo) return
    setImagen(archivo)
    setPreview(URL.createObjectURL(archivo))
  }

  async function handleGuardar() {
    if (!form.nombre || !form.categoria || !form.subcategoria) {
      return alert('Nombre, categoría y subcategoría son obligatorios')
    }
    setGuardando(true)

    let imagen_url = null

    if (imagen) {
      const extension = imagen.name.split('.').pop()
      const nombreArchivo = `${Date.now()}.${extension}`
      const { error: uploadError } = await supabase.storage
        .from('prendas')
        .upload(nombreArchivo, imagen)

      if (uploadError) {
        alert('Error subiendo imagen: ' + uploadError.message)
        setGuardando(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('prendas')
        .getPublicUrl(nombreArchivo)

      imagen_url = urlData.publicUrl
    }

    const { error } = await supabase.from('prendas').insert([{ ...form, imagen_url }])
    if (error) alert('Error guardando prenda: ' + error.message)
    else onGuardado()
    setGuardando(false)
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-semibold text-[#111111]">Nueva prenda</h2>
          <button onClick={onCerrar} className="p-1.5 hover:bg-[#F5F5F5] rounded-lg transition-colors">
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">

          {/* Imagen */}
          <label className="block cursor-pointer">
            <div className={`w-full aspect-video rounded-xl border-2 border-dashed transition-colors overflow-hidden ${
              preview ? 'border-transparent' : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
            }`}>
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#9CA3AF]">
                  <Upload size={22} />
                  <span className="text-sm">Subir foto de la prenda</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
          </label>

          {/* Nombre */}
          <input
            name="nombre"
            placeholder="Nombre de la prenda *"
            value={form.nombre}
            onChange={handleCambio}
            className={inputClass}
          />

          {/* Categoría principal */}
          <div className="relative">
            <select
              name="categoria"
              value={form.categoria}
              onChange={handleCambio}
              className={inputClass + ' appearance-none pr-9'}
            >
              <option value="">Categoría principal *</option>
              {Object.keys(CATEGORIAS).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>

          {/* Subcategoría — aparece solo si hay categoría seleccionada */}
          {subcategorias.length > 0 && (
            <div className="relative">
              <select
                name="subcategoria"
                value={form.subcategoria}
                onChange={handleCambio}
                className={inputClass + ' appearance-none pr-9'}
              >
                <option value="">Subcategoría *</option>
                {subcategorias.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          )}

          {/* Género */}
          <div className="flex gap-2">
            {GENEROS.map(g => (
              <button
                key={g}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, genero: g }))}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  form.genero === g
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F5F5F5]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Color y Talla */}
          <div className="grid grid-cols-2 gap-3">
            <input name="color" placeholder="Color" value={form.color} onChange={handleCambio} className={inputClass} />
            <input name="talla" placeholder="Talla" value={form.talla} onChange={handleCambio} className={inputClass} />
          </div>

          {/* Marca */}
          <input name="marca" placeholder="Marca" value={form.marca} onChange={handleCambio} className={inputClass} />

          {/* Notas */}
          <textarea
            name="notas"
            placeholder="Notas adicionales"
            value={form.notas}
            onChange={handleCambio}
            rows={2}
            className={inputClass + ' resize-none'}
          />

        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#E5E7EB] flex gap-3">
          <button
            onClick={onCerrar}
            className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGuardar}
            disabled={guardando}
            className="flex-1 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {guardando ? 'Guardando...' : 'Guardar prenda'}
          </button>
        </div>

      </div>
    </div>
  )
}

export default FormularioPrenda