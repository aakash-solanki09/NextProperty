// src/components/NavBar.js
import { useState, useEffect } from "react";
import { Menu, X, Building2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const checkAdmin = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      setIsAdminLoggedIn(
        !!token && user?.email === import.meta.env.VITE_ADMIN_EMAIL
      );
    };

    handleResize();
    checkAdmin();

    window.addEventListener("resize", handleResize);
    window.addEventListener("storage", checkAdmin);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", checkAdmin);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAdminLoggedIn(false);
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const navLinks = (
    <>
      {!isAdminLoggedIn && (
        <>
          <Link
            to="/"
            className={`transition px-3 py-1 rounded border ${location.pathname === "/" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
              }`}
          >
            Home
          </Link>

          <Link
            to="/contact"
            className={`transition px-3 py-1 rounded border ${location.pathname === "/contact" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
              }`}
          >
            Contact Us
          </Link>
        </>
      )}

      {isAdminLoggedIn && (
        <>
          <Link
            to="/explore-properties"
            className={`transition px-3 py-1 rounded border ${location.pathname === "/explore-properties" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
              }`}
          >
            Home
          </Link>

          <Link
            to="/create-property"
            className={`transition px-3 py-1 rounded border ${location.pathname === "/create-property" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
              }`}
          >
            Add Property
          </Link>
          <Link
            to="/allContact"
            className={`transition px-3 py-1 rounded border ${location.pathname === "/allContact" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
              }`}
          >
            Contact
          </Link>
          <button
            onClick={handleLogout}
            className={`transition px-3 py-1 rounded border border-transparent hover:text-white`}
          >
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <header className="bg-blue-900 text-white fixed top-0 left-0 w-full z-50 shadow-md font-urbanist h-15 pt-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex justify-between items-center">
        <div className="flex-shrink-0 flex items-center space-x-2">
          <Building2 className="text-white w-8 h-8" />
          <span className="text-white text-lg font-semibold tracking-wide">NextProperty</span>
        </div>

        <nav className="hidden md:flex space-x-4 text-sm font-medium items-center">
          {navLinks}
        </nav>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col space-y-4 bg-blue-800 text-white">
          {navLinks}
        </div>
      )}
    </header>
  );
}
