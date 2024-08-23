import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import { InputSwitch } from "primereact/inputswitch";

const LanguageSwitcher = ({ isEnglish, setIsEnglish }) => {
  const { i18n } = useTranslation();
  const toggleLanguage = () => {
    const newLanguage = isEnglish ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    setIsEnglish(!isEnglish);
  };

  return (
    <div className="flex flex-row align-items-center justify-content-end gap-3 flex-wrap">
      <h6
        style={{
          color: "#F47280",
          opacity: isEnglish !== true ? 1 : 0.35,
          fontSize: "1.2em",
          fontWeight: "bold",
        }}
        className="main-title fw-bold mb-0"
      >
        عربي
      </h6>
      <InputSwitch checked={isEnglish} onChange={toggleLanguage} />
      <h6
        style={{
          color: "#0885da ",
          opacity: isEnglish === true ? 1 : 0.35,
          fontSize: "1.2em",
        }}
        className="main-title fw-bold mb-0"
      >
        ENGLISH
      </h6>
    </div>
  );
};
LanguageSwitcher.propTypes = {
  isEnglish: PropTypes.bool.isRequired,
  setIsEnglish: PropTypes.func.isRequired,
};

export default LanguageSwitcher;
