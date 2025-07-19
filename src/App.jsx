import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import CreateLand from "./pages/property/CreateLand";
import AllLands from "./pages/property/AllLands";
import UpdateLand from "./pages/property/UpdateLand";
import AllPublicProperties from "./pages/property/AllPublicProperties";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <>
      <NavBar />
      <div className="pt-24 min-h-screen"> {/* push content below navbar */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

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
            path="/my-properties"
            element={
              <PrivateRoute>
                <AllLands />
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
              <PrivateRoute> {/* Optional: make it public if you want */}
                <AllPublicProperties />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
