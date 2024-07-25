import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";
import { useLocation, useNavigate } from "react-router-dom";
const UpdatePassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [errors, setErrors] = useState({
    passErr: "",
    confPassErr: "",
    submitErr: "",
  });
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
  const handleUpdate = async () => {
    if (password) {
      setErrors({
        ...errors,
        passErr: "Enter a valid Password",
      });
    } else if (password.length < 8) {
      setErrors({
        ...errors,
        passErr: "Password must be atleast 8 characters long",
      });
    } else if (confPassword && confPassword === password) {
      setErrors({
        ...errors,
        confPassErr: "Confirm Password must be same as Password",
      });
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/updatepassword/${id}`,
          {
            password,
          },
          { withCredentials: true }
        );
        const { success, message } = response.data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
          setErrors({
            passErr: "",
            confPassErr: "",
            submitErr: "",
          });
        } else {
          handleError(message);
          setErrors({
            submitErr: message,
          });
        }
      } catch (error) {
        setErrors({
          submitErr: error.response.data.message,
        });
        handleError("Password Update is Failed");
        setTimeout(() => {
          navigate("/forgotpassword");
        }, 1500);
      }
    }
  };
  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center mt-3">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow rounded-3 border-primary">
              <div className="card-body p-4 p-md-5">
                <h2 className="display-5 text-center mb-4">Update Password</h2>
                <form>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      value={password}
                      placeholder="Enter new Password"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    {errors.passErr && (
                      <div className="invalid-feedback d-block">
                        {errors.passErr}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Confirm Password:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="confPassword"
                      value={confPassword}
                      placeholder="Enter Same new Password"
                      onChange={(e) => {
                        setConfPassword(e.target.value);
                      }}
                    />
                    {errors.confPassErr && (
                      <div className="invalid-feedback d-block">
                        {errors.confPassErr}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    onClick={handleUpdate}
                    className="btn btn-primary btn-block"
                  >
                    Update
                  </button>
                  {errors.submitErr && (
                    <div className="invalid-feedback d-block">
                      {errors.submitErr}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default UpdatePassword;