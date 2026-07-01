import { FiCpu, FiGithub } from 'react-icons/fi'
import { Link, useLocation } from 'react-router-dom'
import GooeyNav from './GooeyNav'

const Navbar = () => {
    const location = useLocation();
    const lastAnalysisId = localStorage.getItem('lastAnalysisId') || '';
    const analysesHref = lastAnalysisId ? `/analysis/${lastAnalysisId}` : '/';

    const navItems = [
      { label: "Home", href: "/" },
      { label: "Analysis", href: analysesHref },
    ];

    const activeIndex = location.pathname.startsWith('/analysis') ? 1 : 0;

    return (
        <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
            <nav className="w-full max-w-5xl h-16 flex items-center justify-between px-6 rounded-full bg-neutral-950/60 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] transition-all duration-300">
                {/* Left Section: Logo */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="flex items-center gap-2.5 group">
                       <img src="/logo.svg" alt="logo" className='h-10 w-10'/>
                            
                    </Link>
                </div>

                {/* Center Section: Navigation Links (Showcase) */}
                <div className="flex items-center">
                    <GooeyNav items={navItems} initialActiveIndex={activeIndex} />
                </div>

                {/* Right Section: System Status & CTAs */}
                <div className="flex items-center gap-3">
                    <a 
                        href="https://github.com/ishaancreates" 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-2 rounded-full hover:bg-white/5 border border-transparent hover:border-white/10 text-neutral-400 hover:text-white transition-all duration-200"
                    >
                        <FiGithub size={18} />
                    </a>
                </div>
            </nav>
        </header>
    )
}

export default Navbar