// src/components/NavBar.js
import { useState, useEffect, useRef } from "react";
import { Menu, X, Building2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/user/userApi";

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken();

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("storage", checkToken);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", checkToken);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
      navigate("/");
      alert("Logout failed: " + error.message);
    }
  };

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  const isAdmin = () => {
    const user = getUser();
    return user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  };

  const getInitials = () => {
    const user = getUser();
    if (!user?.name) return "--";

    const names = user.name.trim().split(" ").filter(Boolean);
    return names.length === 1
      ? names[0][0].toUpperCase()
      : (names[0][0] + names[1][0]).toUpperCase();
  };

  const navLinks = (
    <>
      <Link
        to="/"
        className={`transition px-3 py-1 rounded border ${
          location.pathname === "/" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
        }`}
      >
        Home
      </Link>

      {!isAdmin() && (
        <Link
          to="/about"
          className={`transition px-3 py-1 rounded border ${
            location.pathname === "/about" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
          }`}
        >
          About
        </Link>
      )}

      {!isLoggedIn ? (
        <>
          <Link
            to="/auth/login"
            className={`transition px-3 py-1 rounded border ${
              location.pathname === "/auth/login" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
            }`}
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className={`transition px-3 py-1 rounded border ${
              location.pathname === "/auth/signup" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
            }`}
          >
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/explore-properties"
            className={`transition px-3 py-1 rounded border ${
              location.pathname === "/explore-properties" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
            }`}
          >
            Explore Properties
          </Link>

          {isAdmin() && (
            <Link
              to="/create-property"
              className={`transition px-3 py-1 rounded border ${
                location.pathname === "/create-property"
                  ? "border-gray-400 text-gray-300"
                  : "border-transparent hover:text-white"
              }`}
            >
              Create Property
            </Link>
          )}

          {!isAdmin() && (
            <Link
              to="/contact"
              className={`transition px-3 py-1 rounded border ${
                location.pathname === "/contact" ? "border-gray-400 text-gray-300" : "border-transparent hover:text-white"
              }`}
            >
              Contact Us
            </Link>
          )}

          <div className="relative" ref={profileRef}>
            <button
              onClick={toggleProfileMenu}
              className="w-10 h-10 bg-white text-blue-900 font-semibold rounded-full flex items-center justify-center border border-gray-300"
              title="Profile"
            >
              {getInitials()}
            </button>
            {isProfileMenuOpen && (
              <div className="absolute left-0 md:left-auto md:right-0 top-full mt-1 w-36 bg-white text-sm text-gray-800 rounded shadow-lg z-50">
                <Link
                  to="/auth/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setIsProfileMenuOpen(false)}
                >
                  {isAdmin() ? "Admin Profile" : "View Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );

  return (
    <header className="bg-blue-900 text-white fixed top-0 left-0 w-full z-50 shadow-md font-urbanist h-24 pt-4">
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
