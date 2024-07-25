import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";

const UserProfile = () => {
  const [userDetails, setUserDetails] = useState({});
  const [userSubmissions, setUserSubmissions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}`,
          {},
          { withCredentials: true }
        );
        if (!response.data.success) {
          console.log("Token Not found");
          navigate("/");
        } else {
          setUserDetails(response.data.user);
          setUserSubmissions(response.data.user.submissions);
        }
      } catch (error) {
        console.log(error);
        navigate("/");
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg rounded">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">Profile</h3>
              </div>
              <div className="card-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h5 className="card-title">First Name:</h5>
                    <p className="card-text">{userDetails.firstname}</p>
                  </div>
                  <div className="col-md-6">
                    <h5 className="card-title">Last Name:</h5>
                    <p className="card-text">{userDetails.lastname}</p>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <h5 className="card-title">Phone:</h5>
                    <p className="card-text">{userDetails.phone}</p>
                  </div>
                  <div className="col-md-6">
                    <h5 className="card-title">Email:</h5>
                    <p className="card-text">{userDetails.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-4">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">Submissions</h2>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Problem</th>
                    <th scope="col">Status</th>
                    <th scope="col">Time Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {userSubmissions
                    .slice()
                    .reverse()
                    .map((submission, index) => (
                      <tr key={index}>
                        <td>{submission.problemTitle}</td>
                        <td>{submission.verdict}</td>
                        <td>{submission.timeTaken}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;