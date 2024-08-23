import axios from "axios";
import { useEffect, useState } from "react";
import { BASE, GET_USERS } from "../API/Api";

export default function Users() {
  // States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get all events
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${BASE}/${GET_USERS}`, {
        params: {
          limite: 1000,
          skip: 0,
        },
      })
      .then((data) => {
        setUsers(data.data.responseObject);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, []);

  console.log(users);

  // Sort All Users
  let showUsers = users.map((user, index) => (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{user.nameEn}</td>
      <td>{user.phoneNumber}</td>
      <td>{user.email}</td>
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
        Users <small className="text-muted mt-3 fw-light fst-italic ">All Registered as Users</small>
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
          <tbody>{loading ? tableLoadingtr : showUsers}</tbody>
        </table>
      </div>
    </div>
  );
}
