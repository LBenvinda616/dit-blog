// Navbar component: top-level navigation between Home and Archive views.
// Props:
// - currentPage: string ('home' | 'archive') used to highlight active tab
// - onNavigate: (targetPage: 'home' | 'archive') => void; navigation handler
function Navbar({ currentPage, onNavigate }) {
    return (
        <nav className="navbar">
            <div className="navbar__brand" onClick={() => onNavigate('home')}>
                <span className="navbar__logo">◈</span>
                <span className="navbar__title">DIT Journal</span>
            </div>
            <div className="navbar__links">
                <button
                    className={`navbar__link ${currentPage === 'home' ? 'navbar__link--active' : ''}`}
                    onClick={() => onNavigate('home')}
                >
                    Home
                </button>
                <button
                    className={`navbar__link ${currentPage === 'archive' ? 'navbar__link--active' : ''}`}
                    onClick={() => onNavigate('archive')}
                >
                    Archive
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
