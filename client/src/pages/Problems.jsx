import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import DeleteProblem from "./DeleteProblem";
import "bootstrap/dist/css/bootstrap.css";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleSuccess = (msg) => {
    toast.success(msg, {
      position: "top-right",
    });
  };
  const handleError = (err) => {
    toast.error(err, {
      position: "bottom-left",
    });
  };
  const handleOnChange = (e) => {
    setDifficulty(e.target.value);
  };
  useEffect(() => {
    const verifyCookie = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/`,
          {},
          { withCredentials: true }
        );
        if (!response.data.success) {
          console.log("token not found");
        } else {
          setName(response.data.user.firstname);
        }
      } catch (error) {
        console.log("Token not fetched");
      }
    };

    const fetchData = async () => {
      if (difficulty === "") {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/problems/`
          );
          const prob = response.data.allProblems;
          setProblems(prob);
        } catch (error) {
          console.log(error.response.data.message);
        }
      } else {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/problems/diff/${difficulty}`
          );
          const prob = response.data.allProblems;
          setProblems(prob);
        } catch (error) {
          console.log(error.response.data.message);
        }
      }
    };
    verifyCookie();
    fetchData();
  }, [difficulty]);

  const problemList = () => {
    return problems.map((res, i) => {
      return <DeleteProblem obj={res} key={i} />;
    });
  };
  const handleAdd = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/`,
        {},
        { withCredentials: true }
      );
      navigate("/addproblem");
    } catch (error) {
      handleError("please login as Admin");
      setTimeout(() => {
        navigate("/adminlogin");
      }, 1500);
    }
  };
  return (
    <>
      <div>
        <nav
          className="navbar bg-primary navbar-expand-lg"
          data-bs-theme="dark"
        >
          <div className="container-fluid">
            <a className="navbar-brand text-white" href="/">
              Online Judge
            </a>
          </div>
          <div className="d-flex align-items-center">
            {name !== "" && (
              <a className="nav-link me-3 text-white" href="/userprofile">
                {name}
              </a>
            )}
          </div>
        </nav>
        <div className="container mt-4">
          {/* Select Dropdown */}
          <div className="mb-4 d-flex justify-content-start align-items-center">
            <h3 className="me-3 fw-bold text-primary">Filter:</h3>
            <select
              className="form-select form-select-lg"
              aria-label="Default select example"
              name="difficulty"
              onChange={handleOnChange}
              style={{ width: "200px" }}
            >
              <option value="">Select Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Problems Section */}
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Problems List</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="card-title mb-0">Current Problems</h6>
                <button onClick={handleAdd} className="btn btn-primary">
                  Add Problem
                </button>
              </div>
              <ul className="list-group">{problemList()}</ul>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Problems;