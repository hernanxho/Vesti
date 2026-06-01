/**
 * Visualizador de outfit sobre maniquí por capas
 * Arquitectura preparada para avatar personalizado futuro
 */

// Posiciones de cada categoría sobre el maniquí (porcentajes)
const POSICIONES = {
  'Parte superior': { top: '18%', left: '50%', width: '52%', zIndex: 3 },
  'Exterior':       { top: '15%', left: '50%', width: '58%', zIndex: 4 },
  'Parte inferior': { top: '52%', left: '50%', width: '48%', zIndex: 2 },
  'Prenda completa':{ top: '18%', left: '50%', width: '54%', zIndex: 3 },
  'Calzado':        { top: '82%', left: '50%', width: '44%', zIndex: 2 },
  'Accesorios':     { top: '6%',  left: '72%', width: '22%', zIndex: 5 },
}

// SVG de maniquí neutro/femenino/masculino
const MANIQUI = {
  neutro: '/maniqui-neutro.svg',
  femenino: '/maniqui-femenino.svg',
  masculino: '/maniqui-masculino.svg',
}

export default function VisualizadorOutfit({ prendas, tipoManiqui = 'neutro' }) {
  // Agrupar prendas por categoría — si hay varias del mismo tipo, mostrar la primera
  const prendasPorCategoria = {}
  prendas.forEach(prenda => {
    if (!prendasPorCategoria[prenda.categoria]) {
      prendasPorCategoria[prenda.categoria] = prenda
    }
  })

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: '160%',
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Maniquí base */}
      <img
        src={MANIQUI[tipoManiqui]}
        alt="maniquí"
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '45%',
          zIndex: 1,
          opacity: 0.15, // Semitransparente para que las prendas destaquen
        }}
        onError={e => { e.target.style.display = 'none' }}
      />

      {/* Prendas por capas */}
      {Object.entries(prendasPorCategoria).map(([categoria, prenda]) => {
        const pos = POSICIONES[categoria]
        if (!pos || !prenda.imagen_url) return null

        return (
          <img
            key={prenda.id}
            src={prenda.imagen_url}
            alt={prenda.nombre}
            style={{
              position: 'absolute',
              top: pos.top,
              left: pos.left,
              transform: 'translateX(-50%)',
              width: pos.width,
              zIndex: pos.zIndex,
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))',
            }}
          />
        )
      })}

      {/* Si no hay prendas con imagen */}
      {Object.values(prendasPorCategoria).every(p => !p.imagen_url) && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#D1D5DB', fontSize: 12
        }}>
          Sin imágenes
        </div>
      )}
    </div>
  )
}