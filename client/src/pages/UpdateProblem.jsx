import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";
const UpdateProblem = () => {
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
  useEffect(() => {
    const verifyCookie = async () => {
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
        }
      } catch (error) {
        handleError("Please login as Admin");
        setTimeout(() => {
          navigate("/adminlogin");
        }, 1500);
      }
    };
    verifyCookie();
  }, []);
  // console.log(id);
  const [values, setValues] = useState({
    title: "",
    statement: "",
    difficulty: "",
    inputConstraints: "",
    sampleInput: "",
    outputConstraints: "",
    sampleOutput: "",
    testcasesInput: "",
    testcasesOutput: "",
  });
  const {
    title,
    statement,
    difficulty,
    inputConstraints,
    sampleInput,
    outputConstraints,
    sampleOutput,
    testcasesInput,
    testcasesOutput,
  } = values;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validateUpdateProblem = (data) => {
    const errors = {};
    if (!data.title.trim()) {
      errors.title = "Title is required";
    }
    if (!data.statement.trim()) {
      errors.statement = "Statement is required";
    }
    if (!data.difficulty.trim()) {
      errors.difficulty = "Difficulty is required";
    }
    if (!data.inputConstraints.trim()) {
      errors.inputConstraints = "Input Constraints is required";
    }
    if (!data.sampleInput.trim()) {
      errors.sampleInput = "Sample Input is required";
    }
    if (!data.outputConstraints.trim()) {
      errors.outputConstraints = "Output Constraints is required";
    }
    if (!data.sampleOutput.trim()) {
      errors.sampleOutput = "Sample Output is required";
    }
    if (!data.testcasesInput.trim()) {
      errors.testcasesInput = "Input Testcases is required";
    }
    if (!data.testcasesOutput.trim()) {
      errors.testcasesOutput = "Output Testcases is required";
    }
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateUpdateProblem(values);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/problems/${id}`,
          {
            ...values,
          },
          { withCredentials: true }
        );
        const { success, message } = response.data;
        if (success) {
          handleSuccess("Problem Updated Successfully");
          setTimeout(() => {
            navigate("/problems");
          }, 1500);
        } else {
          handleError(message);
        }
      } catch (error) {
        setValues({
          title: "",
          statement: "",
          difficulty: "",
          inputConstraints: "",
          sampleInput: "",
          outputConstraints: "",
          sampleOutput: "",
          testcasesInput: "",
          testcasesOutput: "",
        });
        setSubmitError(error.response.data.message);
        handleError(error.response.data.message);
      }
    } else {
      setValues({
        title: "",
        statement: "",
        difficulty: "",
        inputConstraints: "",
        sampleInput: "",
        outputConstraints: "",
        sampleOutput: "",
        testcasesInput: "",
        testcasesOutput: "",
      });
      setSubmitError("Updating problem is failed. Try Again");
    }
  };
  return (
    <>
      <Navbar />
      <div className="container-fluid ">
        <div className="row justify-content-center align-items-center vh-100">
          <div className="col-md-8 col-lg-6 col-xl-4">
            <div className="card shadow-lg rounded-3 border-primary">
              <div className="card-body p-4 p-md-5">
                <h2 className="display-6 text-center mb-4">Update Problem</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">
                      Title:
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={title}
                      placeholder="Enter Title"
                      onChange={handleOnChange}
                    />
                    {errors.title && (
                      <div className="invalid-feedback d-block">
                        {errors.title}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="statement" className="form-label">
                      Statement:
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="statement"
                      value={statement}
                      placeholder="Enter statement"
                      onChange={handleOnChange}
                    ></textarea>
                    {errors.statement && (
                      <div className="invalid-feedback d-block">
                        {errors.statement}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="difficulty" className="form-label">
                      Difficulty:
                    </label>
                    <select
                      className="addForm-select"
                      name="difficulty"
                      value={difficulty}
                      onChange={handleOnChange}
                    >
                      <option value="">Select difficulty</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    {errors.difficulty && (
                      <div className="invalid-feedback d-block">
                        {errors.difficulty}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="inputConstraints" className="form-label">
                      Input Constraints:
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="inputConstraints"
                      value={inputConstraints}
                      placeholder="Enter Input Constraints"
                      onChange={handleOnChange}
                    ></textarea>
                    {errors.inputConstraints && (
                      <div className="invalid-feedback d-block">
                        {errors.inputConstraints}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sampleInput" className="form-label">
                      Sample Input:
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="sampleInput"
                      value={sampleInput}
                      placeholder="Enter Sample Input"
                      onChange={handleOnChange}
                    ></textarea>
                    {errors.sampleInput && (
                      <div className="invalid-feedback d-block">
                        {errors.sampleInput}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="outputConstraints" className="form-label">
                      Output Constraints:
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="outputConstraints"
                      value={outputConstraints}
                      placeholder="Enter Output Constraints"
                      onChange={handleOnChange}
                    ></textarea>
                    {errors.outputConstraints && (
                      <div className="invalid-feedback d-block">
                        {errors.outputConstraints}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="sampleOutput" className="form-label">
                      Sample Output:
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="sampleOutput"
                      value={sampleOutput}
                      placeholder="Enter Sample Output"
                      onChange={handleOnChange}
                    ></textarea>
                    {errors.sampleOutput && (
                      <div className="invalid-feedback d-block">
                        {errors.sampleOutput}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="testcasesInput" className="form-label">
                      Testcases Input:
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="testcasesInput"
                      value={testcasesInput}
                      placeholder="Enter Testcases Input"
                      onChange={handleOnChange}
                    ></textarea>
                    {errors.testcasesInput && (
                      <div className="invalid-feedback d-block">
                        {errors.testcasesInput}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="testcasesOutput" className="form-label">
                      Testcases Output:
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="testcasesOutput"
                      value={testcasesOutput}
                      placeholder="Enter Testcases Output"
                      onChange={handleOnChange}
                    ></textarea>
                    {errors.testcasesOutput && (
                      <div className="invalid-feedback d-block">
                        {errors.testcasesOutput}
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mt-4"
                  >
                    Submit
                  </button>
                  {submitError && (
                    <div className="text-danger mt-3 text-center">
                      {submitError}
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

export default UpdateProblem;