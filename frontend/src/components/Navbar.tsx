import { FiMenu, FiArrowLeft } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
    const location = useLocation();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 border-none bg-transparent">
            {/* Back Button - Only show if not on home page */}
            <div>
                {location.pathname !== '/' && (
                    <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-white transition-colors">
                        <FiArrowLeft size={20} />
                        <span>Home</span>
                    </Link>
                )}
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
                {/* <a href="#team" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">The Team</a>
                    <a href="#blog" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">Blog</a>
                    <a href="#contact" className="text-sm font-semibold text-neutral-400 hover:text-white transition-colors">Contact</a> */}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
                <button className="text-neutral-400 hover:text-white transition-colors">
                    <FiMenu size={24} />
                </button>
            </div>
        </nav>
    )
}

export default Navbar