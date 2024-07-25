import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [id, setId] = useState("");
  const [errors, setErrors] = useState({
    emailErr: "",
    otpErr: "",
    verifyErr: "",
    submitErr: "",
  });
  const [isVerify, setIsVerify] = useState(false);
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
  const handleVerify = async (e) => {
    e.preventDefault();
    if (email == "") {
      setErrors({
        ...errors,
        emailErr: "Please enter a valid email",
      });
    } else {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/forgotpassword/${email}`,
          {},
          { withCredentials: true }
        );
        const { success, message, id } = response.data;
        if (success) {
          setIsVerify(true);
          handleSuccess(message);
          setId(id);
          setErrors({ emailErr: "", otpErr: "", verifyErr: "", submitErr: "" });
        } else {
          setIsVerify(false);
          handleError(message);
        }
      } catch (error) {
        setIsVerify(false);
        setErrors({
          ...errors,
          submitErr: error.response.data.message,
        });
        handleError(error.response.data.message);
      }
    }
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp == "" || otp.length != 6) {
      setErrors({
        ...errors,
        otpErr: "Please enter a valid otp",
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
            navigate("/passwordupdate", { state: { id } });
          }, 1500);
          setErrors({ emailErr: "", otpErr: "", verifyErr: "", submitErr: "" });
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
        setTimeout(() => {
          window.location.reload();
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
                <h2 className="display-5 text-center mb-4">Forgot Password</h2>
                <form>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={email}
                      placeholder="Enter your registered email address"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    {errors.emailErr && (
                      <div className="invalid-feedback d-block">
                        {errors.emailErr}
                      </div>
                    )}
                  </div>
                  {!isVerify && (
                    <>
                      <button
                        type="submit"
                        onClick={handleVerify}
                        className="btn btn-primary btn-block"
                      >
                        Verify
                      </button>
                      {errors.submitErr && (
                        <div className="invalid-feedback d-block">
                          {errors.submitErr}
                        </div>
                      )}
                    </>
                  )}
                </form>
                {isVerify && (
                  <form>
                    <div className="mb-3">
                      <label htmlFor="otp" className="form-label">
                        Email:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="otp"
                        value={otp}
                        placeholder="Enter Otp"
                        onChange={(e) => {
                          setOtp(e.target.value);
                        }}
                      />
                      {errors.otpErr && (
                        <div className="invalid-feedback d-block">
                          {errors.otpErr}
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      onClick={handleVerifyOtp}
                      className="btn btn-primary btn-block"
                    >
                      Verify Otp
                    </button>
                    {errors.submitErr && (
                      <div className="invalid-feedback d-block">
                        {errors.submitErr}
                      </div>
                    )}
                  </form>
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

export default ForgotPassword;