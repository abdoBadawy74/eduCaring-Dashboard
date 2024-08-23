import { Outlet } from "react-router-dom";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
// import "../../style.css";
////

export default function Dashboard() {
  return (
    <div>
      <TopBar />
      <div className="dash-content">
        <SideBar />
        <div className="outlet">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
