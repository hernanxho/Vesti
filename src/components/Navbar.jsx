import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Sparkles } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/', label: 'Closet', icon: ShoppingBag },
  { path: '/outfits', label: 'Outfits', icon: Sparkles },
]

function NavItem({ path, label, Icon, active }) {
  return (
    <Link to={path} className="relative flex flex-col items-center group">
      <div
        className={`flex flex-col items-center gap-1 px-5 py-1.5 rounded-xl transition-all duration-200 ${
          active ? 'text-[#111111]' : 'text-[#9CA3AF] hover:text-[#6B7280]'
        }`}
      >
        <Icon size={20} strokeWidth={active ? 2.5 : 1.8} className="transition-all duration-200" />
        <span className="text-xs font-medium tracking-wide">{label}</span>
      </div>
      {active && (
        <span className="absolute -bottom-[17px] left-0 right-0 h-[1.5px] bg-[#111111] rounded-full hidden md:block" />
      )}
      {active && (
        <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#111111] md:hidden" />
      )}
    </Link>
  )
}

function Navbar() {
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#E5E7EB] md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-4xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="hidden md:flex items-center gap-2">
          <span className="text-lg font-semibold tracking-tight text-[#111111]">Vesti</span>
        </Link>
        <div className="flex items-center justify-around w-full md:w-auto md:gap-2">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavItem key={path} path={path} label={label} Icon={Icon} active={location.pathname === path} />
          ))}
        </div>
      </div>
    </nav>
  )
}

export default Navbar