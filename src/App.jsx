import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";




import CreateLand from "./pages/property/CreateLand";
import UpdateLand from "./pages/property/UpdateLand";
import PrivateRoute from "./components/PrivateRoute";
import AllPublicProperties from "./pages/property/AllPublicProperties";
import AllLandsAdmin from "./pages/property/AllLandsAdmin";
import Login from "./pages/auth/Login";
import AllContacts from "./pages/contact/AllContact";
function App() {
  return (
   <>
      <NavBar />
      <div className="pt-16 min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={ <AllPublicProperties/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<Login/>} />
             <Route path="/allContact" element={<AllContacts/>} />
         {/*  <Route path="/auth/signup" element={<AuthPage />} /> */}

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
                <AllLandsAdmin/>
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
