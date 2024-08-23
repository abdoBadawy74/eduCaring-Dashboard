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
import { PrimeReactProvider } from "primereact/api";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SendMessage from "./dashboard/SendMessage";
import axios from "axios";
import { BASE, GET_SPEAKERS } from "./API/Api";
import ContactUs from "./dashboard/ContactUs";
import Support from "./dashboard/Support";
import LandingSponsers from "./dashboard/LandingSponsers";
import LandingText from "./dashboard/LandingText";
import LandingSpeakers from "./dashboard/LandingSpeakers";
import LandingAboutUs from "./dashboard/LandingAboutUs";

function App() {
  const { i18n } = useTranslation();
  const [isEnglish, setIsEnglish] = useState(i18n.language === "en");
  const [loading, setLoading] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${GET_SPEAKERS}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
      })
      .then((data) => {
        setSpeakers(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <PrimeReactProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Dashboard isEnglish={isEnglish} setIsEnglish={setIsEnglish} />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard isEnglish={isEnglish} setIsEnglish={setIsEnglish} />
          }
        >
          <Route path="events" element={<Events isEnglish={isEnglish} />} />
          <Route
            path="event/create"
            element={<CreateEvent isEnglish={isEnglish} speakers={speakers} />}
          />
          <Route path="messages" element={<SendMessage />} />
          <Route path="contactus" element={<ContactUs />} />
          <Route path="support" element={<Support />} />
          <Route
            path="events/:id"
            element={<UpdateEvent isEnglish={isEnglish} speakers={speakers} />}
          />
          <Route path="users" element={<Users isEnglish={isEnglish} />} />
          <Route
            path="landing-speakers"
            element={<LandingSpeakers isEnglish={isEnglish} />}
          />
          <Route
            path="landing-sponsers"
            element={<LandingSponsers isEnglish={isEnglish} />}
          />
          <Route
            path="landing-text"
            element={<LandingText isEnglish={isEnglish} />}
          />
          <Route
            path="landing-aboutus"
            element={<LandingAboutUs isEnglish={isEnglish} />}
          />
          <Route
            path="speakers"
            element={
              <Speakers
                isEnglish={isEnglish}
                speakers={speakers}
                setSpeakers={setSpeakers}
                loading={loading}
                setLoading={setLoading}
              />
            }
          />
        </Route>
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;
