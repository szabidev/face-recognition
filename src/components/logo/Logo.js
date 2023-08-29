import React from "react";
import Tilt from "react-parallax-tilt";
import "./Logo.css";
import brain from "./brain.png";

const Logo = () => {
  return (
    <div className="ma4 mt0 logo">
      <Tilt>
        <div className="Tilt-inner pa3">
          <img src={brain} alt="logo" style={{ paddingTop: "5px" }} />
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
