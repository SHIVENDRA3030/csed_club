import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "./LiquidNav.css";

const LiquidNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navContainerRef = useRef(null);
    const location = useLocation();
    const lastScrollRef = useRef(0);

    const navItems = [
        { name: "Team", to: "/team" },
        { name: "Events", to: "/events" },
        { name: "Projects", to: "/projects" },
        { name: "Newsletter", to: "/newsletter" },
        { name: "Join Us", to: "/join" },
    ];

    // Specular highlight tracking & 3D Parallax
    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e;
            const xPct = (clientX / window.innerWidth) * 100;
            const yPct = (clientY / window.innerHeight) * 100;

            // Update CSS variables for the glow
            document.documentElement.style.setProperty('--mx', `${xPct}%`);
            document.documentElement.style.setProperty('--my', `${yPct}%`);

            // Subtle 3D tilt
            if (navContainerRef.current && window.innerWidth > 1024) {
                const moveX = (clientX - window.innerWidth / 2) / 100;
                const moveY = (clientY - window.innerHeight / 2) / 50;
                navContainerRef.current.style.transform =
                    `rotateX(${-moveY}deg) rotateY(${moveX}deg) translateY(${Math.sin(Date.now() / 1000) * 2}px)`;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Scroll hide/show
    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.pageYOffset;
            const wrapper = document.querySelector('.liquid-nav-wrapper');

            if (wrapper) {
                if (currentScroll > lastScrollRef.current && currentScroll > 100) {
                    wrapper.style.transform = 'translateY(-120%)';
                } else {
                    wrapper.style.transform = 'translateY(0)';
                }
            }
            lastScrollRef.current = currentScroll;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <div className="liquid-nav-wrapper parallax-container">
                <nav className="liquid-nav-container" ref={navContainerRef}>
                    <Link to="/" className="logo" onClick={closeMenu}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="4" fill="url(#liquid-gradient)" />
                            <defs>
                                <linearGradient id="liquid-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#14b8a6" />
                                    <stop offset="1" stopColor="#0d9488" />
                                </linearGradient>
                            </defs>
                        </svg>
                        CSED
                    </Link>

                    <ul className="nav-links">
                        {navItems.map((item) => (
                            <li className="nav-item" key={item.name}>
                                <Link
                                    to={item.to}
                                    className={`nav-link ${isActive(item.to) ? 'active' : ''}`}
                                    onClick={closeMenu}
                                >
                                    {item.name}
                                    <span className="underline"></span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    <button
                        className={`hamburger ${isOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                        aria-label="Toggle Menu"
                    >
                        <span></span>
                        <span></span>
                    </button>
                </nav>
            </div>

            <div className={`mobile-overlay ${isOpen ? 'open' : ''}`}>
                {navItems.map((item, index) => (
                    <Link
                        key={item.name}
                        to={item.to}
                        className="mobile-link"
                        onClick={closeMenu}
                        style={{ transitionDelay: `${0.2 + index * 0.1}s` }}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </>
    );
};

export default LiquidNav;
