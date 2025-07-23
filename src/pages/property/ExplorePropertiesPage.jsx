import { useEffect, useState } from "react";
import AllLandsAdmin from "./AllLandsAdmin";
import AllPublicProperties from "./AllPublicProperties";

const ExplorePropertiesPage = () => {
  const [role, setRole] = useState("loading");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setRole(parsedUser.role === "admin" ? "admin" : "user");
      } catch (err) {
        console.error("Invalid user data in localStorage", err);
        setRole("user");
      }
    } else {
      setRole("user");
    }
  }, []);

  if (role === "loading") {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  return role === "admin" ? <AllLandsAdmin /> : <AllPublicProperties />;
};

export default ExplorePropertiesPage;
