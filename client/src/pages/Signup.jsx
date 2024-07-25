import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";
const Signup = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    firstname: "",
    lastname: "",
    phone: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const { firstname, lastname, phone, email, password } = inputValue;
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
    if (!data.firstname.trim()) {
      errors.firstname = "First Name is required";
    }
    if (!data.lastname.trim()) {
      errors.lastname = "Last Name is required";
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
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/register`,
          {
            ...inputValue,
          },
          { withCredentials: true }
        );
        const { success, message } = response.data;
        if (success) {
          setInputValue({
            firstname: "",
            lastname: "",
            phone: "",
            email: "",
            password: "",
          });
          handleSuccess(message);
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } catch (error) {
        setInputValue({
          firstname: "",
          lastname: "",
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
        firstname: "",
        lastname: "",
        phone: "",
        email: "",
        password: "",
      });
      setConfirmPassword("");
      setSubmitError("form submission failed");
      console.log("form submission failed");
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <div className="container-fluid">
          <div className="row justify-content-center align-items-center mt-3">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow rounded-3 border-primary">
                <div className="card-body p-4 p-md-5">
                  <h2 className="display-5 text-center mb-4">Signup Account</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="firstname" className="form-label">
                        First Name:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="firstname"
                        value={firstname}
                        placeholder="Enter your First Name"
                        onChange={handleOnChange}
                      />
                      {errors.firstname && (
                        <div className="invalid-feedback d-block">
                          {errors.firstname}
                        </div>
                      )}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="lastname" className="form-label">
                        Last Name:
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="lastname"
                        value={lastname}
                        placeholder="Enter your Last Name"
                        onChange={handleOnChange}
                      />
                      {errors.lastname && (
                        <div className="invalid-feedback d-block">
                          {errors.lastname}
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
                    <p className="mb-0">Already have an account? </p>
                    <Link to={"/login"}>Login</Link>
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
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Signup;