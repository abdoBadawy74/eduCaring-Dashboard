import { Route, Routes } from "react-router-dom";

// 3- Dashboard
import Dashboard from "./dashboard/Dashboard";

// 5- Events
import Events from "./dashboard/events/Events";
import CreateEvent from "./dashboard/events/CreateEvent";
import UpdateEvent from "./dashboard/events/UpdateEvent";

// 6- Users && Speakers
import Users from "./dashboard/Users";
import Speakers from "./dashboard/Speakers";

function App() {
  //
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="events" element={<Events />} />
          <Route path="event/create" element={<CreateEvent />} />
          <Route path="events/:id" element={<UpdateEvent />} />
          <Route path="users" element={<Users />} />
          <Route path="speakers" element={<Speakers />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
