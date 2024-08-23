import axios from "axios";
import { useEffect, useState } from "react";
import { BASE, GET_EVENT } from "../../API/Api";
import { Link } from "react-router-dom";

export default function Events() {
  // States
  const [events, setEvents] = useState([]);
  const [runUseEffect, setRunUseEffect] = useState(0);
  const [loading, setLoading] = useState(false);

  // Get all events
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${GET_EVENT}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
      })
      .then((data) => {
        setEvents(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [runUseEffect]);
  console.log(events);

  // Function to format date
  const convertDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours() > 12 ? date.getHours() - 12 : date.getHours()).padStart(
      2,
      "0"
    );
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const period = date.getHours() >= 12 ? "PM" : "AM";

    return `${day}/${month}/${year}  ${hours}:${minutes} ${period}`;
  };

  // Delete Event Day
  const deleteEvent = async (evenId) => {
    console.log(evenId);
    try {
      // Use the provided API endpoint for deletion
      let result = await axios.delete(`${BASE}/Event/DeleteEvent`, {
        params: {
          id: evenId,
        },
      });
      if (result.status === 200) {
        // If deletion is successful, trigger a re-fetch of events
        setRunUseEffect((prev) => prev + 1);
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  // Sort All Events
  let showEvents = events.map((event, index) => (
    <tr key={index} style={{ background: event.isDeleted ? "red" : "" }}>
      <td>{index + 1}</td>
      <td>{event.nameEn}</td>
      <td>{event.descriptionEn}</td>
      <td>{convertDate(event.startDay)}</td>
      <td>{convertDate(event.endDay)}</td>
      <td>
        <Link to={`${event.id}`}>
          <i className="fas fa-pen-alt update"></i>
        </Link>
        <i className="fas fa-trash-alt delete" onClick={() => deleteEvent(event.id)}></i>
        <Link className="">
          <i className="fas fa-paper-plane update"></i>
        </Link>
      </td>
    </tr>
  ));

  const tableLoadingtr = (
    <tr className="text-center">
      <td colSpan="6">Loading ...</td>
    </tr>
  );

  //
  useEffect(() => {
    axios.get(`${BASE}/Event/74`).then((data) => console.log(data.data.responseObject));
  }, []);

  return (
    <div className="h-100">
      <h2 className="main-title fw-bold text-muted">
        Events <small className="text-muted mt-3 fw-light fst-italic ">All Entered Events</small>
      </h2>
      <div style={{ overflowX: "auto" }}>
        <table className=" shadow rounded">
          <thead className="">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Start Day</th>
              <th>End Day</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{loading ? tableLoadingtr : showEvents}</tbody>
        </table>
      </div>
    </div>
  );
}
