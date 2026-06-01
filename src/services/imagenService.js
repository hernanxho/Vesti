/**
 * Elimina el fondo de una imagen usando remove.bg
 * Devuelve un Blob PNG con transparencia
 */
export async function eliminarFondo(archivoOriginal) {
  const apiKey = import.meta.env.VITE_REMOVEBG_API_KEY

  const formData = new FormData()
  formData.append('image_file', archivoOriginal)
  formData.append('size', 'auto')

  const response = await fetch('https://api.remove.bg/v1.0/removebg', {
    method: 'POST',
    headers: { 'X-Api-Key': apiKey },
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.errors?.[0]?.title || 'Error al eliminar fondo')
  }

  const blob = await response.blob()
  return blob // PNG con transparencia
}

/**
 * Sube un blob PNG a Supabase Storage
 * Devuelve la URL pública
 */
export async function subirImagenProcesada(supabaseClient, blob, nombreBase) {
  const nombreArchivo = `${nombreBase}_processed.png`

  const { error } = await supabaseClient.storage
    .from('prendas')
    .upload(nombreArchivo, blob, { contentType: 'image/png' })

  if (error) throw new Error(error.message)

  const { data } = supabaseClient.storage
    .from('prendas')
    .getPublicUrl(nombreArchivo)

  return data.publicUrl
}