import LanguageSwitcher from "./LanguageSwitcher";
import PropTypes from "prop-types";

function TopBar({ isEnglish, setIsEnglish }) {
  
  return (
    <header style={{ direction: "ltr" }} className="top-bar d-flex">
      <h2 style={{ color: " #0d69d5", fontFamily: "sans-serf" }}>
        {" "}
        Dashboard{" "}
      </h2>
      <LanguageSwitcher isEnglish={isEnglish} setIsEnglish={setIsEnglish} />
    </header>
  );
}


TopBar.propTypes = {
  isEnglish: PropTypes.bool.isRequired,
  setIsEnglish: PropTypes.func.isRequired,
};

export default TopBar;
