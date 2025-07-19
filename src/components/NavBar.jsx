// src/components/NavBar.js
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../api/user/userApi"; // adjust path if needed

export default function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken(); // On mount

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    window.addEventListener("storage", checkToken); // Listen for token updates

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.dispatchEvent(new Event("storage")); // Broadcast logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
      navigate("/");
      alert("Logout failed: " + error.message);
    }
  };

  const navLinks = (
    <>
      <Link to="/" className="hover:text-blue-500 transition">Home</Link>
      <Link to="/about" className="hover:text-blue-500 transition">About</Link>
      <Link to="/contact" className="hover:text-blue-500 transition">Contact Us</Link>

      {!isLoggedIn ? (
        <>
          <Link
            to="/auth/login"
            className="hover:text-blue-400 transition border border-white px-3 py-1 rounded"
          >
            Login
          </Link>
          <Link
            to="/auth/signup"
            className="hover:text-blue-400 transition border border-white px-3 py-1 rounded"
          >
            Sign Up
          </Link>
        </>
      ) : (
        <>
          <Link
            to="/explore-properties"
            className="hover:text-indigo-300 transition border border-white px-3 py-1 rounded"
          >
            Explore Properties
          </Link>
          <Link
            to="/create-property"
            className="hover:text-green-300 transition border border-white px-3 py-1 rounded"
          >
            Create Property
          </Link>
          <Link
            to="/my-properties"
            className="hover:text-yellow-300 transition border border-white px-3 py-1 rounded"
          >
            My Properties
          </Link>
          <button
            onClick={handleLogout}
            className="hover:text-red-400 transition border border-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </>
      )}
    </>
  );

  return (
    <header className="bg-blue-900 text-white fixed top-0 left-0 w-full z-50 shadow-md font-urbanist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img
            src={"../../src/assets/logoNextProperty.png"}
            alt="NextProperty Logo"
            className="h-16 w-32 rounded-xl"
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-4 text-sm font-medium items-center">
          {navLinks}
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 flex flex-col space-y-4 bg-black sm:bg-slate-800 text-white">
          {navLinks}
        </div>
      )}
    </header>
  );
}
