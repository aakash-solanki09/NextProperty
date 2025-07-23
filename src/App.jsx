import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";


import Profile from "./pages/auth/Profile";

import CreateLand from "./pages/property/CreateLand";
import UpdateLand from "./pages/property/UpdateLand";

import ExplorePropertiesPage from "./pages/property/ExplorePropertiesPage";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./api/context/AuthContext";
import AuthPage from "../src/pages/AuthPage";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <div className="pt-24 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth/login" element={<AuthPage />} />
          <Route path="/auth/signup" element={<AuthPage />} />

          {/* Protected Routes */}
          <Route
            path="/create-property"
            element={
              <PrivateRoute>
                <CreateLand />
              </PrivateRoute>
            }
          />

          <Route
            path="/update-property/:id"
            element={
              <PrivateRoute>
                <UpdateLand />
              </PrivateRoute>
            }
          />
          <Route
            path="/explore-properties"
            element={
              <PrivateRoute>
                <ExplorePropertiesPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/auth/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  );
}

export default App;
