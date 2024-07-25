import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/themes/prism.css";
import Navbar from "../components/Navbar.jsx";
import "bootstrap/dist/css/bootstrap.css";

const Problem = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProblem, setShowProblem] = useState(true);
  const [problem, setProblem] = useState({});
  const [submissions, setSubmissions] = useState([]);
  const [seconds, setSeconds] = useState(0);
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
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
  const id = location.state.id;
  const [errors, setErrors] = useState({
    langErr: "",
    codeErr: "",
    subErr: "",
  });
  const validateProblem = (data) => {
    const errors = {};
    if (!data.language.trim()) {
      errors.langErr = "Please Select the Language";
    }
    if (!data.code.trim()) {
      errors.codeErr = "Please write your code";
    }
    return errors;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/problems/${id}`,
          {
            withCredentials: true,
          }
        );
        setProblem(response.data.problem);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    fetchData();

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const preCodes = {
      cpp: `#include <iostream>
using namespace std;
int main() { 
  cout << "Hello World"; 
  return 0; 
}`,

      java: `class HelloWorld {
      public static void main(String[] args) {
      System.out.println("Hello World");
      }
    }`,
    };
    setCode(preCodes[language]);
  }, [language]);
  const handleRun = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/`,
        {},
        { withCredentials: true }
      );
      const { success, message } = response.data;
      if (!success) {
        handleError("Please Login first");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
      const values = { language, code };
      const newErrors = validateProblem(values);
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        try {
          const load = {
            language,
            code,
            input,
          };
          const response = await axios.post(
            `${import.meta.env.VITE_COMPILER_URL}/run`,
            load,
            {
              withCredentials: true,
            }
          );
          if (response.data.success) {
            setOutput(response.data.output);
            setVerdict("");
          } else {
            setErrors({
              ...errors,
              subErr: response.data.message,
            });
          }
        } catch (error) {
          setErrors({
            ...errors,
            subErr: error.response.data.message,
          });
        }
      }
    } catch (error) {
      handleError("Please Login first");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/`,
        {},
        { withCredentials: true }
      );
      const { success, message } = userResponse.data;
      if (!success) {
        handleError("Please Login first");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
      const values = { language, code };
      const newErrors = validateProblem(values);
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        try {
          const load = {
            language,
            code,
            inputTestcases: problem.testcases.input,
            outputTestcases: problem.testcases.output,
          };
          const response = await axios.post(
            `${import.meta.env.VITE_COMPILER_URL}/submit`,
            load,
            { withCredentials: true }
          );
          if (response.data.success) {
            setVerdict(response.data.output);
            setOutput("");
            try {
              const submission = {
                language,
                solution: code,
                verdict: response.data.output,
                timeTaken: seconds,
              };
              const submissionResponse = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/problems/${problem._id}/${
                  userResponse.data.user._id
                }`,
                submission,
                { withCredentials: true }
              );
              const { success, message } = submissionResponse.data;
              if (success) {
                handleSuccess("Submission Added Successfully");
              } else {
                handleError(message);
              }
            } catch (error) {
              handleError(error.response.data.message);
            }
          } else {
            setErrors({
              ...errors,
              subErr: response.data.message,
            });
          }
        } catch (error) {
          console.log(error);
          setErrors({
            ...errors,
            subErr: error.response.data.message,
          });
        }
      }
    } catch (error) {
      handleError("Please Login first");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  };
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const hour = Math.floor(time / 3600);
    const seconds = time % 60;
    return `${hour < 10 ? "0" : ""}${hour}:${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  const userSubmissions = async () => {
    setShowProblem(false);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}`,
        {},
        {
          withCredentials: true,
        }
      );
      setSubmissions(response.data.user.submissions);
    } catch (error) {
      handleError("Please login first");
      setTimeout(() => {
        navigate(`/login`);
      }, 1500);
    }
  };
  const problemDetail = () => {
    setShowProblem(true);
  };
  return (
    <>
      <Navbar />
      <div>
        <div className="container mt-4">
          <div className="row">
            {/* Problem Details Section */}
            <div className="col-lg-6 mb-4">
              <div
                className="card bg-primary bg-opacity-50 "
                style={{ color: "black" }}
              >
                <div className="card-body">
                  <div className="mb-4">
                    <h3>{problem.title}</h3>
                  </div>
                  <div>
                    <button onClick={problemDetail}>Problem</button>
                    <button onClick={userSubmissions}>Submissions</button>
                  </div>
                  <br></br>
                  {showProblem ? (
                    <div>
                      <p>{problem.statement}</p>
                      <div className="mb-3">
                        <h4>Difficulty:</h4> {problem.difficulty}
                      </div>
                      {((problem.input && problem.input.constraints) ||
                        (problem.output && problem.output.constraints)) && (
                        <div className="mb-3">
                          <h4>Constraints:</h4> {problem.input.constraints}{" "}
                          <br></br> {problem.output.constraints}
                        </div>
                      )}
                      {((problem.input && problem.input.sample) ||
                        (problem.output && problem.output.sample)) && (
                        <>
                          <div className="mb-3">
                            <h4>Sample Input and Output:</h4>
                          </div>
                          <table className="table table-bordered">
                            <thead className="thead-dark">
                              <tr>
                                <th scope="col">Input</th>
                                <th scope="col">Output</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>{problem.input.sample}</td>
                                <td>{problem.output.sample}</td>
                              </tr>
                            </tbody>
                          </table>
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      <h4>Your Submissions</h4>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover">
                            <thead className="thead-dark">
                              <tr>
                                <th scope="col">Language</th>
                                <th scope="col">Status</th>
                                <th scope="col">Time Taken</th>
                              </tr>
                            </thead>
                            <tbody>
                              {submissions
                                .slice()
                                .reverse()
                                .filter(
                                  (submission) => submission.problemId === id
                                )
                                .map((sub, index) => (
                                  <tr key={index}>
                                    <td>
                                      {(sub.language === "cpp" && <>C++</>) ||
                                        (sub.language === "java" && <>Java</>)}
                                    </td>
                                    <td>{sub.verdict}</td>
                                    <td>{sub.timeTaken}</td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Code Editor Section */}
            <div className="col-lg-6">
              <div
                className="card bg-primary bg-opacity-50 "
                style={{ color: "black" }}
              >
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Language:</label>
                    <select
                      className="form-select mb-2"
                      name="language"
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value);
                      }}
                    >
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                      {/* <option value="py">Python</option> */}
                    </select>
                    {errors.langErr && (
                      <div className="text-danger">{errors.langErr}</div>
                    )}
                  </div>
                  <div className="mb-3" style={{ minHeight: "300px" }}>
                    {" "}
                    <label className="form-label">Write Code here:</label>
                    <Editor
                      className="form-control"
                      style={{
                        minHeight: "300px",
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 13,
                        outline: "none",
                        border: "none",
                        overflow: "auto",
                      }} 
                      value={code}
                      onValueChange={(code) => setCode(code)}
                      highlight={(code) => highlight(code, languages.js)}
                    />
                    {errors.codeErr && (
                      <div className="text-danger">{errors.codeErr}</div>
                    )}
                  </div>
                  <button
                    onClick={handleRun}
                    className="btn btn-light mb-2"
                    type="button"
                  >
                    Run
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-light mb-2 ms-2"
                    type="button"
                  >
                    Submit
                  </button>
                  {errors.subErr && (
                    <div className="text-danger">{errors.subErr}</div>
                  )}
                </div>
              </div>

              {/* Solve Area Section */}
              <div
                className="card bg-primary bg-opacity-50 mt-4"
                style={{ color: "black" }}
              >
                <div className="card-body row">
                  <div className="col">
                    <div className="mb-3">
                      <label className="form-label">Input:</label>
                      <textarea
                        className="form-control"
                        style={{ minHeight: "100px" }}
                        name="input"
                        value={input}
                        placeholder="Enter your Input"
                        onChange={(e) => {
                          setInput(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  {output && (
                    <div className="col">
                      <div className="mb-3">Output: {output}</div>
                    </div>
                  )}
                  {verdict && (
                    <div className="col">
                      <div className="mb-3">Verdict: {verdict}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Time Elapsed Section */}
          {showProblem && (
            <div className="fixed-bottom mb-4">
              <p className="text-primary">
                &emsp;Time Elapsed: {formatTime(seconds)}
              </p>
            </div>
          )}
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default Problem;