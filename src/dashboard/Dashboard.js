import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import PropTypes from "prop-types";



export default function Dashboard({ isEnglish, setIsEnglish }) {
  return (
    <div style={{ direction: isEnglish ? "" : "rtl" }}>
      <TopBar isEnglish={isEnglish} setIsEnglish={setIsEnglish} />
      <div className="dash-content">
        <SideBar />
        <div className={`outlet ${isEnglish ? `` : `outlet-rtl`}`}>
          <Outlet isEnglish={isEnglish} />
        </div>
      </div>
    </div>
  );
}


Dashboard.propTypes = {
  isEnglish: PropTypes.bool.isRequired,
  setIsEnglish: PropTypes.func.isRequired,
};