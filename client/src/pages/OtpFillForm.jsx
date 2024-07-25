import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const OtpFillForm = () => {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState({
    valErr: "",
    submitErr: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state.id;
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp == "" || otp.length != 6) {
      setErrors({
        ...errors,
        valErr: "Please enter a valid otp",
      });
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/verify/${id}`,
          {
            otp,
          },
          { withCredentials: true }
        );
        const { success, message } = response.data;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            navigate("/login");
          }, 1500);
          setErrors({ valErr: "", submitErr: "" });
        } else {
          handleError(message);
          setErrors({
            ...errors,
            submitErr: message,
          });
        }
      } catch (error) {
        handleError("Otp verification failed");
        setErrors({
          ...errors,
          submitErr: error.response.data.message,
        });
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
                <h2 className="display-5 text-center mb-4">OTP</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label">
                      OTP:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="otp"
                      value={otp}
                      placeholder="Enter 6 digit otp"
                      onChange={(e) => {
                        setOtp(e.target.value);
                      }}
                    />
                    {errors.valErr && (
                      <div className="invalid-feedback d-block">
                        {errors.valErr}
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Submit
                  </button>
                </form>
                {errors.submitErr && (
                  <div className="text-danger mt-3 text-center">
                    {errors.submitErr}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default OtpFillForm;