import { useState } from 'react'
import { X, Upload, ChevronDown, Loader2, Sparkles } from 'lucide-react'
import { supabase } from '../supabase'
import { CATEGORIAS, GENEROS } from '../data/categorias'
import { eliminarFondo, subirImagenProcesada } from '../services/imagenService'

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#E5E7EB] text-sm text-[#111111] placeholder-[#9CA3AF] focus:outline-none focus:border-[#111111] transition-colors bg-white"

export default function FormularioPrenda({ prenda, onCerrar, onGuardado, actualizarPrenda }) {
  const modoEdicion = !!prenda

  const [form, setForm] = useState({
    nombre: prenda?.nombre || '',
    categoria: prenda?.categoria || '',
    subcategoria: prenda?.subcategoria || '',
    genero: prenda?.genero || 'Unisex',
    color: prenda?.color || '',
    marca: prenda?.marca || '',
    talla: prenda?.talla || '',
    notas: prenda?.notas || '',
  })

  const [imagenOriginal, setImagenOriginal] = useState(null)
  const [previewOriginal, setPreviewOriginal] = useState(prenda?.imagen_url || null)
  const [previewProcesada, setPreviewProcesada] = useState(null)
  const [procesando, setProcesando] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [errorProceso, setErrorProceso] = useState(null)

  const subcategorias = form.categoria ? CATEGORIAS[form.categoria] : []

  function handleCambio(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'categoria' ? { subcategoria: '' } : {}),
    }))
  }

  async function handleImagen(e) {
    const archivo = e.target.files[0]
    if (!archivo) return

    setImagenOriginal(archivo)
    setPreviewOriginal(URL.createObjectURL(archivo))
    setPreviewProcesada(null)
    setErrorProceso(null)

    // Procesar automáticamente al seleccionar
    setProcesando(true)
    try {
      const blob = await eliminarFondo(archivo)
      const url = URL.createObjectURL(blob)
      setPreviewProcesada(blob)
      setPreviewOriginal(url) // Mostrar la procesada como preview
    } catch (err) {
      setErrorProceso('No se pudo eliminar el fondo. Se usará la imagen original.')
    } finally {
      setProcesando(false)
    }
  }

  async function handleGuardar() {
    if (!form.nombre || !form.categoria || !form.subcategoria) {
      return alert('Nombre, categoría y subcategoría son obligatorios')
    }
    setGuardando(true)

    let imagen_url = prenda?.imagen_url || null

    if (imagenOriginal) {
      try {
        const nombreBase = Date.now().toString()

        if (previewProcesada) {
          // Subir PNG sin fondo
          imagen_url = await subirImagenProcesada(supabase, previewProcesada, nombreBase)
        } else {
          // Subir imagen original si falló el procesamiento
          const extension = imagenOriginal.name.split('.').pop()
          const { error: uploadError } = await supabase.storage
            .from('prendas')
            .upload(`${nombreBase}.${extension}`, imagenOriginal)

          if (uploadError) throw new Error(uploadError.message)

          const { data: urlData } = supabase.storage
            .from('prendas')
            .getPublicUrl(`${nombreBase}.${extension}`)

          imagen_url = urlData.publicUrl
        }
      } catch (err) {
        alert('Error subiendo imagen: ' + err.message)
        setGuardando(false)
        return
      }
    }

    if (modoEdicion) {
      const { error } = await actualizarPrenda(prenda.id, { ...form, imagen_url })
      if (error) alert('Error actualizando: ' + error.message)
      else onGuardado()
    } else {
      const { error } = await supabase.from('prendas').insert([{ ...form, imagen_url }])
      if (error) alert('Error guardando: ' + error.message)
      else onGuardado()
    }

    setGuardando(false)
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-[#E5E7EB] overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="font-semibold text-[#111111]">
            {modoEdicion ? 'Editar prenda' : 'Nueva prenda'}
          </h2>
          <button onClick={onCerrar} className="p-1.5 hover:bg-[#F5F5F5] rounded-lg transition-colors">
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>

        <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">

          {/* Upload de imagen */}
          <label className="block cursor-pointer">
            <div className={`w-full aspect-video rounded-xl border-2 border-dashed transition-colors overflow-hidden relative ${
              previewOriginal ? 'border-transparent' : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
            }`}
            style={{ backgroundColor: previewOriginal ? '#F9F9F9' : undefined }}
            >
              {previewOriginal ? (
                <img
                  src={previewOriginal}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#9CA3AF]">
                  <Upload size={22} />
                  <span className="text-sm">Subir foto de la prenda</span>
                </div>
              )}

              {/* Overlay mientras procesa */}
              {procesando && (
                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-2">
                  <Loader2 size={22} className="text-[#111111] animate-spin" />
                  <span className="text-xs text-[#6B7280] font-medium">Eliminando fondo...</span>
                </div>
              )}
            </div>
            <input type="file" accept="image/*" onChange={handleImagen} className="hidden" />
          </label>

          {/* Estado del procesamiento */}
          {previewProcesada && !procesando && (
            <div className="flex items-center gap-2 text-xs text-[#6B7280] bg-[#F9F9F9] rounded-lg px-3 py-2">
              <Sparkles size={13} className="text-[#111111]" />
              Fondo eliminado correctamente
            </div>
          )}
          {errorProceso && (
            <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
              {errorProceso}
            </div>
          )}

          {/* Campos del formulario */}
          <input
            name="nombre"
            placeholder="Nombre de la prenda *"
            value={form.nombre}
            onChange={handleCambio}
            className={inputClass}
          />

          <div className="relative">
            <select name="categoria" value={form.categoria} onChange={handleCambio} className={inputClass + ' appearance-none pr-9'}>
              <option value="">Categoría principal *</option>
              {Object.keys(CATEGORIAS).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>

          {subcategorias.length > 0 && (
            <div className="relative">
              <select name="subcategoria" value={form.subcategoria} onChange={handleCambio} className={inputClass + ' appearance-none pr-9'}>
                <option value="">Subcategoría *</option>
                {subcategorias.map(sub => <option key={sub} value={sub}>{sub}</option>)}
              </select>
              <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
            </div>
          )}

          <div className="flex gap-2">
            {GENEROS.map(g => (
              <button key={g} type="button"
                onClick={() => setForm(prev => ({ ...prev, genero: g }))}
                className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${
                  form.genero === g ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F5F5F5]'
                }`}
              >{g}</button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input name="color" placeholder="Color" value={form.color} onChange={handleCambio} className={inputClass} />
            <input name="talla" placeholder="Talla" value={form.talla} onChange={handleCambio} className={inputClass} />
          </div>

          <input name="marca" placeholder="Marca" value={form.marca} onChange={handleCambio} className={inputClass} />

          <textarea name="notas" placeholder="Notas adicionales" value={form.notas} onChange={handleCambio} rows={2} className={inputClass + ' resize-none'} />
        </div>

        <div className="px-5 py-4 border-t border-[#E5E7EB] flex gap-3">
          <button onClick={onCerrar} className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] text-sm font-medium text-[#6B7280] hover:bg-[#F5F5F5] transition-colors">
            Cancelar
          </button>
          <button onClick={handleGuardar} disabled={guardando || procesando}
            className="flex-1 py-2.5 rounded-xl bg-[#111111] hover:bg-[#333333] disabled:opacity-50 text-white text-sm font-medium transition-colors">
            {guardando ? 'Guardando...' : modoEdicion ? 'Guardar cambios' : 'Guardar prenda'}
          </button>
        </div>

      </div>
    </div>
  )
}