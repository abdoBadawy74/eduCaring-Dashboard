import { useState } from "react";
import { Collapse } from "react-bootstrap";
import { NavLink } from "react-router-dom";

function SideBar() {
  //
  const [open, setOpen] = useState(false);

  //
  return (
    <div className="side-bar ">
      <p
        className="link"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        <i className="fas fa-th-large"></i>
        <span>All Users</span>
      </p>

      <Collapse in={open} className="collapse border-bottom py-0 pb-1 mb-3">
        <div id="example-collapse-text">
          <NavLink to="/dashboard/users" className="link my-1">
            <i className="fas fa-user-friends"></i>
            <span>Users</span>
          </NavLink>
          <NavLink to="/dashboard/speakers" className="link my-1">
            <i className="fas fa-chalkboard-teacher"></i>
            <span>Speakers</span>
          </NavLink>
        </div>
      </Collapse>

      <NavLink to="/dashboard/events" className="link">
        <i className="fas fa-boxes"></i>
        <span>Events</span>
      </NavLink>
      <NavLink to="/dashboard/event/create" className="link">
        <i className="fas fa-plus-square"></i>
        <span>Add Event</span>
      </NavLink>
    </div>
  );
}

export default SideBar;
