import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";
const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const { fullName, phone, email, password } = inputValue;
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
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
  const validateForm = (data, cnfpas) => {
    const errors = {};
    if (!data.fullName.trim()) {
      errors.fullName = "Full Name is required";
    }
    if (!data.phone.trim()) {
      errors.phone = "Phone Number is required";
    } else if (data.phone.length != 10) {
      errors.phone = "Please enter the correct phone number";
    }
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }
    if (!data.password) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    }
    if (!cnfpas.trim()) {
      errors.confPass = "Confirm Password is required";
    } else if (cnfpas !== data.password) {
      errors.confPass = "Passwords do not match";
    }
    return errors;
  };
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };
  const handleOnChange1 = (e) => {
    const { name, value } = e.target;
    setConfirmPassword(value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(inputValue, confirmPassword);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // console.log(inputValue);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/admin/register`,
          {
            ...inputValue,
          },
          { withCredentials: true }
        );
        const { success, message } = response.data;

        if (success) {
          setInputValue({
            fullName: "",
            phone: "",
            email: "",
            password: "",
          });
          handleSuccess("Admin Successfully Registered");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          handleError(message);
        }
      } catch (error) {
        setInputValue({
          fullName: "",
          phone: "",
          email: "",
          password: "",
        });
        setConfirmPassword("");
        setSubmitError(error.response.data.message);
        handleError(error.response.data.message);
      }
    } else {
      setInputValue({
        fullName: "",
        phone: "",
        email: "",
        password: "",
      });
      setConfirmPassword("");
      setSubmitError("form submission failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid ">
        <div className="row justify-content-center align-items-center vh-100 mt-3">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg rounded-3 border-primary">
              <div className="card-body p-4 p-md-5">
                <h2 className="display-5 text-center mb-4">Admin Signup</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Full Name:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={fullName}
                      placeholder="Enter your Full Name"
                      onChange={handleOnChange}
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback d-block">
                        {errors.fullName}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone Number:
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      name="phone"
                      value={phone}
                      placeholder="Enter your Phone Number"
                      onChange={handleOnChange}
                    />
                    {errors.phone && (
                      <div className="invalid-feedback d-block">
                        {errors.phone}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email:
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={email}
                      placeholder="Enter your Email"
                      onChange={handleOnChange}
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password:
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        errors.password ? "is-invalid" : ""
                      }`}
                      name="password"
                      value={password}
                      placeholder="Enter your password"
                      onChange={handleOnChange}
                    />
                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password:
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={confirmPassword}
                      placeholder="Enter the same Password"
                      onChange={handleOnChange1}
                    />
                    {errors.confPass && (
                      <div className="invalid-feedback d-block">
                        {errors.confPass}
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">
                    Submit
                  </button>
                </form>
                <div className="mt-3 text-center">
                  <p className="mb-0">Already have an admin account? </p>
                  <Link to={"/adminlogin"}>Login</Link>
                </div>
                {submitError && (
                  <div className="text-danger mt-3 text-center">
                    {submitError}
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

export default Signup;