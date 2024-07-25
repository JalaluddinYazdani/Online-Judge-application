import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.css";
const DeleteProblem = (props) => {
  const { _id, title, difficulty } = props.obj;
  const [errors, setErrors] = useState("");
  const navigate = useNavigate();
  const handleError = (err) => {
    toast.error(err, {
      position: "bottom-left",
    });
  };
  const handleWarning = (war) => {
    toast.warning(war, {
      position: "top-center",
    });
  };
  const deleteProblem = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/`,
        {},
        { withCredentials: true }
      );
      if (!response.data.success) {
        handleError("Please login as Admin");
        setTimeout(() => {
          navigate("/adminlogin");
        }, 1500);
      } else {
        try {
          const response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URL}/problems/${_id}`
          );
          const { success, message } = response.data;
          if (success) {
            handleWarning("Problem deleted Successfully");
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            handleError(message);
          }
        } catch (error) {
          setErrors(error.response.data.message);
          handleError(error.response.data.message);
        }
      }
    } catch (error) {
      handleError("Please login as Admin");
      setTimeout(() => {
        navigate("/adminlogin");
      }, 1500);
    }
  };
  let badgeColor;
  switch (difficulty) {
    case "easy":
      badgeColor = "success";
      break;
    case "medium":
      badgeColor = "warning";
      break;
    case "hard":
      badgeColor = "danger";
      break;
    default:
      badgeColor = "secondary";
  }
  const handleUpdate = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/admin/`,
        {},
        { withCredentials: true }
      );
      navigate(`/updateProblem`, { state: { id: _id } });
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
        <li className="list-group-item d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">{title}</h5>

          <div>
            <div
              className={`badge bg-${badgeColor} text-white me-2`}
              style={{ minWidth: "4em" }}
            >
              {difficulty}
            </div>
            <button
              className="btn btn-info btn-sm me-2"
              onClick={() =>
                navigate(`/problem/${title}`, { state: { id: _id } })
              }
            >
              View
            </button>
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={handleUpdate}
            >
              Update
            </button>
            <button className="btn btn-danger btn-sm" onClick={deleteProblem}>
              Delete
            </button>
          </div>
          {errors && <div className="text-danger">{errors}</div>}
        </li>
        <ToastContainer />
      </div>
    </>
  );
};

export default DeleteProblem;