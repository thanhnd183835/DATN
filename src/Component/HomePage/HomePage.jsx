import React from "react";
import NavBar from "../NavBar/Navbar";
import FillTerContent from "../FillTerContent/FillTerContent";

const HomePage = () => {
  return (
    <div>
      <div>
        <NavBar />
      </div>
      <div className="border border-2 " style={{ paddingTop: "6rem" }}>
        <FillTerContent />
      </div>
    </div>
  );
};
export default HomePage;
