// src/pages/Home.js
import { useState, useEffect } from "react";
import desktopBg from "../assets/desktopbg.jpg";
import mobileBg from "../assets/mobilebg.jpg";
import house1 from "../assets/house1.jpg";
import house2 from "../assets/house2.jpg";
import house3 from "../assets/house3.jpg";
import house4 from "../assets/house4.jpg";

export default function Home() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkToken();

    window.addEventListener("resize", () =>
      setIsMobile(window.innerWidth < 768)
    );
    window.addEventListener("storage", checkToken);

    return () => {
      window.removeEventListener("resize", () =>
        setIsMobile(window.innerWidth < 768)
      );
      window.removeEventListener("storage", checkToken);
    };
  }, []);

  const propertyData = [
    { image: house1, title: "Modern Villa in LA", price: "$2,500,000" },
    { image: house2, title: "Family Home in TX", price: "$850,000" },
    { image: house3, title: "Luxury Condo in NY", price: "$1,200,000" },
    { image: house4, title: "Countryside Escape", price: "$430,000" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800 font-urbanist ">
      <div className="min-h-screen px-4 sm:px-8 py-24">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to NextProperty
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Find your dream property today.
          </p>

          {!isLoggedIn && (
            <div className="mt-8 flex justify-center gap-4">
              <a
                href="/auth/signup"
                className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-full"
              >
                Sign Up
              </a>
              <a
                href="/auth/login"
                className="px-6 py-2 bg-gray-300 text-gray-800 hover:bg-gray-400 rounded-full"
              >
                Login
              </a>
            </div>
          )}
        </section>

        {/* Properties Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyData.map((item, idx) => (
              <div
                key={idx}
                className="bg-gray-100 rounded-xl p-4 shadow hover:shadow-md transition"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="rounded-lg h-40 w-full object-cover"
                />
                <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
                <p className="text-blue-700">{item.price}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
