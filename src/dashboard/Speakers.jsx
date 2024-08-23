import axios from "axios";
import { useEffect, useState } from "react";
import { BASE, GET_SPEAKERS } from "../API/Api";

export default function Speakers() {
  // States
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all speakers
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

  console.log(speakers);

  // Sort All Speakers
  let showSpeakers = speakers.map((speaker, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{speaker.nameEn}</td>
      <td>{speaker.phoneNumber}</td>
      <td>{speaker.email}</td>
      <td></td>
    </tr>
  ));

  const tableLoadingtr = (
    <tr className="text-center">
      <td colSpan="5">Loading ...</td>
    </tr>
  );

  return (
    <div className="h-100">
      <h2 className="main-title fw-bold text-muted">
        Speakers <small className="text-muted mt-3 fw-light fst-italic ">All Registered as Speakers</small>
      </h2>
      
      <div style={{ overflowX: "auto" }}>
        <table className="shadow rounded">
          <thead className="">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{loading ? tableLoadingtr : showSpeakers}</tbody>
        </table>
      </div>
    </div>
  );
}
