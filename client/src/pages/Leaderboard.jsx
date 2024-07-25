import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";

const Leaderboard = () => {
  const [leaderboardData, setLeaderBoardData] = useState([]);
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/leaderboard`,
          {},
          {
            withCredentials: true,
          }
        );
        if (response.data.success) {
          setLeaderBoardData(response.data.results);
          console.log(response.data.results);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h2 className="mb-0">Leaderboard</h2>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th scope="col">Rank</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Total Problems Solved</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{user.firstname}</td>
                      <td>{user.lastname}</td>
                      <td>{user.totalProblemsSolved}</td>
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

export default Leaderboard;