import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/image/logo_artanita.png";
import DonationForm from "./form/donation";

// ChevronDown icon component
const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          setScrolled(scrollPosition > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.about-dropdown')) {
        setIsAboutOpen(false);
      }
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Close modal on escape key and handle body scroll
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsAboutOpen(false);
  }, [location.pathname]);

  const isActive = (path: string): boolean => location.pathname === path;
  const isAboutActive = (): boolean => location.pathname.startsWith("/about");

  const aboutLinks = [
    { path: "/about/sejarah", label: "Sejarah Panti" },
    { path: "/about/visi-misi", label: "Visi, Misi & Tujuan" },
    { path: "/about/legalitas", label: "Legalitas & Akta Notaris" },
    { path: "/about/pengurus", label: "Pengurus & Pengasuh" },
    { path: "/about/anak-panti", label: "Anak-Anak Panti" },
  ];

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/campaign", label: "Campaign" },
    { path: "/activity", label: "Activity" },
  ];

  const handleAboutToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAboutOpen(!isAboutOpen);
  };

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  return (
    <>
      <div
        className={`w-full sticky top-0 z-40 transition-all duration-300 ease-in-out ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-white/90 backdrop-blur-sm"
        }`}
      >
        <nav className="container-nav w-full  flex justify-between items-center py-3 px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 z-50">
            <a href="/" className="flex items-center">
              <img 
                src={logo} 
                alt="Artanita Logo" 
                className="h-12 sm:h-14 lg:h-20 w-auto transition-all duration-300" 
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-base font-medium">
            {navLinks.map(({ path, label }) => (
              <a
                key={path}
                href={path}
                className={`relative pb-1 transition-all duration-300 hover:text-[#379777] ${
                  isActive(path) 
                    ? "font-semibold !text-[#379777]" 
                    : "!text-gray-700 hover:!text-[#379777]"
                }`}
              >
                {label}
                {isActive(path) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#379777] transform scale-x-100 transition-transform duration-300"></span>
                )}
              </a>
            ))}

            {/* About Dropdown */}
            <div className="relative about-dropdown">
              <button
                onClick={handleAboutToggle}
                className={`flex items-center gap-1 pb-1 transition-all duration-300 hover:text-[#379777] ${
                  isAboutActive()
                    ? "font-semibold !text-[#379777]"
                    : "!text-gray-700 hover:!text-[#379777]"
                }`}
              >
                About 
                <ChevronDownIcon 
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isAboutOpen ? 'rotate-180' : 'rotate-0'
                  }`} 
                />
                {isAboutActive() && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#379777] transform scale-x-100 transition-transform duration-300"></span>
                )}
              </button>
              
              {/* Desktop Dropdown Menu */}
              <div
                className={`absolute top-full left-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-100 min-w-[240px] z-50 transform transition-all duration-300 origin-top ${
                  isAboutOpen
                    ? 'opacity-100 scale-y-100 translate-y-0 visible'
                    : 'opacity-0 scale-y-95 -translate-y-2 invisible'
                }`}
              >
                <div className="py-2">
                  {aboutLinks.map(({ path, label }) => (
                    <a
                      key={path}
                      href={path}
                      onClick={() => setIsAboutOpen(false)}
                      className={`block px-4 py-3 text-sm transition-colors duration-200 hover:bg-gray-50 ${
                        isActive(path)
                          ? "!text-[#379777] font-medium bg-green-50"
                          : "!text-gray-700 hover:!text-[#379777]"
                      }`}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Donasi Button */}
          <button
            className="hidden lg:block rounded-xl bg-[#379777] hover:bg-[#2d7d61] transition-all duration-300 !px-6 xl:!px-8 !py-2.5 text-sm xl:text-base font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#379777] focus:ring-offset-2"
            onClick={() => setIsModalOpen(true)}
          >
            Donasi
          </button>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden mobile-menu-button p-2 rounded-md text-gray-700 hover:text-[#379777] hover:bg-gray-100 transition-all duration-200 z-50"
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            <svg 
              className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden mobile-menu overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-1 bg-white/95 backdrop-blur-md border-t border-gray-100">
            {/* Mobile Navigation Links */}
            {navLinks.map(({ path, label }) => (
              <a
                key={path}
                href={path}
                className={`block px-3 py-3 rounded-md text-base font-medium text-center transition-colors duration-200 ${
                  isActive(path)
                    ? "!text-[#379777] bg-green-50 font-semibold"
                    : "!text-gray-700 hover:!text-[#379777] hover:bg-gray-50"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}

            {/* Mobile About Section */}
            <div className="space-y-1">
              <button
                onClick={handleAboutToggle}
                className={`w-full flex items-center justify-center gap-2   !py-3 rounded-md text-base font-medium text-center transition-colors duration-200 ${
                  isAboutActive()
                    ? "!text-[#379777] bg-green-50 font-semibold"
                    : "!text-gray-700 hover:!text-[#379777] hover:bg-gray-50"
                }`}
              >
                About
                <ChevronDownIcon 
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isAboutOpen ? 'rotate-180' : 'rotate-0'
                  }`} 
                />
              </button>
              
              {/* Mobile About Submenu */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isAboutOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="mt-2 space-y-1">
                  {aboutLinks.map(({ path, label }) => (
                    <a
                      key={path}
                      href={path}
                      className={`block px-3 py-2 rounded-md text-center text-sm transition-colors duration-200 ${
                        isActive(path)
                          ? "!text-[#379777] bg-green-50 font-medium"
                          : "!text-gray-600 hover:!text-[#379777] hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsAboutOpen(false);
                      }}
                    >
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Donasi Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                className="w-full rounded-xl bg-[#379777] hover:bg-[#2d7d61] transition-all duration-300 !px-4 !py-3 text-base font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#379777] focus:ring-offset-2"
                onClick={() => {
                  setIsModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Donasi Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Donation Form */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/60  flex justify-center items-center z-50 p-4 transition-opacity duration-300"
          onClick={handleModalBackdropClick}
        >
          <div 
            className={`bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-2xl transform transition-all duration-300 ${
              isModalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 rounded-t-2xl  bg-white/0 border-gray-100 px-6 pt-6 flex justify-end items-end  ">
              <button
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                onClick={handleModalClose}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              <DonationForm initialData={null} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}